import { defineField, defineType } from "sanity"

export const tableRow = defineType({
  name: "tableRow",
  title: "Table row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1).error("Add at least one cell.")
    })
  ],
  preview: {
    select: { cells: "cells" },
    prepare({ cells }) {
      const row = (cells || []).filter(Boolean).join(" | ")
      return {
        title: row || "Empty row"
      }
    }
  }
})
