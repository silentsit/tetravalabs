// ============================================================
// TetravaLabs Label Batch Import — #v1 / #v2 / #v3
// ============================================================

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "generate") {
      await createLabelTemplate();
      figma.ui.postMessage({ type: "done" });
      return;
    }
    if (msg.type === "batch-import") {
      const result = await batchImportLabels(msg.rows || []);
      figma.notify(
        "Created " +
          result.total +
          " labels (" +
          result.main +
          " v1, " +
          result.flower +
          " v2, " +
          (result.capsule || 0) +
          " v3)"
      );
      figma.ui.postMessage({ type: "batch-done", count: result.total, ...result });
    }
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    figma.notify("Label error: " + message, { error: true });
    figma.ui.postMessage({ type: "error", message });
  }
};

var PRODUCT_MAX_WIDTH = 918;
var PRODUCT_MAX_SIZE = 96;
var PRODUCT_MIN_SIZE = 34;
var FORMULA_RED = { r: 0.86, g: 0.15, b: 0.15 };
var FORMULA_DIGITS = "0123456789₀₁₂₃₄₅₆₇₈₉";

async function autoFitProductName(instance) {
  var node = instance.findOne(function (n) {
    return (
      n.type === "TEXT" &&
      (n.name === "#product_name" || n.name.toLowerCase().indexOf("product") >= 0)
    );
  });
  if (!node || node.fontName === figma.mixed) return;

  await figma.loadFontAsync(node.fontName);

  var size = PRODUCT_MAX_SIZE;
  node.fontSize = size;
  while (node.width > PRODUCT_MAX_WIDTH && size > PRODUCT_MIN_SIZE) {
    size -= 2;
    node.fontSize = size;
  }
}

function isFormulaDigit(char) {
  return FORMULA_DIGITS.indexOf(char) >= 0;
}

async function styleFormulaDigits(instance) {
  var node = instance.findOne(function (n) {
    return n.type === "TEXT" && n.name.toLowerCase().indexOf("formula") >= 0;
  });
  if (!node || !node.characters || node.fontName === figma.mixed) return;

  await figma.loadFontAsync(node.fontName);

  for (var i = 0; i < node.characters.length; i++) {
    if (isFormulaDigit(node.characters[i])) {
      node.setRangeFills(i, i + 1, [{ type: "SOLID", color: FORMULA_RED }]);
    }
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

function findComponentByNames(names) {
  const upperNames = names.map(function (n) {
    return n.toUpperCase();
  });
  const matches = figma.currentPage.findAll(function (node) {
    if (node.type !== "COMPONENT") return false;
    const name = node.name.toUpperCase().replace(/\s+/g, " ").trim();
    for (let i = 0; i < upperNames.length; i++) {
      const needle = upperNames[i];
      if (name === needle || name.indexOf(needle) >= 0) return true;
    }
    return false;
  });
  if (!matches.length) {
    throw new Error(
      'Component not found. Looked for: ' +
        names.join(", ") +
        ". On this page, add Components named #v1, #v2, and #v3 (right-click frame → Create component)."
    );
  }
  matches.sort(function (a, b) {
    return a.y - b.y || a.x - b.x;
  });
  return matches[0];
}

function findLabelTemplates() {
  const templates = {
    // Prefer your current Figma frames (#v1 / #v2 / #v3), fall back to older names.
    main: findComponentByNames(["#v1", "# v1", "v1", "LABEL-MAIN"]),
    flower: findComponentByNames(["#v2", "# v2", "v2", "LABEL-FLOWER"]),
    capsule: null,
  };
  try {
    templates.capsule = findComponentByNames(["#v3", "# v3", "v3", "LABEL-CAPSULE"]);
  } catch (err) {
    templates.capsule = null;
  }
  return templates;
}

function findTextLayerByNames(root, namePatterns) {
  const texts = root.findAll(function (n) {
    return n.type === "TEXT";
  });
  for (let p = 0; p < namePatterns.length; p++) {
    const needle = namePatterns[p].toLowerCase();
    for (let i = 0; i < texts.length; i++) {
      const layerName = texts[i].name.toLowerCase();
      if (layerName === needle || layerName.indexOf(needle) >= 0) {
        return texts[i];
      }
    }
  }

  const containers = root.findAll(function (n) {
    return n.type === "FRAME" || n.type === "GROUP" || n.type === "COMPONENT";
  });
  for (let p = 0; p < namePatterns.length; p++) {
    const needle = namePatterns[p].toLowerCase();
    for (let i = 0; i < containers.length; i++) {
      const layerName = containers[i].name.toLowerCase();
      if (layerName !== needle && layerName.indexOf(needle) < 0) continue;
      const inner = containers[i].findOne(function (n) {
        return n.type === "TEXT";
      });
      if (inner) return inner;
    }
  }

  return null;
}

function buildLayerBindings(component) {
  const layerDefs = {
    product: ["#product_name", "product_name"],
    cas: ["#cas_number", "#cass_number", "cas_number", "cass_number"],
    formula: ["#formula", "formula"],
    conc: ["#concentration", "concentration"],
    sub: ["#sub_name", "sub_name"],
  };

  const layers = {};
  Object.keys(layerDefs).forEach(function (key) {
    layers[key] = {
      patterns: layerDefs[key],
      node: findTextLayerByNames(component, layerDefs[key]),
    };
  });
  return layers;
}

function resolveTemplateBinding(component, variant) {
  const map = {};
  for (const key of Object.keys(component.componentPropertyDefinitions)) {
    const def = component.componentPropertyDefinitions[key];
    if (def.type !== "TEXT") continue;
    const lower = key.toLowerCase();
    if (lower.indexOf("sub") >= 0 && lower.indexOf("name") >= 0) map.sub = key;
    else if (lower.indexOf("product") >= 0) map.product = key;
    else if (lower.indexOf("cas") >= 0) map.cas = key;
    else if (lower.indexOf("formula") >= 0) map.formula = key;
    else if (lower.indexOf("concentr") >= 0 || lower.indexOf("dosage") >= 0) {
      map.conc = key;
    }
  }

  const layers = buildLayerBindings(component);

  const propsOk =
    variant === "flower"
      ? map.product && map.sub && map.conc
      : map.product && map.cas && map.conc;
  if (propsOk) {
    // Keep layer bindings even in properties mode — side-panel #cas_number /
    // #formula text is often not wired to component text properties.
    return { mode: "properties", keys: map, layers: layers };
  }

  const layersOk =
    variant === "flower"
      ? layers.product.node && layers.sub.node && layers.conc.node
      : layers.product.node && layers.cas.node && layers.conc.node;
  if (layersOk) {
    return { mode: "layers", layers: layers, keys: map };
  }

  const label = variant === "flower" ? "v2" : "v1";
  const missing = [];
  if (!map.product && !layers.product.node) missing.push("#product_name (text layer)");
  if (variant === "flower") {
    if (!map.sub && !layers.sub.node) missing.push("#sub_name (text layer)");
  } else if (!map.cas && !layers.cas.node) {
    missing.push("#cas_number (text layer — check for #cass_number typo)");
  }
  if (!map.conc && !layers.conc.node) {
    missing.push("#concentration (text layer, or a frame named #concentration containing text)");
  }

  throw new Error(
    label +
      " setup incomplete. Either bind Component text properties, or add text layers named " +
      (variant === "flower"
        ? "#product_name, #sub_name, #concentration"
        : "#product_name, #cas_number, #concentration, #formula") +
      ". Missing: " +
      missing.join("; ")
  );
}

function getPropertyMap(component, variant) {
  return resolveTemplateBinding(component, variant);
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
  const text = value.trim();
  if (text.toUpperCase().indexOf("CAS") === 0) return text;
  return "CAS " + text;
}

function usesFlowerTemplate(row) {
  return !!pickField(row, ["#sub_name", "sub_name", "Sub Name"]);
}

function usesCapsuleTemplate(row) {
  const forced = pickField(row, ["label_template", "Label Template", "mockup"]).toLowerCase();
  if (forced === "capsule" || forced === "v3") return true;
  const product = pickField(row, ["#product_name", "product_name", "Product Name"]);
  return /capsule/i.test(product);
}

function rowToMainProperties(row, keys) {
  const props = {};
  props[keys.product] = pickField(row, [
    "#product_name",
    "product_name",
    "Product Name",
    "Peptide Name",
  ]);
  props[keys.cas] = formatCas(
    pickField(row, ["#cas_number", "#CAS_number", "cas_number", "CAS Number"])
  );
  props[keys.conc] = pickField(row, [
    "#concentration",
    "#Concentration",
    "concentration",
    "dosage",
    "Dosage",
  ]);
  if (keys.formula) {
    props[keys.formula] = pickField(row, [
      "#formula",
      "formula",
      "Chemical Formula",
      "chemical_formula",
    ]);
  }
  return props;
}

function rowToFlowerProperties(row, keys) {
  const props = {};
  props[keys.product] = pickField(row, [
    "#product_name",
    "product_name",
    "Product Name",
    "Peptide Name",
  ]);
  props[keys.sub] = pickField(row, ["#sub_name", "sub_name", "Sub Name"]);
  props[keys.conc] = pickField(row, [
    "#concentration",
    "#Concentration",
    "concentration",
    "dosage",
    "Dosage",
  ]);
  return props;
}

function plainRowValues(row, useFlower) {
  const values = {
    product: pickField(row, ["#product_name", "product_name", "Product Name", "Peptide Name"]),
    conc: pickField(row, ["#concentration", "#Concentration", "concentration", "dosage", "Dosage"]),
    cas: formatCas(pickField(row, ["#cas_number", "#CAS_number", "cas_number", "CAS Number"])),
    formula: pickField(row, ["#formula", "formula", "Chemical Formula", "chemical_formula"]),
    sub: pickField(row, ["#sub_name", "sub_name", "Sub Name"]),
  };
  if (useFlower) return values;
  return values;
}

async function setInstanceText(instance, layerDef, value) {
  if (!layerDef || value === undefined || value === null || value === "") return;
  const node = findTextLayerByNames(instance, layerDef.patterns);
  if (!node || node.fontName === figma.mixed) return;
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function applySidePanelText(instance, binding, values, useFlower) {
  if (useFlower || !binding.layers) return;
  await setInstanceText(instance, binding.layers.cas, values.cas);
  if (binding.layers.formula && binding.layers.formula.node) {
    await setInstanceText(instance, binding.layers.formula, values.formula);
  }
}

async function applyRowToInstance(instance, binding, row, useFlower) {
  const values = plainRowValues(row, useFlower);
  if (binding.mode === "properties") {
    const keys = binding.keys;
    const props = useFlower ? rowToFlowerProperties(row, keys) : rowToMainProperties(row, keys);
    instance.setProperties(props);
    await applySidePanelText(instance, binding, values, useFlower);
    return {
      product: props[keys.product],
      conc: props[keys.conc],
      sub: keys.sub ? props[keys.sub] : "",
      cas: keys.cas ? props[keys.cas] : values.cas,
      formula: keys.formula ? props[keys.formula] : values.formula,
    };
  }

  await setInstanceText(instance, binding.layers.product, values.product);
  if (useFlower) {
    await setInstanceText(instance, binding.layers.sub, values.sub);
  } else {
    await setInstanceText(instance, binding.layers.cas, values.cas);
    if (binding.layers.formula.node) {
      await setInstanceText(instance, binding.layers.formula, values.formula);
    }
  }
  await setInstanceText(instance, binding.layers.conc, values.conc);
  return values;
}

function instanceNameFromValues(values, variant) {
  const prefix = variant === "capsule" ? "capsule" : variant === "flower" ? "flower" : "main";
  return [prefix, values.product, values.conc].filter(Boolean).join(" — ");
}

async function batchImportLabels(rows) {
  if (!rows.length) {
    throw new Error("CSV has no data rows.");
  }

  const templates = findLabelTemplates();
  const mainBinding = resolveTemplateBinding(templates.main, "main");
  const flowerBinding = resolveTemplateBinding(templates.flower, "flower");
  const capsuleBinding = templates.capsule
    ? resolveTemplateBinding(templates.capsule, "main")
    : null;

  const gap = 80;
  const cols = 4;
  const bottoms = [templates.main, templates.flower, templates.capsule].filter(Boolean);
  const startX = Math.min.apply(
    null,
    bottoms.map(function (t) {
      return t.x;
    })
  );
  const startY =
    Math.max.apply(
      null,
      bottoms.map(function (t) {
        return t.y + t.height;
      })
    ) + gap;

  const created = [];
  var mainCount = 0;
  var flowerCount = 0;
  var capsuleCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const forcedTemplate = pickField(row, ["label_template", "Label Template"]).toLowerCase();
    const useCapsule =
      !!templates.capsule &&
      (forcedTemplate === "capsule" ||
        forcedTemplate === "v3" ||
        (forcedTemplate !== "main" &&
          forcedTemplate !== "flower" &&
          usesCapsuleTemplate(row)));
    const useFlower =
      !useCapsule &&
      (forcedTemplate === "flower" ||
        (forcedTemplate !== "main" && usesFlowerTemplate(row)));

    const component = useCapsule
      ? templates.capsule
      : useFlower
        ? templates.flower
        : templates.main;
    const binding = useCapsule ? capsuleBinding : useFlower ? flowerBinding : mainBinding;

    const instance = component.createInstance();
    const values = await applyRowToInstance(instance, binding, row, useFlower);
    if (!values.product) {
      instance.remove();
      continue;
    }

    await autoFitProductName(instance);
    if (!useFlower) await styleFormulaDigits(instance);

    const col = i % cols;
    const rowIdx = Math.floor(i / cols);
    instance.x = startX + col * (component.width + gap);
    instance.y = startY + rowIdx * (component.height + gap);
    instance.name = instanceNameFromValues(
      values,
      useCapsule ? "capsule" : useFlower ? "flower" : "main"
    );

    figma.currentPage.appendChild(instance);
    created.push(instance);
    if (useCapsule) capsuleCount++;
    else if (useFlower) flowerCount++;
    else mainCount++;
  }

  if (!created.length) {
    throw new Error(
      "No rows imported. Check CSV headers: #product_name, #cas_number, #formula, #concentration, #sub_name"
    );
  }

  figma.currentPage.selection = created;
  figma.viewport.scrollAndZoomIntoView(created);
  return {
    total: created.length,
    main: mainCount,
    flower: flowerCount,
    capsule: capsuleCount,
  };
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

  const productName = makeText("#product_name", "BPC-157", 72, 168, 96, "Bold");
  frame.appendChild(productName);

  const casNumber = makeText("#cas_number", "CAS 137525-51-0", 72, 306, 30, fonts.semi);
  frame.appendChild(casNumber);

  const formula = makeText("#formula", "C62H98N16O22", 72, 350, 28, "Regular");
  frame.appendChild(formula);

  const concentration = makeText("#concentration", "10mg", 72, 396, 48, "Bold");
  frame.appendChild(concentration);

  const component = figma.createComponentFromNode(frame);

  function bindTextProp(textNode, propName, defaultValue) {
    const key = component.addComponentProperty(propName, "TEXT", defaultValue);
    textNode.componentPropertyReferences = { characters: key };
    return key;
  }

  bindTextProp(productName, "product_name", "BPC-157");
  bindTextProp(casNumber, "cas_number", "CAS 137525-51-0");
  bindTextProp(formula, "formula", "C62H98N16O22");
  bindTextProp(concentration, "concentration", "10mg");

  figma.currentPage.selection = [component];
  figma.viewport.scrollAndZoomIntoView([component]);
  figma.notify("Legacy template created — prefer your #v1 / #v2 / #v3 components");
}
