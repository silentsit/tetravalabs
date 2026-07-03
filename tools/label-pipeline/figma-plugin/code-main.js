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
