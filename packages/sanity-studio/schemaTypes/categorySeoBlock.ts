import { defineField, defineType } from "sanity"

export const categorySeoBlock = defineType({
  name: "categorySeoBlock",
  title: "Category SEO Block",
  type: "document",
  fields: [
    defineField({
      name: "categorySlug",
      title: "Category slug",
      type: "string",
      description: "URL slug used on /category/{slug} (e.g. glp-1-metabolic).",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "introCopy",
      title: "Intro copy",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "supportingCopy",
      title: "Supporting copy",
      type: "text",
      rows: 6
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string"
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3
    })
  ],
  preview: {
    select: { title: "categorySlug", subtitle: "introCopy" }
  }
})
