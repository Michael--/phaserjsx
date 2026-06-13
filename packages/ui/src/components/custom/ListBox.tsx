/** @jsxImportSource ../.. */
/**
 * ListBox component — scrollable single-selection list with hover states.
 * Keyboard navigation is deferred until a focus-management system is in place.
 */
import type { ViewProps } from '..'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'
import { ScrollView } from './ScrollView'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ListBoxLabels {
  empty?: string
}

export interface ListBoxItem {
  /** Unique item value used for selection. */
  value: string
  /** Visible label. Falls back to value when no children/renderItem provided. */
  label?: string
  /** Disabled items cannot be selected. */
  disabled?: boolean
}

export interface ListBoxItemRenderProps {
  item: ListBoxItem
  selected: boolean
  disabled: boolean
  hovered: boolean
  index: number
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

export interface ListBoxThemeSlot extends ViewTheme {
  itemHeight?: number
  itemGap?: number
  itemPadding?: ViewTheme['padding']
  itemCornerRadius?: number
  itemStyle?: ViewTheme
  itemHoverStyle?: ViewTheme
  itemSelectedStyle?: ViewTheme
  itemDisabledStyle?: ViewTheme
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  selectedTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  disabledTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  emptyStyle?: Phaser.Types.GameObjects.Text.TextStyle
  disabledAlpha?: number
  labels?: ListBoxLabels
}

export interface ListBoxProps extends Omit<ViewProps, 'children'> {
  /** Available items. */
  items: ListBoxItem[]
  /** Selected value in controlled mode. */
  value?: string
  /** Initial selected value in uncontrolled mode. */
  defaultValue?: string
  /** Called when a selectable item is selected. */
  onChange?: (value: string) => void
  /** Render custom item content. */
  renderItem?: (props: ListBoxItemRenderProps) => ChildrenType
  /** Enable hover state tracking and hover styling. Default true. */
  hoverable?: boolean
  /** Localized labels. */
  labels?: ListBoxLabels
  /** Disabled state for the whole control. */
  disabled?: boolean
  /** Maximum visible items before scrolling. If unset, the list grows to fit. */
  maxVisibleItems?: number
  /** Theme overrides. */
  theme?: PartialTheme
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Finds an item by its value in the items array.
 */
export function findListBoxItem(
  items: ListBoxItem[],
  value: string | undefined
): ListBoxItem | undefined {
  if (value === undefined) return undefined
  return items.find((item) => item.value === value)
}

/**
 * Resolves the effective value considering controlled/uncontrolled mode and disabled items.
 */
export function resolveListBoxValue(
  items: ListBoxItem[],
  value?: string,
  defaultValue?: string
): string {
  if (value !== undefined) {
    return findListBoxItem(items, value)?.value ?? ''
  }

  const defaultItem = findListBoxItem(items, defaultValue)
  if (defaultItem) return defaultItem.value

  return items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? ''
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

function omitListBoxThemeProps(theme: ListBoxThemeSlot): ViewTheme {
  const {
    itemHeight: _ih,
    itemGap: _ig,
    itemPadding: _ip,
    itemCornerRadius: _icr,
    itemStyle: _is,
    itemHoverStyle: _ihs,
    itemSelectedStyle: _iss,
    itemDisabledStyle: _ids,
    textStyle: _ts,
    selectedTextStyle: _sts,
    disabledTextStyle: _dts,
    emptyStyle: _es,
    disabledAlpha: _da,
    labels: _l,
    ...viewTheme
  } = theme
  return viewTheme
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ListBox — scrollable single-selection list.
 */
export function ListBox(props: ListBoxProps): VNodeLike {
  const {
    items,
    value,
    defaultValue,
    onChange,
    renderItem,
    hoverable = true,
    labels: labelOverrides,
    disabled = false,
    maxVisibleItems,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('ListBox', mergedLocalTheme, {})
  const themedControl = themed as unknown as ListBoxThemeSlot
  const [hoveredValue, setHoveredValue] = useState<string | undefined>(undefined)

  const isControlled = value !== undefined
  const initialValue = resolveListBoxValue(items, value, defaultValue)
  const [internalValue, setInternalValue] = useState(initialValue)
  const currentValue = isControlled
    ? resolveListBoxValue(items, value)
    : resolveListBoxValue(items, internalValue)

  useEffect(() => {
    if (!isControlled && internalValue !== currentValue) {
      setInternalValue(currentValue)
    }
  }, [isControlled, internalValue, currentValue])

  const labels = {
    ...(themedControl.labels ?? {}),
    ...(labelOverrides ?? {}),
  }

  // ── Text styles ──────────────────────────────────────────────────────────

  const textStyle = mergeTextStyle({ color: '#e0e7ff', fontSize: '14px' }, themedControl.textStyle)
  const selectedTextStyle = mergeTextStyle(textStyle, themedControl.selectedTextStyle)
  const disabledTextStyle = mergeTextStyle(textStyle, themedControl.disabledTextStyle)
  const emptyStyle = themedControl.emptyStyle ?? { color: '#6b7280', fontSize: '14px' }
  const finalAlpha = disabled ? (themedControl.disabledAlpha ?? 0.5) : alpha

  // ── Commit value ─────────────────────────────────────────────────────────

  const commitValue = (nextValue: string) => {
    const item = findListBoxItem(items, nextValue)
    if (!item || item.disabled || disabled) return

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  // ── Item sizes ───────────────────────────────────────────────────────────

  const itemHeight = themedControl.itemHeight ?? 36
  const itemGap = themedControl.itemGap ?? 1
  const totalItemHeight = items.length * (itemHeight + itemGap) - (items.length > 0 ? itemGap : 0)
  const listHeight =
    maxVisibleItems && maxVisibleItems > 0
      ? Math.min(totalItemHeight, maxVisibleItems * (itemHeight + itemGap))
      : totalItemHeight

  // ── Render items ─────────────────────────────────────────────────────────

  const rootThemeProps = omitListBoxThemeProps(themedControl)

  const renderListItem = (item: ListBoxItem, index: number) => {
    const selected = item.value === currentValue
    const itemDisabled = disabled || !!item.disabled
    const hovered = hoverable ? hoveredValue === item.value : false
    const selectable = !itemDisabled

    const itemStyle = mergeViewTheme(
      { height: itemHeight },
      themedControl.itemStyle,
      hoverable && hovered && !selected && !itemDisabled ? themedControl.itemHoverStyle : undefined,
      selected ? themedControl.itemSelectedStyle : undefined,
      itemDisabled ? themedControl.itemDisabledStyle : undefined
    )

    const effectiveTextStyle = itemDisabled
      ? disabledTextStyle
      : selected
        ? selectedTextStyle
        : textStyle

    const contentTheme = mergeThemes(nestedTheme, {
      Text: effectiveTextStyle ? { style: effectiveTextStyle } : {},
    })

    const content = renderItem?.({
      item,
      selected,
      disabled: itemDisabled,
      hovered,
      index,
      ...(effectiveTextStyle ? { textStyle: effectiveTextStyle } : {}),
    })

    const hoverHandlers =
      hoverable && selectable && (themedControl.itemHoverStyle || themedControl.itemSelectedStyle)
        ? {
            onHoverStart: () => setHoveredValue(item.value),
            onHoverEnd: () =>
              setHoveredValue((current) => (current === item.value ? undefined : current)),
          }
        : {}

    return (
      <View
        key={item.value}
        width={'fill'}
        direction="row"
        alignItems="center"
        padding={themedControl.itemPadding}
        cornerRadius={themedControl.itemCornerRadius}
        {...itemStyle}
        enableGestures={selectable}
        onTouch={() => commitValue(item.value)}
        {...hoverHandlers}
        theme={contentTheme}
      >
        {content ?? (
          <Text
            text={item.label ?? item.value}
            {...(effectiveTextStyle ? { style: effectiveTextStyle } : {})}
          />
        )}
      </View>
    )
  }

  const emptyLabel = labels.empty ?? 'No items'

  return (
    <View
      {...viewProps}
      {...rootThemeProps}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
      overflow="hidden"
    >
      {items.length === 0 ? (
        <View alignItems="center" justifyContent="center" height={itemHeight * 3}>
          <Text text={emptyLabel} style={emptyStyle} />
        </View>
      ) : (
        <ScrollView
          height={listHeight > 0 ? listHeight : undefined}
          width="fill"
          theme={nestedTheme}
        >
          <View direction="column" gap={itemGap} width="fill" theme={nestedTheme}>
            {items.map(renderListItem)}
          </View>
        </ScrollView>
      )}
    </View>
  )
}
