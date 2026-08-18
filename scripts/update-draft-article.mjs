import { readFileSync, writeFileSync } from "node:fs";

const [, , slug, bodyPath] = process.argv;
if (!slug || !bodyPath) {
  console.error("Usage: node scripts/update-draft-article.mjs <slug> <body.json>");
  process.exit(1);
}

const dataPath = "apps/storefront/src/data/research-articles.json";
const body = JSON.parse(readFileSync(bodyPath, "utf8"));
const data = JSON.parse(readFileSync(dataPath, "utf8"));

const idx = data.findIndex((a) => a.slug === slug);
if (idx === -1) {
  console.error(`Slug "${slug}" not found. Aborting.`);
  process.exit(1);
}

data[idx] = { ...data[idx], body };
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Updated body for "${slug}" (${data[idx].body.length} blocks).`);
