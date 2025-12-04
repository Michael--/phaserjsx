/**
 * Header - Navigation and branding
 */
/** @jsxImportSource react */
import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Site header with navigation and theme toggle
 */
export function Header() {
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark')
  }

  return (
    <header
      style={{
        height: '60px',
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link
          to="/"
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: darkMode ? '#fff' : '#000',
            textDecoration: 'none',
          }}
        >
          PhaserJSX UI
        </Link>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link
            to="/components"
            style={{ color: darkMode ? '#aaa' : '#666', textDecoration: 'none' }}
          >
            Components
          </Link>
          <Link to="/guides" style={{ color: darkMode ? '#aaa' : '#666', textDecoration: 'none' }}>
            Guides
          </Link>
        </nav>
      </div>
      <button
        onClick={toggleTheme}
        style={{
          padding: '8px 16px',
          backgroundColor: darkMode ? '#333' : '#f0f0f0',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
