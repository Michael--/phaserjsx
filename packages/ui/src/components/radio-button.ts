/**
 * RadioButton component - Selectable option with circle indicator and label
 */
import type { VNode } from '../hooks'
import { Text, View } from './index'

/**
 * Props for RadioButton component
 */
export interface RadioButtonProps {
  /** Label text for the radio button */
  label: string
  /** Whether this radio button is selected */
  selected?: boolean
  /** Callback when radio button is clicked */
  onClick?: () => void
  /** Color when selected (default: 0x4ecdc4) */
  selectedColor?: number
  /** Color when unselected (default: 0x666666) */
  unselectedColor?: number
  /** Label text color (default: white) */
  labelColor?: string
  /** Size of the radio circle (default: 16) */
  size?: number
}

/**
 * RadioButton component - displays a selectable circle with label
 * This is a composite component built from View and Text primitives
 * @param props - RadioButton properties
 * @returns RadioButton VNode
 */
export function RadioButton(props: RadioButtonProps): VNode {
  const size = props.size ?? 16
  const selectedColor = props.selected
    ? (props.selectedColor ?? 0x4ecdc4)
    : (props.unselectedColor ?? 0x666666)
  const innerSize = size * 0.5

  const handleClick = () => {
    props.onClick?.()
  }

  const innerCircle: VNode = {
    type: View,
    props: {
      width: innerSize,
      height: innerSize,
      backgroundColor: 0xffffff,
    },
  }

  const outerCircle: VNode = {
    type: View,
    props: {
      width: size,
      height: size,
      backgroundColor: selectedColor,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    children: props.selected ? [innerCircle] : [],
  }

  const labelText: VNode = {
    type: Text,
    props: {
      text: props.label,
      color: props.labelColor ?? 'white',
      fontSize: 14,
    },
  }

  return {
    type: View,
    props: {
      direction: 'row' as const,
      gap: 8,
      alignItems: 'center' as const,
      padding: { left: 4, top: 4, right: 4, bottom: 4 },
      onPointerDown: handleClick,
    },
    children: [outerCircle, labelText],
  }
}
