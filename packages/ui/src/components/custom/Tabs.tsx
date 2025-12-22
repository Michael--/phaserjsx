/** @jsxImportSource ../.. */
/**
 * Tabs component - horizontal tab list with switchable panels
 */
import type { ViewProps } from '..'
import { useMemo, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNode } from '../../hooks'
import type { VNodeLike } from '../../vdom'
import { Text, View } from '../index'

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

  return (
    <View {...themed} {...viewProps} direction="column" theme={nestedTheme}>
      <View {...tabListStyle} {...(tabGap !== undefined ? { gap: tabGap } : {})} direction="row">
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

      {activePanel ? (
        <View {...panelStyle} {...panelViewProps}>
          {panelChildren}
        </View>
      ) : null}
    </View>
  )
}
