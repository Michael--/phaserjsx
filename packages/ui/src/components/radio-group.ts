/**
 * RadioGroup component - Manages a group of radio buttons with single-selection logic
 */
import type { VNode } from '../hooks'
import { useState } from '../hooks'
import { View } from './index'

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
 * @returns RadioGroup VNode
 */
export function RadioGroup(props: RadioGroupProps): VNode {
  const [selected, setSelected] = useState<string>(props.value ?? '')

  const handleSelect = (value: string) => {
    setSelected(value)
    props.onChange?.(value)
  }

  const radioButtons: VNode[] = props.options.map((option) => {
    const isSelected = selected === option.value

    return {
      type: View,
      props: {
        direction: 'row' as const,
        gap: 8,
        alignItems: 'center' as const,
        padding: { left: 4, top: 4, right: 4, bottom: 4 },
        onPointerDown: () => handleSelect(option.value),
      },
      children: [
        {
          type: View,
          props: {
            width: 16,
            height: 16,
            backgroundColor: isSelected
              ? (props.selectedColor ?? 0x4ecdc4)
              : (props.unselectedColor ?? 0x666666),
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
          },
          children: isSelected
            ? [
                {
                  type: View,
                  props: {
                    width: 8,
                    height: 8,
                    backgroundColor: 0xffffff,
                  },
                },
              ]
            : [],
        },
        {
          type: 'Text',
          props: {
            text: option.label,
            color: props.labelColor ?? 'white',
            fontSize: 14,
          },
        },
      ],
      __key: option.value,
    }
  })

  return {
    type: View,
    props: {
      direction: props.direction ?? ('column' as const),
      gap: props.gap ?? 8,
    },
    children: radioButtons,
  }
}
