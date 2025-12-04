/**
 * Hero section component
 */
/** @jsxImportSource react */
import type { ReactNode } from 'react'

interface HeroProps {
  title: string
  children: ReactNode
}

/**
 * Hero section for landing page
 */
export function Hero({ title, children }: HeroProps) {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <div className="doc-description">{children}</div>
    </div>
  )
}
