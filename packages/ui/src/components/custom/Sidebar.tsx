/** @jsxImportSource ../.. */
import type * as Phaser from 'phaser'
/**
 * Sidebar component - High-level container with typical sidebar styling
 */
import type { ViewProps } from '..'
import type { VNode } from '../../hooks'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Divider } from './Divider'
import { ScrollView } from './ScrollView'
import { Text } from './Text'
import { View } from './View'

export type SidebarVariant = 'solid' | 'muted' | 'ghost' | 'inset'
export type SidebarSize = 'sm' | 'md' | 'lg'

export interface SidebarNavItem {
  key?: string
  label?: string
  icon?: ChildrenType
  badge?: ChildrenType | number
  active?: boolean
  disabled?: boolean
  onSelect?: (key: string | undefined) => void
  content?: ChildrenType
}

export interface SidebarSection {
  key?: string
  title?: string | ChildrenType
  items?: SidebarNavItem[]
  footer?: ChildrenType
  content?: ChildrenType
}

/**
 * Props for Sidebar component - extends ViewProps for full flexibility
 */
export interface SidebarProps extends ViewProps {
  /** Visual variant */
  variant?: SidebarVariant
  /** Size preset for padding/gaps */
  size?: SidebarSize
  /** Pinned header content */
  header?: ChildrenType
  /** Pinned footer content */
  footer?: ChildrenType
  /** Structured navigation sections */
  sections?: SidebarSection[]
  /** Enable internal scroll area for long content */
  scrollable?: boolean
  /** Render dividers between sections */
  showDividers?: boolean
  /** Override item spacing */
  itemGap?: number
  /** Override section spacing */
  sectionGap?: number
}

interface SidebarTheme extends ViewTheme {
  variant?: SidebarVariant
  size?: SidebarSize
  variants?: Partial<Record<SidebarVariant, ViewTheme>>
  sizes?: Partial<Record<SidebarSize, ViewTheme>>
  dividerColor?: number
  dividerAlpha?: number
  headerStyle?: ViewTheme
  footerStyle?: ViewTheme
  sectionStyle?: ViewTheme & {
    titleStyle?: Phaser.Types.GameObjects.Text.TextStyle
  }
  itemStyle?: ViewTheme & {
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    active?: ViewTheme
    disabledAlpha?: number
  }
  badgeStyle?: ViewTheme & {
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  }
  scrollable?: boolean
  itemGap?: number
  sectionGap?: number
}

/**
 * Sidebar component - pre-configured container for navigation/options
 * Adds variants, size presets, and optional header/sections/footer slots.
 */
export function Sidebar(props: SidebarProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themedProps, nestedTheme } = getThemedProps('Sidebar', localTheme, {})
  const themed = themedProps as SidebarTheme

  const resolvedVariant = props.variant ?? themed.variant ?? 'solid'
  const resolvedSize = props.size ?? themed.size ?? 'md'

  const variantTheme = themed.variants?.[resolvedVariant] ?? {}
  const sizeTheme = themed.sizes?.[resolvedSize] ?? {}

  const {
    variants: _variants,
    sizes: _sizes,
    headerStyle,
    footerStyle,
    sectionStyle,
    itemStyle,
    badgeStyle,
    dividerColor,
    dividerAlpha: _dividerAlpha,
    scrollable: themedScrollable,
    itemGap: themedItemGap,
    sectionGap: themedSectionGap,
    variant: _variant,
    size: _size,
    ...baseTheme
  } = themed

  const effectiveGap = props.gap ?? (sizeTheme.gap as number | undefined) ?? themed.gap
  const sectionGap = props.sectionGap ?? themedSectionGap ?? effectiveGap ?? 8
  const itemGap = props.itemGap ?? themedItemGap ?? 8
  const scrollable = props.scrollable ?? themedScrollable ?? false
  const showDividers = props.showDividers ?? false
  const dividerColorValue = dividerColor ?? 0xcccccc

  const combinedProps: ViewProps = {
    ...baseTheme,
    ...variantTheme,
    ...sizeTheme,
    ...props,
    direction: props.direction ?? 'column',
    alignItems: props.alignItems ?? 'start',
    gap: effectiveGap,
  }

  const { titleStyle, ...sectionContainer } = sectionStyle ?? {}
  const {
    textStyle: itemTextStyle,
    active: activeItemStyle,
    disabledAlpha,
    ...itemContainer
  } = itemStyle ?? {}
  const { textStyle: badgeTextStyle, ...badgeContainer } = badgeStyle ?? {}

  const normalizeChildren = (child: ChildrenType | null): VNode[] => {
    if (!child) return []
    const flat = Array.isArray(child) ? (child as unknown[]).flat(Infinity) : [child]
    return flat.filter(
      (node): node is VNode => !!node && typeof node === 'object' && 'type' in node
    )
  }

  const renderTitle = (title?: string | ChildrenType) => {
    if (!title) return null
    return typeof title === 'string' ? <Text text={title} style={titleStyle} /> : title
  }

  const renderBadge = (badge?: ChildrenType | number) => {
    if (badge === undefined || badge === null) return null
    const badgeContent =
      typeof badge === 'number' ? <Text text={`${badge}`} style={badgeTextStyle} /> : badge
    return (
      <View
        direction="row"
        alignItems="center"
        justifyContent="center"
        {...badgeContainer}
        padding={badgeContainer.padding ?? 6}
      >
        {badgeContent}
      </View>
    )
  }

  const renderItems = (items?: SidebarNavItem[], sectionKey?: string) => {
    if (!items?.length) return null
    return items.map((item, itemIndex) => {
      const key = item.key ?? `${sectionKey ?? 'section'}-item-${itemIndex}`
      const activeProps = item.active ? (activeItemStyle ?? {}) : {}
      const disabledProps =
        item.disabled && disabledAlpha !== undefined ? { alpha: disabledAlpha } : {}

      const content: ChildrenType | null =
        item.content ?? (item.label ? <Text text={item.label} style={itemTextStyle} /> : null)
      const iconNodes = normalizeChildren(item.icon ?? null)
      const contentNodes = normalizeChildren(content)
      const badgeNodes = normalizeChildren(renderBadge(item.badge))
      const handleTouch = item.disabled ? undefined : () => item.onSelect?.(item.key ?? key)

      return (
        <View
          key={key}
          direction="row"
          alignItems="center"
          gap={itemContainer.gap ?? itemGap}
          enableGestures={!item.disabled}
          {...(handleTouch && { onTouch: handleTouch })}
          {...itemContainer}
          {...activeProps}
          {...disabledProps}
        >
          {[...iconNodes, ...contentNodes, ...badgeNodes]}
        </View>
      )
    })
  }

  const renderSections = () => {
    if (!props.sections?.length) return null
    const lastSectionIndex = props.sections.length - 1
    return props.sections.map((section, index) => {
      const sectionKey = section.key ?? `section-${index}`
      return (
        <View key={sectionKey} direction="column" gap={sectionGap} {...sectionContainer}>
          {renderTitle(section.title)}
          {section.content ?? null}
          {renderItems(section.items, sectionKey)}
          {section.footer ?? null}
          {showDividers && index < lastSectionIndex ? (
            <Divider
              color={dividerColorValue}
              thickness={1}
              length={'100%'}
              orientation="horizontal"
            />
          ) : null}
        </View>
      )
    })
  }

  const sectionsContent = renderSections()
  const hasSections = !!props.sections?.length
  const primaryContent = sectionsContent ?? (!hasSections ? props.children : null) ?? null
  const extraContent = hasSections ? (props.children ?? null) : null
  const contentNodes = [...normalizeChildren(primaryContent), ...normalizeChildren(extraContent)]

  return (
    <View
      {...combinedProps}
      theme={nestedTheme}
      backgroundColor={themed.backgroundColor}
      backgroundAlpha={themed.backgroundAlpha}
      padding={themed.padding}
      gap={themed.gap}
    >
      {props.header ? <View {...headerStyle}>{props.header}</View> : null}

      {scrollable ? (
        <ScrollView
          flex={1}
          width={'fill'}
          height={'fill'}
          showVerticalSlider={'auto'}
          showHorizontalSlider={false}
          sliderSize={'tiny'}
          theme={nestedTheme}
        >
          <View direction="column" gap={effectiveGap} width={'fill'}>
            {contentNodes}
          </View>
        </ScrollView>
      ) : (
        contentNodes
      )}

      {props.footer ? <View {...footerStyle}>{props.footer}</View> : null}
    </View>
  )
}
