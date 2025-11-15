/**
 * RadioButton component - Selectable option with circle indicator and label
 */
import { Text, View } from '@phaserjsx/ui'

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
 * @param props - RadioButton properties
 * @returns RadioButton JSX element
 */
export function RadioButton(props: RadioButtonProps) {
  const size = props.size ?? 16
  const selectedColor = props.selected
    ? (props.selectedColor ?? 0x4ecdc4)
    : (props.unselectedColor ?? 0x666666)
  const innerSize = size * 0.5

  return (
    <View
      direction="row"
      gap={8}
      alignItems="center"
      padding={{ left: 4, top: 4, right: 4, bottom: 4 }}
      onPointerDown={() => props.onClick?.()}
    >
      <View
        width={size}
        height={size}
        backgroundColor={selectedColor}
        alignItems="center"
        justifyContent="center"
      >
        <View
          width={innerSize}
          height={innerSize}
          backgroundColor={0xffffff}
          visible={props.selected ?? false}
        />
      </View>

      <Text text={props.label} color={props.labelColor ?? 'white'} style={{ fontSize: 14 }} />
    </View>
  )
}
