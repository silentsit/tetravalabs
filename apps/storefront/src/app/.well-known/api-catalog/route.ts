import { NextResponse } from "next/server"

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
const PROFILE = "https://www.rfc-editor.org/info/rfc9727"

const catalog = {
  linkset: [
    {
      anchor: `${BASE}/`,
      "api-catalog": [
        {
          href: `${BASE}/.well-known/api-catalog`,
          type: "application/linkset+json"
        }
      ]
    },
    {
      anchor: `${BASE}/api`,
      "service-desc": [
        {
          href: `${BASE}/openapi.json`,
          type: "application/openapi+json"
        }
      ],
      "service-doc": [
        {
          href: `${BASE}/llms.txt`,
          type: "text/plain"
        },
        {
          href: `${BASE}/auth.md`,
          type: "text/markdown"
        }
      ],
      status: [
        {
          href: `${BASE}/api/geo`,
          type: "application/json"
        }
      ]
    }
  ]
}

function catalogHeaders() {
  return {
    "Content-Type": `application/linkset+json; profile="${PROFILE}"`,
    "Cache-Control": "public, max-age=3600",
    Link: [
      `<${BASE}/.well-known/api-catalog>; rel="api-catalog"`,
      `<${BASE}/openapi.json>; rel="service-desc"; type="application/openapi+json"`,
      `<${BASE}/auth.md>; rel="describedby"; type="text/markdown"`,
      `<${BASE}/llms.txt>; rel="alternate"; type="text/plain"`
    ].join(", ")
  }
}

export function GET() {
  return NextResponse.json(catalog, { headers: catalogHeaders() })
}

export function HEAD() {
  return new NextResponse(null, { status: 200, headers: catalogHeaders() })
}
