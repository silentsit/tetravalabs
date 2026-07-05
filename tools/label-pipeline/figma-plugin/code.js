// Auto-built — run: python build-plugin.py
const PLUGIN_UI = "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body {\n      font-family: Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n      background: #fff;\n      color: #333;\n      padding: 20px;\n      width: 340px;\n    }\n    .header {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      margin-bottom: 16px;\n    }\n    .logo-hex {\n      width: 32px;\n      height: 28px;\n      background: #3D94D9;\n      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n    }\n    .header h1 { font-size: 15px; font-weight: 600; }\n    .section {\n      background: #f8f9fa;\n      border-radius: 8px;\n      padding: 14px;\n      margin-bottom: 12px;\n    }\n    .section-title {\n      font-size: 11px;\n      font-weight: 600;\n      text-transform: uppercase;\n      letter-spacing: 0.4px;\n      color: #555;\n      margin-bottom: 8px;\n    }\n    .section p {\n      font-size: 12px;\n      line-height: 1.45;\n      color: #666;\n      margin-bottom: 10px;\n    }\n    .prop-tag {\n      font-size: 11px;\n      font-family: \"SF Mono\", Monaco, monospace;\n      background: #f0f7ff;\n      border: 1px solid #d0e3f7;\n      border-radius: 5px;\n      padding: 4px 8px;\n      margin-bottom: 4px;\n    }\n    .btn {\n      width: 100%;\n      padding: 11px;\n      border: none;\n      border-radius: 8px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: pointer;\n      margin-top: 8px;\n    }\n    .btn-primary { background: #3D94D9; color: #fff; }\n    .btn-secondary { background: #eef2f7; color: #333; width: auto; padding: 8px 12px; margin: 0; }\n    .btn:disabled { opacity: 0.45; cursor: not-allowed; }\n    .file-row { display: flex; align-items: center; gap: 8px; margin: 10px 0 4px; }\n    .file-name { flex: 1; font-size: 11px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    input[type=\"file\"] { display: none; }\n    #status { font-size: 11px; text-align: center; margin-top: 10px; min-height: 16px; color: #888; }\n    #status.ok { color: #27ae60; }\n    #status.err { color: #c0392b; }\n  </style>\n</head>\n<body>\n  <div class=\"header\">\n    <div class=\"logo-hex\"></div>\n    <h1>TetravaLabs Label</h1>\n  </div>\n\n  <div class=\"section\">\n    <div class=\"section-title\">Step 1 \u2014 Template</div>\n    <p>Create the master label component (once).</p>\n    <button class=\"btn btn-primary\" id=\"generate\">Generate Label Template</button>\n  </div>\n\n  <div class=\"section\">\n    <div class=\"section-title\">Step 2 \u2014 Batch import CSV</div>\n    <p>Download your Google Sheet as CSV, then import all rows.</p>\n    <div class=\"prop-tag\">#product_name</div>\n    <div class=\"prop-tag\">#cas_number</div>\n    <div class=\"prop-tag\">#Concentration</div>\n    <div class=\"file-row\">\n      <button class=\"btn btn-secondary\" id=\"pick-file\">Choose CSV</button>\n      <span class=\"file-name\" id=\"file-name\">No file selected</span>\n    </div>\n    <input type=\"file\" id=\"csv-file\" accept=\".csv,text/csv\" />\n    <button class=\"btn btn-primary\" id=\"batch-import\" disabled>Batch Import CSV</button>\n  </div>\n\n  <div id=\"status\"></div>\n\n  <script>\n    var parsedRows = [];\n\n    function setStatus(text, kind) {\n      var el = document.getElementById(\"status\");\n      el.textContent = text;\n      el.className = kind ? kind : \"\";\n    }\n\n    function parseCsv(text) {\n      var rows = [];\n      var row = [];\n      var field = \"\";\n      var inQuotes = false;\n\n      for (var i = 0; i < text.length; i++) {\n        var ch = text[i];\n        var next = text[i + 1];\n\n        if (inQuotes) {\n          if (ch === '\"' && next === '\"') { field += '\"'; i++; }\n          else if (ch === '\"') { inQuotes = false; }\n          else { field += ch; }\n          continue;\n        }\n        if (ch === '\"') { inQuotes = true; }\n        else if (ch === \",\") { row.push(field); field = \"\"; }\n        else if (ch === \"\\r\" && next === \"\\n\") { row.push(field); rows.push(row); row = []; field = \"\"; i++; }\n        else if (ch === \"\\n\") { row.push(field); rows.push(row); row = []; field = \"\"; }\n        else { field += ch; }\n      }\n      if (field.length || row.length) { row.push(field); rows.push(row); }\n      if (!rows.length) return [];\n\n      var headers = rows[0].map(function(h) { return h.trim().replace(/^\\uFEFF/, \"\"); });\n      var out = [];\n      for (var r = 1; r < rows.length; r++) {\n        if (!rows[r].some(function(c) { return c.trim(); })) continue;\n        var obj = {};\n        headers.forEach(function(h, idx) { obj[h] = (rows[r][idx] || \"\").trim(); });\n        out.push(obj);\n      }\n      return out;\n    }\n\n    document.getElementById(\"generate\").onclick = function() {\n      setStatus(\"Generating template\u2026\");\n      parent.postMessage({ pluginMessage: { type: \"generate\" } }, \"*\");\n    };\n\n    document.getElementById(\"pick-file\").onclick = function() {\n      document.getElementById(\"csv-file\").click();\n    };\n\n    document.getElementById(\"csv-file\").onchange = function(e) {\n      var file = e.target.files[0];\n      if (!file) return;\n      document.getElementById(\"file-name\").textContent = file.name;\n      var reader = new FileReader();\n      reader.onload = function() {\n        parsedRows = parseCsv(reader.result);\n        document.getElementById(\"batch-import\").disabled = parsedRows.length === 0;\n        if (parsedRows.length === 0) setStatus(\"CSV empty or unreadable.\", \"err\");\n        else setStatus(\"Ready: \" + parsedRows.length + \" rows.\", \"ok\");\n      };\n      reader.readAsText(file);\n    };\n\n    document.getElementById(\"batch-import\").onclick = function() {\n      if (!parsedRows.length) return;\n      setStatus(\"Importing \" + parsedRows.length + \" labels\u2026\");\n      parent.postMessage({ pluginMessage: { type: \"batch-import\", rows: parsedRows } }, \"*\");\n    };\n\n    window.onmessage = function(event) {\n      var msg = event.data.pluginMessage;\n      if (!msg) return;\n      if (msg.type === \"done\") setStatus(\"Template ready. Choose CSV below.\", \"ok\");\n      if (msg.type === \"batch-done\") setStatus(\"Done \u2014 \" + msg.count + \" labels created.\", \"ok\");\n      if (msg.type === \"error\") setStatus(msg.message, \"err\");\n    };\n  </script>\n</body>\n</html>\n";
figma.showUI(PLUGIN_UI, { width: 340, height: 520, themeColors: true });

// ============================================================
// TetravaLabs Label Template Generator + CSV Batch Import
// ============================================================

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "generate") {
      await createLabelTemplate();
      figma.ui.postMessage({ type: "done" });
      return;
    }
    if (msg.type === "batch-import") {
      const count = await batchImportLabels(msg.rows || []);
      figma.notify(`Created ${count} label instance(s)`);
      figma.ui.postMessage({ type: "batch-done", count });
    }
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    figma.notify("Label error: " + message, { error: true });
    figma.ui.postMessage({ type: "error", message });
  }
};

// Product-name auto-fit — long titles shrink so they never overflow the label.
var PRODUCT_MAX_WIDTH = 918; // frame width 1062 - 72px margins each side
var PRODUCT_MAX_SIZE = 96;
var PRODUCT_MIN_SIZE = 34;

async function autoFitProductName(instance) {
  var node = instance.findOne(function (n) {
    return (
      n.type === "TEXT" &&
      (n.name === "#product_name" || n.name.toLowerCase().indexOf("product") >= 0)
    );
  });
  if (!node) return;
  if (node.fontName === figma.mixed) return;

  await figma.loadFontAsync(node.fontName);

  var size = PRODUCT_MAX_SIZE;
  node.fontSize = size;
  while (node.width > PRODUCT_MAX_WIDTH && size > PRODUCT_MIN_SIZE) {
    size -= 2;
    node.fontSize = size;
  }
}

async function loadFont(style) {
  await figma.loadFontAsync({ family: "Inter", style });
}

async function loadFonts() {
  await loadFont("Regular");
  await loadFont("Bold");
  await loadFont("Medium");
  try {
    await loadFont("Semi Bold");
    return { semi: "Semi Bold" };
  } catch (_e) {
    await loadFont("Medium");
    return { semi: "Medium" };
  }
}

function makeText(name, characters, x, y, size, style, options) {
  const text = figma.createText();
  text.name = name;
  text.fontName = { family: "Inter", style };
  text.fontSize = size;
  text.x = x;
  text.y = y;
  text.characters = characters;
  text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  if (options && options.letterSpacing) {
    text.letterSpacing = { value: options.letterSpacing, unit: "PIXELS" };
  }
  if (options && options.uppercase) {
    text.textCase = "UPPER";
  }
  return text;
}

function makeLine(name, x, y, width) {
  const line = figma.createLine();
  line.name = name;
  line.x = x;
  line.y = y;
  line.resize(width, 0);
  line.strokes = [{ type: "SOLID", color: { r: 0.55, g: 0.55, b: 0.55 } }];
  line.strokeWeight = 1.5;
  line.strokeCap = "ROUND";
  return line;
}

function findLabelComponent() {
  const selected = figma.currentPage.selection[0];
  if (selected && selected.type === "COMPONENT") {
    return selected;
  }
  if (selected && selected.type === "INSTANCE" && selected.mainComponent) {
    return selected.mainComponent;
  }

  const matches = figma.currentPage.findAll(
    (node) =>
      node.type === "COMPONENT" && node.name === "TetravaLabs Label Template"
  );

  if (matches.length === 0) {
    throw new Error(
      'No label template found. Click "Generate Label Template" first.'
    );
  }

  if (matches.length === 1) {
    return matches[0];
  }

  // Multiple masters (Generate was run more than once) — use top-left template
  matches.sort(function (a, b) {
    return a.y - b.y || a.x - b.x;
  });
  figma.notify(
    "Using the top-left template (" +
      matches.length +
      " found — delete extras to avoid confusion)"
  );
  return matches[0];
}

function getPropertyMap(component) {
  const map = {};
  for (const key of Object.keys(component.componentPropertyDefinitions)) {
    const def = component.componentPropertyDefinitions[key];
    if (def.type !== "TEXT") continue;
    const lower = key.toLowerCase();
    if (lower.indexOf("product") >= 0) map.product = key;
    else if (lower.indexOf("cas") >= 0) map.cas = key;
    else if (lower.indexOf("concentr") >= 0 || lower.indexOf("dosage") >= 0) {
      map.conc = key;
    } else if (lower.indexOf("purity") >= 0) map.purity = key;
    else if (lower.indexOf("footer") >= 0) map.footer = key;
  }
  if (!map.product || !map.cas || !map.conc) {
    throw new Error(
      "Template missing text properties. Regenerate the label template."
    );
  }
  return map;
}

function pickField(row, keys) {
  for (let i = 0; i < keys.length; i++) {
    const val = row[keys[i]];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val).trim();
    }
  }
  return "";
}

function formatCas(value) {
  if (!value) return "";
  return value.toUpperCase().indexOf("CAS:") === 0 ? value : "CAS: " + value;
}

function rowToProperties(row, keys) {
  const props = {};
  props[keys.product] = pickField(row, [
    "#product_name",
    "product_name",
    "Product Name",
    "Peptide Name",
  ]).toUpperCase();
  props[keys.cas] = formatCas(
    pickField(row, ["#cas_number", "#CAS_number", "cas_number", "CAS Number"])
  );
  props[keys.conc] = pickField(row, [
    "#Concentration",
    "#concentration",
    "concentration",
    "dosage",
    "Dosage",
  ]);
  if (keys.purity) {
    props[keys.purity] =
      pickField(row, ["purity", "Purity"]) || "Purity: >99.9%";
  }
  if (keys.footer) {
    props[keys.footer] =
      pickField(row, ["footer", "Footer"]) || "FOR RESEARCH USE ONLY";
  }
  return props;
}

async function batchImportLabels(rows) {
  if (!rows.length) {
    throw new Error("CSV has no data rows.");
  }

  const component = findLabelComponent();
  const keys = getPropertyMap(component);
  const gap = 80;
  const cols = 4;
  const startX = component.x;
  const startY = component.y + component.height + gap;
  const created = [];

  for (let i = 0; i < rows.length; i++) {
    const props = rowToProperties(rows[i], keys);
    if (!props[keys.product]) continue;

    const instance = component.createInstance();
    instance.setProperties(props);
    await autoFitProductName(instance);

    const col = i % cols;
    const rowIdx = Math.floor(i / cols);
    instance.x = startX + col * (component.width + gap);
    instance.y = startY + rowIdx * (component.height + gap);
    instance.name = props[keys.product];

    figma.currentPage.appendChild(instance);
    created.push(instance);
  }

  if (!created.length) {
    throw new Error(
      "No rows imported. Check CSV headers: #product_name, #cas_number, #Concentration"
    );
  }

  figma.currentPage.selection = created;
  figma.viewport.scrollAndZoomIntoView(created);
  return created.length;
}

async function createLabelTemplate() {
  const fonts = await loadFonts();

  const frame = figma.createFrame();
  frame.name = "TetravaLabs Label Template";
  frame.resize(1062, 1112);
  frame.x = 100;
  frame.y = 100;
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.12 }];
  frame.strokeWeight = 1;
  frame.strokeAlign = "INSIDE";
  figma.currentPage.appendChild(frame);

  const watermark = figma.createPolygon();
  watermark.name = "watermark";
  watermark.pointCount = 6;
  watermark.resize(520, 450);
  watermark.x = 271;
  watermark.y = 331;
  watermark.fills = [];
  watermark.strokes = [
    { type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.88 }, opacity: 0.45 },
  ];
  watermark.strokeWeight = 1.5;
  frame.appendChild(watermark);

  const logoBox = figma.createRectangle();
  logoBox.name = "logo-placeholder";
  logoBox.resize(48, 48);
  logoBox.x = 72;
  logoBox.y = 58;
  logoBox.fills = [{ type: "SOLID", color: { r: 0.24, g: 0.58, b: 0.85 } }];
  logoBox.cornerRadius = 6;
  frame.appendChild(logoBox);

  const brandText = makeText("brand-text", "TetravaLabs", 132, 68, 28, fonts.semi);
  frame.appendChild(brandText);

  frame.appendChild(makeLine("divider-top", 72, 126, 918));

  const productName = makeText("#product_name", "RETATRUTIDE", 72, 168, 96, "Bold", {
    letterSpacing: 2,
    uppercase: true,
  });
  frame.appendChild(productName);

  const casNumber = makeText("#cas_number", "CAS: 2381089-83-2", 72, 306, 30, fonts.semi);
  frame.appendChild(casNumber);

  const concentration = makeText("#Concentration", "20mg", 72, 396, 48, "Bold");
  frame.appendChild(concentration);

  const purity = makeText("purity", "Purity: >99.9%", 722, 408, 38, fonts.semi);
  frame.appendChild(purity);

  frame.appendChild(makeLine("divider-bottom", 72, 520, 918));

  const footer = makeText("footer", "FOR RESEARCH USE ONLY", 72, 558, 52, "Bold", {
    letterSpacing: 3,
    uppercase: true,
  });
  frame.appendChild(footer);

  const component = figma.createComponentFromNode(frame);

  function bindTextProp(textNode, propName, defaultValue) {
    const key = component.addComponentProperty(propName, "TEXT", defaultValue);
    textNode.componentPropertyReferences = { characters: key };
    return key;
  }

  bindTextProp(productName, "product_name", "RETATRUTIDE");
  bindTextProp(casNumber, "cas_number", "CAS: 2381089-83-2");
  bindTextProp(concentration, "concentration", "20mg");
  bindTextProp(purity, "purity", "Purity: >99.9%");
  bindTextProp(footer, "footer", "FOR RESEARCH USE ONLY");

  figma.currentPage.selection = [component];
  figma.viewport.scrollAndZoomIntoView([component]);
  figma.notify("Template ready — now batch import your CSV");
}
