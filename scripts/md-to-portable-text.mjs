// One-off authoring helper: converts a lightweight markdown dialect into the
// Portable Text block shape used by apps/storefront/src/data/research-articles.json.
// Not part of the app build — run manually with `node scripts/md-to-portable-text.mjs <input.md>`.
import { readFileSync, writeFileSync } from "node:fs";

let keyCounter = 0;
function key(prefix) {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

// Inline parser: handles **bold**, *em*, and [text](url) links.
function parseInline(text) {
  const spans = [];
  const markDefs = [];
  let i = 0;
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const boldRe = /\*\*([^*]+)\*\*/g;

  // Tokenize by finding earliest of link/bold markers, iterating left to right.
  let remaining = text;
  let cursor = 0;
  while (cursor < remaining.length) {
    const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(remaining.slice(cursor));
    const boldMatch = /\*\*([^*]+)\*\*/.exec(remaining.slice(cursor));
    const linkIdx = linkMatch ? cursor + linkMatch.index : Infinity;
    const boldIdx = boldMatch ? cursor + boldMatch.index : Infinity;

    if (linkIdx === Infinity && boldIdx === Infinity) {
      spans.push({ _type: "span", _key: key("sp"), text: remaining.slice(cursor), marks: [] });
      break;
    }

    if (linkIdx <= boldIdx) {
      if (linkIdx > cursor) {
        spans.push({ _type: "span", _key: key("sp"), text: remaining.slice(cursor, linkIdx), marks: [] });
      }
      const linkKey = key("lnk");
      markDefs.push({ _key: linkKey, _type: "link", href: linkMatch[2] });
      spans.push({ _type: "span", _key: key("sp"), text: linkMatch[1], marks: [linkKey] });
      cursor = linkIdx + linkMatch[0].length;
    } else {
      if (boldIdx > cursor) {
        spans.push({ _type: "span", _key: key("sp"), text: remaining.slice(cursor, boldIdx), marks: [] });
      }
      spans.push({ _type: "span", _key: key("sp"), text: boldMatch[1], marks: ["strong"] });
      cursor = boldIdx + boldMatch[0].length;
    }
  }
  return { spans, markDefs };
}

function textBlock(line, style = "normal", listItem) {
  const { spans, markDefs } = parseInline(line);
  const block = { _type: "block", _key: key("blk"), style, markDefs, children: spans };
  if (listItem) {
    block.listItem = listItem;
    block.level = 1;
  }
  return block;
}

export function convert(md) {
  const lines = md.split("\n");
  const body = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (line.startsWith("<!--image:")) {
      const parts = line.slice("<!--image:".length, -"-->".length).split("|");
      body.push({ _type: "blogImage", _key: key("img"), src: parts[0], alt: parts[1] || "", caption: parts[2] || "" });
      i += 1;
      continue;
    }
    if (line.startsWith("<!--table:")) {
      const caption = line.slice("<!--table:".length, -"-->".length);
      i += 1;
      const rows = [];
      while (i < lines.length && !lines[i].startsWith("<!--/table-->")) {
        const cells = lines[i].split("|").map((c) => c.trim()).filter((c) => c.length > 0);
        if (cells.length) rows.push({ _key: key("row"), cells });
        i += 1;
      }
      i += 1; // skip closing tag
      body.push({ _type: "tableBlock", _key: key("tbl"), caption, hasHeaderRow: true, rows });
      continue;
    }
    if (line.startsWith("### ")) {
      body.push(textBlock(line.slice(4), "h3"));
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      body.push(textBlock(line.slice(3), "h2"));
      i += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      body.push(textBlock(line.slice(2), "normal", "bullet"));
      i += 1;
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      body.push(textBlock(line.replace(/^\d+\.\s/, ""), "normal", "number"));
      i += 1;
      continue;
    }
    body.push(textBlock(line));
    i += 1;
  }
  return body;
}

if (process.argv[1] && process.argv[1].endsWith("md-to-portable-text.mjs") && process.argv[2]) {
  const md = readFileSync(process.argv[2], "utf8");
  const out = JSON.stringify(convert(md), null, 2);
  if (process.argv[3]) {
    writeFileSync(process.argv[3], out, "utf8");
  } else {
    process.stdout.write(out);
  }
}
