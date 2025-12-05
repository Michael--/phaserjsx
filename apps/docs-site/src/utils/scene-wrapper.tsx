/**
 * SceneWrapper - Provides absolute scene dimensions to example components
 * This wrapper enables percentage-based sizing in examples by providing the scene's width and height
 */
/** @jsxImportSource @phaserjsx/ui */
import { View, type VNode } from '@phaserjsx/ui'

/**
 * Wrapper component that provides scene dimensions to child components
 * @param props - Contains width, height, and children
 * @returns View with absolute dimensions from the scene
 */
export function SceneWrapper(props: Record<string, unknown>) {
  const { width, height, children } = props

  return (
    <View width={width as number} height={height as number}>
      {children as VNode}
    </View>
  )
}
