import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { deleteTypesenseProduct } from "../lib/typesense-index"

export default async function typesenseProductDeleteHandler({
  event: { data }
}: SubscriberArgs<{ id: string }>) {
  if (!data?.id) return
  await deleteTypesenseProduct(data.id)
}

export const config: SubscriberConfig = {
  event: "product.deleted"
}
