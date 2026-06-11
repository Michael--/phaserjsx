/** @jsxImportSource ../.. */
/**
 * Checkbox component - binary or tristate selection control.
 */
import type * as Phaser from 'phaser'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View } from '../index'

export type CheckboxState = boolean | 'indeterminate'
export type CheckboxLabelPosition = 'left' | 'right' | 'none'

export interface CheckboxIndicatorRenderProps {
  checked: CheckboxState
  disabled: boolean
  size: number
  color: number
  checkedColor: number
  indeterminateColor: number
}

export interface CheckboxProps {
  /** Unique key for VDOM identification */
  key?: string | number | undefined
  /** Label text rendered next to the indicator */
  label?: string
  /** Controlled checked state */
  checked?: CheckboxState
  /** Initial state for uncontrolled checkboxes */
  defaultChecked?: CheckboxState
  /** Enables unchecked -> checked -> indeterminate cycling */
  tristate?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Label position relative to the indicator */
  labelPosition?: CheckboxLabelPosition
  /** Optional custom indicator content */
  indicator?: ChildrenType
  /** Render function for custom indicators */
  renderIndicator?: (props: CheckboxIndicatorRenderProps) => ChildrenType
  /** Optional theme overrides */
  theme?: PartialTheme
  /** Callback when checked state changes */
  onChange?: (checked: CheckboxState) => void
}

export function getNextCheckedState(checked: CheckboxState, tristate: boolean): CheckboxState {
  if (!tristate) return checked === true ? false : true
  if (checked === false) return true
  if (checked === true) return 'indeterminate'
  return false
}

export function normalizeCheckedState(checked: CheckboxState, tristate: boolean): CheckboxState {
  return checked === 'indeterminate' && !tristate ? false : checked
}

function drawDefaultIndicator(
  graphics: Phaser.GameObjects.Graphics,
  indicatorProps: CheckboxIndicatorRenderProps
): void {
  const { checked, disabled, size, color, checkedColor, indeterminateColor } = indicatorProps
  const borderWidth = Math.max(2, Math.round(size * 0.1))
  const inset = Math.max(4, Math.round(size * 0.22))
  const radius = Math.max(2, Math.round(size * 0.15))
  const alpha = disabled ? 0.45 : 1

  graphics.clear()
  graphics.lineStyle(borderWidth, checked === false ? color : checkedColor, alpha)
  graphics.strokeRoundedRect(
    borderWidth / 2,
    borderWidth / 2,
    size - borderWidth,
    size - borderWidth,
    radius
  )

  if (checked === true) {
    graphics.lineStyle(borderWidth + 1, checkedColor, alpha)
    graphics.beginPath()
    graphics.moveTo(inset, size * 0.52)
    graphics.lineTo(size * 0.43, size - inset)
    graphics.lineTo(size - inset, inset)
    graphics.strokePath()
  }

  if (checked === 'indeterminate') {
    graphics.lineStyle(borderWidth + 1, indeterminateColor, alpha)
    graphics.beginPath()
    graphics.moveTo(inset, size / 2)
    graphics.lineTo(size - inset, size / 2)
    graphics.strokePath()
  }
}

export function Checkbox(props: CheckboxProps): VNodeLike {
  const localTheme = useTheme()
  const mergedLocalTheme = props.theme ? mergeThemes(localTheme ?? {}, props.theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('Checkbox', mergedLocalTheme, {})
  const size = themed.size ?? 20
  const gap = themed.gap ?? 8
  const labelPosition = props.labelPosition ?? themed.labelPosition ?? 'right'
  const disabled = props.disabled ?? false
  const disabledAlpha = themed.disabledAlpha ?? 0.5
  const tristate = props.tristate ?? false
  const initialChecked = normalizeCheckedState(
    props.checked ?? props.defaultChecked ?? false,
    tristate
  )
  const [checked, setChecked] = useState<CheckboxState>(initialChecked)

  useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(normalizeCheckedState(props.checked, tristate))
    }
  }, [props.checked, tristate])

  const indicatorProps: CheckboxIndicatorRenderProps = {
    checked,
    disabled,
    size,
    color: themed.color ?? 0x777777,
    checkedColor: themed.checkedColor ?? 0x4caf50,
    indeterminateColor: themed.indeterminateColor ?? themed.checkedColor ?? 0x4caf50,
  }

  const handleToggle = () => {
    if (disabled) return

    const nextChecked = getNextCheckedState(checked, tristate)
    if (props.checked === undefined) setChecked(nextChecked)
    props.onChange?.(nextChecked)
  }

  const indicator = props.indicator ?? props.renderIndicator?.(indicatorProps) ?? (
    <Graphics
      width={size}
      height={size}
      headless={false}
      dependencies={[
        indicatorProps.checked,
        indicatorProps.disabled,
        indicatorProps.size,
        indicatorProps.color,
        indicatorProps.checkedColor,
        indicatorProps.indeterminateColor,
      ]}
      onDraw={(graphics) => drawDefaultIndicator(graphics, indicatorProps)}
    />
  )

  const label =
    props.label && labelPosition !== 'none' ? (
      <Text text={props.label} style={themed.labelStyle} alpha={disabled ? disabledAlpha : 1} />
    ) : null

  return (
    <View
      key={props.key}
      direction="row"
      alignItems="center"
      enableGestures={!disabled}
      onTouch={handleToggle}
      theme={nestedTheme}
      gap={gap}
      alpha={disabled ? disabledAlpha : 1}
    >
      {labelPosition === 'left' && label}
      {indicator}
      {labelPosition !== 'left' && label}
    </View>
  )
}
