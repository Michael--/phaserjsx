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
}
