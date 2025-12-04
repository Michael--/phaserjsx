/**
 * Inherited props component
 */
/** @jsxImportSource react */
import type { InheritedComponent } from '@/types/docs'
import './InheritedProps.css'

interface InheritedPropsProps {
  inherits: InheritedComponent[]
}

/**
 * Displays inherited component information
 * @param inherits - Array of inherited components
 */
export function InheritedProps({ inherits }: InheritedPropsProps) {
  if (!inherits || inherits.length === 0) return null

  return (
    <div className="inherited-props">
      <h3>Inherited Props</h3>
      {inherits.map((parent) => (
        <div key={parent.component} className="inherited-item">
          <div className="inherited-header">
            <span className="inherited-label">From</span>
            <a href={parent.link} className="inherited-link">
              {parent.component}
            </a>
          </div>
          <p className="inherited-description">{parent.description}</p>
        </div>
      ))}
    </div>
  )
}
