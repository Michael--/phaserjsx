/** @jsxImportSource ../.. */
/**
 * Divider component - Simple visual separator
 * Test component to validate TSX support in packages/ui
 */
import { View } from '../index'

/**
 * Props for Divider component
 */
export interface DividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical'
  /** Thickness of the divider line */
  thickness?: number
  /** Color of the divider */
  color?: number
  /** Length of the divider (defaults to 100%) */
  length?: number
}

/**
 * Divider component - renders a simple line separator
 * @param props - Divider properties
 * @returns Divider JSX element
 */
export function Divider(props: DividerProps) {
  const { orientation = 'horizontal', thickness = 1, color = 0xcccccc, length } = props

  const isHorizontal = orientation === 'horizontal'

  return (
    <View
      width={isHorizontal ? (length ?? '100%') : thickness}
      height={isHorizontal ? thickness : (length ?? '100%')}
      backgroundColor={color}
    />
  )
}
