/** @jsxImportSource ../.. */
/**
 * RadioGroup component - Manages a group of radio buttons with single-selection logic
 */

import { useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { VNodeLike } from '../../vdom'
import { View } from '../index'
import { RadioButton } from './RadioButton'

// import { getThemedProps, Text, useState, View } from '@number10/phaserjsx'

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
  /** Initial selected value for uncontrolled groups */
  defaultValue?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
  /** Layout direction (default: 'column') */
  direction?: 'row' | 'column'
  /** Disabled state for all options */
  disabled?: boolean
}

/**
 * RadioGroup component - displays a group of radio buttons with single-selection
 * @param props - RadioGroup properties
 * @returns RadioGroup JSX element
 */
export function RadioGroup(props: RadioGroupProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('RadioButton', localTheme, {})

  const [internalSelected, setInternalSelected] = useState<string>(
    props.value ?? props.defaultValue ?? ''
  )
  const selected = props.value ?? internalSelected

  const handleSelect = (value: string) => {
    if (props.disabled) return
    if (props.value === undefined) {
      setInternalSelected(value)
    }
    props.onChange?.(value)
  }

  return (
    <View direction={props.direction ?? 'column'} theme={nestedTheme} gap={themed.gap}>
      {props.options.map((option) => {
        const isSelected = selected === option.value

        return (
          <RadioButton
            key={option.value}
            label={option.label}
            selected={isSelected}
            disabled={props.disabled ?? false}
            onClick={() => handleSelect(option.value)}
          />
        )
      })}
    </View>
  )
}
