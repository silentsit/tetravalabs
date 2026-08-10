# Semantic Pen → Sanity draft webhook

Lets Semantic Pen (or Pabbly/Zapier) push generated articles into Sanity as **draft** `researchArticle` documents. Nothing goes live until you publish in Studio.

## Endpoint

| | |
|---|---|
| URL | `https://tetravalabs.com/api/webhooks/semantic-pen` |
| Methods | `GET` (health), `POST` (create/update draft) |
| Auth | `Authorization: Bearer <SEMANTIC_PEN_WEBHOOK_SECRET>` **or** header `x-semantic-pen-secret` |

## Vercel env (storefront)

| Variable | Required | Notes |
|---|---|---|
| `SEMANTIC_PEN_WEBHOOK_SECRET` | Yes | Long random string; paste into Semantic Pen / Zapier |
| `SANITY_API_WRITE_TOKEN` | Yes | Sanity Editor (or higher) token with create/write |
| `SANITY_PROJECT_ID` | Yes | Same as storefront read config |
| `SANITY_DATASET` | Yes | Usually `production` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Optional | Used in JSON response `studioUrl` |

Redeploy after setting env vars.

## Semantic Pen setup

1. Plan that includes **Webhook** (or route via Pabbly).
2. Webhook URL: `https://tetravalabs.com/api/webhooks/semantic-pen`
3. Auth header: `Authorization: Bearer <your secret>` (or `x-semantic-pen-secret: <secret>`)
4. Send JSON when an article finishes. Accepted body fields (any subset works):

```json
{
  "title": "How to reconstitute BPC-157 for research",
  "slug": "how-to-reconstitute-bpc-157",
  "articleHtml": "<h2>...</h2><p>...</p>",
  "excerpt": "Optional meta-style summary",
  "category": "Protocols",
  "featuredImage": "https://cdn.example.com/cover.jpg",
  "targetKeyword": "bpc-157 reconstitution"
}
```

Also accepted aliases: `article_html`, `content`, `html`, `markdown`, `metaDescription`, `categoryName`, `imageUrl`, nested `{ "article": { ... } }` (Zapier-style).

`category` must be one of: `Protocols` | `Analytical` | `Compliance` (default `Protocols`). Fuzzy matches like “compliance” / “analytical” are mapped.

## Behaviour

- Always writes **`drafts.*`** — storefront GROQ is published-only, so drafts stay invisible.
- Same `slug` → updates that draft (`createOrReplace`).
- HTML/markdown → Portable Text (`h2`/`h3`/paragraphs/lists/`strong`/`em`/links). Embedded `<img>` in body are stripped; optional cover via `featuredImage` URL.
- Response includes `studioUrl` / `previewPath` hints. Publish in Sanity Studio after editorial review.

## Smoke test

```powershell
# Health
Invoke-RestMethod https://tetravalabs.com/api/webhooks/semantic-pen

# Create draft (set secret first)
$headers = @{
  Authorization = "Bearer YOUR_SECRET"
  "Content-Type" = "application/json"
}
$body = @{
  title = "Semantic Pen webhook test"
  articleHtml = "<h2>Overview</h2><p>Draft-only test article for Tetrava Labs.</p>"
  category = "Protocols"
} | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri https://tetravalabs.com/api/webhooks/semantic-pen -Headers $headers -Body $body
```

Open Sanity Studio → Research Article drafts → review → Publish.

## Notes

- Do **not** auto-publish. Peptide / RUO content needs human E-E-A-T review.
- Cloudflare WAF: allowlist Semantic Pen / Zapier IPs if POSTs are blocked (same pattern as Sanity → `/api/revalidate` in `doc/cloudflare-setup.md`).
