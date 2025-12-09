/**
 * Sidebar - Navigation menu
 */
/** @jsxImportSource react */
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', path: '/introduction' },
      { label: 'Installation', path: '/installation' },
      { label: '🚧 Quick Start', path: '/quick-start' },
    ],
  },
  {
    title: 'Layout Components',
    items: [
      { label: 'View', path: '/components/view' },
      { label: 'ScrollView', path: '/components/scroll-view' },
      { label: 'Divider', path: '/components/divider' },
    ],
  },
  {
    title: 'Advanced Composition',
    items: [{ label: 'Portal', path: '/components/portal' }],
  },
  {
    title: 'Form Controls',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Toggle', path: '/components/toggle' },
      { label: 'Slider', path: '/components/slider' },
      { label: 'RadioButton', path: '/components/radiobutton' },
      { label: 'Dropdown', path: '/components/dropdown' },
    ],
  },
  {
    title: 'Text & Content',
    items: [
      { label: 'Text', path: '/components/text' },
      { label: 'WrapText', path: '/components/wraptext' },
      { label: 'CharText', path: '/components/chartext' },
      { label: 'CharTextInput', path: '/components/chartextinput' },
    ],
  },
  {
    title: 'Overlays & Dialogs',
    items: [
      { label: 'Modal', path: '/components/modal' },
      { label: 'Dialog', path: '/components/dialog' },
      { label: 'AlertDialog', path: '/components/alertdialog' },
      { label: 'Accordion', path: '/components/accordion' },
    ],
  },
  {
    title: 'Media & Icons',
    items: [
      { label: 'Icon', path: '/components/icon' },
      { label: 'Image', path: '/components/image' },
      { label: 'Graphics', path: '/components/graphics' },
      { label: 'NineSliceButton', path: '/components/nineslice-button' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { label: '🚧 Sprite (soon)', path: '/components/sprite' },
      { label: '🚧 TileSprite (soon)', path: '/components/tilesprite' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'RefOriginView', path: '/components/ref-origin-view' },
      { label: 'TransformOriginView', path: '/components/transform-origin-view' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Best Practices', path: '/guides/best-practices' },
      { label: 'Gestures & Interaction', path: '/guides/gestures' },
      { label: 'Theme System', path: '/guides/theme-system' },
      { label: '🚧 Responsive Design', path: '/guides/responsive-design' },
      { label: '🚧 Layout Patterns', path: '/guides/layout-patterns' },
      { label: 'Effects & Animations', path: '/guides/effects-animations' },
      { label: '🚧 Performance', path: '/guides/performance' },
      { label: 'Scene Backgrounds', path: '/guides/scene-backgrounds' },
      { label: 'Testing & Development', path: '/guides/testing' },
    ],
  },
  {
    title: 'Icon System',
    items: [
      { label: 'Overview', path: '/guides/icon-system' },
      { label: 'Generator Config', path: '/guides/icon-generator-config' },
      { label: 'Custom Component', path: '/guides/custom-icon-component' },
      { label: 'Custom SVG Icons', path: '/guides/custom-svg-icons' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: '🚧 Hooks', path: '/api/hooks' },
      { label: '🚧 Core Props', path: '/api/core-props' },
      { label: '🚧 Theme Types', path: '/api/theme-types' },
      { label: '🚧 Effect Registry', path: '/api/effects' },
    ],
  },
]

/**
 * Sidebar navigation menu
 */
export function Sidebar() {
  const location = useLocation()
  const darkMode = true // TODO: sync with theme context

  return (
    <aside
      style={{
        width: '250px',
        height: '100%',
        backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
        borderRight: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
        overflowY: 'auto',
        padding: '24px 16px',
      }}
    >
      {navigation.map((section) => (
        <div key={section.title} style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: darkMode ? '#888' : '#666',
              marginBottom: '8px',
            }}
          >
            {section.title}
          </h3>
          {section.items.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  color: isActive ? '#61dafb' : darkMode ? '#ccc' : '#666',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  backgroundColor: isActive ? (darkMode ? '#2a2a2a' : '#e8f4f8') : 'transparent',
                  marginBottom: '4px',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
