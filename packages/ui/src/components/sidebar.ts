/**
 * Sidebar component - High-level container with typical sidebar styling
 */
import type { VNode } from '../hooks'
import { View } from './index'
import type { ViewProps } from './view'

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
  /** Width of the sidebar (default: 200) */
  width?: number | string
  height?: number | string
  /** Background color (default: 0x1e1e1e) */
  backgroundColor?: number
  /** Padding inside sidebar (default: 10 on all sides) */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  /** Gap between children (default: 10) */
  gap?: number
  /** Children to display in sidebar */
  children?: VNode | VNode[] | null
}

/**
 * Sidebar component - pre-configured container for navigation/options
 * @param props - Sidebar properties
 * @returns Sidebar VNode
 */
export function Sidebar(props: SidebarProps): VNode {
  const width = props.width ?? 200
  const height = props.height ?? undefined
  const backgroundColor = props.backgroundColor ?? 0x1e1e1e
  const gap = props.gap ?? 10

  let padding: ViewProps['padding']
  if (typeof props.padding === 'number') {
    padding = {
      top: props.padding,
      right: props.padding,
      bottom: props.padding,
      left: props.padding,
    }
  } else if (props.padding) {
    padding = props.padding
  } else {
    padding = { top: 10, right: 10, bottom: 10, left: 10 }
  }

  const children = props.children
    ? Array.isArray(props.children)
      ? props.children
      : [props.children]
    : []

  return {
    type: View,
    props: {
      width,
      height,
      backgroundColor,
      padding,
      gap,
      direction: 'column' as const,
      alignItems: 'start' as const,
    },
    children,
  }
}
