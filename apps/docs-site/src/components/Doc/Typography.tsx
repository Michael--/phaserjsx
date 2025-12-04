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
