/**
 * Text component implementation - native Phaser Text GameObject
 */
import type Phaser from 'phaser'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsExtension } from '../types'

/**
 * Base props for Text - without JSX-specific props
 */
export interface TextBaseProps {
  x?: number
  y?: number
  text: string
  style?: Phaser.Types.GameObjects.Text.TextStyle
  visible?: boolean
  depth?: number
  alpha?: number
  scaleX?: number
  scaleY?: number
  rotation?: number
}

/**
 * Props for Text component - extends base props with JSX-specific props
 */
export interface TextProps extends TextBaseProps, PropsExtension {}

/**
 * Text creator - creates a Phaser Text object
 */
export const textCreator: HostCreator<'Text'> = (scene, props) => {
  const text = scene.add.text(props.x ?? 0, props.y ?? 0, props.text, props.style)
  if (props.visible !== undefined) text.visible = props.visible
  if (props.depth !== undefined) text.setDepth(props.depth)
  if (props.alpha !== undefined) text.setAlpha(props.alpha)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    text.setScale(props.scaleX ?? 1, props.scaleY ?? 1)
  }
  if (props.rotation !== undefined) text.setRotation(props.rotation)
  return text
}

/**
 * Text patcher - updates Text properties
 */
export const textPatcher: HostPatcher<'Text'> = (node, prev, next) => {
  // Common transform props
  if (prev.x !== next.x && next.x !== undefined) node.x = next.x
  if (prev.y !== next.y && next.y !== undefined) node.y = next.y
  if (prev.visible !== next.visible && next.visible !== undefined) node.visible = next.visible
  if (prev.depth !== next.depth && next.depth !== undefined) node.setDepth(next.depth)
  if (prev.alpha !== next.alpha && next.alpha !== undefined) node.setAlpha(next.alpha)
  if (
    (prev.scaleX !== next.scaleX && next.scaleX !== undefined) ||
    (prev.scaleY !== next.scaleY && next.scaleY !== undefined)
  ) {
    node.setScale(next.scaleX ?? node.scaleX, next.scaleY ?? node.scaleY)
  }
  if (prev.rotation !== next.rotation && next.rotation !== undefined) {
    node.setRotation(next.rotation)
  }

  // Text-specific props
  if (prev.text !== next.text) {
    node.setText(next.text)
  }
  if (prev.style !== next.style && next.style !== undefined) {
    node.setStyle(next.style)
  }
}

// JSX type definitions for type-safe props
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      Text: TextProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
