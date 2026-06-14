# Cloudflare Setup

Put Cloudflare in front of `tetravalabs.com` for DNS, TLS, WAF, and bot protection. Vercel remains the origin for the storefront; Render hosts Medusa and Typesense on private services.

## 1. Add the site

1. Create a Cloudflare account and add `tetravalabs.com`.
2. Update nameservers at your registrar to Cloudflare's pair.
3. Wait for status **Active** before enabling strict security rules.

## 2. DNS records

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` | `cname.vercel-dns.com` (or Vercel apex alias) | Proxied |
| CNAME | `www` | `cname.vercel-dns.com` | Proxied |

Do **not** expose Medusa or Typesense publicly. They stay on Render internal hostnames; only the Vercel storefront calls them.

Optional:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| TXT | `@` | SPF/DMARC for email (see Resend docs) | DNS only |

## 3. SSL/TLS

- **SSL/TLS mode:** Full (strict)
- **Always Use HTTPS:** On
- **Minimum TLS Version:** 1.2
- **Automatic HTTPS Rewrites:** On

Vercel serves a valid certificate; Cloudflare terminates client TLS and re-encrypts to origin.

## 4. WAF and bot rules

Recommended managed rules:

- Cloudflare OWASP Core Ruleset — **On**
- Cloudflare Bot Fight Mode — **On** (or Super Bot Fight on paid plan)
- Rate limiting on `/api/checkout` and `/api/revalidate` if abuse appears

Custom rule example (block obvious scanners):

```
(http.request.uri.path contains "/wp-admin") or
(http.request.uri.path contains "/.env")
→ Block
```

## 5. Cache

- **Cache HTML minimally** — Vercel handles Next.js caching; set Cloudflare cache level to **Standard** and bypass cache for `/api/*`, `/checkout`, `/cart`.
- Page Rules or Cache Rules:
  - `*tetravalabs.com/api/*` → Cache Level: Bypass
  - `*tetravalabs.com/_next/static/*` → Cache Level: Cache Everything, Edge TTL 1 month

## 6. Headers (already in repo)

Storefront sets security headers in:

- `apps/storefront/src/middleware.ts` — runtime on every page
- `apps/storefront/vercel.json` — CDN-level fallback

Cloudflare can add (Transform Rules → Modify Response Header):

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

The storefront also reads `cf-ipcountry` for geo-restricted checkout (see middleware).

## 7. Sanity webhook through Cloudflare

When Sanity webhooks POST to `https://tetravalabs.com/api/revalidate`:

1. URL: `https://tetravalabs.com/api/revalidate`
2. Header: `x-revalidate-secret: <REVALIDATE_SECRET>`
3. Payload examples:
   - Blog: `{ "type": "researchArticle", "slug": "my-article" }`
   - Category SEO: `{ "type": "categorySeoBlock", "categorySlug": "glp-1-incretin" }`
   - Legal: `{ "type": "legalPage", "legalType": "terms" }`
   - Product (Medusa): `{ "handle": "semaglutide-5mg" }`

Allowlist Sanity webhook IPs in WAF if requests are blocked.

## 8. Verification checklist

- [ ] `https://tetravalabs.com` loads with Cloudflare proxy (orange cloud)
- [ ] SSL Labs grade A or A+
- [ ] Checkout geo-restrict still works (`cf-ipcountry` header present)
- [ ] `/api/revalidate` returns 401 without secret, 200 with secret
- [ ] Medusa admin and Typesense are **not** in public DNS

## 9. Rollback

If origin errors spike after enabling proxy:

1. Set affected records to **DNS only** (grey cloud) temporarily
2. Compare Cloudflare vs direct Vercel response headers
3. Re-enable proxy after fixing SSL mode or cache bypass rules
