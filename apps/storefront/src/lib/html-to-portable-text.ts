/**
 * Convert Semantic Pen (or similar) HTML/markdown into Sanity Portable Text blocks
 * matching researchArticle.body (normal/h2/h3, lists, strong/em/link).
 */

export type PortableSpan = {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

export type PortableMarkDef = {
  _type: "link"
  _key: string
  href: string
}

export type PortableBlock = {
  _type: "block"
  _key: string
  style: "normal" | "h2" | "h3"
  listItem?: "bullet" | "number"
  level?: number
  markDefs: PortableMarkDef[]
  children: PortableSpan[]
}

function key(prefix = "k") {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim()
}

function parseInline(html: string): { children: PortableSpan[]; markDefs: PortableMarkDef[] } {
  const markDefs: PortableMarkDef[] = []
  const children: PortableSpan[] = []
  const active = new Set<string>()
  let i = 0
  let textBuf = ""

  const flush = () => {
    if (!textBuf) return
    children.push({
      _type: "span",
      _key: key("s"),
      text: decodeEntities(textBuf),
      marks: [...active]
    })
    textBuf = ""
  }

  while (i < html.length) {
    if (html[i] === "<") {
      const close = html.indexOf(">", i)
      if (close < 0) break
      const raw = html.slice(i + 1, close).trim()
      const isClose = raw.startsWith("/")
      const name = (isClose ? raw.slice(1) : raw).split(/[\s/]/)[0]?.toLowerCase() || ""
      flush()

      if (name === "br") {
        textBuf = "\n"
        flush()
      } else if (!isClose && (name === "strong" || name === "b")) {
        active.add("strong")
      } else if (isClose && (name === "strong" || name === "b")) {
        active.delete("strong")
      } else if (!isClose && (name === "em" || name === "i")) {
        active.add("em")
      } else if (isClose && (name === "em" || name === "i")) {
        active.delete("em")
      } else if (!isClose && name === "a") {
        const hrefMatch = raw.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i)
        const href = decodeEntities(hrefMatch?.[2] || hrefMatch?.[3] || hrefMatch?.[4] || "").trim()
        if (href) {
          const linkKey = key("l")
          markDefs.push({ _type: "link", _key: linkKey, href })
          active.add(linkKey)
        }
      } else if (isClose && name === "a") {
        for (const m of [...active]) {
          if (m.startsWith("l")) active.delete(m)
        }
      }
      // ignore img/script/etc.
      i = close + 1
      continue
    }
    textBuf += html[i]
    i += 1
  }
  flush()

  if (!children.length) {
    children.push({ _type: "span", _key: key("s"), text: "", marks: [] })
  }

  return { children, markDefs }
}

function blockFromHtml(
  innerHtml: string,
  style: PortableBlock["style"],
  listItem?: PortableBlock["listItem"]
): PortableBlock | null {
  const { children, markDefs } = parseInline(innerHtml)
  const text = children.map((c) => c.text).join("").trim()
  if (!text) return null
  return {
    _type: "block",
    _key: key("b"),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs,
    children
  }
}

function markdownToBlocks(markdown: string): PortableBlock[] {
  const blocks: PortableBlock[] = []
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n")
  let para: string[] = []

  const flushPara = () => {
    const text = para.join(" ").trim()
    para = []
    if (!text) return
    blocks.push({
      _type: "block",
      _key: key("b"),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key("s"), text, marks: [] }]
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushPara()
      continue
    }
    if (/^###\s+/.test(trimmed)) {
      flushPara()
      blocks.push({
        _type: "block",
        _key: key("b"),
        style: "h3",
        markDefs: [],
        children: [{ _type: "span", _key: key("s"), text: trimmed.replace(/^###\s+/, ""), marks: [] }]
      })
      continue
    }
    if (/^##\s+/.test(trimmed)) {
      flushPara()
      blocks.push({
        _type: "block",
        _key: key("b"),
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: key("s"), text: trimmed.replace(/^##\s+/, ""), marks: [] }]
      })
      continue
    }
    const bullet = trimmed.match(/^[-*]\s+(.+)$/)
    if (bullet) {
      flushPara()
      blocks.push({
        _type: "block",
        _key: key("b"),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: key("s"), text: bullet[1], marks: [] }]
      })
      continue
    }
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (numbered) {
      flushPara()
      blocks.push({
        _type: "block",
        _key: key("b"),
        style: "normal",
        listItem: "number",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: key("s"), text: numbered[1], marks: [] }]
      })
      continue
    }
    para.push(trimmed)
  }
  flushPara()
  return blocks
}

function htmlToBlocks(html: string): PortableBlock[] {
  const cleaned = String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:div|section|article|header|footer|main|figure|figcaption)[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<img\b[^>]*>/gi, "")

  const blocks: PortableBlock[] = []
  const re =
    /<(h[1-3]|p|li|blockquote)(\s[^>]*)?>([\s\S]*?)<\/\1>|<(ul|ol)(\s[^>]*)?>([\s\S]*?)<\/\4>/gi
  let match: RegExpExecArray | null
  let lastIndex = 0

  const pushLoose = (chunk: string) => {
    const text = stripTags(chunk)
    if (!text) return
    blocks.push({
      _type: "block",
      _key: key("b"),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key("s"), text, marks: [] }]
    })
  }

  while ((match = re.exec(cleaned))) {
    if (match.index > lastIndex) pushLoose(cleaned.slice(lastIndex, match.index))
    lastIndex = re.lastIndex

    const tag = (match[1] || match[4] || "").toLowerCase()
    if (tag === "ul" || tag === "ol") {
      const listHtml = match[6] || ""
      const listItem = tag === "ol" ? "number" : "bullet"
      const liRe = /<li(\s[^>]*)?>([\s\S]*?)<\/li>/gi
      let li: RegExpExecArray | null
      while ((li = liRe.exec(listHtml))) {
        const block = blockFromHtml(li[2] || "", "normal", listItem)
        if (block) blocks.push(block)
      }
      continue
    }

    const inner = match[3] || ""
    let style: PortableBlock["style"] = "normal"
    if (tag === "h1" || tag === "h2") style = "h2"
    else if (tag === "h3") style = "h3"
    const block = blockFromHtml(inner, style)
    if (block) blocks.push(block)
  }

  if (lastIndex < cleaned.length) pushLoose(cleaned.slice(lastIndex))
  return blocks
}

/** Prefer HTML when tags present; otherwise treat as markdown. */
export function contentToPortableText(input: string): PortableBlock[] {
  const raw = String(input || "").trim()
  if (!raw) return []
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(raw)
  const blocks = looksHtml ? htmlToBlocks(raw) : markdownToBlocks(raw)
  return blocks.filter((b) => b.children.some((c) => c.text.trim()))
}

export function estimateReadTimeMinutes(blocks: PortableBlock[]) {
  const words = blocks
    .flatMap((b) => b.children.map((c) => c.text))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.min(60, Math.max(1, Math.ceil(words / 200)))
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
}
