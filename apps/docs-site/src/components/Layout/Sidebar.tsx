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
    ],
  },
  {
    title: 'Components',
    items: [
      { label: 'Button', path: '/components/button' }, // done so far
      { label: 'Dropdown', path: '/components/dropdown' },
      { label: 'Toggle', path: '/components/toggle' },
      { label: 'Slider', path: '/components/slider' },
      { label: 'View', path: '/components/view' }, // done so far
      // add more if needed
    ],
  },
  {
    // Gestures & Interaction
    // → Better in: /guides/gestures or /guides/interaction
    // - enableGestures, onTouch, onTouchMove, onTouchOutside
    // - onDoubleTap, onLongPress, gesture configuration
    // Reason: Complex topic, needs dedicated space for patterns

    // Theme Integration
    // → Better in: /guides/theming
    // - theme prop, nested themes, component-level styling
    // - getThemedProps usage, theme inheritance
    // Reason: Theme system is cross-cutting, needs holistic view

    // Responsive Design
    // → Better in: /guides/responsive-design
    // - Viewport units (vw, vh), percentage sizes
    // - calc() expressions, dynamic sizing strategies
    // - maxWidth with viewport units for breakpoints
    // Reason: Responsive patterns span multiple components

    // Layout Patterns
    // → Better in: /guides/layout-patterns
    // - Common patterns: Holy Grail, Sidebar, Grid-like structures
    // - Flexbox equivalents (stretch, flex-grow behavior)
    // - Centering strategies, sticky footers
    // Reason: Patterns involve multiple components and techniques

    // Performance Considerations
    // → Better in: /guides/performance
    // - When to use headless, layout recalculation triggers
    // - Nested View overhead, optimization tips
    // Reason: Performance is a cross-cutting concern

    title: 'Guides',
    items: [
      { label: 'Testing & Development', path: '/guides/testing' },
      { label: 'Gestures & Interaction', path: '/guides/gestures' },
      { label: 'Theme Integration', path: '/guides/theming' },
      { label: 'Responsive Design', path: '/guides/responsive-design' },
      { label: 'Layout Patterns', path: '/guides/layout-patterns' },
      { label: 'Performance Considerations', path: '/guides/performance' },
      { label: 'Scene Backgrounds', path: '/guides/scene-backgrounds' },
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
