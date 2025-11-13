import type Phaser from 'phaser'

export type SignalLike<T> = { value: T } | T

/**
 * Props for RexLabel widget
 */
export interface RexLabelProps {
  x?: number
  y?: number
  text?: string
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  background?: { radius?: number; color?: number }
  space?: Record<string, number>
  align?: string
  onPointerdown?: () => void
}

/**
 * Props for RexSizer layout container
 */
export interface RexSizerProps {
  x?: number
  y?: number
  orientation?: 'x' | 'y'
  space?: Record<string, number>
  align?: string
  width?: number
  height?: number
  background?: { radius?: number; color?: number }
  onPointerdown?: () => void
}

/**
 * Props for Phaser Text game object
 */
export interface TextProps {
  x?: number
  y?: number
  text?: string
  style?: Phaser.Types.GameObjects.Text.TextStyle
  onPointerdown?: () => void
}

/**
 * rexUI Sizer type (layout container)
 */
export type RexSizerType = Phaser.GameObjects.Container & {
  layout: () => void
  add: (child: Phaser.GameObjects.GameObject) => void
  remove: (child: Phaser.GameObjects.GameObject, destroy?: boolean) => void
}

/**
 * rexUI Label type (text with optional background)
 */
export type RexLabelType = Phaser.GameObjects.Container & {
  text: Phaser.GameObjects.Text
  setText: (text: string) => void
}

/**
 * Type for parent objects that can contain children
 */
export type ParentType = Phaser.Scene | Phaser.GameObjects.Container | RexSizerType
