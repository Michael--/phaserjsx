/**
 * Props table component for API documentation
 */
/** @jsxImportSource react */
import type { PropDefinition } from '@/content/button.content'
import './PropsTable.css'

interface PropsTableProps {
  props: PropDefinition[]
}

/**
 * Renders a formatted table of component props
 * @param props - Array of prop definitions
 */
export function PropsTable({ props }: PropsTableProps) {
  return (
    <table className="props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop) => (
          <tr key={prop.name}>
            <td>
              <code>{prop.name}</code>
            </td>
            <td>{prop.type}</td>
            <td>{prop.default ? <code>{prop.default}</code> : '-'}</td>
            <td>{prop.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
