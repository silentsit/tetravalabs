type IncomingCryptoEvent =
  | "pending"
  | "processing"
  | "confirmed"
  | "completed"
  | "expired"
  | "failed"
  | "refunded"
  | string

export function mapCryptoEventToOrderStatus(event: IncomingCryptoEvent) {
  switch (event) {
    case "pending":
      return "pending"
    case "processing":
      return "processing"
    case "confirmed":
    case "completed":
      return "completed"
    case "refunded":
      return "refunded"
    case "expired":
    case "failed":
      return "failed"
    default:
      return "unknown"
  }
}
