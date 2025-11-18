/**
 * RadioGroup component - Manages a group of radio buttons with single-selection logic
 */
import { Text, View, useState } from '@phaserjsx/ui'

/**
 * Option item for RadioGroup
 */
export interface RadioGroupOption {
  /** Unique value for this option */
  value: string
  /** Display label for this option */
  label: string
}

/**
 * Props for RadioGroup component
 */
export interface RadioGroupProps {
  /** Array of options to display */
  options: RadioGroupOption[]
  /** Currently selected value */
  value?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
  /** Gap between radio buttons (default: 8) */
  gap?: number
  /** Layout direction (default: 'column') */
  direction?: 'row' | 'column'
  /** Color when selected */
  selectedColor?: number
  /** Color when unselected */
  unselectedColor?: number
  /** Label text color */
  labelColor?: string
}

/**
 * RadioGroup component - displays a group of radio buttons with single-selection
 * @param props - RadioGroup properties
 * @returns RadioGroup JSX element
 */
export function RadioGroup(props: RadioGroupProps) {
  const [selected, setSelected] = useState<string>(props.value ?? '')

  const handleSelect = (value: string) => {
    setSelected(value)
    props.onChange?.(value)
  }

  return (
    <View direction={props.direction ?? 'column'} gap={props.gap ?? 8}>
      {props.options.map((option) => {
        const isSelected = selected === option.value
        const size = 16
        const innerSize = size * 0.5
        const selectedColor = isSelected
          ? (props.selectedColor ?? 0x4ecdc4)
          : (props.unselectedColor ?? 0x666666)

        return (
          <View
            key={option.value}
            direction="row"
            gap={8}
            alignItems="center"
            padding={{ left: 4, top: 4, right: 4, bottom: 4 }}
            onPointerDown={() => handleSelect(option.value)}
          >
            <View
              width={size}
              height={size}
              backgroundColor={selectedColor}
              alignItems="center"
              justifyContent="center"
              backgroundAlpha={1.0}
            >
              <View
                width={innerSize}
                height={innerSize}
                backgroundColor={0xffffff}
                visible={isSelected}
              />
            </View>

            <Text
              text={option.label}
              style={{ fontSize: 14, color: props.labelColor ?? 'white' }}
            />
          </View>
        )
      })}
    </View>
  )
}
