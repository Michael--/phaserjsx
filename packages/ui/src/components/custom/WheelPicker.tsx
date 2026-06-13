/** @jsxImportSource ../.. */
/**
 * WheelPicker component — SwiftUI-style scrollable cylinder picker.
 * Items snap to center with no additional overlays — selected styling is text-only.
 */
import { useEffect, useMemo, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View, type ViewProps } from '../index'
import { ScrollView } from './ScrollView'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WheelPickerLabels {
  empty?: string
}

export type WheelPickerSize = 'small' | 'medium' | 'large'

export interface WheelPickerItem {
  value: string
  label: string
  disabled?: boolean
}

export interface WheelPickerItemRenderProps {
  item: WheelPickerItem
  selected: boolean
  disabled: boolean
  index: number
  distanceFromCenter: number // 0 = center, 1 = far edge
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

export interface WheelPickerThemeSlot extends ViewTheme {
  size?: WheelPickerSize
  itemHeight?: number
  visibleItems?: number
  itemPadding?: ViewTheme['padding']
  textColor?: string
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  selectedTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  disabledTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  overlayAlpha?: number
  disabledAlpha?: number
  labels?: WheelPickerLabels
}

export interface WheelPickerProps extends Omit<ViewProps, 'children'> {
  /** Available items. */
  items: WheelPickerItem[]
  /** Selected value in controlled mode. */
  value?: string
  /** Initial selected value in uncontrolled mode. */
  defaultValue?: string
  /** Called when the snapped item changes. */
  onChange?: (value: string) => void
  /** Number of items visible at once (odd numbers look best: 3, 5, 7). */
  visibleItems?: number
  /** Size preset controlling item height and text sizing. */
  size?: WheelPickerSize
  /** Loop items infinitely. */
  loop?: boolean
  /** Render custom item content. */
  renderItem?: (props: WheelPickerItemRenderProps) => ChildrenType
  /** Localized labels. */
  labels?: WheelPickerLabels
  /** Disabled state. */
  disabled?: boolean
  /** Theme overrides. */
  theme?: PartialTheme
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findWheelPickerItem(
  items: WheelPickerItem[],
  value: string | undefined
): WheelPickerItem | undefined {
  if (value === undefined) return undefined
  return items.find((i) => i.value === value)
}

function mergeTextStyle(
  ...styles: Array<Phaser.Types.GameObjects.Text.TextStyle | undefined>
): Phaser.Types.GameObjects.Text.TextStyle | undefined {
  const merged = Object.assign({}, ...styles.filter(Boolean))
  return Object.keys(merged).length > 0 ? merged : undefined
}

function getSizeConfig(size: WheelPickerSize): {
  itemHeight: number
  textFontSize: string
  selectedTextFontSize: string
} {
  switch (size) {
    case 'small':
      return { itemHeight: 30, textFontSize: '13px', selectedTextFontSize: '14px' }
    case 'large':
      return { itemHeight: 52, textFontSize: '20px', selectedTextFontSize: '22px' }
    default:
      return { itemHeight: 40, textFontSize: '16px', selectedTextFontSize: '18px' }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * WheelPicker — scrollable snap-to-center picker with fade edges.
 */
export function WheelPicker(props: WheelPickerProps): VNodeLike {
  const {
    items,
    value,
    defaultValue,
    onChange,
    visibleItems = 5,
    size,
    renderItem,
    labels: labelOverrides,
    disabled = false,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('WheelPicker', mergedLocalTheme, {})
  const themedControl = themed as unknown as WheelPickerThemeSlot

  const resolvedSize = size ?? themedControl.size ?? 'medium'
  const sizeConfig = getSizeConfig(resolvedSize)
  const itemHeight = themedControl.itemHeight ?? sizeConfig.itemHeight
  const containerHeight = visibleItems * itemHeight
  const halfVisible = Math.floor(visibleItems / 2)

  // Controlled / uncontrolled
  const isControlled = value !== undefined
  const initialValue = value ?? defaultValue ?? items[0]?.value ?? ''
  const [internalValue, setInternalValue] = useState(initialValue)

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value ?? '')
    }
  }, [isControlled, value])

  const currentValue = isControlled ? (value ?? '') : internalValue

  const labels = { ...(themedControl.labels ?? {}), ...(labelOverrides ?? {}) }

  // Text style — from theme, no hardcoded colors
  const textStyle = mergeTextStyle(
    {
      fontSize: sizeConfig.textFontSize,
      ...(themedControl.textColor ? { color: themedControl.textColor } : {}),
    },
    themedControl.textStyle
  )
  const selectedTextStyle = textStyle
  const disabledTextStyle = mergeTextStyle(textStyle, themedControl.disabledTextStyle)

  // Calculate snap positions — each item center position in the scroll content
  // We pad top/bottom with empty space so the first/last item can reach center
  const topPad = halfVisible * itemHeight
  const snapPositions = useMemo(
    () => items.map((_, i) => topPad + i * itemHeight),
    [items, topPad, itemHeight]
  )

  const initialSnapIndex = useMemo(
    () => items.findIndex((i) => i.value === initialValue),
    [items, initialValue]
  )
  const hasInitialSnapRef = useRef(false)
  const currentSnapIndex = useMemo(
    () => items.findIndex((i) => i.value === currentValue),
    [items, currentValue]
  )
  const lastControlledValueRef = useRef<string | undefined>(isControlled ? currentValue : undefined)

  // Programmatic scroll target (tap-to-center). Reset after ScrollView consumes it.
  const [pendingSnapIndex, setPendingSnapIndex] = useState<number | undefined>(undefined)
  const scrollTarget = useMemo(() => {
    if (pendingSnapIndex !== undefined) {
      return { snapIndex: pendingSnapIndex }
    }
    if (!hasInitialSnapRef.current) {
      hasInitialSnapRef.current = true
      return { snapIndex: initialSnapIndex >= 0 ? initialSnapIndex : 0 }
    }
    if (isControlled && currentValue !== lastControlledValueRef.current) {
      lastControlledValueRef.current = currentValue
      return { snapIndex: currentSnapIndex >= 0 ? currentSnapIndex : 0 }
    }
    lastControlledValueRef.current = isControlled ? currentValue : undefined
    return undefined
  }, [pendingSnapIndex, initialSnapIndex, isControlled, currentValue, currentSnapIndex])

  const commitValue = (nextValue: string, scrollToIndex?: number) => {
    const item = findWheelPickerItem(items, nextValue)
    if (!item || item.disabled || disabled) return

    if (scrollToIndex !== undefined) {
      setPendingSnapIndex(scrollToIndex)
    }

    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const handleSnap = (index: number) => {
    // ScrollView has landed on this index — clear any pending programmatic scroll
    setPendingSnapIndex(undefined)
    const item = items[index]
    if (item && !item.disabled && !disabled) {
      if (!isControlled) {
        setInternalValue(item.value)
      }
      onChange?.(item.value)
    }
  }

  // Render items
  const renderPickerItem = (item: WheelPickerItem, index: number) => {
    const selected = item.value === currentValue
    const itemDisabled = disabled || !!item.disabled
    const effectiveStyle = itemDisabled
      ? disabledTextStyle
      : selected
        ? selectedTextStyle
        : textStyle

    const content = renderItem?.({
      item,
      selected,
      disabled: itemDisabled,
      index,
      distanceFromCenter: 0, // Will be inaccurate in static render; dynamic alpha is done via overlays
      ...(effectiveStyle ? { textStyle: effectiveStyle } : {}),
    })

    return (
      <View
        key={item.value}
        width="fill"
        height={itemHeight}
        direction="row"
        alignItems="center"
        justifyContent="center"
        padding={themedControl.itemPadding}
        enableGestures={!itemDisabled}
        onTouch={() => commitValue(item.value, index)}
      >
        {content ?? (
          <Text text={item.label} {...(effectiveStyle ? { style: effectiveStyle } : {})} />
        )}
      </View>
    )
  }

  const finalAlpha = disabled ? (themedControl.disabledAlpha ?? 0.5) : alpha
  const emptyLabel = labels.empty ?? 'No items'

  return (
    <View
      width={viewProps.width ?? 'fill'}
      height={containerHeight}
      overflow="hidden"
      cornerRadius={themedControl.cornerRadius ?? 8}
      backgroundColor={themedControl.backgroundColor}
      backgroundAlpha={themedControl.backgroundAlpha}
      borderColor={themedControl.borderColor}
      borderWidth={themedControl.borderWidth}
      direction="stack"
      {...viewProps}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {items.length === 0 ? (
        <View width="fill" height="fill" alignItems="center" justifyContent="center">
          <Text text={emptyLabel} style={textStyle} />
        </View>
      ) : (
        <>
          <ScrollView
            width="fill"
            height="fill"
            showVerticalSlider={false}
            showHorizontalSlider={false}
            momentum
            snap={{ positions: snapPositions, threshold: itemHeight }}
            snapAlignment="center"
            {...(scrollTarget ? { scroll: scrollTarget } : {})}
            onSnap={handleSnap}
            theme={nestedTheme}
          >
            <View width="fill" height={topPad} />
            <View direction="column" width="fill" theme={nestedTheme}>
              {items.map(renderPickerItem)}
            </View>
            <View width="fill" height={topPad} />
          </ScrollView>

          {/* Stationary overlay mask: blocks top and bottom, center is transparent */}
          <View
            width="fill"
            height={halfVisible * itemHeight}
            backgroundColor={themedControl.backgroundColor ?? 0x000000}
            backgroundAlpha={themedControl.overlayAlpha ?? 0.85}
            y={0}
          />
          <View
            width="fill"
            height={halfVisible * itemHeight}
            backgroundColor={themedControl.backgroundColor ?? 0x000000}
            backgroundAlpha={themedControl.overlayAlpha ?? 0.85}
            y={containerHeight - halfVisible * itemHeight}
          />
        </>
      )}
    </View>
  )
}
