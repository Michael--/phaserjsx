/** @jsxImportSource ../.. */
/**
 * NumberInput component
 * Numeric stepper control without free-form text entry.
 */
import type { ViewProps } from '..'
import type { GestureEventData } from '../../core-props'
import { useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'
import { Button, type ButtonSize, type ButtonVariant } from './Button'

export interface NumberInputLabels {
  /** Text used for the decrement button. */
  decrement?: string
  /** Text used for the increment button. */
  increment?: string
  /** Accessible/visible value label when label prop is omitted. */
  value?: string
}

export type NumberInputLabelPosition = 'left' | 'right' | 'top' | 'bottom' | 'none'
export type NumberInputButtonPlacement = 'split' | 'left' | 'right'
export type NumberInputButtonDirection = 'row' | 'column'

export interface NumberInputProps extends Omit<ViewProps, 'children'> {
  /** Current value in controlled mode. */
  value?: number
  /** Initial value in uncontrolled mode. */
  defaultValue?: number
  /** Callback fired when the value changes. */
  onChange?: (value: number) => void
  /** Minimum allowed value. */
  min?: number
  /** Maximum allowed value. */
  max?: number
  /** Step used by increment and decrement controls. */
  step?: number
  /** Decimal precision. Defaults to precision inferred from step. */
  precision?: number
  /** Optional visible label. */
  label?: string
  /** Label placement relative to the numeric control. */
  labelPosition?: NumberInputLabelPosition
  /** Formatter for the displayed value. */
  formatValue?: (value: number) => string
  /** Localized button/value labels. */
  labels?: NumberInputLabels
  /** Custom decrement button content. Children take precedence over labels.decrement. */
  decrementContent?: ChildrenType
  /** Custom increment button content. Children take precedence over labels.increment. */
  incrementContent?: ChildrenType
  /** Disable all interactions. */
  disabled?: boolean
  /** Placement of the decrement/increment buttons around the value display. */
  buttonPlacement?: NumberInputButtonPlacement
  /** Direction used when both buttons are placed on one side. */
  buttonDirection?: NumberInputButtonDirection
  /** Variant forwarded to the internal Button controls. */
  buttonVariant?: ButtonVariant
  /** Size forwarded to the internal Button controls. */
  buttonSize?: ButtonSize
  /** Text style forwarded to generated button labels. */
  buttonTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  /** Enable repeated changes after a long press. */
  repeatOnHold?: boolean
  /** Delay before hold repeat starts in milliseconds. */
  holdDelay?: number
  /** Interval used while holding a button in milliseconds. */
  repeatInterval?: number
  /** Width of the displayed value area. */
  valueWidth?: number
  /** Height of the control row. */
  controlHeight?: number
  /** Theme overrides. */
  theme?: PartialTheme
}

export interface NumberInputValueOptions {
  min?: number
  max?: number
  step?: number
  precision?: number
}

const DEFAULT_LABELS: Required<NumberInputLabels> = {
  decrement: '-',
  increment: '+',
  value: 'Value',
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function getOrderedBounds(min?: number, max?: number): { min: number; max: number } {
  const resolvedMin = isFiniteNumber(min) ? min : -Infinity
  const resolvedMax = isFiniteNumber(max) ? max : Infinity

  return {
    min: Math.min(resolvedMin, resolvedMax),
    max: Math.max(resolvedMin, resolvedMax),
  }
}

function getDecimalPlaces(value: number): number {
  if (!Number.isFinite(value) || Number.isInteger(value)) return 0

  const [, decimals = ''] = value.toString().split('.')
  return decimals.length
}

export function getNumberInputPrecision(step = 1, precision?: number): number {
  if (isFiniteNumber(precision) && precision >= 0) {
    return Math.floor(precision)
  }

  return getDecimalPlaces(Math.abs(step))
}

export function normalizeNumberInputValue(
  value: number,
  options: NumberInputValueOptions = {}
): number {
  const { min, max } = getOrderedBounds(options.min, options.max)
  const fallback = Number.isFinite(min) ? min : Number.isFinite(max) ? max : 0
  const rawValue = isFiniteNumber(value) ? value : fallback
  const clamped = Math.max(min, Math.min(max, rawValue))
  const precision = getNumberInputPrecision(options.step, options.precision)
  const factor = 10 ** precision

  return Math.round(clamped * factor) / factor
}

export function getNextNumberInputValue(
  currentValue: number,
  direction: -1 | 1,
  options: NumberInputValueOptions = {}
): number {
  const step = isFiniteNumber(options.step) && options.step > 0 ? options.step : 1
  return normalizeNumberInputValue(currentValue + step * direction, options)
}

/**
 * NumberInput component
 * Displays a numeric value with decrement/increment controls.
 */
export function NumberInput(props: NumberInputProps): VNodeLike {
  const {
    value,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision,
    label,
    labelPosition,
    formatValue,
    labels: labelOverrides,
    decrementContent,
    incrementContent,
    disabled = false,
    buttonPlacement,
    buttonDirection,
    buttonVariant,
    buttonSize,
    buttonTextStyle,
    repeatOnHold,
    holdDelay,
    repeatInterval,
    valueWidth,
    controlHeight,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('NumberInput', mergedLocalTheme, {})

  const valueOptions: NumberInputValueOptions = {
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    step,
    ...(precision !== undefined ? { precision } : {}),
  }
  const initialValue = normalizeNumberInputValue(defaultValue ?? value ?? min ?? 0, valueOptions)
  const [internalValue, setInternalValue] = useState(initialValue)
  const currentValueRef = useRef(initialValue)
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isControlled = value !== undefined
  const currentValue = normalizeNumberInputValue(isControlled ? value : internalValue, valueOptions)
  currentValueRef.current = currentValue

  useEffect(() => {
    if (!isControlled && internalValue !== currentValue) {
      setInternalValue(currentValue)
    }
  }, [isControlled, internalValue, currentValue])

  useEffect(() => {
    return () => stopHoldRepeat()
  }, [])

  const labels = {
    ...DEFAULT_LABELS,
    ...(themed.labels ?? {}),
    ...(labelOverrides ?? {}),
  }

  const resolvedLabelPosition = labelPosition ?? themed.labelPosition ?? 'left'
  const resolvedButtonPlacement = buttonPlacement ?? themed.buttonPlacement ?? 'split'
  const resolvedButtonDirection = buttonDirection ?? themed.buttonDirection ?? 'row'
  const resolvedButtonVariant = buttonVariant ?? themed.buttonVariant ?? 'secondary'
  const resolvedButtonSize = buttonSize ?? themed.buttonSize ?? 'small'
  const resolvedButtonTextStyle = buttonTextStyle ??
    themed.buttonTextStyle ?? { color: '#111827', fontSize: '16px' }
  const resolvedRepeatOnHold = repeatOnHold ?? themed.repeatOnHold ?? true
  const resolvedHoldDelay = holdDelay ?? themed.holdDelay ?? 350
  const resolvedRepeatInterval = repeatInterval ?? themed.repeatInterval ?? 90
  const resolvedValueWidth = valueWidth ?? themed.valueWidth ?? 78
  const resolvedControlHeight = controlHeight ?? themed.controlHeight ?? 34
  const labelStyle = themed.labelStyle ?? { color: '#ffffff', fontSize: '14px' }
  const valueStyle = themed.valueStyle ?? { color: '#ffffff', fontSize: '14px' }
  const buttonControlSize = themed.buttonControlSize ?? resolvedControlHeight
  const displayText = formatValue?.(currentValue) ?? `${currentValue}`
  const visibleLabel = label ?? labels.value
  const showLabel = resolvedLabelPosition !== 'none' && visibleLabel.length > 0

  const decrementValue = getNextNumberInputValue(currentValue, -1, valueOptions)
  const incrementValue = getNextNumberInputValue(currentValue, 1, valueOptions)
  const canDecrement = decrementValue !== currentValue
  const canIncrement = incrementValue !== currentValue

  const commitValue = (nextValue: number) => {
    const normalized = normalizeNumberInputValue(nextValue, valueOptions)
    if (normalized === currentValueRef.current) return

    currentValueRef.current = normalized

    if (!isControlled) {
      setInternalValue(normalized)
    }

    onChange?.(normalized)
  }

  const commitStep = (direction: -1 | 1) => {
    commitValue(getNextNumberInputValue(currentValueRef.current, direction, valueOptions))
  }

  const stopHoldRepeat = () => {
    if (!holdIntervalRef.current) return
    clearInterval(holdIntervalRef.current)
    holdIntervalRef.current = null
  }

  const startHoldRepeat = (direction: -1 | 1) => {
    if (!resolvedRepeatOnHold || disabled) return

    stopHoldRepeat()
    commitStep(direction)
    holdIntervalRef.current = setInterval(() => {
      commitStep(direction)
    }, resolvedRepeatInterval)
  }

  const handleHoldMove = (event: GestureEventData) => {
    if (event.state === 'end') {
      stopHoldRepeat()
    }
  }

  const renderStepButton = (direction: -1 | 1) => {
    const isDecrement = direction === -1
    const canChange = isDecrement ? canDecrement : canIncrement
    const content = isDecrement ? decrementContent : incrementContent
    const text = isDecrement ? labels.decrement : labels.increment

    return (
      <Button
        key={isDecrement ? 'decrement' : 'increment'}
        label={content ? undefined : text}
        width={buttonControlSize}
        height={buttonControlSize}
        variant={resolvedButtonVariant}
        size={resolvedButtonSize}
        textStyle={resolvedButtonTextStyle}
        disabled={disabled || !canChange}
        onClick={() => commitStep(direction)}
        onLongPress={() => startHoldRepeat(direction)}
        onTouchMove={handleHoldMove}
        longPressDuration={resolvedHoldDelay}
      >
        {content}
      </Button>
    )
  }

  const stepButtons = (
    <View
      direction={resolvedButtonDirection}
      alignItems="center"
      gap={themed.buttonGap ?? themed.controlGap ?? 0}
      theme={nestedTheme}
    >
      {renderStepButton(-1)}
      {renderStepButton(1)}
    </View>
  )

  const valueDisplay = (
    <View
      width={resolvedValueWidth}
      height={resolvedControlHeight}
      alignItems="center"
      justifyContent="center"
      backgroundColor={themed.valueBackgroundColor ?? 0x000000}
      backgroundAlpha={themed.valueBackgroundAlpha ?? 0.12}
      borderColor={themed.valueBorderColor ?? themed.borderColor}
      borderWidth={themed.valueBorderWidth ?? 1}
      cornerRadius={themed.valueCornerRadius ?? themed.cornerRadius ?? 6}
      padding={themed.valuePadding ?? { left: 8, right: 8, top: 4, bottom: 4 }}
      theme={nestedTheme}
    >
      <Text text={displayText} style={valueStyle} />
    </View>
  )

  const control =
    resolvedButtonPlacement === 'left' ? (
      <View direction="row" alignItems="center" gap={themed.controlGap ?? 0} theme={nestedTheme}>
        {stepButtons}
        {valueDisplay}
      </View>
    ) : resolvedButtonPlacement === 'right' ? (
      <View direction="row" alignItems="center" gap={themed.controlGap ?? 0} theme={nestedTheme}>
        {valueDisplay}
        {stepButtons}
      </View>
    ) : (
      <View direction="row" alignItems="center" gap={themed.controlGap ?? 0} theme={nestedTheme}>
        {renderStepButton(-1)}
        {valueDisplay}
        {renderStepButton(1)}
      </View>
    )

  const labelNode = showLabel ? <Text text={visibleLabel} style={labelStyle} /> : null
  const isVertical = resolvedLabelPosition === 'top' || resolvedLabelPosition === 'bottom'
  const finalAlpha = disabled ? (themed.disabledAlpha ?? 0.5) : viewProps.alpha
  const content =
    resolvedLabelPosition === 'right' || resolvedLabelPosition === 'bottom' ? (
      <>
        {control}
        {labelNode}
      </>
    ) : (
      <>
        {labelNode}
        {control}
      </>
    )

  return (
    <View
      {...viewProps}
      direction={isVertical ? 'column' : 'row'}
      alignItems="center"
      gap={themed.gap ?? 10}
      padding={themed.padding ?? 0}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {content}
    </View>
  )
}
