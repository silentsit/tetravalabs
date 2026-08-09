import { defineField, defineType } from "sanity"

export const tableBlock = defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
      description: "Shown above the table for accessibility and context."
    }),
    defineField({
      name: "hasHeaderRow",
      title: "First row is a header",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "tableRow" }],
      validation: (rule) => rule.min(1).error("Add at least one row.")
    })
  ],
  preview: {
    select: { caption: "caption", rows: "rows" },
    prepare({ caption, rows }) {
      const count = rows?.length || 0
      return {
        title: caption || "Comparison table",
        subtitle: `${count} row${count === 1 ? "" : "s"}`
      }
    }
  }
})
