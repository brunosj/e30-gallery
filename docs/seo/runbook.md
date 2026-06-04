# SEO / AEO / GEO runbook — E30 Gallery

## After each production deploy

1. `pnpm seo:audit` — quick HTTP/metadata checks
2. `pnpm seo:audit:full` — adds W3C HTML validation, linkinator crawl, Lighthouse (requires Chrome locally)
3. Google [Rich Results Test](https://search.google.com/test/rich-results) on:
   - `/`
   - one `/artists/{slug}`
   - one `/exhibitions/{slug}`
   - one `/insights/{slug}`
4. Search Console → Sitemaps → submit `https://e30gallery.com/sitemap.xml`

## Monthly

- Link crawl: `npx linkinator https://e30gallery.com --recurse --skip "mailto:|tel:"`
- Review [`production-audit-report.md`](./production-audit-report.md) KPI table
- Plausible: top landing pages and content engagement

## Locale model (`localePrefix: never`)

- Do **not** add hreflang pointing to `/de/...` unless URL strategy changes.
- Canonical and sitemap `loc` values use `getPathname` per locale (e.g. `/kuenstler` vs `/artists`).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical/sitemap/JSON-LD base (preferred, HTTPS) |
| `NEXT_PUBLIC_FRONTEND_URL` | Fallback site URL |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta (optional) |
| `PAYLOAD_API_KEY` | CMS fetches (server-side) |
| `REVALIDATION_KEY` | Shared secret for `GET /next/revalidate` (must match CMS) |

## CMS cache revalidation (e30-cms)

| Variable (CMS) | Purpose |
|----------------|---------|
| `FRONTEND_URL` | Public frontend origin (e.g. `https://e30gallery.com`) |
| `REVALIDATION_KEY` | Same value as frontend `REVALIDATION_KEY` |

On publish/delete, CMS hooks call `/next/revalidate?secret=…&collection=…&slug=…` (or `global=menu`). Payload fetches use cache tags `cms:{collection}` and `cms:global:{slug}` with a 1h ISR fallback.

## Files

| Area | Location |
|------|----------|
| Metadata helper | `app/_utilities/generatePageMetadata.ts` |
| JSON-LD | `app/_components/StructuredData/` |
| Robots | `app/robots.ts` |
| Sitemaps | `app/(sitemaps)/*.xml/route.ts` (route group; public URLs stay `/sitemap.xml`, etc.) |
| AEO discovery | `public/llms.txt` |
| Implemented list | `docs/seo/implemented-seo-measures.md` |
