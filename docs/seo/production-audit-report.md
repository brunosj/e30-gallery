# E30 Gallery — Production SEO audit (baseline)

**Date:** 2026-06-04  
**Target:** https://e30gallery.com  
**Locale strategy:** `localePrefix: never` (cookie-based locale; localized slugs only)

## Executive summary

| Area | Status | Priority |
|------|--------|----------|
| Canonical URLs | All pages inherited homepage canonical | P0 — fixed in implementation |
| hreflang | Declared `/de` URLs that do not exist | P0 — removed |
| JSON-LD | None on production | P0 — added |
| robots.txt | Static HTTP host, allow-all | P1 — dynamic route |
| Sitemap | Postbuild only; incomplete for CMS/locales | P1 — partitioned routes |
| Asset 404s | `site.webmanifest`, `favicon.icon`, apple-touch icons | P2 — fixed |
| Broken links (crawl) | 1787 flagged (mostly `_next/image` timeouts under crawl load) | P2 — monitor |
| Lighthouse | Not run in CI (Chrome unavailable in sandbox) | Run locally via `pnpm seo:audit` |

## Link crawl (`linkinator`)

Command: `npx linkinator https://e30gallery.com --recurse`  
Log: [`audit-linkinator.log`](./audit-linkinator.log)

**Confirmed 404s (site-owned):**

- `/site.webmanifest`
- `/favicon.icon` (metadata typo)
- `/apple-touch-icon-precomposed.png`

**External 404 (content):**

- `https://www.raphaelpaulun.de/` (linked artist site)

**Crawl noise (not treated as broken pages):**

- `_next/image?...` returning 503/504/500 under high concurrency
- `/de`, `/en/exhibitions/...` status `0` (invalid paths with `localePrefix: never`)

## Metadata spot-check (pre-fix)

Production HTML exposed a single canonical (`https://e30gallery.com`) on inner pages. No `application/ld+json` blocks detected.

## Recommended post-deploy verification

1. Rich Results Test: homepage, one artist, one exhibition, one insight
2. `curl -sI https://e30gallery.com/robots.txt` — HTTPS sitemap URL
3. `curl -s https://e30gallery.com/sitemap.xml` — index lists 8 partitions
4. Search Console: submit sitemap after deploy
5. `pnpm seo:audit` monthly

## KPI baseline (fill after deploy)

| Metric | Baseline | Target |
|--------|----------|--------|
| SEO Lighthouse (home) | TBD | ≥ 90 |
| Performance Lighthouse (home) | TBD | ≥ 80 |
| Rich Results valid graphs | 0 | ≥ 4 templates |
| Site-owned 404s from crawl | 3+ asset paths | 0 |
