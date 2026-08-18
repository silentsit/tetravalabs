// One-off authoring helper: appends a new draft article (meta + body) to
// research-articles.json. Does NOT touch retired-blog-slugs.ts / KEPT_BLOG_SLUGS,
// so the article stays unreachable on the live site until a human reviews it
// and explicitly publishes it (per AGENTS.md E-E-A-T review rule).
import { readFileSync, writeFileSync } from "node:fs";

const [, , metaPath, bodyPath] = process.argv;
if (!metaPath || !bodyPath) {
  console.error("Usage: node scripts/append-draft-article.mjs <meta.json> <body.json>");
  process.exit(1);
}

const dataPath = "apps/storefront/src/data/research-articles.json";
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const body = JSON.parse(readFileSync(bodyPath, "utf8"));
const data = JSON.parse(readFileSync(dataPath, "utf8"));

if (data.some((a) => a.slug === meta.slug)) {
  console.error(`Slug "${meta.slug}" already exists in research-articles.json. Aborting.`);
  process.exit(1);
}

const entry = { ...meta, body };
data.push(entry);
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Appended "${meta.slug}" (${data.length} total articles).`);
