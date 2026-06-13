import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemaTypes"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || ""
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production"

export default defineConfig({
  name: "tetrava-labs",
  title: "Tetrava Labs",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
})
