import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage
} from "ai"
import { openai } from "@ai-sdk/openai"
import { TETRAVA_CHAT_SYSTEM_PROMPT } from "@/lib/ai/system-prompt"
import { chatTools } from "@/lib/ai/chat-tools"
import { allowChatRequest } from "@/lib/ai/rate-limit"

export const maxDuration = 60

function resolveModel() {
  // AI Gateway string model when gateway credentials are present.
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN) {
    return process.env.AI_CHAT_MODEL || "openai/gpt-4o-mini"
  }
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  return openai(process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini")
}

export async function POST(req: Request) {
  const model = resolveModel()
  if (!model) {
    return Response.json(
      {
        error:
          "Chat is not configured. Set OPENAI_API_KEY or AI Gateway credentials on the storefront."
      },
      { status: 503 }
    )
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  if (!allowChatRequest(ip)) {
    return Response.json({ error: "Too many chat requests. Try again shortly." }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const messages = (body?.messages || []) as UIMessage[]
  if (!Array.isArray(messages) || !messages.length) {
    return Response.json({ error: "messages are required" }, { status: 400 })
  }

  const result = streamText({
    model,
    system: TETRAVA_CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: chatTools,
    stopWhen: stepCountIs(5)
  })

  return result.toUIMessageStreamResponse()
}
