/**
 * SceneWrapper - Internal component that provides scene dimensions
 * Enables percentage-based sizing for mounted components
 * Used automatically by mountJSX unless disableAutoSize is true
 */
/** @jsxImportSource ../.. */
import type { VNode } from '../../hooks'
import { View } from '../custom/View'

/**
 * Props for SceneWrapper
 */
export interface SceneWrapperProps {
  /** Scene/container width in pixels */
  width: number
  /** Scene/container height in pixels */
  height: number
  /** Child component to render */
  children: VNode
}

/**
 * Internal wrapper that provides scene dimensions to child components
 * This allows child components to use percentage-based widths/heights
 * @param props - SceneWrapper properties
 * @returns View with absolute dimensions
 */
export function SceneWrapper(props: SceneWrapperProps) {
  const { width, height, children } = props

  return (
    <View width={width} height={height}>
      {children}
    </View>
  )
}
