/** @jsxImportSource ../.. */
/**
 * PalettePicker component
 * Fixed color palette picker for theme colors, recent colors, and curated swatches.
 */
import type * as Phaser from 'phaser'
import type { ViewProps } from '..'
import { ensureContrast, normalizeColorNumber, numberToHex } from '../../colors'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View } from '../index'

export type PalettePickerColor = number | PalettePickerOption

export interface PalettePickerLabels {
  title?: string
  empty?: string
  formatHex?: (color: number) => string
}

export interface PalettePickerOption {
  /** Phaser color number. */
  value: number
  /** Optional label for custom renderers and accessibility-adjacent UI. */
  label?: string
  /** Disabled colors are shown but cannot be selected. */
  disabled?: boolean
}

export interface NormalizedPalettePickerOption extends PalettePickerOption {
  value: number
  hex: string
}

export interface PalettePickerSwatchRenderProps {
  option: NormalizedPalettePickerOption
  color: number
  hex: string
  selected: boolean
  disabled: boolean
  index: number
  size: number
  selectedBorderColor: number
  checkColor: number
}

export interface PalettePickerProps extends Omit<ViewProps, 'children'> {
  /** Palette colors as numbers or option objects. */
  colors: PalettePickerColor[]
  /** Current color in controlled mode. */
  value?: number
  /** Initial color in uncontrolled mode. */
  defaultValue?: number
  /** Called when a selectable color is selected. */
  onChange?: (color: number, option: NormalizedPalettePickerOption) => void
  /** Number of columns before wrapping into a new row. */
  columns?: number
  /** Swatch width and height in pixels. */
  swatchSize?: number
  /** Show title text from labels.title. */
  showTitle?: boolean
  /** Show hex text below each swatch. */
  showHex?: boolean
  /** Localized labels and formatters. */
  labels?: PalettePickerLabels
  /** Disabled state for the whole control. */
  disabled?: boolean
  /** Render custom swatch content. */
  renderSwatch?: (props: PalettePickerSwatchRenderProps) => ChildrenType
  /** Theme overrides. */
  theme?: PartialTheme
}

export interface PalettePickerThemeSlot extends ViewTheme {
  columns?: number
  swatchSize?: number
  swatchGap?: number
  rowGap?: number
  itemWidth?: ViewTheme['width']
  swatchCornerRadius?: ViewTheme['cornerRadius']
  swatchBorderColor?: number
  swatchBorderWidth?: number
  swatchSelectedBorderColor?: number
  swatchSelectedBorderWidth?: number
  swatchDisabledAlpha?: number
  selectedCheckColor?: number
  disabledAlpha?: number
  titleStyle?: Phaser.Types.GameObjects.Text.TextStyle
  emptyStyle?: Phaser.Types.GameObjects.Text.TextStyle
  hexStyle?: Phaser.Types.GameObjects.Text.TextStyle
  labels?: PalettePickerLabels
  showTitle?: boolean
  showHex?: boolean
}

const DEFAULT_LABELS: Required<Omit<PalettePickerLabels, 'formatHex'>> = {
  title: 'Palette',
  empty: 'No colors',
}

export function normalizePalettePickerColor(
  color: PalettePickerColor
): NormalizedPalettePickerOption {
  const option = typeof color === 'number' ? { value: color } : color
  const value = normalizeColorNumber(option.value)

  return {
    ...option,
    value,
    hex: numberToHex(value).toUpperCase(),
  }
}

export function normalizePalettePickerColors(
  colors: PalettePickerColor[]
): NormalizedPalettePickerOption[] {
  return colors.map(normalizePalettePickerColor)
}

export function resolvePalettePickerValue(
  colors: NormalizedPalettePickerOption[],
  value?: number,
  defaultValue?: number
): number | undefined {
  if (value !== undefined) {
    const normalizedValue = normalizeColorNumber(value)
    return colors.some((color) => color.value === normalizedValue) ? normalizedValue : undefined
  }

  if (defaultValue !== undefined) {
    const normalizedDefault = normalizeColorNumber(defaultValue)
    const defaultOption = colors.find((color) => color.value === normalizedDefault)
    if (defaultOption) return defaultOption.value
  }

  return colors.find((color) => !color.disabled)?.value ?? colors[0]?.value
}

export function chunkPalettePickerColors<T>(colors: T[], columns: number): T[][] {
  const safeColumns = Math.max(1, Math.floor(columns))
  const rows: T[][] = []

  for (let index = 0; index < colors.length; index += safeColumns) {
    rows.push(colors.slice(index, index + safeColumns))
  }

  return rows
}

export function getPalettePickerContrastColor(color: number, preferred = 0xffffff): number {
  return ensureContrast(preferred, color, 4.5)
}

function getSelectable(option: NormalizedPalettePickerOption, disabled: boolean): boolean {
  return !disabled && !option.disabled
}

/**
 * PalettePicker component
 */
export function PalettePicker(props: PalettePickerProps): VNodeLike {
  const {
    colors,
    value,
    defaultValue,
    onChange,
    columns,
    swatchSize,
    showTitle,
    showHex,
    labels: labelOverrides,
    disabled = false,
    renderSwatch,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('PalettePicker', mergedLocalTheme, {})
  const themedPicker = themed as unknown as PalettePickerThemeSlot
  const normalizedColors = normalizePalettePickerColors(colors)
  const isControlled = value !== undefined
  const initialValue = resolvePalettePickerValue(normalizedColors, value, defaultValue)
  const [internalValue, setInternalValue] = useState<number | undefined>(initialValue)
  const currentValue = isControlled
    ? resolvePalettePickerValue(normalizedColors, value)
    : resolvePalettePickerValue(normalizedColors, internalValue)

  useEffect(() => {
    if (!isControlled && internalValue !== currentValue) {
      setInternalValue(currentValue)
    }
  }, [isControlled, internalValue, currentValue])

  const labels = {
    ...DEFAULT_LABELS,
    ...(themedPicker.labels ?? {}),
    ...(labelOverrides ?? {}),
  }
  const resolvedColumns = Math.max(1, Math.floor(columns ?? themedPicker.columns ?? 6))
  const resolvedSwatchSize = swatchSize ?? themedPicker.swatchSize ?? 28
  const resolvedShowTitle = showTitle ?? themedPicker.showTitle ?? true
  const resolvedShowHex = showHex ?? themedPicker.showHex ?? false
  const swatchGap = themedPicker.swatchGap ?? 8
  const rowGap = themedPicker.rowGap ?? swatchGap
  const itemWidth =
    themedPicker.itemWidth ??
    (resolvedShowHex ? Math.max(56, resolvedSwatchSize) : resolvedSwatchSize)
  const titleStyle = themedPicker.titleStyle ?? {
    color: '#ffffff',
    fontSize: '14px',
    fontStyle: 'bold',
  }
  const emptyStyle = themedPicker.emptyStyle ?? { color: '#9fb3c8', fontSize: '13px' }
  const hexStyle = themedPicker.hexStyle ?? { color: '#9fb3c8', fontSize: '11px' }
  const finalAlpha = disabled ? (themedPicker.disabledAlpha ?? 0.5) : alpha
  const rows = chunkPalettePickerColors(normalizedColors, resolvedColumns)

  const commitColor = (option: NormalizedPalettePickerOption) => {
    if (!getSelectable(option, disabled)) return

    if (!isControlled) {
      setInternalValue(option.value)
    }

    onChange?.(option.value, option)
  }

  const renderDefaultSwatch = (props: PalettePickerSwatchRenderProps) => (
    <View
      width={props.size}
      height={props.size}
      backgroundColor={props.color}
      borderColor={props.selected ? props.selectedBorderColor : themedPicker.swatchBorderColor}
      borderWidth={
        props.selected
          ? (themedPicker.swatchSelectedBorderWidth ?? 3)
          : (themedPicker.swatchBorderWidth ?? 1)
      }
      cornerRadius={themedPicker.swatchCornerRadius ?? 5}
      alignItems="center"
      justifyContent="center"
      alpha={props.disabled ? (themedPicker.swatchDisabledAlpha ?? 0.45) : 1}
      theme={nestedTheme}
    >
      {props.selected ? (
        <Graphics
          width={props.size}
          height={props.size}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.clear()
            g.lineStyle(Math.max(2, Math.round(props.size * 0.09)), props.checkColor, 1)
            g.beginPath()
            g.moveTo(props.size * 0.25, props.size * 0.52)
            g.lineTo(props.size * 0.43, props.size * 0.7)
            g.lineTo(props.size * 0.77, props.size * 0.3)
            g.strokePath()
          }}
        />
      ) : null}
    </View>
  )

  const renderOption = (option: NormalizedPalettePickerOption, index: number) => {
    const selected = currentValue === option.value
    const optionDisabled = disabled || !!option.disabled
    const selectable = getSelectable(option, disabled)
    const selectedBorderColor = ensureContrast(
      themedPicker.swatchSelectedBorderColor ?? 0xffffff,
      option.value,
      3
    )
    const checkColor = getPalettePickerContrastColor(
      option.value,
      themedPicker.selectedCheckColor ?? 0xffffff
    )
    const swatchProps: PalettePickerSwatchRenderProps = {
      option,
      color: option.value,
      hex: option.hex,
      selected,
      disabled: optionDisabled,
      index,
      size: resolvedSwatchSize,
      selectedBorderColor,
      checkColor,
    }
    const swatchContent = renderSwatch?.(swatchProps) ?? renderDefaultSwatch(swatchProps)
    const hexText = labels.formatHex?.(option.value) ?? option.hex

    return (
      <View
        key={`${option.value}-${index}`}
        width={itemWidth}
        alignItems="center"
        gap={4}
        enableGestures={selectable}
        {...(selectable ? { onTouch: () => commitColor(option) } : {})}
        theme={nestedTheme}
      >
        {swatchContent}
        {resolvedShowHex ? <Text text={hexText} style={hexStyle} /> : null}
      </View>
    )
  }

  return (
    <View
      {...viewProps}
      direction="column"
      gap={themedPicker.gap ?? 10}
      padding={themedPicker.padding ?? 0}
      {...(themedPicker.backgroundColor !== undefined
        ? { backgroundColor: themedPicker.backgroundColor }
        : {})}
      {...(themedPicker.backgroundAlpha !== undefined
        ? { backgroundAlpha: themedPicker.backgroundAlpha }
        : {})}
      {...(themedPicker.borderColor !== undefined ? { borderColor: themedPicker.borderColor } : {})}
      {...(themedPicker.borderWidth !== undefined ? { borderWidth: themedPicker.borderWidth } : {})}
      {...(themedPicker.cornerRadius !== undefined
        ? { cornerRadius: themedPicker.cornerRadius }
        : {})}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {resolvedShowTitle ? <Text text={labels.title} style={titleStyle} /> : null}

      {normalizedColors.length === 0 ? (
        <Text text={labels.empty} style={emptyStyle} />
      ) : (
        <View direction="column" gap={rowGap} theme={nestedTheme}>
          {rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} direction="row" gap={swatchGap} theme={nestedTheme}>
              {row.map((option, columnIndex) =>
                renderOption(option, rowIndex * resolvedColumns + columnIndex)
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
