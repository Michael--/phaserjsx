/**
 * Typography components for documentation
 */
/** @jsxImportSource react */
import type { ReactNode } from 'react'

interface DocDescriptionProps {
  children: ReactNode
}

/**
 * Main component description text
 */
export function DocDescription({ children }: DocDescriptionProps) {
  return <p className="doc-description">{children}</p>
}

interface SectionDescriptionProps {
  children: ReactNode
}

/**
 * Section description text (smaller, muted)
 */
export function SectionDescription({ children }: SectionDescriptionProps) {
  return <p className="section-description">{children}</p>
}

interface DocTitleProps {
  children: ReactNode
}

/**
 * Main page title
 */
export function DocTitle({ children }: DocTitleProps) {
  return <h1 className="doc-title">{children}</h1>
}

interface SectionTitleProps {
  children: ReactNode
}

/**
 * Section title
 */
export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="section-title">{children}</h2>
}

interface DocParagraphProps {
  children: ReactNode
}

/**
 * Documentation paragraph
 */
export function DocParagraph({ children }: DocParagraphProps) {
  return <p className="doc-paragraph">{children}</p>
}

interface DocSectionProps {
  children: ReactNode
}

/**
 * Documentation section wrapper
 */
export function DocSection({ children }: DocSectionProps) {
  return <section className="doc-section">{children}</section>
}

interface CodeBlockProps {
  children: string
  language?: string
  title?: string
}

/**
 * Code block with syntax highlighting
 */
export function CodeBlock({ children, language, title }: CodeBlockProps) {
  return (
    <div className="code-block">
      {title && <div className="code-block-title">{title}</div>}
      <pre className={`language-${language || 'typescript'}`}>
        <code>{children}</code>
      </pre>
    </div>
  )
}
