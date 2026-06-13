/** @jsxImportSource ../.. */
/**
 * SegmentedControl component
 * Compact single-selection control for short mode, filter, and toolbar choices.
 */
import type { ViewProps } from '..'
import { compactControlSizePresets } from '../../design-tokens/component-size-presets'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'

export type SegmentedControlOrientation = 'horizontal' | 'vertical'
export type SegmentedControlSize = 'small' | 'medium' | 'large'
export type SegmentedControlVariant = 'solid' | 'soft' | 'outline'
export type SegmentedControlLabelPosition = 'left' | 'top' | 'none'

export interface SegmentedControlLabels {
  /** Optional visible group label. */
  group?: string
}

export interface SegmentedControlOption {
  /** Unique option value. */
  value: string
  /** Visible text for this segment. Falls back to value when no icon/children are provided. */
  label?: string
  /** Optional leading icon or glyph content. */
  icon?: ChildrenType
  /** Full custom segment content. Takes precedence over icon and label. */
  children?: ChildrenType
  /** Disabled options cannot be selected. */
  disabled?: boolean
}

export interface SegmentedControlOptionRenderProps {
  option: SegmentedControlOption
  selected: boolean
  disabled: boolean
  hovered: boolean
  index: number
  size: SegmentedControlSize
  variant: SegmentedControlVariant
  orientation: SegmentedControlOrientation
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconSize?: number
}

export interface SegmentedControlThemeSlot extends ViewTheme {
  orientation?: SegmentedControlOrientation
  size?: SegmentedControlSize
  variant?: SegmentedControlVariant
  segmentWidth?: ViewTheme['width']
  segmentHeight?: ViewTheme['height']
  segmentGap?: number
  segmentPadding?: ViewTheme['padding']
  segmentCornerRadius?: ViewTheme['cornerRadius']
  segmentStyle?: ViewTheme
  segmentHoverStyle?: ViewTheme
  segmentSelectedStyle?: ViewTheme
  segmentDisabledStyle?: ViewTheme
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  selectedTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  disabledTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconGap?: number
  iconSize?: number
  disabledAlpha?: number
  labelPosition?: SegmentedControlLabelPosition
  labels?: SegmentedControlLabels
}

export interface SegmentedControlProps extends Omit<ViewProps, 'children'> {
  /** Available segments. */
  options: SegmentedControlOption[]
  /** Selected value in controlled mode. */
  value?: string
  /** Initial selected value in uncontrolled mode. */
  defaultValue?: string
  /** Called when a selectable segment is selected. */
  onChange?: (value: string) => void
  /** Layout orientation. */
  orientation?: SegmentedControlOrientation
  /** Size preset. */
  size?: SegmentedControlSize
  /** Visual variant. */
  variant?: SegmentedControlVariant
  /** Optional visible group label. Takes precedence over labels.group. */
  label?: string
  /** Position of the optional visible group label. */
  labelPosition?: SegmentedControlLabelPosition
  /** Localized labels. */
  labels?: SegmentedControlLabels
  /** Disabled state for the whole control. */
  disabled?: boolean
  /** Fixed segment width. */
  segmentWidth?: ViewProps['width']
  /** Fixed segment height. */
  segmentHeight?: ViewProps['height']
  /** Render custom segment content. */
  renderOption?: (props: SegmentedControlOptionRenderProps) => ChildrenType
  /** Theme overrides. */
  theme?: PartialTheme
}

export function findSegmentedControlOption(
  options: SegmentedControlOption[],
  value: string | undefined
): SegmentedControlOption | undefined {
  if (value === undefined) return undefined
  return options.find((option) => option.value === value)
}

export function resolveSegmentedControlValue(
  options: SegmentedControlOption[],
  value?: string,
  defaultValue?: string
): string {
  if (value !== undefined) {
    return findSegmentedControlOption(options, value)?.value ?? ''
  }

  const defaultOption = findSegmentedControlOption(options, defaultValue)
  if (defaultOption) return defaultOption.value

  return options.find((option) => !option.disabled)?.value ?? options[0]?.value ?? ''
}

export function isSegmentedControlOptionSelectable(
  option: SegmentedControlOption,
  currentValue: string,
  disabled = false
): boolean {
  return !disabled && !option.disabled && option.value !== currentValue
}

function mergeViewTheme(...themes: Array<ViewTheme | undefined>): ViewTheme {
  return Object.assign({}, ...themes.filter(Boolean))
}

function mergeTextStyle(
  ...styles: Array<Phaser.Types.GameObjects.Text.TextStyle | undefined>
): Phaser.Types.GameObjects.Text.TextStyle | undefined {
  const merged = Object.assign({}, ...styles.filter(Boolean))
  return Object.keys(merged).length > 0 ? merged : undefined
}

function omitSegmentedControlThemeProps(theme: SegmentedControlThemeSlot): ViewTheme {
  const {
    orientation: _orientation,
    size: _size,
    variant: _variant,
    segmentWidth: _segmentWidth,
    segmentHeight: _segmentHeight,
    segmentGap: _segmentGap,
    segmentPadding: _segmentPadding,
    segmentCornerRadius: _segmentCornerRadius,
    segmentStyle: _segmentStyle,
    segmentHoverStyle: _segmentHoverStyle,
    segmentSelectedStyle: _segmentSelectedStyle,
    segmentDisabledStyle: _segmentDisabledStyle,
    textStyle: _textStyle,
    selectedTextStyle: _selectedTextStyle,
    disabledTextStyle: _disabledTextStyle,
    labelStyle: _labelStyle,
    iconGap: _iconGap,
    iconSize: _iconSize,
    disabledAlpha: _disabledAlpha,
    labelPosition: _labelPosition,
    labels: _labels,
    ...viewTheme
  } = theme

  return viewTheme
}

function getSegmentedControlSizeTheme(
  size: SegmentedControlSize
): Pick<
  SegmentedControlThemeSlot,
  'segmentWidth' | 'segmentHeight' | 'segmentPadding' | 'textStyle' | 'iconSize'
> {
  const { sm, lg } = compactControlSizePresets
  switch (size) {
    case 'small':
      return {
        segmentWidth: 72,
        segmentHeight: sm.height,
        segmentPadding: {
          left: sm.paddingH,
          right: sm.paddingH,
          top: sm.paddingV,
          bottom: sm.paddingV,
        },
        iconSize: sm.iconSize,
        textStyle: { fontSize: '12px' },
      }
    case 'large':
      return {
        segmentWidth: 108,
        segmentHeight: lg.height,
        segmentPadding: {
          left: lg.paddingH,
          right: lg.paddingH,
          top: lg.paddingV,
          bottom: lg.paddingV,
        },
        iconSize: lg.iconSize,
        textStyle: { fontSize: '16px' },
      }
    default:
      return {}
  }
}

function getSegmentedControlVariantTheme(
  variant: SegmentedControlVariant
): Pick<
  SegmentedControlThemeSlot,
  | 'backgroundColor'
  | 'backgroundAlpha'
  | 'borderColor'
  | 'borderWidth'
  | 'segmentStyle'
  | 'segmentHoverStyle'
  | 'segmentSelectedStyle'
  | 'textStyle'
  | 'selectedTextStyle'
> {
  switch (variant) {
    case 'soft':
      return {
        backgroundColor: 0x0f172a,
        backgroundAlpha: 0.78,
        borderColor: 0x334155,
        segmentStyle: {
          backgroundColor: 0x1e293b,
          backgroundAlpha: 0,
          borderWidth: 0,
        },
        segmentHoverStyle: {
          backgroundColor: 0x334155,
          backgroundAlpha: 0.7,
        },
        segmentSelectedStyle: {
          backgroundColor: 0x334155,
          backgroundAlpha: 1,
          borderColor: 0x64748b,
          borderWidth: 1,
        },
        textStyle: {
          color: '#cbd5e1',
        },
        selectedTextStyle: {
          color: '#ffffff',
          fontStyle: 'bold',
        },
      }
    case 'outline':
      return {
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        borderColor: 0x60a5fa,
        borderWidth: 1,
        segmentStyle: {
          backgroundColor: 0x000000,
          backgroundAlpha: 0,
          borderColor: 0x60a5fa,
          borderWidth: 0,
        },
        segmentHoverStyle: {
          backgroundColor: 0x1d4ed8,
          backgroundAlpha: 0.12,
        },
        segmentSelectedStyle: {
          backgroundColor: 0x1d4ed8,
          backgroundAlpha: 0.2,
          borderColor: 0x93c5fd,
          borderWidth: 1,
        },
        textStyle: {
          color: '#bfdbfe',
        },
        selectedTextStyle: {
          color: '#ffffff',
          fontStyle: 'bold',
        },
      }
    default:
      return {}
  }
}

/**
 * SegmentedControl component
 */
export function SegmentedControl(props: SegmentedControlProps): VNodeLike {
  const {
    options,
    value,
    defaultValue,
    onChange,
    orientation,
    size,
    variant,
    label,
    labelPosition,
    labels: labelOverrides,
    disabled = false,
    segmentWidth,
    segmentHeight,
    renderOption,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('SegmentedControl', mergedLocalTheme, {})
  const themedControl = themed as unknown as SegmentedControlThemeSlot
  const isControlled = value !== undefined
  const initialValue = resolveSegmentedControlValue(options, value, defaultValue)
  const [internalValue, setInternalValue] = useState(initialValue)
  const [hoveredValue, setHoveredValue] = useState<string | undefined>(undefined)
  const currentValue = isControlled
    ? resolveSegmentedControlValue(options, value)
    : resolveSegmentedControlValue(options, internalValue)

  useEffect(() => {
    if (!isControlled && internalValue !== currentValue) {
      setInternalValue(currentValue)
    }
  }, [isControlled, internalValue, currentValue])

  const labels = {
    ...(themedControl.labels ?? {}),
    ...(labelOverrides ?? {}),
  }
  const resolvedOrientation = orientation ?? themedControl.orientation ?? 'horizontal'
  const resolvedSize = size ?? themedControl.size ?? 'medium'
  const resolvedVariant = variant ?? themedControl.variant ?? 'solid'
  const sizeTheme = getSegmentedControlSizeTheme(resolvedSize)
  const variantTheme = getSegmentedControlVariantTheme(resolvedVariant)
  const resolvedLabelPosition = labelPosition ?? themedControl.labelPosition ?? 'none'
  const resolvedSegmentWidth = segmentWidth ?? sizeTheme.segmentWidth ?? themedControl.segmentWidth
  const resolvedSegmentHeight =
    segmentHeight ?? sizeTheme.segmentHeight ?? themedControl.segmentHeight
  const visibleLabel = label ?? labels.group
  const showLabel = resolvedLabelPosition !== 'none' && visibleLabel !== undefined
  const rootThemeProps = mergeViewTheme(
    omitSegmentedControlThemeProps(themedControl),
    omitSegmentedControlThemeProps(variantTheme)
  )
  const rootDirection = resolvedLabelPosition === 'left' ? 'row' : 'column'
  const segmentDirection = resolvedOrientation === 'horizontal' ? 'row' : 'column'
  const segmentGap = themedControl.segmentGap ?? 0
  const textStyle = mergeTextStyle(
    { color: '#dbeafe', fontSize: '13px' },
    themedControl.textStyle,
    variantTheme.textStyle,
    sizeTheme.textStyle
  )
  const selectedTextStyle = mergeTextStyle(
    textStyle,
    themedControl.selectedTextStyle,
    variantTheme.selectedTextStyle
  )
  const disabledTextStyle = mergeTextStyle(textStyle, themedControl.disabledTextStyle)
  const labelStyle = themedControl.labelStyle ?? { color: '#9fb3c8', fontSize: '13px' }
  const finalAlpha = disabled ? (themedControl.disabledAlpha ?? 0.5) : alpha

  const commitValue = (nextValue: string) => {
    const option = findSegmentedControlOption(options, nextValue)
    if (!option || !isSegmentedControlOptionSelectable(option, currentValue, disabled)) return

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  const renderSegment = (option: SegmentedControlOption, index: number) => {
    const selected = option.value === currentValue
    const optionDisabled = disabled || !!option.disabled
    const hovered = hoveredValue === option.value
    const selectable = isSegmentedControlOptionSelectable(option, currentValue, disabled)
    const generatedLabel = option.label ?? (option.icon ? undefined : option.value)
    const segmentStyle = mergeViewTheme(
      {
        height: resolvedSegmentHeight,
        width: resolvedSegmentWidth,
        padding: sizeTheme.segmentPadding ?? themedControl.segmentPadding,
        cornerRadius: themedControl.segmentCornerRadius,
      },
      themedControl.segmentStyle,
      variantTheme.segmentStyle,
      hovered && !selected && !optionDisabled ? themedControl.segmentHoverStyle : undefined,
      hovered && !selected && !optionDisabled ? variantTheme.segmentHoverStyle : undefined,
      selected ? themedControl.segmentSelectedStyle : undefined,
      selected ? variantTheme.segmentSelectedStyle : undefined,
      optionDisabled ? themedControl.segmentDisabledStyle : undefined
    )
    const effectiveTextStyle = optionDisabled
      ? disabledTextStyle
      : selected
        ? selectedTextStyle
        : textStyle
    const resolvedIconSize = sizeTheme.iconSize ?? themedControl.iconSize
    const contentTheme = mergeThemes(nestedTheme, {
      Text: effectiveTextStyle ? { style: effectiveTextStyle } : {},
      Icon: {
        ...(resolvedIconSize !== undefined ? { size: resolvedIconSize } : {}),
      },
    })
    const content =
      renderOption?.({
        option,
        selected,
        disabled: optionDisabled,
        hovered,
        index,
        size: resolvedSize,
        variant: resolvedVariant,
        orientation: resolvedOrientation,
        ...(effectiveTextStyle ? { textStyle: effectiveTextStyle } : {}),
        ...(resolvedIconSize !== undefined ? { iconSize: resolvedIconSize } : {}),
      }) ?? option.children
    const hoverHandlers =
      selectable && (themedControl.segmentHoverStyle || variantTheme.segmentHoverStyle)
        ? {
            onHoverStart: () => setHoveredValue(option.value),
            onHoverEnd: () =>
              setHoveredValue((current) => (current === option.value ? undefined : current)),
          }
        : {}

    return (
      <View
        key={option.value}
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={themedControl.iconGap ?? 6}
        {...segmentStyle}
        enableGestures={selectable}
        onTouch={() => commitValue(option.value)}
        {...hoverHandlers}
        theme={contentTheme}
      >
        {content ?? (
          <>
            {option.icon}
            {generatedLabel !== undefined ? (
              <Text
                text={generatedLabel}
                {...(effectiveTextStyle ? { style: effectiveTextStyle } : {})}
              />
            ) : null}
          </>
        )}
      </View>
    )
  }

  const control = (
    <View
      {...rootThemeProps}
      direction={segmentDirection}
      gap={segmentGap}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {options.map(renderSegment)}
    </View>
  )

  return (
    <View
      {...viewProps}
      direction={rootDirection}
      alignItems="center"
      gap={themedControl.gap ?? 8}
      theme={nestedTheme}
    >
      {showLabel ? <Text text={visibleLabel} style={labelStyle} /> : null}
      {control}
    </View>
  )
}
