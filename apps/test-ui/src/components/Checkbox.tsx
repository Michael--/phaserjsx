/**
 * RadioButton component - Selectable option with circle indicator and label
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useState, View } from '@phaserjsx/ui'
import { Icon } from './Icon'

// Module augmentation to add RadioGroup theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Checkbox: {
      color?: number
      labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
      gap?: number
      size?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * Props for RadioButton component
 */
export interface CheckboxProps {
  /** Label text for the checkbox */
  label: string
  /** Whether its checked */
  checked?: boolean
  /** Callback when checked state changed */
  onChange?: (checked: boolean) => void
}

/**
 * RadioButton component - displays a selectable circle with label
 * @param props - RadioButton properties
 * @returns RadioButton JSX element
 */
export function Checkbox(props: CheckboxProps) {
  const { props: themed, nestedTheme } = getThemedProps('Checkbox', undefined, {})
  const size = themed.size ?? 32
  const [checked, setChecked] = useState<boolean>(props.checked ?? false)

  const onClick = () => {
    const newChecked = !checked
    setChecked(newChecked)
    props.onChange?.(newChecked)
  }

  return (
    <View
      direction="row"
      alignItems="center"
      alignContent="center"
      enableGestures={true}
      onTouch={onClick}
      theme={nestedTheme}
      gap={themed.gap}
    >
      <View direction="stack" minHeight={size} minWidth={size}>
        <Icon type={'square'} size={size} />
        <Icon type={'check'} size={size} visible={checked} />
      </View>
      <Text text={props.label} style={themed.labelStyle} />
    </View>
  )
}
