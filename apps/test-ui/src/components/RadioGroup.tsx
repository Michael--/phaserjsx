/**
 * RadioGroup component - Manages a group of radio buttons with single-selection logic
 */
import { Text, View, getThemedProps, useState } from '@phaserjsx/ui'

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
  /** Layout direction (default: 'column') */
  direction?: 'row' | 'column'
}

/**
 * RadioGroup component - displays a group of radio buttons with single-selection
 * @param props - RadioGroup properties
 * @returns RadioGroup JSX element
 */
export function RadioGroup(props: RadioGroupProps) {
  const { props: themed, nestedTheme } = getThemedProps('RadioButton', undefined, {})

  const [selected, setSelected] = useState<string>(props.value ?? '')

  const handleSelect = (value: string) => {
    setSelected(value)
    props.onChange?.(value)
  }

  return (
    <View direction={props.direction ?? 'column'} theme={nestedTheme} gap={themed.gap}>
      {props.options.map((option) => {
        const isSelected = selected === option.value

        const size = themed.size ?? 16
        const innerSize = themed.innerSize ?? size * 0.75
        const innerRadius = innerSize * 0.5
        const outerRadius = size * 0.5

        return (
          <View
            key={option.value}
            direction="row"
            gap={themed.gap}
            alignItems="center"
            enableGestures={true}
            onTouch={() => handleSelect(option.value)}
          >
            <View
              width={size}
              height={size}
              backgroundColor={themed.color}
              alignItems="center"
              justifyContent="center"
              backgroundAlpha={1.0}
              padding={0}
              cornerRadius={outerRadius}
            >
              <View
                width={innerSize}
                height={innerSize}
                backgroundColor={themed.selectedColor}
                visible={isSelected}
                cornerRadius={innerRadius}
              />
            </View>
            <Text text={option.label} style={themed.labelStyle} />
          </View>
        )
      })}
    </View>
  )
}
