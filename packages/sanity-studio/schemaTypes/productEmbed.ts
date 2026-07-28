import { defineField, defineType } from "sanity"

export const productEmbed = defineType({
  name: "productEmbed",
  title: "Product card",
  type: "object",
  fields: [
    defineField({
      name: "handle",
      title: "Product handle",
      type: "string",
      description: "Medusa parent product handle (e.g. bpc-157). Do not store price or inventory here.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "cardVariant",
      title: "Card style",
      type: "string",
      options: {
        list: [
          { title: "Featured", value: "featured" },
          { title: "Shop", value: "shop" },
          { title: "Default", value: "default" }
        ],
        layout: "radio"
      },
      initialValue: "featured"
    })
  ],
  preview: {
    select: { handle: "handle", cardVariant: "cardVariant" },
    prepare({ handle, cardVariant }) {
      return {
        title: handle ? `Product: ${handle}` : "Product card",
        subtitle: cardVariant ? `Style: ${cardVariant}` : "Product card"
      }
    }
  }
})
