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
      { label: 'Quick Start', path: '/quick-start' },
    ],
  },
  {
    title: 'Layout Components',
    items: [
      { label: 'View', path: '/components/view' },
      { label: 'ScrollView', path: '/components/scroll-view' },
      { label: 'Portal', path: '/components/portal' },
      { label: 'Divider', path: '/components/divider' },
    ],
  },
  {
    title: 'Form Controls',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Toggle', path: '/components/toggle' },
      { label: 'Slider', path: '/components/slider' },
      { label: 'RadioButton', path: '/components/radio-button' },
      { label: 'RadioGroup', path: '/components/radio-group' },
      { label: 'Dropdown', path: '/components/dropdown' },
    ],
  },
  {
    title: 'Text & Content',
    items: [
      { label: 'Text', path: '/components/text' },
      { label: 'WrapText', path: '/components/wrap-text' },
      { label: 'CharText', path: '/components/char-text' },
      { label: 'CharTextInput', path: '/components/char-text-input' },
    ],
  },
  {
    title: 'Overlays & Dialogs',
    items: [
      { label: 'Modal', path: '/components/modal' },
      { label: 'Dialog', path: '/components/dialog' },
      { label: 'AlertDialog', path: '/components/alert-dialog' },
      { label: 'Sidebar', path: '/components/sidebar' },
      { label: 'Accordion', path: '/components/accordion' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { label: 'Image', path: '/components/image' },
      { label: 'Sprite', path: '/components/sprite' },
      { label: 'Graphics', path: '/components/graphics' },
      { label: 'NineSlice', path: '/components/nineslice' },
      { label: 'TileSprite', path: '/components/tilesprite' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'NineSliceButton', path: '/components/nineslice-button' },
      { label: 'ScrollSlider', path: '/components/scroll-slider' },
      { label: 'RefOriginView', path: '/components/ref-origin-view' },
      { label: 'TransformOriginView', path: '/components/transform-origin-view' },
    ],
  },
  {
    title: 'Icon System',
    items: [
      { label: 'Icon Component', path: '/icons/component' },
      { label: 'Icon Generator', path: '/icons/generator' },
      { label: 'Vite Plugin', path: '/icons/vite-plugin' },
      { label: 'Configuration', path: '/icons/configuration' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Gestures & Interaction', path: '/guides/gestures' },
      { label: 'Theme System', path: '/guides/theming' },
      { label: 'Responsive Design', path: '/guides/responsive-design' },
      { label: 'Layout Patterns', path: '/guides/layout-patterns' },
      { label: 'Effects & Animations', path: '/guides/effects' },
      { label: 'Performance', path: '/guides/performance' },
      { label: 'Scene Backgrounds', path: '/guides/scene-backgrounds' },
      { label: 'Testing & Development', path: '/guides/testing' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'Hooks', path: '/api/hooks' },
      { label: 'Core Props', path: '/api/core-props' },
      { label: 'Theme Types', path: '/api/theme-types' },
      { label: 'Effect Registry', path: '/api/effects' },
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
