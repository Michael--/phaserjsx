#!/usr/bin/env node
/**
 * @file Technical SEO smoke checker for local build folders or live sites.
 *
 * Usage:
 *   node check-seo.mjs --url https://example.com
 *   node check-seo.mjs --url http://localhost:2222 --verbose
 *   node check-seo.mjs --dir ./dist --base-url https://example.com
 *   node check-seo.mjs ./dist --base-url https://example.com
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, sep } from 'node:path'

function parseArgs(argv) {
  const flags = { verbose: false, url: '', dir: '', baseUrl: '' }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--verbose' || arg === '-v') flags.verbose = true
    else if (arg.startsWith('--url=')) flags.url = normalizeBaseUrl(arg.slice('--url='.length))
    else if (arg === '--url' && argv[i + 1]) flags.url = normalizeBaseUrl(argv[++i])
    else if (arg.startsWith('--dir=')) flags.dir = arg.slice('--dir='.length)
    else if (arg === '--dir' && argv[i + 1]) flags.dir = argv[++i]
    else if (arg.startsWith('--base-url=')) flags.baseUrl = normalizeBaseUrl(arg.slice('--base-url='.length))
    else if (arg === '--base-url' && argv[i + 1]) flags.baseUrl = normalizeBaseUrl(argv[++i])
    else if (!arg.startsWith('-') && /^https?:\/\//i.test(arg)) flags.url = normalizeBaseUrl(arg)
    else if (!arg.startsWith('-')) flags.dir = arg
  }

  if (!flags.baseUrl && flags.url) flags.baseUrl = flags.url
  return flags
}

const { verbose, url: modeUrl, dir: modeDir, baseUrl } = parseArgs(process.argv.slice(2))

let errors = 0
let warnings = 0
let checked = 0
const seenTitles = new Map()
const seenDescriptions = new Map()

function err(label, message) {
  console.error(`  ❌ ${label}: ${message}`)
  errors++
}

function warn(label, message) {
  console.log(`  ⚠️  ${label}: ${message}`)
  warnings++
}

function ok(label, message) {
  if (verbose) console.log(`  ✅ ${label}: ${message}`)
}

function normalizeBaseUrl(value) {
  if (!value) return ''
  return value.replace(/\/+$/, '')
}

function normalizeComparableUrl(value) {
  try {
    const url = new URL(value)
    url.hash = ''
    url.pathname = url.pathname.replace(/\/+$/, '') || '/'
    return url.toString().replace(/\/$/, url.pathname === '/' ? '/' : '')
  } catch {
    return value.replace(/#.*$/, '').replace(/\/+$/, '') || '/'
  }
}

function expectedUrlForPath(pathname) {
  if (!baseUrl) return ''
  return `${baseUrl}${pathname === '/' ? '/' : pathname}`
}

function compareUrl(label, field, actual, expected) {
  if (!actual || !expected) return

  const normalizedActual = normalizeComparableUrl(actual)
  const normalizedExpected = normalizeComparableUrl(expected)

  if (normalizedActual !== normalizedExpected) {
    warn(label, `${field} points to ${actual}, expected ${expected}`)
  } else {
    ok(label, `${field}: ${actual}`)
  }
}

async function fetchResource(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'phaserjsx-seo-check/1.0' },
  })

  return {
    body: await res.text(),
    finalUrl: res.url,
    ok: res.ok,
    status: res.status,
  }
}

function parseAttributes(tag) {
  const attrs = {}
  const attrPattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

  for (const match of tag.matchAll(attrPattern)) {
    const name = match[1].toLowerCase()
    if (name === tag.slice(1).split(/\s+/)[0].toLowerCase()) continue
    attrs[name] = match[2] ?? match[3] ?? match[4] ?? ''
  }

  return attrs
}

function findTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0])
}

function getMetaContent(html, key, expectedValue) {
  for (const tag of findTags(html, 'meta')) {
    const attrs = parseAttributes(tag)
    if ((attrs[key] ?? '').toLowerCase() === expectedValue.toLowerCase()) {
      return attrs.content ?? ''
    }
  }
  return ''
}

function getCanonical(html) {
  for (const tag of findTags(html, 'link')) {
    const attrs = parseAttributes(tag)
    const rels = (attrs.rel ?? '').toLowerCase().split(/\s+/)
    if (rels.includes('canonical')) return attrs.href ?? ''
  }
  return ''
}

function getTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  return match ? match[1].replace(/\s+/g, ' ').trim() : ''
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1].trim())
}

function parseRobotsSitemaps(text, base) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^sitemap:/i.test(line))
    .map((line) => line.replace(/^sitemap:\s*/i, '').trim())
    .filter(Boolean)
    .map((value) => new URL(value, `${base}/`).toString())
}

function checkRobotsTxt(text, label) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))

  if (lines.some((line) => /^disallow:\s*\/\s*$/i.test(line))) {
    err(label, 'Blocks everything with Disallow: /')
  }

  if (!lines.some((line) => /^sitemap:/i.test(line))) {
    warn(label, 'No Sitemap: reference')
  } else {
    ok(label, 'Sitemap reference found')
  }
}

function collectHtml(dir) {
  const result = []

  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue

    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) result.push(...collectHtml(fullPath))
    else if (extname(entry).toLowerCase() === '.html') result.push(fullPath)
  }

  return result
}

function routePathForHtmlFile(rootDir, filePath) {
  const rel = relative(rootDir, filePath).split(sep).join('/')
  if (rel === 'index.html') return '/'
  if (rel === '404.html') return '/404'
  if (basename(rel) === 'index.html') return `/${dirname(rel)}`
  return `/${rel.replace(/\.html$/i, '')}`
}

function recordDuplicate(map, value, label, field) {
  if (!value) return

  const previous = map.get(value)
  if (previous) warn(label, `Duplicate ${field}; also used by ${previous}`)
  else map.set(value, label)
}

function checkPageHtml(html, label, expectedUrl = '') {
  checked++

  const title = getTitle(html)
  if (!title) err(label, 'Missing <title>')
  else if (title.length < 10) warn(label, `Title too short: "${title}"`)
  else if (title.length > 70) warn(label, `Title too long (${title.length} chars)`)
  else ok(label, `title: "${title}"`)

  if (/^(home|page|component|untitled)(\s*[-|:]\s*.+)?$/i.test(title)) {
    warn(label, `Title looks generic: "${title}"`)
  }
  recordDuplicate(seenTitles, title, label, 'title')

  const description = getMetaContent(html, 'name', 'description')
  if (!description) err(label, 'Missing <meta name="description">')
  else if (description.length < 50) warn(label, `Description too short (${description.length} chars)`)
  else if (description.length > 160) warn(label, `Description too long (${description.length} chars)`)
  else ok(label, `description (${description.length} chars)`)
  recordDuplicate(seenDescriptions, description, label, 'description')

  const robots = getMetaContent(html, 'name', 'robots')
  if (!robots) warn(label, 'Missing <meta name="robots">')
  else if (label === '/404') {
    if (!/\bnoindex\b/i.test(robots)) err(label, '404 should have noindex')
    else ok(label, 'robots: noindex')
  } else if (/\bnoindex\b/i.test(robots)) {
    err(label, `robots="${robots}" blocks indexing`)
  } else if (!/\bindex\b/i.test(robots)) {
    warn(label, `robots="${robots}" does not explicitly include index`)
  } else {
    ok(label, `robots: ${robots}`)
  }

  const canonical = getCanonical(html)
  if (!canonical) warn(label, 'Missing canonical')
  else compareUrl(label, 'canonical', canonical, expectedUrl)

  const ogTitle = getMetaContent(html, 'property', 'og:title')
  const ogDescription = getMetaContent(html, 'property', 'og:description')
  const ogUrl = getMetaContent(html, 'property', 'og:url')
  const ogImage = getMetaContent(html, 'property', 'og:image')
  const twitterCard = getMetaContent(html, 'name', 'twitter:card')

  if (!ogTitle) warn(label, 'Missing og:title')
  else if (title && ogTitle !== title) warn(label, 'og:title differs from <title>')
  else ok(label, 'og:title')

  if (!ogDescription) warn(label, 'Missing og:description')
  else if (description && ogDescription !== description) warn(label, 'og:description differs from description')
  else ok(label, 'og:description')

  if (!ogUrl) warn(label, 'Missing og:url')
  else compareUrl(label, 'og:url', ogUrl, expectedUrl || canonical)

  if (!ogImage) warn(label, 'Missing og:image')
  else ok(label, 'og:image')

  if (!twitterCard) warn(label, 'Missing twitter:card')
  else ok(label, 'twitter:card')
}

async function loadSitemapUrls(sitemapUrl, visited = new Set()) {
  if (visited.has(sitemapUrl)) return []
  visited.add(sitemapUrl)

  const res = await fetchResource(sitemapUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  if (!/^\s*<\?xml/i.test(res.body)) throw new Error('Not XML')

  const urls = parseSitemapUrls(res.body)
  if (/<sitemapindex\b/i.test(res.body)) {
    const nested = []
    for (const url of urls) nested.push(...(await loadSitemapUrls(url, visited)))
    return nested
  }

  return urls
}

async function checkUrlMode(base) {
  console.log(`\n🔍 SEO Check — ${base}`)
  console.log('═'.repeat(50))

  let sitemapSources = [`${base}/sitemap.xml`]

  console.log('\n📄 robots.txt')
  try {
    const robots = await fetchResource(`${base}/robots.txt`)
    if (!robots.ok) err('robots.txt', `HTTP ${robots.status}`)
    else {
      checkRobotsTxt(robots.body, 'robots.txt')
      const robotsSitemaps = parseRobotsSitemaps(robots.body, base)
      if (robotsSitemaps.length > 0) sitemapSources = robotsSitemaps
      ok('robots.txt', `OK (${robots.body.split('\n').length} lines)`)
    }
  } catch (error) {
    err('robots.txt', `Not reachable: ${error.message}`)
  }

  console.log('\n📄 sitemap.xml')
  let pages = []
  for (const sitemapUrl of sitemapSources) {
    try {
      const urls = await loadSitemapUrls(sitemapUrl)
      pages.push(...urls)
      ok('sitemap.xml', `${sitemapUrl}: ${urls.length} URLs`)
    } catch (error) {
      err('sitemap.xml', `${sitemapUrl}: ${error.message}`)
    }
  }

  pages = [...new Set(pages)]
  if (pages.length === 0) {
    warn('sitemap.xml', 'No sitemap URLs found; checking only root')
    pages = [`${base}/`]
  }

  console.log(`\n📄 Pages (${pages.length})`)
  for (const pageUrl of pages) {
    const label = new URL(pageUrl).pathname || '/'
    try {
      const page = await fetchResource(pageUrl)
      if (!page.ok) err(label, `HTTP ${page.status}`)
      else checkPageHtml(page.body, label, pageUrl)
    } catch (error) {
      err(label, `Not reachable: ${error.message}`)
    }
  }

  console.log('\n📄 404 page')
  try {
    const missingUrl = `${base}/__seo_nonexistent_test_404__`
    const page = await fetchResource(missingUrl)
    const robots = getMetaContent(page.body, 'name', 'robots')

    if (page.status !== 404 && page.status !== 410) {
      warn('404', `Unknown URL returned HTTP ${page.status}; expected 404 or 410`)
    } else {
      ok('404', `HTTP ${page.status}`)
    }

    if (!/\bnoindex\b/i.test(robots)) warn('404', 'Missing noindex robots meta')
    else ok('404', 'Has noindex')
  } catch (error) {
    err('404', `Not reachable: ${error.message}`)
  }
}

function checkDirMode(dir) {
  if (!existsSync(dir)) {
    console.error(`❌ Not found: ${dir}`)
    process.exit(1)
  }

  console.log(`\n🔍 SEO Check — ${dir}${baseUrl ? ` (→ ${baseUrl})` : ''}`)
  console.log('═'.repeat(50))

  console.log('\n📄 robots.txt')
  const robotsPath = join(dir, 'robots.txt')
  if (!existsSync(robotsPath)) {
    err('robots.txt', 'Missing')
  } else {
    checkRobotsTxt(readFileSync(robotsPath, 'utf-8'), 'robots.txt')
    ok('robots.txt', 'Present')
  }

  const htmlFiles = collectHtml(dir).sort()
  console.log(`\n📁 Found ${htmlFiles.length} HTML files`)

  console.log('\n📄 sitemap.xml')
  const sitemapPath = join(dir, 'sitemap.xml')
  const sitemapUrls = new Map()
  if (!existsSync(sitemapPath)) {
    err('sitemap.xml', 'Missing')
  } else {
    const sitemap = readFileSync(sitemapPath, 'utf-8')
    if (!/^\s*<\?xml/i.test(sitemap)) err('sitemap.xml', 'Not XML')
    for (const url of parseSitemapUrls(sitemap)) sitemapUrls.set(normalizeComparableUrl(url), url)
    ok('sitemap.xml', `${sitemapUrls.size} URLs`)
  }

  const htmlUrls = new Map()
  console.log('\n📄 Pages')
  for (const file of htmlFiles) {
    const routePath = routePathForHtmlFile(dir, file)
    if (routePath === '/404') continue

    const expectedUrl = expectedUrlForPath(routePath)
    if (expectedUrl) htmlUrls.set(normalizeComparableUrl(expectedUrl), expectedUrl)
    checkPageHtml(readFileSync(file, 'utf-8'), routePath, expectedUrl)
  }

  if (baseUrl && sitemapUrls.size > 0) {
    for (const [key, url] of htmlUrls) {
      if (!sitemapUrls.has(key)) warn('sitemap.xml', `Missing URL for HTML page: ${url}`)
    }
    for (const [key, url] of sitemapUrls) {
      if (!htmlUrls.has(key)) warn('sitemap.xml', `URL has no matching HTML file: ${url}`)
    }
  }

  const notFoundPath = join(dir, '404.html')
  if (existsSync(notFoundPath)) {
    console.log('\n📄 404.html')
    const robots = getMetaContent(readFileSync(notFoundPath, 'utf-8'), 'name', 'robots')
    if (!/\bnoindex\b/i.test(robots)) warn('404.html', 'Missing noindex robots meta')
    else ok('404.html', 'Present with noindex')
  }
}

async function main() {
  if (modeUrl) await checkUrlMode(modeUrl)
  else if (modeDir) checkDirMode(modeDir)
  else {
    console.error('Usage:')
    console.error('  node check-seo.mjs --url <url>                   (live site via robots/sitemap)')
    console.error('  node check-seo.mjs --dir <path>                  (local build folder)')
    console.error('  node check-seo.mjs ./dist --base-url <url>       (local build with expected URLs)')
    console.error('  node check-seo.mjs --url <url> --verbose')
    process.exit(1)
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`📊 ${checked} pages | ${errors} errors | ${warnings} warnings`)

  if (errors > 0) {
    console.log('❌ FAIL')
    process.exit(1)
  }
  if (warnings > 0) {
    console.log('⚠️  PASS with warnings')
    process.exit(0)
  }

  console.log('✅ PASS — technical SEO smoke checks passed')
  process.exit(0)
}

main()
