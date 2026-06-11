/** @jsxImportSource ../.. */
/**
 * RadioButton component - Selectable option with circle indicator and label
 */
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'

export type RadioButtonLabelPosition = 'left' | 'right' | 'none'

/**
 * Props for RadioButton component
 */
export interface RadioButtonProps {
  /** Unique key for VDOM identification */
  key?: string | number | undefined
  /** Label text for the radio button */
  label: string
  /** Whether this radio button is selected */
  selected?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Label position relative to the indicator */
  labelPosition?: RadioButtonLabelPosition
  /** Optional theme overrides */
  theme?: PartialTheme
  /** Callback when radio button is clicked */
  onClick?: () => void
}

/**
 * RadioButton component - displays a selectable circle with label
 * @param props - RadioButton properties
 * @returns RadioButton JSX element
 */
export function RadioButton(props: RadioButtonProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps(
    'RadioButton',
    localTheme,
    props.theme ?? {}
  )
  const size = themed.size ?? 18
  const innerSize = themed.innerSize ?? Math.max(6, Math.round(size * 0.45))
  const innerRadius = innerSize * 0.5
  const outerRadius = size * 0.5
  const borderWidth = themed.borderWidth ?? Math.max(2, Math.round(size * 0.11))
  const selected = props.selected ?? false
  const disabled = props.disabled ?? false
  const disabledAlpha = themed.disabledAlpha ?? 0.5
  const labelPosition = props.labelPosition ?? themed.labelPosition ?? 'right'
  const selectedColor = themed.selectedColor ?? 0x2196f3
  const idleColor = themed.color ?? 0x757575
  const activeColor = selected ? selectedColor : idleColor
  const indicatorFillColor = themed.backgroundColor
  const gap = themed.gap ?? 8
  const label =
    labelPosition !== 'none' ? (
      <Text text={props.label} style={themed.labelStyle} alpha={disabled ? disabledAlpha : 1} />
    ) : null

  const handleClick = () => {
    if (disabled) return
    props.onClick?.()
  }

  return (
    <View
      key={props.key}
      direction="row"
      alignItems="center"
      enableGestures={!disabled}
      onTouch={handleClick}
      theme={nestedTheme}
      gap={gap}
      alpha={disabled ? disabledAlpha : 1}
    >
      {labelPosition === 'left' && label}
      <View
        width={size}
        height={size}
        {...(indicatorFillColor !== undefined && { backgroundColor: indicatorFillColor })}
        borderColor={activeColor}
        borderWidth={borderWidth}
        alignItems="center"
        justifyContent="center"
        padding={0}
        cornerRadius={outerRadius}
      >
        <View
          width={innerSize}
          height={innerSize}
          backgroundColor={selectedColor}
          visible={selected}
          cornerRadius={innerRadius}
        />
      </View>

      {labelPosition !== 'left' && label}
    </View>
  )
}
