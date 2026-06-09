import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(".");
const sourceDir = resolve(rootDir, "apps", "storefront", ".next");
const targetDir = resolve(rootDir, ".next");

if (!existsSync(sourceDir)) {
  throw new Error(
    `Expected Next output at ${sourceDir} but it was not found. Build apps/storefront first.`
  );
}

if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true });
}

cpSync(sourceDir, targetDir, { recursive: true });
console.log("Synced apps/storefront/.next to root .next for Vercel packaging.");
