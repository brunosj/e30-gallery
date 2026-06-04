# Implemented SEO / AEO / GEO measures (E30 frontend)

Reference aligned with PowerKonnekt patterns, adapted for `localePrefix: never` and Plausible (no GTM).

## Summary checklist

| Area | Status |
|------|--------|
| Robots | `app/robots.ts` — dynamic, HTTPS sitemap, disallows auth/members |
| Sitemaps | Eight locale partitions + `/sitemap.xml` index |
| Canonical / social | `buildPageMetadata()` — per-page canonical + OG `url` + Twitter |
| Hreflang | Omitted (cookie locale; no stable `/de` URLs) |
| JSON-LD | `StructuredData` — ArtGallery + WebSite `@graph`; Article, Person, ExhibitionEvent, BreadcrumbList |
| Analytics | Plausible via `next-plausible` (self-hosted) |
| AEO / GEO | `public/llms.txt` |
| PWA hints | `public/site.webmanifest`, `app/manifest.ts`, viewport `themeColor` |
| Security headers | HSTS (prod), Referrer-Policy, X-Content-Type-Options, X-Frame-Options |

## Crawling

- **Robots:** `app/robots.ts`
- **Sitemap index:** `app/(sitemaps)/sitemap.xml/route.ts`
- **Partitions:** `page-`, `artist-`, `exhibition-`, `insight-` × `en` / `de` under `app/(sitemaps)/` (route group — URLs unchanged)
- **Helpers:** `app/utils/sitemapPartitions.ts`, `app/utils/sitemapXml.ts`
- **CMS URLs:** `fetchCollection()` in `app/_utilities/fetchCollection.ts`

## Metadata

- **Defaults:** `app/_components/Metadata/index.tsx` (`siteDefaults` — no global canonical)
- **Per page:** `buildPageMetadata()` in `app/_utilities/generatePageMetadata.ts`
- **URL resolver:** `localizedAbsoluteUrl()` + `getPathname` in `app/_utilities/localizedUrl.ts`

## Structured data

- **Layout:** site-wide `@graph` in `app/[locale]/layout.tsx`
- **Routes:** Article (insights), Person (artists), ExhibitionEvent + Breadcrumb (exhibitions), Breadcrumb (generic pages)

## Non-indexable routes

`noindex` + robots disallow: create-account, recover/reset password, logout, newsletter-success, members-area, account.

## Verification

- Production audit: `docs/seo/production-audit-report.md`
- Scripts: `pnpm seo:audit` (quick), `pnpm seo:audit:full` (HTML + links + Lighthouse)
- Runbook: `docs/seo/runbook.md`
