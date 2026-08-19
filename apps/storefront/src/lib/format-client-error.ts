export function formatClientError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message && error.message !== "[object Event]") {
    return error.message
  }

  if (typeof error === "string" && error.trim()) {
    return error
  }

  if (error && typeof error === "object" && "type" in error) {
    return "The page scripts failed to load. Refresh the page. If you are developing locally, stop the dev server, delete apps/storefront/.next, and run npm run dev again."
  }

  return fallback
}
