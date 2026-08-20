"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageCircle, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { buildReorderCartItems } from "@/lib/reorder-cart"
import { formatClientError } from "@/lib/format-client-error"

const TEASER_STORAGE_KEY = "tetrava-chat-teaser-dismissed"

function textFromParts(parts: Array<{ type: string; text?: string }> | undefined) {
  if (!parts?.length) return ""
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("")
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false)
  const [teaserVisible, setTeaserVisible] = useState(false)
  const [input, setInput] = useState("")
  const { addItem, setIsOpen } = useCart()
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), [])
  const { messages, sendMessage, status, error } = useChat({ transport })
  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(TEASER_STORAGE_KEY)) return
    const timer = window.setTimeout(() => setTeaserVisible(true), 1400)
    return () => window.clearTimeout(timer)
  }, [])

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

  const dismissTeaser = () => {
    setTeaserVisible(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TEASER_STORAGE_KEY, "1")
    }
  }

  const openChat = () => {
    setTeaserVisible(false)
    setOpen(true)
  }

  return (
    <>
      {!open && teaserVisible ? (
        <div className="fixed bottom-[4.75rem] right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative">
            <button
              type="button"
              onClick={openChat}
              className="flex max-w-[16.5rem] items-center gap-3 rounded-2xl bg-white py-3 pl-3 pr-9 text-left shadow-[0_8px_28px_rgba(15,23,42,0.18)] ring-1 ring-black/5 transition hover:shadow-[0_10px_32px_rgba(15,23,42,0.22)]"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#CCFBF1] ring-2 ring-white">
                <Image
                  src="/brand/tetravalabs-icon.png"
                  alt="Tetrava Labs"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="min-w-0 text-[13px] leading-snug text-[#0F172A]">
                <span className="block font-semibold">Need help?</span>
                <span className="block text-[#334155]">Chat with me.</span>
              </span>
            </button>
            <button
              type="button"
              aria-label="Dismiss chat tip"
              onClick={dismissTeaser}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#64748B]"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white shadow-[2px_2px_4px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open research support chat"}
        onClick={() => {
          if (open) {
            setOpen(false)
          } else {
            openChat()
          }
        }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-lg transition hover:bg-[#0F766E]"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" strokeWidth={1.75} />}
      </button>

      {open ? (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
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
