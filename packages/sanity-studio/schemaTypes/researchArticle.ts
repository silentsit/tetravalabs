import { defineArrayMember, defineField, defineType } from "sanity"

const categories = [
  { title: "Protocols", value: "Protocols" },
  { title: "Analytical", value: "Analytical" },
  { title: "Compliance", value: "Compliance" }
]

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
      name: "category",
      title: "Category",
      type: "string",
      options: { list: categories },
      initialValue: "Protocols"
    }),
    defineField({
      name: "readTimeMinutes",
      title: "Read time (minutes)",
      type: "number",
      validation: (rule) => rule.min(1).max(60)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 16,
      description: "Use blank lines between paragraphs."
    }),
    defineField({
      name: "references",
      title: "References",
      type: "array",
      description: "Citations rendered as a numbered footnote list at the end of the article.",
      of: [
        defineArrayMember({
          type: "object",
          name: "citation",
          title: "Citation",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "authors",
              title: "Authors",
              type: "string",
              description: "e.g. Smith J, Lee A"
            }),
            defineField({
              name: "publication",
              title: "Publication",
              type: "string",
              description: "Journal, publisher, or site name"
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "string"
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.uri({
                  allowRelative: false,
                  scheme: ["http", "https"]
                })
            }),
            defineField({
              name: "citationText",
              title: "Full citation (optional)",
              type: "text",
              rows: 2,
              description: "If set, shown instead of the auto-built citation line."
            })
          ],
          preview: {
            select: {
              title: "title",
              authors: "authors",
              year: "year"
            },
            prepare({ title, authors, year }) {
              return {
                title: title || "Untitled citation",
                subtitle: [authors, year].filter(Boolean).join(" · ")
              }
            }
          }
        })
      ]
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: { title: "title", subtitle: "category" }
  }
})
