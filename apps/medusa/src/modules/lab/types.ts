export type ProductVisualType =
  | "vial"
  | "capsule"
  | "water_solution"
  | "blend"
  | "bundle"

export type BatchDocumentType = "coa" | "hplc"

export interface LabBatchDocument {
  id: string
  variant_id: string
  batch_number: string
  purity_percent: number | null
  tested_at: string | null
  document_type: BatchDocumentType
  document_url: string
  metadata?: Record<string, unknown>
}

export interface ComplianceRecord {
  order_id: string
  disclaimer_version: string
  acknowledged_at: string
  shipping_country: string | null
  ip_country: string | null
}
