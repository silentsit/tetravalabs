"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageCircle, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { checkoutWhatsAppHref } from "@/lib/checkout-support"
import { buildReorderCartItems } from "@/lib/reorder-cart"
import { formatClientError } from "@/lib/format-client-error"

const WHATSAPP_BADGE_SRC = "/chat/whatsapp-badge.png"

function SupportActionLabel({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold leading-none text-[#334155] shadow-[0_2px_8px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
      {children}
    </span>
  )
}

function ChatSupportActions({
  iconSize,
  onOpenChat
}: {
  iconSize: number
  onOpenChat: () => void
}) {
  const whatsappHref = checkoutWhatsAppHref()
  const iconClass =
    iconSize >= 48
      ? "shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition hover:scale-[1.03]"
      : "shadow-[0_4px_14px_rgba(15,23,42,0.14)] transition hover:scale-[1.02]"

  return (
    <div className="flex flex-col items-end gap-2.5">
      <div className="flex items-center gap-2">
        <SupportActionLabel>WhatsApp</SupportActionLabel>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message Tetrava Labs on WhatsApp"
          title="Message Tetrava Labs on WhatsApp"
          className={`flex shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-white ${iconClass}`}
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src={WHATSAPP_BADGE_SRC}
            alt=""
            width={iconSize}
            height={iconSize}
            unoptimized
            className="rounded-full"
            style={{ width: iconSize, height: iconSize }}
          />
        </a>
      </div>
      <div className="flex items-center gap-2">
        <SupportActionLabel>AI chat</SupportActionLabel>
        <button
          type="button"
          aria-label="Open research support chat"
          onClick={onOpenChat}
          className={`flex shrink-0 items-center justify-center rounded-full bg-[#0D9488] text-white ring-2 ring-white ${iconClass}`}
          style={{ width: iconSize, height: iconSize }}
        >
          <MessageCircle className="h-[54%] w-[54%]" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  )
}

function textFromParts(parts: Array<{ type: string; text?: string }> | undefined) {
  if (!parts?.length) return ""
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const { addItem, setIsOpen } = useCart()
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), [])
  const { messages, sendMessage, status, error } = useChat({ transport })
  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    for (const message of messages) {
      if (message.role !== "assistant") continue
      for (const part of message.parts || []) {
        const typed = part as {
          type?: string
          state?: string
          output?: {
            action?: string
            items?: Array<{
              variantId?: string
              productId?: string
              handle?: string
              title?: string
              variantTitle?: string
              unitPrice?: number
              quantity?: number
            }>
          }
        }
        if (typed.type !== "tool-addToCart" || typed.state !== "output-available") continue
        if (typed.output?.action !== "add_to_cart" || !typed.output.items?.length) continue
        const key = `chat-cart:${message.id}:${typed.output.items.map((i) => i.variantId).join(",")}`
        if (typeof window !== "undefined" && sessionStorage.getItem(key)) continue
        const { items } = buildReorderCartItems(typed.output.items)
        for (const item of items) {
          const { quantity, ...rest } = item
          addItem(rest, quantity)
        }
        if (items.length) {
          sessionStorage.setItem(key, "1")
          setIsOpen(true)
        }
      }
    }
  }, [addItem, messages, setIsOpen])

  const openChat = () => setOpen(true)

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        {open ? (
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-lg transition hover:bg-[#0F766E]"
          >
            <X className="h-6 w-6" />
          </button>
        ) : (
          <ChatSupportActions iconSize={48} onOpenChat={openChat} />
        )}
      </div>

      {open ? (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
          <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
            <p className="text-sm font-semibold text-[#0F172A]">Tetrava research support</p>
            <p className="mt-0.5 text-[11px] leading-snug text-[#64748B]">
              Research Use Only — not medical advice. No dosing guidance.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {!messages.length ? (
              <p className="text-xs text-[#64748B]">
                Ask about shipping, COA/lots, payments, or find a compound.
              </p>
            ) : null}
            {messages.map((message) => {
              const text = textFromParts(message.parts as Array<{ type: string; text?: string }>)
              if (!text) return null
              return (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    message.role === "user"
                      ? "ml-8 bg-[#0D9488] text-white"
                      : "mr-6 bg-[#F1F5F9] text-[#334155]"
                  }`}
                >
                  {text}
                </div>
              )
            })}
            {error ? (
              <p className="text-xs text-red-600">
                {formatClientError(error, "Chat unavailable. Email us via Contact.")}
              </p>
            ) : null}
          </div>

          <form
            className="border-t border-[#E2E8F0] p-2"
            onSubmit={(event) => {
              event.preventDefault()
              const text = input.trim()
              if (!text || busy) return
              void sendMessage({ text })
              setInput("")
            }}
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a research support question…"
                className="min-w-0 flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs outline-none focus:border-[#0D9488]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-lg bg-[#0D9488] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-[#94A3B8]">
              Prefer a human?{" "}
              <a href="/contact" className="text-[#0D9488] underline">
                Contact
              </a>
            </p>
          </form>
        </div>
      ) : null}
    </>
  )
}
