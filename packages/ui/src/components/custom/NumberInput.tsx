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
import { Graphics, Text, View, type GraphicsProps } from '../index'
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
export type NumberInputButtonAction = 'decrement' | 'increment'
export type NumberInputIndicatorDirection = 'left' | 'right' | 'up' | 'down'
export type NumberInputIndicatorVariant = 'sign' | 'chevron'

export interface NumberInputButtonRenderProps {
  action: NumberInputButtonAction
  disabled: boolean
  value: number
  nextValue: number
  size: number
  color: number
  activeColor: number
}

export interface NumberInputValueRenderProps {
  value: number
  displayText: string
  min?: number
  max?: number
  step: number
  disabled: boolean
  canDecrement: boolean
  canIncrement: boolean
  valueWidth: number
  controlHeight: number
}

export interface NumberInputIndicatorProps extends Omit<
  GraphicsProps,
  'children' | 'dependencies' | 'onDraw'
> {
  /** Indicator variant. Sign draws minus/plus; chevron draws an arrow. */
  variant?: NumberInputIndicatorVariant
  /** NumberInput action. Used by the sign variant. */
  action?: NumberInputButtonAction
  /** Chevron direction. Defaults from action when omitted. */
  direction?: NumberInputIndicatorDirection
  /** Indicator square size. */
  size?: number
  /** Stroke and border color. */
  color?: number
  /** Optional active stroke color. */
  activeColor?: number
  /** Disabled visual state. */
  disabled?: boolean
  /** Draw a framed background behind the glyph. */
  framed?: boolean
  /** Alpha applied to the framed background. */
  backgroundAlpha?: number
  /** Alpha applied to the frame border. */
  borderAlpha?: number
}

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
  /** Render custom value content while preserving the NumberInput value frame. */
  renderValue?: (props: NumberInputValueRenderProps) => ChildrenType
  /** Localized button/value labels. */
  labels?: NumberInputLabels
  /** Custom decrement button content. Children take precedence over labels.decrement. */
  decrementContent?: ChildrenType
  /** Custom increment button content. Children take precedence over labels.increment. */
  incrementContent?: ChildrenType
  /** Render step button content with action, disabled state, size, and theme colors. */
  renderButtonContent?: (props: NumberInputButtonRenderProps) => ChildrenType
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
  /** Color passed to renderButtonContent and NumberInputIndicator examples. */
  buttonIndicatorColor?: number
  /** Active color passed to renderButtonContent and NumberInputIndicator examples. */
  buttonIndicatorActiveColor?: number
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

function getDefaultIndicatorDirection(
  action: NumberInputButtonAction
): NumberInputIndicatorDirection {
  return action === 'decrement' ? 'left' : 'right'
}

function drawChevronPath(
  g: Phaser.GameObjects.Graphics,
  direction: NumberInputIndicatorDirection,
  size: number
): void {
  const center = size / 2
  const inset = size * 0.32
  const outer = size * 0.68
  const start = size * 0.3
  const end = size * 0.7

  g.beginPath()

  if (direction === 'left') {
    g.moveTo(outer, start)
    g.lineTo(inset, center)
    g.lineTo(outer, end)
  } else if (direction === 'right') {
    g.moveTo(inset, start)
    g.lineTo(outer, center)
    g.lineTo(inset, end)
  } else if (direction === 'up') {
    g.moveTo(start, outer)
    g.lineTo(center, inset)
    g.lineTo(end, outer)
  } else {
    g.moveTo(start, inset)
    g.lineTo(center, outer)
    g.lineTo(end, inset)
  }

  g.strokePath()
}

function drawSignPath(
  g: Phaser.GameObjects.Graphics,
  action: NumberInputButtonAction,
  size: number
): void {
  const center = size / 2
  const lineStart = size * 0.3
  const lineEnd = size * 0.7

  g.beginPath()
  g.moveTo(lineStart, center)
  g.lineTo(lineEnd, center)
  g.strokePath()

  if (action === 'increment') {
    g.beginPath()
    g.moveTo(center, lineStart)
    g.lineTo(center, lineEnd)
    g.strokePath()
  }
}

/**
 * NumberInputIndicator component
 * Small Graphics-based sign or chevron indicator for NumberInput buttons.
 */
export function NumberInputIndicator(props: NumberInputIndicatorProps): VNodeLike {
  const {
    variant = 'sign',
    action = 'increment',
    direction,
    size = 24,
    color = 0xffffff,
    activeColor = color,
    disabled = false,
    framed = false,
    backgroundAlpha = 0.12,
    borderAlpha = 1,
    ...viewProps
  } = props

  const resolvedDirection = direction ?? getDefaultIndicatorDirection(action)

  return (
    <Graphics
      {...viewProps}
      width={size}
      height={size}
      dependencies={[
        variant,
        action,
        resolvedDirection,
        size,
        color,
        activeColor,
        disabled,
        framed,
        backgroundAlpha,
        borderAlpha,
      ]}
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        const alpha = disabled ? 0.45 : 1
        const inset = Math.max(3, Math.round(size * 0.16))
        const stroke = Math.max(2, Math.round(size * 0.12))
        const iconColor = disabled ? color : activeColor

        g.clear()

        if (framed) {
          g.fillStyle(iconColor, backgroundAlpha * alpha)
          g.lineStyle(2, iconColor, borderAlpha * alpha)
          g.fillRoundedRect(inset, inset, size - inset * 2, size - inset * 2, size * 0.18)
          g.strokeRoundedRect(inset, inset, size - inset * 2, size - inset * 2, size * 0.18)
        }

        g.lineStyle(stroke, iconColor, alpha)

        if (variant === 'chevron') {
          drawChevronPath(g, resolvedDirection, size)
        } else {
          drawSignPath(g, action, size)
        }
      }}
    />
  )
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
    renderValue,
    labels: labelOverrides,
    decrementContent,
    incrementContent,
    renderButtonContent,
    disabled = false,
    buttonPlacement,
    buttonDirection,
    buttonVariant,
    buttonSize,
    buttonTextStyle,
    buttonIndicatorColor,
    buttonIndicatorActiveColor,
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
  const resolvedButtonIndicatorColor =
    buttonIndicatorColor ?? themed.buttonIndicatorColor ?? 0xffffff
  const resolvedButtonIndicatorActiveColor =
    buttonIndicatorActiveColor ?? themed.buttonIndicatorActiveColor ?? resolvedButtonIndicatorColor
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
  const valueContent = renderValue?.({
    value: currentValue,
    displayText,
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    step,
    disabled,
    canDecrement,
    canIncrement,
    valueWidth: resolvedValueWidth,
    controlHeight: resolvedControlHeight,
  })

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

  const renderStepButton = (stepDirection: -1 | 1) => {
    const isDecrement = stepDirection === -1
    const action: NumberInputButtonAction = isDecrement ? 'decrement' : 'increment'
    const canChange = isDecrement ? canDecrement : canIncrement
    const content = isDecrement ? decrementContent : incrementContent
    const text = isDecrement ? labels.decrement : labels.increment
    const nextValue = isDecrement ? decrementValue : incrementValue
    const isButtonDisabled = disabled || !canChange
    const renderedContent =
      content ??
      renderButtonContent?.({
        action,
        disabled: isButtonDisabled,
        value: currentValue,
        nextValue,
        size: buttonControlSize,
        color: resolvedButtonIndicatorColor,
        activeColor: resolvedButtonIndicatorActiveColor,
      })

    return (
      <Button
        key={isDecrement ? 'decrement' : 'increment'}
        label={renderedContent ? undefined : text}
        width={buttonControlSize}
        height={buttonControlSize}
        variant={resolvedButtonVariant}
        size={resolvedButtonSize}
        textStyle={resolvedButtonTextStyle}
        disabled={isButtonDisabled}
        onClick={() => commitStep(stepDirection)}
        onLongPress={() => startHoldRepeat(stepDirection)}
        onTouchMove={handleHoldMove}
        longPressDuration={resolvedHoldDelay}
      >
        {renderedContent}
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
      {valueContent ?? <Text text={displayText} style={valueStyle} />}
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
