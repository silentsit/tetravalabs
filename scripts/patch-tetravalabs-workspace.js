/**
 * Re-attach Tetravalabs chat history to the workspace Cursor opens on this PC.
 * Old laptop path: C:\Users\daryl\Downloads\Tetravalabs  (id d124...)
 * Current PC path:  C:\Users\user\Downloads\Tetravalabs   (id b61a...)
 */
const Database = require("better-sqlite3");

const GLOBAL_DB =
  process.env.CURSOR_GLOBAL_DB ||
  "C:/Users/user/AppData/Roaming/Cursor/User/globalStorage/state.vscdb";

const OLD_WS_ID = "d124ed09fc0c83390e82968e231ce8ab";
const NEW_WS_ID = "b61a893a15ee39b51c7c4b743007655d";
const OLD_PATH = "c:\\Users\\daryl\\Downloads\\Tetravalabs";
const NEW_PATH = "c:\\Users\\user\\Downloads\\Tetravalabs";
const NEW_URI = {
  $mid: 1,
  fsPath: NEW_PATH,
  _sep: 1,
  external: "file:///c%3A/Users/user/Downloads/Tetravalabs",
  path: "/c:/Users/user/Downloads/Tetravalabs",
  scheme: "file",
};

function isTetravalabsPath(p) {
  if (!p) return false;
  return p.replace(/\//g, "\\").toLowerCase().includes("tetravalabs");
}

function patchWorkspaceIdentifier(obj) {
  if (!obj || typeof obj !== "object") return false;
  let changed = false;

  if (obj.workspaceIdentifier?.id === OLD_WS_ID) {
    obj.workspaceIdentifier.id = NEW_WS_ID;
    obj.workspaceIdentifier.uri = { ...NEW_URI };
    changed = true;
  }

  if (obj.agentLocation?.environment?.id === OLD_WS_ID) {
    obj.agentLocation.environment.id = NEW_WS_ID;
    obj.agentLocation.environment.uri = { ...NEW_URI };
    changed = true;
  }

  if (Array.isArray(obj.agentLocationHistory)) {
    for (const h of obj.agentLocationHistory) {
      if (h.location?.environment?.id === OLD_WS_ID) {
        h.location.environment.id = NEW_WS_ID;
        h.location.environment.uri = { ...NEW_URI };
        changed = true;
      }
    }
  }

  if (Array.isArray(obj.trackedGitRepos)) {
    for (const repo of obj.trackedGitRepos) {
      if (isTetravalabsPath(repo.repoPath)) {
        repo.repoPath = NEW_PATH;
        changed = true;
      }
    }
  }

  return changed;
}

const db = new Database(GLOBAL_DB);
db.pragma("journal_mode = WAL");

let headerCount = 0;
let dataCount = 0;

const headerRow = db.prepare("SELECT value FROM ItemTable WHERE key = 'composer.composerHeaders'").get();
if (headerRow) {
  const headers = JSON.parse(headerRow.value.toString());
  for (const c of headers.allComposers || []) {
    const wsPath = c.workspaceIdentifier?.uri?.fsPath;
    if (c.workspaceIdentifier?.id === OLD_WS_ID || isTetravalabsPath(wsPath)) {
      if (patchWorkspaceIdentifier(c)) headerCount++;
    }
  }
  db.prepare("UPDATE ItemTable SET value = ? WHERE key = 'composer.composerHeaders'").run(
    JSON.stringify(headers)
  );
}

const composerRows = db
  .prepare("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'composerData:%'")
  .all();
for (const row of composerRows) {
  try {
    const data = JSON.parse(row.value.toString());
    const wsPath = data.workspaceIdentifier?.uri?.fsPath;
    if (data.workspaceIdentifier?.id === OLD_WS_ID || isTetravalabsPath(wsPath)) {
      if (patchWorkspaceIdentifier(data)) {
        db.prepare("UPDATE cursorDiskKV SET value = ? WHERE key = ?").run(
          JSON.stringify(data),
          row.key
        );
        dataCount++;
      }
    }
  } catch {
    /* ignore malformed rows */
  }
}

// Copy glass editor tab state from old workspace id to new
const oldGlassKey = `cursor/glass.tabs.v2/${OLD_WS_ID}/state.json`;
const newGlassKey = `cursor/glass.tabs.v2/${NEW_WS_ID}/state.json`;
const glassRow = db.prepare("SELECT value FROM ItemTable WHERE key = ?").get(oldGlassKey);
if (glassRow) {
  const existing = db.prepare("SELECT value FROM ItemTable WHERE key = ?").get(newGlassKey);
  if (!existing) {
    db.prepare("INSERT INTO ItemTable (key, value) VALUES (?, ?)").run(newGlassKey, glassRow.value);
  } else {
    db.prepare("UPDATE ItemTable SET value = ? WHERE key = ?").run(glassRow.value, newGlassKey);
  }
}

// Patch local agent project entry for Tetravalabs
const projectsRow = db.prepare("SELECT value FROM ItemTable WHERE key = 'glass.localAgentProjects.v1'").get();
if (projectsRow) {
  const projects = JSON.parse(projectsRow.value.toString());
  for (const p of projects) {
    if (p.workspace?.id === OLD_WS_ID || isTetravalabsPath(p.workspace?.uri?.fsPath)) {
      p.workspace = { id: NEW_WS_ID, uri: { ...NEW_URI } };
    }
  }
  db.prepare("UPDATE ItemTable SET value = ? WHERE key = 'glass.localAgentProjects.v1'").run(
    JSON.stringify(projects)
  );
}

db.close();
console.log(`Patched composer headers: ${headerCount}`);
console.log(`Patched composerData rows: ${dataCount}`);
console.log(`Target workspace: ${NEW_PATH}`);
