/**
 * Checkbox component - Selectable option with square indicator and label
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, useState, View } from '@phaserjsx/ui'
import { Icon, type IconType } from './Icon'

// Module augmentation to add RadioGroup theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Checkbox: {
      color?: number
      labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
      bodyIcon?: IconType
      checkedIcon?: IconType
      intermediateIcon?: IconType
      gap?: number
      size?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

type CheckedState = boolean | 'indeterminate'

/**
 * Props for Checkbox component
 */
export interface CheckboxProps {
  /** Label text for the checkbox */
  label: string
  /** Whether its checked (true), unchecked (false), or 'indeterminate' */
  checked?: CheckedState
  /** Whether to enable tristate mode (unchecked, checked, indeterminate) */
  tristate?: boolean
  /** Callback when checked state changed */
  onChange?: (checked: CheckedState) => void
}

/**
 * Checkbox component - displays a selectable square with label
 * @param props - Checkbox properties
 * @returns Checkbox JSX element
 */
export function Checkbox(props: CheckboxProps) {
  const { props: themed, nestedTheme } = getThemedProps('Checkbox', undefined, {})
  const size = themed.size ?? 32
  const initialChecked = props.checked !== undefined ? props.checked : false
  const [checked, setChecked] = useState<CheckedState>(initialChecked)
  const bodyIcon = themed.bodyIcon ?? 'square'
  const checkedIcon = themed.checkedIcon ?? 'check'
  const indeterminateIcon = themed.intermediateIcon ?? 'dash'

  const onClick = () => {
    let newChecked: CheckedState
    if (!props.tristate) {
      newChecked = checked ? false : true
    } else {
      if (checked === false) newChecked = true
      else if (checked === true) newChecked = 'indeterminate'
      else newChecked = false
    }
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
        <Icon type={bodyIcon} size={size} />
        <Icon type={checkedIcon} size={size} visible={checked === true} />
        <Icon type={indeterminateIcon} size={size} visible={checked === 'indeterminate'} />
      </View>
      <Text text={props.label} style={themed.labelStyle} />
    </View>
  )
}
