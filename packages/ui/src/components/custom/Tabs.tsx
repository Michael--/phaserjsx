/** @jsxImportSource ../.. */
/**
 * Tabs component - horizontal tab list with switchable panels
 */
import type { ViewProps } from '..'
import type { VNode } from '../../hooks'
import { useLayoutEffect, useLayoutRect, useMemo, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'
import { ScrollView, type ScrollViewProps } from './ScrollView'

/**
 * Props for Tab header
 */
export interface TabProps extends Omit<ViewProps, 'children'> {
  /** Optional label convenience */
  label?: string
  /** Tab header content */
  children?: ChildrenType
  /** Disabled tab */
  disabled?: boolean
}

/**
 * Props for Tab panel
 */
export interface TabPanelProps extends Omit<ViewProps, 'children'> {
  /** Panel content */
  children?: ChildrenType
}

/**
 * Props for Tabs container
 */
export interface TabsProps extends Omit<ViewProps, 'children'> {
  /** Tab and TabPanel children */
  children?: ChildrenType
  /** Controlled active index */
  activeIndex?: number
  /** Uncontrolled default index */
  defaultIndex?: number
  /** Called when active tab changes */
  onChange?: (index: number) => void
  /** Optional gap between tab headers */
  tabGap?: number
  /** Enable horizontal scrolling for the tab list */
  scrollableTabs?: boolean
  /** ScrollView props applied to the tab list when scrollableTabs is enabled */
  tabListScrollProps?: Omit<ScrollViewProps, 'children'>
}

/**
 * Tab marker component - used inside Tabs
 */
export function Tab(_props: TabProps): VNodeLike {
  return null
}

/**
 * TabPanel marker component - used inside Tabs
 */
export function TabPanel(_props: TabPanelProps): VNodeLike {
  return null
}

const normalizeChildren = (children: ChildrenType): VNode[] => {
  if (!children) return []
  const flat = Array.isArray(children) ? (children as unknown[]).flat(Infinity) : [children]
  return flat.filter(
    (child): child is VNode => !!child && typeof child === 'object' && 'type' in child
  )
}

/**
 * Tabs component
 */
export function Tabs(props: TabsProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Tabs', localTheme, {})

  const [internalIndex, setInternalIndex] = useState(props.defaultIndex ?? 0)
  const rawIndex = props.activeIndex ?? internalIndex

  const { tabs, panels } = useMemo(() => {
    const nodes = normalizeChildren(props.children)
    const collectedTabs: VNode[] = []
    const collectedPanels: VNode[] = []

    for (const node of nodes) {
      if (node.type === Tab) collectedTabs.push(node)
      if (node.type === TabPanel) collectedPanels.push(node)
    }

    return { tabs: collectedTabs, panels: collectedPanels }
  }, [props.children])

  const panelCount = Math.min(tabs.length, panels.length)
  const safeIndex = panelCount > 0 ? Math.min(Math.max(rawIndex, 0), panelCount - 1) : 0

  const handleSelect = (index: number) => {
    if (props.activeIndex === undefined) {
      setInternalIndex(index)
    }
    if (index !== safeIndex) {
      props.onChange?.(index)
    }
  }

  const tabListStyle = themed.tabListStyle ?? {}
  const tabStyle = themed.tabStyle ?? {}
  const tabActiveStyle = themed.tabActiveStyle ?? {}
  const tabDisabledStyle = themed.tabDisabledStyle ?? {}
  const panelStyle = themed.panelStyle ?? {}
  const tabTextStyle = themed.tabTextStyle
  const tabGap = props.tabGap ?? themed.tabGap

  const {
    children: _children,
    activeIndex: _activeIndex,
    defaultIndex: _defaultIndex,
    onChange: _onChange,
    tabGap: _tabGap,
    ...viewProps
  } = props

  const activePanel = panels[safeIndex]
  const activePanelProps = (activePanel?.props as TabPanelProps | undefined) ?? {}
  const panelChildren = activePanel?.children ?? activePanelProps.children
  const { children: _panelChildren, ...panelViewProps } = activePanelProps
  const scrollableTabs = props.scrollableTabs ?? true
  const tabListScrollProps = props.tabListScrollProps ?? {}

  const tabListContentStyle = scrollableTabs
    ? {
        height: tabListStyle.height ?? '100%',
        alignItems: tabListStyle.alignItems ?? 'center',
      }
    : {}

  const tabListContent = (
    <View
      {...tabListStyle}
      {...tabListContentStyle}
      {...(tabGap !== undefined ? { gap: tabGap } : {})}
      direction="row"
      width={scrollableTabs ? 'auto' : '100%'}
      height="auto"
    >
      {tabs.slice(0, panelCount).map((tab, index) => {
        const tabProps = (tab.props as TabProps | undefined) ?? {}
        const { label, disabled, onTouch, enableGestures, ...tabViewProps } = tabProps
        const tabChildren = tab.children ?? tabProps.children
        const isActive = index === safeIndex
        const combinedTabStyle = {
          ...tabStyle,
          ...(isActive ? tabActiveStyle : {}),
          ...(disabled ? tabDisabledStyle : {}),
          ...tabViewProps,
        }
        const tabKey = tab.__key ?? tabProps.key ?? index

        return (
          <View
            key={tabKey as string | number}
            {...combinedTabStyle}
            enableGestures={!disabled && (enableGestures ?? true)}
            onTouch={(data) => {
              if (disabled) return
              handleSelect(index)
              onTouch?.(data)
            }}
          >
            {tabChildren ?? (label ? <Text text={label} style={tabTextStyle} /> : null)}
          </View>
        )
      })}
    </View>
  )

  // Measure tab height for scrollable tab list - a little hacky but works
  const [tabHeight, setTabHeight] = useState<number>(0)
  const [sliderHeight, setSliderHeight] = useState<number>(0)
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  useLayoutEffect(() => {
    const layout = useLayoutRect(ref)
    if (layout) setTabHeight(layout.height)
  }, [props, ref])

  return (
    <View {...themed} {...viewProps} direction="column" theme={nestedTheme}>
      {scrollableTabs ? (
        <ScrollView
          width="100%"
          height={tabHeight + sliderHeight}
          showHorizontalSlider="auto"
          showVerticalSlider={false}
          sliderSize="tiny"
          theme={nestedTheme}
          onSliderSize={(size) => setSliderHeight(size.height)}
          {...tabListScrollProps}
        >
          <View ref={ref}>{tabListContent}</View>
        </ScrollView>
      ) : (
        tabListContent
      )}

      {activePanel ? (
        <View {...panelStyle} {...panelViewProps}>
          {panelChildren}
        </View>
      ) : null}
    </View>
  )
}
