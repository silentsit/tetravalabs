// UI inlined for Figma dev plugin (no bundler required)
const PLUGIN_UI = "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <style>\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n    body {\n      font-family: Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n      background: #ffffff;\n      color: #333;\n      padding: 24px;\n      width: 320px;\n    }\n    .header {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      margin-bottom: 20px;\n    }\n    .logo-hex {\n      width: 36px;\n      height: 32px;\n      background: #3D94D9;\n      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .logo-hex::after {\n      content: \"\";\n      width: 12px;\n      height: 14px;\n      background: white;\n      clip-path: polygon(35% 0%, 65% 0%, 65% 40%, 100% 80%, 100% 100%, 0% 100%, 0% 80%, 35% 40%);\n    }\n    .header h1 {\n      font-size: 16px;\n      font-weight: 600;\n      color: #1a1a1a;\n    }\n    .preview {\n      width: 100%;\n      aspect-ratio: 1062 / 1112;\n      background: #f5f5f5;\n      border-radius: 8px;\n      border: 1px solid #e0e0e0;\n      padding: 16px;\n      margin-bottom: 20px;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      font-size: 10px;\n    }\n    .preview-row {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n    .preview-logo {\n      width: 16px;\n      height: 14px;\n      background: #3D94D9;\n      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n    }\n    .preview-line {\n      height: 1px;\n      background: #999;\n      width: 100%;\n    }\n    .preview-product {\n      font-size: 18px;\n      font-weight: 800;\n      letter-spacing: 1px;\n      color: #000;\n    }\n    .preview-cas {\n      font-size: 8px;\n      font-weight: 600;\n      color: #333;\n    }\n    .preview-row-split {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    .preview-dosage {\n      font-size: 12px;\n      font-weight: 700;\n    }\n    .preview-purity {\n      font-size: 10px;\n      font-weight: 600;\n    }\n    .preview-footer {\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 1px;\n      color: #000;\n    }\n    .specs {\n      background: #f8f9fa;\n      border-radius: 8px;\n      padding: 14px;\n      margin-bottom: 20px;\n      font-size: 12px;\n      line-height: 1.6;\n    }\n    .specs-title {\n      font-weight: 600;\n      margin-bottom: 8px;\n      color: #555;\n      font-size: 11px;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n    }\n    .spec-item {\n      display: flex;\n      justify-content: space-between;\n      padding: 3px 0;\n    }\n    .spec-label {\n      color: #888;\n    }\n    .spec-value {\n      color: #333;\n      font-weight: 500;\n      font-family: \"SF Mono\", Monaco, monospace;\n      font-size: 11px;\n    }\n    .properties {\n      margin-bottom: 20px;\n    }\n    .prop-list {\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n      margin-top: 10px;\n    }\n    .prop-tag {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 6px 10px;\n      background: #f0f7ff;\n      border: 1px solid #d0e3f7;\n      border-radius: 6px;\n      font-size: 12px;\n    }\n    .prop-icon {\n      width: 16px;\n      height: 16px;\n      background: #3D94D9;\n      border-radius: 4px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      font-size: 10px;\n      font-weight: 700;\n    }\n    .prop-name {\n      font-weight: 500;\n      color: #1a1a1a;\n      font-family: \"SF Mono\", Monaco, monospace;\n      font-size: 11px;\n    }\n    .btn {\n      width: 100%;\n      padding: 12px;\n      background: #3D94D9;\n      color: white;\n      border: none;\n      border-radius: 8px;\n      font-size: 14px;\n      font-weight: 600;\n      cursor: pointer;\n      transition: background 0.15s;\n    }\n    .btn:hover {\n      background: #2d7bc7;\n    }\n    .btn:active {\n      background: #2568a8;\n    }\n    .footer {\n      margin-top: 16px;\n      text-align: center;\n      font-size: 11px;\n      color: #aaa;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"header\">\n    <div class=\"logo-hex\"></div>\n    <h1>TetravaLabs Label</h1>\n  </div>\n\n  <div class=\"preview\">\n    <div class=\"preview-row\">\n      <div class=\"preview-logo\"></div>\n      <span>TetravaLabs</span>\n    </div>\n    <div class=\"preview-line\"></div>\n    <div class=\"preview-product\">RETATRUTIDE</div>\n    <div class=\"preview-cas\">CAS: 2381089-83-2</div>\n    <div class=\"preview-row-split\">\n      <span class=\"preview-dosage\">20mg <span style=\"font-weight:400;color:#999;font-size:8px\">(concentration)</span></span>\n      <span class=\"preview-purity\">Purity: >99.9%</span>\n    </div>\n    <div class=\"preview-line\"></div>\n    <div class=\"preview-footer\">FOR RESEARCH USE ONLY</div>\n  </div>\n\n  <div class=\"specs\">\n    <div class=\"specs-title\">Specifications</div>\n    <div class=\"spec-item\">\n      <span class=\"spec-label\">Frame Size</span>\n      <span class=\"spec-value\">1062 &times; 1112</span>\n    </div>\n    <div class=\"spec-item\">\n      <span class=\"spec-label\">Font</span>\n      <span class=\"spec-value\">Inter</span>\n    </div>\n    <div class=\"spec-item\">\n      <span class=\"spec-label\">Layers</span>\n      <span class=\"spec-value\">10</span>\n    </div>\n    <div class=\"spec-item\">\n      <span class=\"spec-label\">Type</span>\n      <span class=\"spec-value\">Component</span>\n    </div>\n  </div>\n\n  <div class=\"properties\">\n    <div class=\"specs-title\">Swappable Properties (5)</div>\n    <div class=\"prop-list\">\n      <div class=\"prop-tag\">\n        <div class=\"prop-icon\">T</div>\n        <span class=\"prop-name\">product_name</span>\n      </div>\n      <div class=\"prop-tag\">\n        <div class=\"prop-icon\">T</div>\n        <span class=\"prop-name\">cas_number</span>\n      </div>\n      <div class=\"prop-tag\">\n        <div class=\"prop-icon\">T</div>\n        <span class=\"prop-name\">concentration</span>\n      </div>\n      <div class=\"prop-tag\">\n        <div class=\"prop-icon\">T</div>\n        <span class=\"prop-name\">purity</span>\n      </div>\n      <div class=\"prop-tag\">\n        <div class=\"prop-icon\">T</div>\n        <span class=\"prop-name\">footer</span>\n      </div>\n    </div>\n  </div>\n\n  <button class=\"btn\" id=\"generate\">Generate Label Template</button>\n\n  <div class=\"footer\">Creates a Component with text properties</div>\n\n  <script>\n    document.getElementById('generate').addEventListener('click', () => {\n      parent.postMessage({ pluginMessage: { type: 'generate' } }, '*');\n    });\n  </script>\n</body>\n</html>";
figma.showUI(PLUGIN_UI, { width: 320, height: 640, themeColors: true });

// ============================================================
// TetravaLabs Label Template Generator
// Creates a 1062×1112 label component with swappable text properties
// ============================================================


figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    await createLabelTemplate();
  }
};

async function createLabelTemplate() {
  // Load the Inter font
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

  // ---- COLORS ----
  const COLORS = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 1, g: 1, b: 1 },
    logoBlue: { r: 0.24, g: 0.58, b: 0.85 },  // #3D94D9
    watermarkGray: { r: 0.88, g: 0.88, b: 0.88 },
    dividerGray: { r: 0.55, g: 0.55, b: 0.55 },
  };

  // ---- MAIN FRAME (1062 × 1112) ----
  const frame = figma.createFrame();
  frame.name = "Label Template";
  frame.resize(1062, 1112);
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.strokes = [{ type: "SOLID", color: COLORS.black, opacity: 0.15 }];
  frame.strokeWeight = 1;
  frame.strokeAlign = "INSIDE";

  // ---- MOLECULAR WATERMARK (Background) ----
  const watermarkGroup = figma.createGroup();
  watermarkGroup.name = "Watermark";
  watermarkGroup.locked = true;

  // Create hexagon shape for watermark background
  const watermarkHex = figma.createPolygon();
  watermarkHex.name = "watermark-hex";
  watermarkHex.pointCount = 6;
  watermarkHex.resize(600, 520);
  watermarkHex.x = 231;
  watermarkHex.y = 296;
  watermarkHex.fills = [];
  watermarkHex.strokes = [{ type: "SOLID", color: COLORS.watermarkGray, opacity: 0.35 }];
  watermarkHex.strokeWeight = 1.5;
  watermarkHex.strokeAlign = "CENTER";

  // Add internal molecular bond lines (hexagonal pattern)
  const bondLines = [
    // Center hex connections
    { sx: 531, sy: 296, ex: 531, ey: 416 },     // top-center to center
    { sx: 381, sy: 386, ex: 531, ey: 416 },     // left-upper to center
    { sx: 531, sy: 416, ex: 681, ey: 386 },     // center to right-upper
    { sx: 381, sy: 506, ex: 531, ey: 536 },     // left-lower to bottom-center
    { sx: 531, sy: 416, ex: 531, ey: 536 },     // center to bottom-center
    { sx: 531, sy: 536, ex: 681, ey: 506 },     // bottom-center to right-lower
  ];

  bondLines.forEach((bond, i) => {
    const line = figma.createVector();
    line.name = `bond-${i}`;
    line.vectorPaths = [{
      windingRule: "NONZERO",
      data: `M ${bond.sx} ${bond.sy} L ${bond.ex} ${bond.ey}`
    }];
    line.strokes = [{ type: "SOLID", color: COLORS.watermarkGray, opacity: 0.3 }];
    line.strokeWeight = 1.5;
    line.strokeCap = "ROUND";
    line.strokeJoin = "ROUND";
    line.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    watermarkGroup.appendChild(line);
  });

  // Small atom circles at vertices
  const atomPositions = [
    { x: 531, y: 296, r: 12 },   // top
    { x: 681, y: 386, r: 10 },   // upper-right
    { x: 681, y: 506, r: 10 },   // lower-right
    { x: 531, y: 536, r: 12 },   // bottom
    { x: 381, y: 506, r: 10 },   // lower-left
    { x: 381, y: 386, r: 10 },   // upper-left
    { x: 531, y: 416, r: 10 },   // center
  ];

  atomPositions.forEach((atom, i) => {
    const circle = figma.createEllipse();
    circle.name = `atom-${i}`;
    circle.resize(atom.r * 2, atom.r * 2);
    circle.x = atom.x - atom.r;
    circle.y = atom.y - atom.r;
    circle.fills = [{ type: "SOLID", color: COLORS.white, opacity: 0.85 }];
    circle.strokes = [{ type: "SOLID", color: COLORS.watermarkGray, opacity: 0.3 }];
    circle.strokeWeight = 1.5;
    circle.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    watermarkGroup.appendChild(circle);
  });

  watermarkGroup.appendChild(watermarkHex);

  // ---- LOGO AREA (Molecular Hexagon) ----
  // NOTE: This is a vector approximation of the TetravaLabs logo.
  // To use the actual logo.png, swap this group with an image fill.
  const logoGroup = figma.createGroup();
  logoGroup.name = "logo-group";

  // Hexagon outline
  const logoHex = figma.createPolygon();
  logoHex.name = "logo-hex-outline";
  logoHex.pointCount = 6;
  logoHex.resize(42, 36);
  logoHex.x = 72;
  logoHex.y = 58;
  logoHex.fills = [];
  logoHex.strokes = [{ type: "SOLID", color: COLORS.logoBlue }];
  logoHex.strokeWeight = 4;
  logoHex.rotation = 30;
  logoGroup.appendChild(logoHex);

  // Inner hexagon
  const logoInner = figma.createPolygon();
  logoInner.name = "logo-hex-inner";
  logoInner.pointCount = 6;
  logoInner.resize(22, 19);
  logoInner.x = 82;
  logoInner.y = 66;
  logoInner.fills = [{ type: "SOLID", color: COLORS.logoBlue, opacity: 0.6 }];
  logoInner.rotation = 30;
  logoGroup.appendChild(logoInner);

  // Vertex nodes (spheres) — 6 corners
  const logoNodes = [
    { cx: 93, cy: 58, r: 5 },   // top
    { cx: 106, cy: 66, r: 5 },  // upper-right
    { cx: 106, cy: 84, r: 5 },  // lower-right
    { cx: 93, cy: 93, r: 5 },   // bottom
    { cx: 80, cy: 84, r: 5 },   // lower-left
    { cx: 80, cy: 66, r: 5 },   // upper-left
  ];
  logoNodes.forEach((n, i) => {
    const node = figma.createEllipse();
    node.name = `logo-node-${i}`;
    node.resize(n.r * 2, n.r * 2);
    node.x = n.cx - n.r;
    node.y = n.cy - n.r;
    node.fills = [{ type: "SOLID", color: COLORS.logoBlue }];
    node.strokes = [{ type: "SOLID", color: COLORS.white }];
    node.strokeWeight = 1;
    logoGroup.appendChild(node);
  });

  // ---- TetravaLabs Logo Text ----
  const logoText = figma.createText();
  logoText.name = "brand-text";
  logoText.fontName = { family: "Inter", style: "Semi Bold" };
  logoText.fontSize = 28;
  logoText.letterSpacing = { value: 0.5, unit: "PIXELS" };
  logoText.x = 128;
  logoText.y = 64;
  logoText.characters = "TetravaLabs";
  logoText.fills = [{ type: "SOLID", color: COLORS.black }];
  logoText.textCase = "ORIGINAL";

  // ---- DIVIDER LINE 1 (Below logo) ----
  const divider1 = figma.createLine();
  divider1.name = "divider-top";
  divider1.x = 72;
  divider1.y = 126;
  divider1.resize(918, 0);
  divider1.strokes = [{ type: "SOLID", color: COLORS.dividerGray }];
  divider1.strokeWeight = 1.5;
  divider1.strokeCap = "ROUND";

  // ---- PRODUCT NAME (Large Bold) ----
  const productName = figma.createText();
  productName.name = "#product_name";
  productName.fontName = { family: "Inter", style: "Bold" };
  productName.fontSize = 96;
  productName.letterSpacing = { value: 2, unit: "PIXELS" };
  productName.x = 72;
  productName.y = 168;
  productName.characters = "RETATRUTIDE";
  productName.fills = [{ type: "SOLID", color: COLORS.black }];
  productName.textCase = "UPPER";

  // ---- CAS NUMBER ----
  const casNumber = figma.createText();
  casNumber.name = "#CAS_number";
  casNumber.fontName = { family: "Inter", style: "Semi Bold" };
  casNumber.fontSize = 30;
  casNumber.x = 72;
  casNumber.y = 306;
  casNumber.characters = "CAS: 2381089-83-2";
  casNumber.fills = [{ type: "SOLID", color: COLORS.black }];

  // ---- CONCENTRATION (Left side) ----
  const dosage = figma.createText();
  dosage.name = "#concentration";
  dosage.fontName = { family: "Inter", style: "Bold" };
  dosage.fontSize = 48;
  dosage.x = 72;
  dosage.y = 396;
  dosage.characters = "20mg";
  dosage.fills = [{ type: "SOLID", color: COLORS.black }];

  // ---- PURITY (Right side) ----
  const purity = figma.createText();
  purity.name = "purity";
  purity.fontName = { family: "Inter", style: "Semi Bold" };
  purity.fontSize = 38;
  purity.x = 722;
  purity.y = 408;
  purity.characters = "Purity: >99.9%";
  purity.fills = [{ type: "SOLID", color: COLORS.black }];

  // ---- DIVIDER LINE 2 (Above footer) ----
  const divider2 = figma.createLine();
  divider2.name = "divider-bottom";
  divider2.x = 72;
  divider2.y = 520;
  divider2.resize(918, 0);
  divider2.strokes = [{ type: "SOLID", color: COLORS.dividerGray }];
  divider2.strokeWeight = 1.5;
  divider2.strokeCap = "ROUND";

  // ---- FOOTER ("FOR RESEARCH USE ONLY") ----
  const footer = figma.createText();
  footer.name = "footer";
  footer.fontName = { family: "Inter", style: "Bold" };
  footer.fontSize = 52;
  footer.letterSpacing = { value: 3, unit: "PIXELS" };
  footer.x = 72;
  footer.y = 558;
  footer.characters = "FOR RESEARCH USE ONLY";
  footer.fills = [{ type: "SOLID", color: COLORS.black }];
  footer.textCase = "UPPER";

  // ---- ASSEMBLE ALL ELEMENTS INTO FRAME ----
  // Order matters for z-index (first = bottom)
  frame.appendChild(watermarkGroup);
  frame.appendChild(logoGroup);
  frame.appendChild(logoText);
  frame.appendChild(divider1);
  frame.appendChild(productName);
  frame.appendChild(casNumber);
  frame.appendChild(dosage);
  frame.appendChild(purity);
  frame.appendChild(divider2);
  frame.appendChild(footer);

  // ---- CONVERT TO COMPONENT ----
  const component = figma.createComponent();
  component.name = "TetravaLabs Label Template";
  component.x = 100;
  component.y = 100;
  component.resize(1062, 1112);
  component.fills = frame.fills;
  component.strokes = frame.strokes;
  component.strokeWeight = frame.strokeWeight;
  component.strokeAlign = frame.strokeAlign;

  // Move all children from frame to component
  const children = [...frame.children];
  children.forEach(child => {
    component.appendChild(child);
  });

  // Remove the temporary frame
  frame.remove();

  // ---- ADD COMPONENT PROPERTIES (Swappable Text) ----

  // 1. Product Name property
  component.addComponentProperty("#product_name", "TEXT", "RETATRUTIDE");
  productName.componentPropertyReferences = {
    characters: "#product_name"
  };

  // 2. CAS Number property
  component.addComponentProperty("#CAS_number", "TEXT", "CAS: 2381089-83-2");
  casNumber.componentPropertyReferences = {
    characters: "#CAS_number"
  };

  // 3. Concentration property
  component.addComponentProperty("#concentration", "TEXT", "20mg");
  dosage.componentPropertyReferences = {
    characters: "#concentration"
  };

  // 4. Purity property
  component.addComponentProperty("purity", "TEXT", "Purity: >99.9%");
  purity.componentPropertyReferences = {
    characters: "purity"
  };

  // 5. Footer property
  component.addComponentProperty("footer", "TEXT", "FOR RESEARCH USE ONLY");
  footer.componentPropertyReferences = {
    characters: "footer"
  };

  // ---- ADD TO CURRENT PAGE ----
  figma.currentPage.appendChild(component);
  figma.currentPage.selection = [component];
  figma.viewport.scrollAndZoomIntoView([component]);

  // ---- CREATE AN INSTANCE AS EXAMPLE ----
  const instance = component.createInstance();
  instance.x = 1200;
  instance.y = 100;
  instance.setProperties({
    "#product_name": "SEMGLUTIDE",
    "#CAS_number": "CAS: 910463-68-2",
    "#concentration": "5mg",
    "purity": "Purity: >98%",
    "footer": "FOR RESEARCH USE ONLY"
  });
  figma.currentPage.appendChild(instance);

  // ---- SUCCESS ----
  figma.notify("✅ TetravaLabs Label Template created with 5 swappable text properties!");
  figma.closePlugin();
}