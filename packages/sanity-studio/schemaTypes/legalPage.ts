import { defineField, defineType } from "sanity"

const legalTypes = [
  { title: "Terms of Service", value: "terms" },
  { title: "Privacy Policy", value: "privacy" },
  { title: "Refund Policy", value: "refund" },
  { title: "RUO Disclaimer", value: "ruo" }
]

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Page type",
      type: "string",
      options: { list: legalTypes },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 24,
      description: "Plain text with blank lines between paragraphs.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      initialValue: "1.0"
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: { title: "type", subtitle: "version" }
  }
})
