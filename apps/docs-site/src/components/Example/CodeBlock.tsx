/**
 * CodeBlock - Syntax-highlighted code display
 */
/** @jsxImportSource react */
import { useState } from 'react'

interface CodeBlockProps {
  /** Code to display */
  children: string
  /** Programming language for syntax highlighting */
  language?: string
}

/**
 * Displays code with syntax highlighting and copy button
 */
export function CodeBlock({ children, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'relative',
        margin: '20px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#1e1e1e',
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '6px 12px',
          backgroundColor: copied ? '#4caf50' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
      <pre
        style={{
          margin: 0,
          padding: '20px',
          overflow: 'auto',
          color: '#d4d4d4',
          fontSize: '14px',
          fontFamily: 'Consolas, Monaco, monospace',
          lineHeight: '1.5',
        }}
      >
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}
