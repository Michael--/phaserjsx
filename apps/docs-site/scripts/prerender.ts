/**
 * Prerender script for docs-site SSG
 *
 * After `vite build`, this script generates static index.html files for every
 * route in the SPA. Each file contains route-specific SEO metadata (title,
 * description, og:tags, canonical URL) while referencing the same JS/CSS
 * bundle. GitHub Pages then serves these real HTML files directly — no more
 * 404.html redirect for known routes.
 *
 * Usage: pnpm run prerender  (called automatically via `pnpm run build`)
 */

import fs from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const siteUrl = 'https://phaserjsx.number10.de'
const distDir = path.resolve(import.meta.dirname, '../dist')

// ---------------------------------------------------------------------------
// Route metadata — mirrors src/components/SeoMetadata.tsx
// ---------------------------------------------------------------------------

interface RouteMeta {
  path: string
  title: string
  description: string
  priority: number
  changefreq: string
}

const componentTitles: Record<string, string> = {
  accordion: 'Accordion',
  'activity-indicator': 'ActivityIndicator',
  alertdialog: 'AlertDialog',
  badge: 'Badge and Tag',
  'bottom-sheet': 'BottomSheet',
  button: 'Button',
  checkbox: 'Checkbox',
  chartext: 'CharText',
  chartextinput: 'CharTextInput',
  colorpicker: 'ColorPicker',
  dialog: 'Dialog',
  divider: 'Divider',
  dropdown: 'Dropdown',
  graphics: 'Graphics',
  icon: 'Icon',
  image: 'Image',
  joystick: 'Joystick',
  listbox: 'ListBox',
  'menu-button': 'MenuButton',
  modal: 'Modal',
  'nineslice-button': 'NineSliceButton',
  'number-input': 'NumberInput',
  'palette-picker': 'PalettePicker',
  particles: 'Particles',
  popover: 'Popover and ContextMenu',
  portal: 'Portal',
  'progress-view': 'ProgressView',
  progressbar: 'ProgressBar',
  radiobutton: 'RadioButton',
  'rating-bar': 'RatingBar',
  'ref-origin-view': 'RefOriginView',
  'scroll-view': 'ScrollView',
  'segmented-control': 'SegmentedControl',
  slider: 'Slider',
  sprite: 'Sprite',
  tabs: 'Tabs',
  text: 'Text',
  tilesprite: 'TileSprite',
  toast: 'Toast and NotificationStack',
  toggle: 'Toggle',
  toolbar: 'Toolbar',
  'transform-origin-view': 'TransformOriginView',
  view: 'View',
  'wheel-picker': 'WheelPicker',
  wraptext: 'WrapText',
}

function getRouteMeta(slug: string): Omit<RouteMeta, 'priority' | 'changefreq'> {
  // Static route descriptions
  const staticRoutes: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'PhaserJSX - JSX UI framework for Phaser 4',
      description:
        'PhaserJSX is a React-like JSX UI framework and component library for building type-safe Phaser 4 game interfaces.',
    },
    '/introduction': {
      title: 'Introduction - PhaserJSX',
      description:
        'Learn how PhaserJSX brings React-like JSX components, hooks, and declarative UI patterns to Phaser 4 games.',
    },
    '/installation': {
      title: 'Installation - PhaserJSX',
      description:
        'Install @number10/phaserjsx and configure TypeScript JSX support for Phaser 4 projects.',
    },
    '/quick-start': {
      title: 'Quick Start - PhaserJSX',
      description:
        'Build your first Phaser 4 UI with JSX, components, hooks, and mountJSX from @number10/phaserjsx.',
    },
    '/guides/theme-system': {
      title: 'Theme System - PhaserJSX',
      description:
        'Customize PhaserJSX game UI components with global themes, local overrides, presets, and color modes.',
    },
    '/guides/responsive-design': {
      title: 'Responsive Design - PhaserJSX',
      description:
        'Create responsive Phaser 4 game interfaces with flexible layout values, viewport units, and adaptive components.',
    },
    '/guides/effects-animations': {
      title: 'Effects and Animations - PhaserJSX',
      description:
        'Use built-in effects, spring animations, and motion patterns in PhaserJSX UI components.',
    },
    '/guides/phaserjsx-plugin': {
      title: 'PhaserJSX Plugin - PhaserJSX',
      description:
        'Configure the PhaserJSX plugin and integrate declarative JSX UI rendering into Phaser 4 scenes.',
    },
    '/api/hooks': {
      title: 'Hooks API - PhaserJSX',
      description:
        'Reference for PhaserJSX hooks used to build stateful, declarative Phaser 4 game UI components.',
    },
    '/api/core-props': {
      title: 'Core Props API - PhaserJSX',
      description:
        'Reference for shared PhaserJSX component props, layout options, styling props, and Phaser display settings.',
    },
  }

  const staticHit = staticRoutes[slug]
  if (staticHit) return staticHit

  // Component pages: /components/<name>
  const componentMatch = slug.match(/^\/components\/([^/]+)$/)
  if (componentMatch) {
    const componentName = componentTitles[componentMatch[1]] ?? 'Component'
    return {
      title: `${componentName} - PhaserJSX component`,
      description: `Use the ${componentName} component from PhaserJSX to build type-safe, React-like UI for Phaser 4 games.`,
    }
  }

  // Guide pages
  if (slug.startsWith('/guides/')) {
    return {
      title: 'PhaserJSX guide',
      description:
        'Guide for building Phaser 4 game interfaces with PhaserJSX components, hooks, themes, and TypeScript.',
    }
  }

  // API pages
  if (slug.startsWith('/api/')) {
    return {
      title: 'PhaserJSX API reference',
      description:
        'API reference for PhaserJSX, the React-like JSX UI framework for Phaser 4 games.',
    }
  }

  // Fallback
  return {
    title: 'PhaserJSX - JSX UI framework for Phaser 4',
    description:
      'PhaserJSX is a React-like JSX UI framework and component library for building type-safe Phaser 4 game interfaces.',
  }
}

// ---------------------------------------------------------------------------
// Route list — mirrors src/App.tsx <Routes>
// ---------------------------------------------------------------------------

const ROUTES: { path: string; priority: number; changefreq: string }[] = [
  // Core pages
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/introduction', priority: 0.9, changefreq: 'monthly' },
  { path: '/installation', priority: 0.9, changefreq: 'monthly' },
  { path: '/quick-start', priority: 0.9, changefreq: 'monthly' },

  // Component pages (from App.tsx)
  ...[
    'view',
    'scroll-view',
    'button',
    'checkbox',
    'toggle',
    'slider',
    'colorpicker',
    'progressbar',
    'progress-view',
    'number-input',
    'segmented-control',
    'palette-picker',
    'toolbar',
    'menu-button',
    'badge',
    'radiobutton',
    'rating-bar',
    'dropdown',
    'tabs',
    'listbox',
    'joystick',
    'wheel-picker',
    'divider',
    'portal',
    'popover',
    'modal',
    'dialog',
    'alertdialog',
    'toast',
    'accordion',
    'activity-indicator',
    'text',
    'wraptext',
    'bottom-sheet',
    'chartext',
    'chartextinput',
    'icon',
    'image',
    'sprite',
    'tilesprite',
    'particles',
    'graphics',
    'nineslice-button',
    'ref-origin-view',
    'transform-origin-view',
  ].map((c) => ({ path: `/components/${c}`, priority: 0.8, changefreq: 'monthly' })),

  // Guide pages
  ...[
    'best-practices',
    'testing',
    'scene-backgrounds',
    'animation-showcase',
    'custom-component-pattern',
    'effects-animations',
    'gestures',
    'tooltips',
    'layout-patterns',
    'performance',
    'responsive-design',
    'theme-system',
    'phaserjsx-plugin',
    'icon-system',
    'icon-generator-config',
    'custom-icon-component',
    'custom-svg-icons',
  ].map((g) => ({ path: `/guides/${g}`, priority: 0.8, changefreq: 'monthly' })),

  // API pages
  { path: '/api/hooks', priority: 0.7, changefreq: 'monthly' },
  { path: '/api/core-props', priority: 0.7, changefreq: 'monthly' },
  { path: '/api/theme-types', priority: 0.7, changefreq: 'monthly' },
  { path: '/api/effects', priority: 0.7, changefreq: 'monthly' },
]

// ---------------------------------------------------------------------------
// Template manipulation
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Generates route-specific HTML by replacing SEO meta tags in the built
 * index.html template.
 */
function generatePageHtml(template: string, route: RouteMeta): string {
  const canonicalUrl = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`

  let html = template

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(route.description)}"`
  )

  // Replace og:title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(route.title)}"`
  )

  // Replace og:description
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(route.description)}"`
  )

  // Replace og:url
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"/,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}"`
  )

  // Replace twitter:title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}"`
  )

  // Replace twitter:description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}"`
  )

  // Add canonical link (after the last meta tag before </head>)
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n  </head>`
    )
  } else {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"/,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}"`
    )
  }

  // Remove sessionStorage redirect script from non-root pages.
  // The root page needs it for the 404.html → SPA fallback flow.
  if (route.path !== '/') {
    html = html.replace(
      /<script>\s*\n\s*\/\*\s*\n\s*\*\s*Restore the original path[\s\S]*?<\/script>/,
      ''
    )
  }

  return html
}

// ---------------------------------------------------------------------------
// Sitemap generation
// ---------------------------------------------------------------------------

function generateSitemap(routes: typeof ROUTES): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map(
      (r) =>
        `  <url><loc>${siteUrl}${r.path === '/' ? '' : r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const templatePath = path.join(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.')
    process.exit(1)
  }

  const template = fs.readFileSync(templatePath, 'utf-8')
  let generated = 0

  for (const route of ROUTES) {
    const meta = getRouteMeta(route.path)
    const html = generatePageHtml(template, { ...route, ...meta })
    const outDir = path.join(distDir, route.path === '/' ? '.' : route.path)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
    generated++
  }

  // Root index.html already exists — overwrite with prerendered version
  // (same path, already handled above since path '/' writes to dist/index.html)

  // Generate sitemap
  const sitemap = generateSitemap(ROUTES)
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

  console.log(`✅ Prerendered ${generated} pages + sitemap.xml`)
}

main()
