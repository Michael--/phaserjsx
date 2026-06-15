/** @jsxImportSource react */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const siteUrl = 'https://phaserjsx.number10.de'
const siteTitle = 'PhaserJSX'
const defaultDescription =
  'PhaserJSX is a React-like JSX UI framework and component library for building type-safe Phaser 4 game interfaces.'

const routeDescriptions: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'PhaserJSX - JSX UI framework for Phaser 4',
    description: defaultDescription,
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
  'nine-slice-button': 'NineSliceButton',
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

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value)
  }

  return element
}

function ensureCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

function getRouteMetadata(pathname: string) {
  const normalizedPath = pathname === '/index.html' ? '/' : pathname
  const routeMetadata = routeDescriptions[normalizedPath]

  if (routeMetadata) {
    return routeMetadata
  }

  const componentMatch = normalizedPath.match(/^\/components\/([^/]+)$/)
  if (componentMatch) {
    const componentName = componentTitles[componentMatch[1]] ?? 'Component'

    return {
      title: `${componentName} - PhaserJSX component`,
      description: `Use the ${componentName} component from PhaserJSX to build type-safe, React-like UI for Phaser 4 games.`,
    }
  }

  if (normalizedPath.startsWith('/guides/')) {
    return {
      title: 'PhaserJSX guide',
      description:
        'Guide for building Phaser 4 game interfaces with PhaserJSX components, hooks, themes, and TypeScript.',
    }
  }

  if (normalizedPath.startsWith('/api/')) {
    return {
      title: 'PhaserJSX API reference',
      description:
        'API reference for PhaserJSX, the React-like JSX UI framework for Phaser 4 games.',
    }
  }

  return routeDescriptions['/']
}

export function SeoMetadata() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname === '/index.html' ? '/' : location.pathname
    const metadata = getRouteMetadata(path)
    const canonicalUrl = `${siteUrl}${path === '/' ? '/' : path}`

    document.title = metadata.title
    ensureCanonical(canonicalUrl)
    ensureMeta('meta[name="description"]', {
      name: 'description',
      content: metadata.description,
    })
    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: metadata.title,
    })
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metadata.description,
    })
    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    })
    ensureMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: metadata.title,
    })
    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metadata.description,
    })
    ensureMeta('meta[name="application-name"]', {
      name: 'application-name',
      content: siteTitle,
    })
  }, [location.pathname])

  return null
}
