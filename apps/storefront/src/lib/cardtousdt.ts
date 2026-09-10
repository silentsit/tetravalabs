export const CARDTOUSDT_PROVIDER = "cardtousdt" as const

export const CARD_CHECKOUT_TITLE = "Credit/Debit Cards (Visa/MasterCard/Amex/Discover)"

export const CARD_CHECKOUT_DESCRIPTION_LINES = [
  '1. Click on "Place order".',
  "2. Card checkout opens in a new tab.",
  "3. Pay with Visa, Mastercard, Amex, or Discover. We do not collect card numbers on this site."
] as const

const CARD_CHECKOUT_TAB = "tetrava-card-checkout"

/** Reverse-tabnabbing guard. Throws once the handle is cross-origin, so it stays best-effort. */
function detachOpener(tab: Window | null) {
  try {
    if (tab) tab.opener = null
  } catch {
    // Handle already navigated to CardToUSDT.
  }
}

/**
 * Opened during the Place order click so the tab survives the popup blocker, which ignores
 * window.open once the checkout request has resolved.
 */
export function openCardCheckoutPlaceholder() {
  if (typeof window === "undefined") return null
  try {
    const tab = window.open("about:blank", CARD_CHECKOUT_TAB)
    detachOpener(tab)
    return tab
  } catch {
    return null
  }
}

export function assignCardCheckoutTab(tab: Window | null, url: string) {
  if (typeof window === "undefined" || !url) return false
  try {
    if (tab && !tab.closed) {
      tab.location.replace(url)
      tab.focus()
      return true
    }
  } catch {
    // Fall through to a fresh tab.
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
  try {
    const tab = window.open(url, CARD_CHECKOUT_TAB)
    detachOpener(tab)
    return Boolean(tab)
  } catch {
    return false
  }
}
