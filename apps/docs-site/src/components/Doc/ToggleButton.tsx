/**
 * Toggle button component
 */
/** @jsxImportSource react */

interface ToggleButtonProps {
  isActive: boolean
  activeText: string
  inactiveText: string
  onClick: () => void
}

/**
 * Toggle button for showing/hiding content
 */
export function ToggleButton({ isActive, activeText, inactiveText, onClick }: ToggleButtonProps) {
  return (
    <button className="toggle-button" onClick={onClick}>
      {isActive ? activeText : inactiveText}
    </button>
  )
}
