export const CARDTOUSDT_PROVIDER = "cardtousdt" as const

export const CARD_CHECKOUT_TITLE = "Credit/Debit Cards (Visa/MasterCard/Amex/Discover)"

export const CARD_CHECKOUT_DESCRIPTION_LINES = [
  '1. Click on "Place order".',
  "2. Card checkout opens in a new tab.",
  "3. Pay with Visa, Mastercard, Amex, or Discover. We do not collect card numbers on this site."
] as const

const CARD_CHECKOUT_TAB = "tetrava-card-checkout"

export function openCardCheckoutPlaceholder() {
  if (typeof window === "undefined") return null
  const tab = window.open("about:blank", CARD_CHECKOUT_TAB)
  if (tab) tab.opener = null
  return tab
}

export function assignCardCheckoutTab(tab: Window | null, url: string) {
  if (typeof window === "undefined" || !url) return false
  if (tab && !tab.closed) {
    tab.location.replace(url)
    tab.focus()
    return true
  }
  return openCardCheckoutTab(url)
}

export function closeCardCheckoutTab(tab: Window | null) {
  try {
    tab?.close()
  } catch {
    // Popup may already be gone.
  }
}

export function openCardCheckoutTab(url: string) {
  if (typeof window === "undefined" || !url) return false
  const tab = window.open(url, CARD_CHECKOUT_TAB)
  if (tab) tab.opener = null
  return Boolean(tab)
}
