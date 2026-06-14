import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { syncProductToTypesense } from "../lib/typesense-index"

export default async function typesenseProductSyncHandler({
  event: { data },
  container
}: SubscriberArgs<{ id: string }>) {
  if (!data?.id) return
  await syncProductToTypesense(container, data.id)
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"]
}
