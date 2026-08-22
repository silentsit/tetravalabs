import { defineField, defineType } from "sanity"

export const blogImage = defineType({
  name: "blogImage",
  title: "Article image",
  type: "object",
  fields: [
    defineField({
      name: "src",
      title: "Image path or URL",
      type: "string",
      description:
        "Use a repo-hosted /images/blog/... path or an absolute Sanity CDN URL.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2
    })
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption"
    }
  }
})
