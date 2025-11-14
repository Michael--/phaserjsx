/**
 * Text component implementation - native Phaser Text GameObject
 */
import type Phaser from 'phaser'
import type { EdgeInsets, TextSpecificProps, TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsExtension } from '../types'
import { applyTextProps } from './appliers/applyText'
import { applyTransformProps } from './appliers/applyTransform'
import { createTransform } from './creators/createTransform'

/**
 * Base props for Text - composing shared prop groups
 * Includes optional margin for layout engine use
 */
export interface TextBaseProps extends TransformProps, TextSpecificProps {
  margin?: EdgeInsets
  // Legacy: support Phaser's style object directly
  style?: Phaser.Types.GameObjects.Text.TextStyle
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

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(text, props)

  // Attach layout props for layout calculations
  ;(text as Phaser.GameObjects.Text & { __layoutProps?: TextProps }).__layoutProps = props

  return text
}

/**
 * Text patcher - updates Text properties
 */
export const textPatcher: HostPatcher<'Text'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, prev, next)

  // Apply text-specific props (text content, color, font, etc.)
  applyTextProps(node, prev, next)
}
