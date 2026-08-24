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
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      validation: (rule) => rule.max(70)
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160)
    }),
    defineField({
      name: "keywords",
      title: "Target keywords and questions",
      type: "array",
      of: [{ type: "string" }]
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
      name: "image",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description: "Hero/cover image shown at the top of the article."
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Rich text with optional tables and mid-article product cards (Medusa handle only).",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" }
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"]
                      })
                  })
                ]
              }
            ]
          }
        }),
        defineArrayMember({ type: "blogImage" }),
        defineArrayMember({ type: "productEmbed" }),
        defineArrayMember({ type: "tableBlock" })
      ]
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
    }),
    defineField({
      name: "video",
      title: "Source video (YouTube)",
      type: "object",
      description:
        "Optional source YouTube video. Linked out from the article; do not use VideoObject schema on Research Hub posts (they are not Google watch pages).",
      fields: [
        defineField({
          name: "youtubeId",
          title: "YouTube video ID",
          type: "string",
          validation: (rule) => rule.required()
        }),
        defineField({
          name: "title",
          title: "Video title",
          type: "string"
        }),
        defineField({
          name: "description",
          title: "Video description",
          type: "text",
          rows: 3
        }),
        defineField({
          name: "presenter",
          title: "Presenter",
          type: "string"
        }),
        defineField({
          name: "uploadDate",
          title: "Upload date",
          type: "datetime",
          description: "Original YouTube upload date (ISO).",
          validation: (rule) => rule.required()
        }),
        defineField({
          name: "thumbnail",
          title: "Thumbnail URL override",
          type: "url"
        })
      ]
    })
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" }
  }
})
