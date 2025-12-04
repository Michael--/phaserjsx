/**
 * Section component for documentation structure
 */
/** @jsxImportSource react */
import type { ReactNode } from 'react'

interface SectionProps {
  title?: string
  children: ReactNode
}

/**
 * Documentation section with consistent spacing
 * @param title - Optional section title (h2)
 * @param children - Section content
 */
export function Section({ title, children }: SectionProps) {
  return (
    <section className="doc-section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}
