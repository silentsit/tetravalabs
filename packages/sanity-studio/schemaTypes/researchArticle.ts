import { defineField, defineType } from "sanity"

export const researchArticle = defineType({
  name: "researchArticle",
  title: "Research Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 16,
      description: "Use blank lines between paragraphs."
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt" }
  }
})
