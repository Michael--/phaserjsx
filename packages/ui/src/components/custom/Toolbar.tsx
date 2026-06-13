/** @jsxImportSource ../.. */
/**
 * Toolbar and ToolButtonGroup components
 * Compact action/toggle button groups for editor tools, HUD controls, and debug panels.
 */
import type { ViewProps } from '..'
import { toolbarSizePresets } from '../../design-tokens/component-size-presets'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Button, Text, View, type ButtonProps } from '../index'
import type { ButtonSize, ButtonVariant } from './Button'
import { Divider } from './Divider'
import { MenuButton } from './MenuButton'
import type { ContextMenuItem } from './Popover'

export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarDensity = 'compact' | 'normal'
export type ToolbarItemType = 'action' | 'toggle' | 'separator' | 'menu'

export interface ToolbarLabels {
  overflow?: string
  menuIndicator?: string
}

interface ToolbarBaseItem {
  /** Unique item id. Required for action, toggle, and menu items. */
  id?: string
  /** Item type. Omitted type defaults to action. */
  type?: ToolbarItemType
  /** Visible or tooltip label. */
  label?: string
  /** Optional icon/glyph content. */
  icon?: ChildrenType
  /** Full custom button content. Takes precedence over icon and label. */
  children?: ChildrenType
  /** Hide generated label text while keeping label available for tooltips. */
  showLabel?: boolean
  /** Disabled item state. */
  disabled?: boolean
  /** Tooltip text. Falls back to label when labels are hidden. */
  tooltip?: string
  /** Item-specific button variant. */
  buttonVariant?: ButtonVariant
  /** Item-specific button size. */
  buttonSize?: ButtonSize
  /** Button prop overrides. */
  buttonProps?: Omit<ButtonProps, 'children' | 'label' | 'onClick' | 'disabled'>
  /** Called before Toolbar onSelect. */
  onSelect?: (id: string) => void
}

export interface ToolbarActionItem extends ToolbarBaseItem {
  type?: 'action'
  id: string
}

export interface ToolbarToggleItem extends ToolbarBaseItem {
  type: 'toggle'
  id: string
  /** Controlled pressed state for this toggle. */
  pressed?: boolean
  /** Initial pressed state for uncontrolled toolbars. */
  defaultPressed?: boolean
  /** Allow clicking an active toggle to clear it. */
  allowDeselect?: boolean
  /** Called when the toggle pressed state changes. */
  onToggle?: (pressed: boolean, id: string) => void
}

export interface ToolbarMenuItem extends ToolbarBaseItem {
  type: 'menu'
  id: string
  /** Future-facing menu item payload; render with MenuButton when overlay behavior is needed. */
  items?: ContextMenuItem[]
}

export interface ToolbarSeparatorItem {
  type: 'separator'
  id?: string
  length?: ViewProps['width']
  thickness?: number
}

export type ToolbarItem =
  | ToolbarActionItem
  | ToolbarToggleItem
  | ToolbarMenuItem
  | ToolbarSeparatorItem

export interface ToolbarThemeSlot extends ViewTheme {
  orientation?: ToolbarOrientation
  density?: ToolbarDensity
  itemWidth?: ViewTheme['width']
  itemHeight?: ViewTheme['height']
  compactItemWidth?: ViewTheme['width']
  compactItemHeight?: ViewTheme['height']
  itemGap?: number
  groupGap?: number
  buttonVariant?: ButtonVariant
  activeButtonVariant?: ButtonVariant
  menuButtonVariant?: ButtonVariant
  buttonSize?: ButtonSize
  compactButtonSize?: ButtonSize
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  activeTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  disabledTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  menuIndicatorStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconSize?: number
  compactIconSize?: number
  separatorColor?: number
  separatorThickness?: number
  separatorLength?: ViewProps['width']
  disabledAlpha?: number
  labels?: ToolbarLabels
}

export interface ToolbarProps extends Omit<ViewProps, 'children'> {
  /** Toolbar items. */
  items: ToolbarItem[]
  /** Active tool id in controlled mode. */
  activeId?: string
  /** Initial active tool id in uncontrolled mode. */
  defaultActiveId?: string
  /** Called when an action, toggle, or menu trigger is selected. */
  onSelect?: (id: string, item: Exclude<ToolbarItem, ToolbarSeparatorItem>) => void
  /** Called when a toggle item changes pressed state. */
  onToggle?: (id: string, pressed: boolean, item: ToolbarToggleItem) => void
  /** Layout orientation. */
  orientation?: ToolbarOrientation
  /** Density preset. */
  density?: ToolbarDensity
  /** Hide generated labels for compact icon-only toolbars. */
  showLabels?: boolean
  /** Disable the entire toolbar. */
  disabled?: boolean
  /** Localized labels. */
  labels?: ToolbarLabels
  /** Theme overrides. */
  theme?: PartialTheme
}

export function isToolbarSeparatorItem(item: ToolbarItem): item is ToolbarSeparatorItem {
  return item.type === 'separator'
}

export function isToolbarToggleItem(item: ToolbarItem): item is ToolbarToggleItem {
  return item.type === 'toggle'
}

export function isToolbarMenuItem(item: ToolbarItem): item is ToolbarMenuItem {
  return item.type === 'menu'
}

export function getToolbarItemId(item: ToolbarItem, index: number): string {
  return isToolbarSeparatorItem(item) ? (item.id ?? `separator-${index}`) : item.id
}

export function resolveToolbarActiveId(
  items: ToolbarItem[],
  activeId?: string
): string | undefined {
  if (!activeId) return undefined
  return items.some((item) => !isToolbarSeparatorItem(item) && item.id === activeId)
    ? activeId
    : undefined
}

function getDefaultPressedId(items: ToolbarItem[]): string | undefined {
  return items.find(
    (item): item is ToolbarToggleItem => isToolbarToggleItem(item) && !!item.defaultPressed
  )?.id
}

function mergeTextStyle(
  ...styles: Array<Phaser.Types.GameObjects.Text.TextStyle | undefined>
): Phaser.Types.GameObjects.Text.TextStyle | undefined {
  const merged = Object.assign({}, ...styles.filter(Boolean))
  return Object.keys(merged).length > 0 ? merged : undefined
}

function getDensityTheme(
  density: ToolbarDensity
): Pick<ToolbarThemeSlot, 'itemWidth' | 'itemHeight' | 'buttonSize' | 'iconSize'> {
  if (density === 'compact') {
    return {
      itemWidth: toolbarSizePresets.compactWidth,
      itemHeight: toolbarSizePresets.compactHeight,
      buttonSize: 'small',
      iconSize: toolbarSizePresets.compactIconSize,
    }
  }

  return {}
}

/**
 * Toolbar component
 */
export function Toolbar(props: ToolbarProps): VNodeLike {
  const {
    items,
    activeId,
    defaultActiveId,
    onSelect,
    onToggle,
    orientation,
    density,
    showLabels,
    disabled = false,
    labels: labelOverrides,
    theme,
    alpha,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('Toolbar', mergedLocalTheme, {})
  const themedToolbar = themed as unknown as ToolbarThemeSlot
  const isControlled = activeId !== undefined
  const initialActiveId =
    resolveToolbarActiveId(items, activeId ?? defaultActiveId) ?? getDefaultPressedId(items)
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(initialActiveId)
  const currentActiveId = isControlled
    ? resolveToolbarActiveId(items, activeId)
    : resolveToolbarActiveId(items, internalActiveId)

  useEffect(() => {
    if (!isControlled && internalActiveId !== currentActiveId) {
      setInternalActiveId(currentActiveId)
    }
  }, [isControlled, internalActiveId, currentActiveId])

  const labels = {
    ...(themedToolbar.labels ?? {}),
    ...(labelOverrides ?? {}),
  }
  const resolvedOrientation = orientation ?? themedToolbar.orientation ?? 'horizontal'
  const resolvedDensity = density ?? themedToolbar.density ?? 'normal'
  const densityTheme = getDensityTheme(resolvedDensity)
  const itemWidth =
    themedToolbar[resolvedDensity === 'compact' ? 'compactItemWidth' : 'itemWidth'] ??
    densityTheme.itemWidth ??
    themedToolbar.itemWidth ??
    40
  const itemHeight =
    themedToolbar[resolvedDensity === 'compact' ? 'compactItemHeight' : 'itemHeight'] ??
    densityTheme.itemHeight ??
    themedToolbar.itemHeight ??
    36
  const resolvedButtonSize =
    (resolvedDensity === 'compact' ? themedToolbar.compactButtonSize : undefined) ??
    densityTheme.buttonSize ??
    themedToolbar.buttonSize ??
    'small'
  const resolvedIconSize =
    (resolvedDensity === 'compact' ? themedToolbar.compactIconSize : undefined) ??
    densityTheme.iconSize ??
    themedToolbar.iconSize
  const resolvedShowLabels = showLabels ?? resolvedDensity !== 'compact'
  const finalAlpha = disabled ? (themedToolbar.disabledAlpha ?? 0.55) : alpha
  const textStyle = themedToolbar.textStyle ?? { color: '#e2e8f0', fontSize: '13px' }
  const activeTextStyle = mergeTextStyle(textStyle, themedToolbar.activeTextStyle)
  const disabledTextStyle = mergeTextStyle(textStyle, themedToolbar.disabledTextStyle)
  const menuIndicatorStyle = themedToolbar.menuIndicatorStyle ?? {
    color: '#94a3b8',
    fontSize: '10px',
  }
  const mainDirection = resolvedOrientation === 'horizontal' ? 'row' : 'column'
  const separatorOrientation = resolvedOrientation === 'horizontal' ? 'vertical' : 'horizontal'
  const separatorLength =
    themedToolbar.separatorLength ?? (resolvedOrientation === 'horizontal' ? itemHeight : itemWidth)

  const handlePress = (item: Exclude<ToolbarItem, ToolbarSeparatorItem>) => {
    if (disabled || item.disabled) return

    if (isToolbarToggleItem(item)) {
      const pressed = item.pressed ?? currentActiveId === item.id
      const nextPressed = pressed && item.allowDeselect ? false : true

      if (!isControlled && item.pressed === undefined) {
        setInternalActiveId(nextPressed ? item.id : undefined)
      }

      item.onToggle?.(nextPressed, item.id)
      onToggle?.(item.id, nextPressed, item)
    }

    item.onSelect?.(item.id)
    onSelect?.(item.id, item)
  }

  const renderItemContent = (
    item: Exclude<ToolbarItem, ToolbarSeparatorItem>,
    pressed: boolean,
    itemDisabled: boolean
  ) => {
    if (item.children) return item.children

    const shouldShowLabel = item.showLabel ?? resolvedShowLabels
    const effectiveTextStyle = itemDisabled
      ? disabledTextStyle
      : pressed
        ? activeTextStyle
        : textStyle

    return (
      <>
        {item.icon}
        {shouldShowLabel && item.label ? (
          <Text text={item.label} {...(effectiveTextStyle ? { style: effectiveTextStyle } : {})} />
        ) : null}
        {isToolbarMenuItem(item) ? (
          <Text text={labels.menuIndicator ?? 'v'} style={menuIndicatorStyle} />
        ) : null}
      </>
    )
  }

  const renderToolbarItem = (item: ToolbarItem, index: number) => {
    const key = getToolbarItemId(item, index)

    if (isToolbarSeparatorItem(item)) {
      return (
        <View key={key} alignItems="center" justifyContent="center" theme={nestedTheme}>
          <Divider
            orientation={separatorOrientation}
            length={item.length ?? separatorLength}
            thickness={item.thickness ?? themedToolbar.separatorThickness ?? 1}
            color={themedToolbar.separatorColor ?? 0x475569}
          />
        </View>
      )
    }

    const itemDisabled = disabled || !!item.disabled
    const pressed = isToolbarToggleItem(item)
      ? (item.pressed ?? currentActiveId === item.id)
      : currentActiveId === item.id
    const tooltipText = item.tooltip ?? (!resolvedShowLabels ? item.label : undefined)
    const buttonVariant =
      item.buttonVariant ??
      (pressed
        ? (themedToolbar.activeButtonVariant ?? 'primary')
        : isToolbarMenuItem(item)
          ? (themedToolbar.menuButtonVariant ?? themedToolbar.buttonVariant ?? 'secondary')
          : (themedToolbar.buttonVariant ?? 'secondary'))
    const effectiveTextStyle = itemDisabled
      ? disabledTextStyle
      : pressed
        ? activeTextStyle
        : textStyle
    const buttonTheme = mergeThemes(nestedTheme, {
      Button: {
        ...(effectiveTextStyle ? { textStyle: effectiveTextStyle } : {}),
        ...(resolvedIconSize !== undefined ? { iconSize: resolvedIconSize } : {}),
      },
    })

    if (isToolbarMenuItem(item)) {
      return (
        <MenuButton
          key={key}
          items={item.items ?? []}
          onSelect={() => {
            item.onSelect?.(item.id)
            onSelect?.(item.id, item)
          }}
          placement={resolvedOrientation === 'horizontal' ? 'bottom-start' : 'right-start'}
          disabled={itemDisabled}
          theme={buttonTheme}
          trigger={({ isOpen }) => (
            <Button
              variant={buttonVariant}
              size={item.buttonSize ?? resolvedButtonSize}
              disabled={itemDisabled}
              width={itemWidth}
              height={itemHeight}
              theme={buttonTheme}
              {...item.buttonProps}
              {...(tooltipText ? { onTooltip: () => tooltipText } : {})}
            >
              <View
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={themedToolbar.gap ?? 6}
              >
                {renderItemContent(item, isOpen, itemDisabled)}
              </View>
            </Button>
          )}
        />
      )
    }

    return (
      <Button
        key={key}
        width={itemWidth}
        height={itemHeight}
        variant={buttonVariant}
        size={item.buttonSize ?? resolvedButtonSize}
        disabled={itemDisabled}
        {...item.buttonProps}
        onClick={() => handlePress(item)}
        {...(tooltipText ? { onTooltip: () => tooltipText } : {})}
        theme={buttonTheme}
      >
        <View
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={themedToolbar.gap ?? 6}
        >
          {renderItemContent(item, pressed, itemDisabled)}
        </View>
      </Button>
    )
  }

  return (
    <View
      {...viewProps}
      direction={mainDirection}
      alignItems="center"
      gap={themedToolbar.itemGap ?? 6}
      padding={themedToolbar.padding ?? 4}
      backgroundColor={themedToolbar.backgroundColor}
      backgroundAlpha={themedToolbar.backgroundAlpha}
      borderColor={themedToolbar.borderColor}
      borderWidth={themedToolbar.borderWidth}
      cornerRadius={themedToolbar.cornerRadius}
      {...(finalAlpha !== undefined ? { alpha: finalAlpha } : {})}
      theme={nestedTheme}
    >
      {items.map(renderToolbarItem)}
    </View>
  )
}

/**
 * ToolButtonGroup is an alias for Toolbar when a button-group name fits the UI better.
 */
export function ToolButtonGroup(props: ToolbarProps): VNodeLike {
  return <Toolbar {...props} />
}
