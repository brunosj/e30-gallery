#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = process.env.SEO_AUDIT_URL || 'https://e30gallery.com'
const FULL = process.argv.includes('--full')
const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_DIR = join(__dirname, '..', 'docs', 'seo')

const httpChecks = [
  { name: 'robots.txt', url: `${SITE}/robots.txt`, expect: 'Sitemap:' },
  { name: 'sitemap index', url: `${SITE}/sitemap.xml`, expect: '<sitemapindex' },
  { name: 'llms.txt', url: `${SITE}/llms.txt`, expect: 'E30 Gallery' },
  { name: 'site.webmanifest', url: `${SITE}/site.webmanifest`, expect: '"name"' },
  {
    name: 'homepage canonical',
    url: `${SITE}/`,
    expect: 'rel="canonical"',
    reject: 'https://e30gallery.com/artists',
  },
  { name: 'homepage JSON-LD', url: `${SITE}/`, expect: 'application/ld+json' },
  {
    name: 'artist page canonical',
    url: `${SITE}/artists`,
    expect: 'rel="canonical"',
    optional: true,
  },
]

function runCommand(name, command, args, options = {}) {
  console.log(`\n▶ ${name}`)
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    ...options,
  })
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim()
  if (output) {
    console.log(output.slice(-2000))
  }
  return { ok: result.status === 0, output, status: result.status }
}

async function runHttpChecks() {
  let failed = 0
  console.log(`SEO audit — ${SITE}\n`)

  for (const check of httpChecks) {
    try {
      const res = await fetch(check.url, { redirect: 'follow' })
      const body = await res.text()
      let ok = res.ok && body.includes(check.expect)
      if (ok && check.reject && body.includes(check.reject)) {
        ok = false
      }
      console.log(`${ok ? '✓' : '✗'} ${check.name} (${res.status})`)
      if (!ok && !check.optional) failed++
      else if (!ok && check.optional) console.log('  (optional check)')
    } catch (error) {
      console.log(`✗ ${check.name} — ${error.message}`)
      if (!check.optional) failed++
    }
  }

  return failed
}

async function runHtmlValidation() {
  const urls = [`${SITE}/`, `${SITE}/artists`, `${SITE}/exhibitions`]
  let failed = 0

  console.log('\n▶ HTML validation (W3C Nu Checker API)')
  for (const url of urls) {
    try {
      const params = new URLSearchParams({
        doc: url,
        outline: '0',
        'filter-non-html': '1',
      })
      const res = await fetch(
        `https://validator.w3.org/nu/?${params.toString()}`,
        {
          headers: { Accept: 'application/json' },
        },
      )
      if (!res.ok) {
        console.log(`✗ ${url} — validator HTTP ${res.status}`)
        failed++
        continue
      }
      const data = await res.json()
      const errors = (data.messages || []).filter(m => m.type === 'error')
      const ok = errors.length === 0
      console.log(
        `${ok ? '✓' : '✗'} ${url} — ${errors.length} error(s), ${(data.messages || []).length} message(s)`,
      )
      if (!ok) failed++
    } catch (error) {
      console.log(`✗ ${url} — ${error.message}`)
      failed++
    }
  }

  return failed
}

function runLinkinator() {
  const logPath = join(LOG_DIR, 'audit-linkinator.log')
  const result = runCommand(
    'Broken links (linkinator)',
    'npx',
    [
      '--yes',
      'linkinator',
      SITE,
      '--recurse',
      '--concurrency',
      '3',
      '--skip',
      'mailto:|tel:|javascript:|_next/image',
    ],
    { timeout: 180000 },
  )
  if (result.output) {
    writeFileSync(logPath, result.output)
    console.log(`  Log written to docs/seo/audit-linkinator.log`)
  }
  return result.ok ? 0 : 1
}

function runLighthouse() {
  const outPath = join(LOG_DIR, 'audit-lighthouse-home.json')
  const result = runCommand(
    'Lighthouse (homepage SEO + performance)',
    'npx',
    [
      '--yes',
      'lighthouse',
      SITE,
      '--only-categories=seo,performance',
      '--output=json',
      `--output-path=${outPath}`,
      '--chrome-flags=--headless --no-sandbox',
      '--quiet',
    ],
    { timeout: 120000 },
  )
  if (result.ok) {
    console.log(`  Report written to docs/seo/audit-lighthouse-home.json`)
  } else {
    console.log('  Lighthouse skipped or failed (Chrome may be unavailable in CI)')
  }
  return result.ok ? 0 : 0
}

async function run() {
  let failed = await runHttpChecks()

  if (FULL) {
    failed += await runHtmlValidation()
    failed += runLinkinator()
    runLighthouse()
  } else {
    console.log('\nRun with --full for HTML validation, linkinator, and Lighthouse.')
  }

  console.log(
    `\n${failed === 0 ? 'All required checks passed.' : `${failed} required check(s) failed.`}`,
  )
  process.exit(failed > 0 ? 1 : 0)
}

run()
