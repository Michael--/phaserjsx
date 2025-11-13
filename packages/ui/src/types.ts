import type Phaser from 'phaser'
import { Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components'
import type { VNode } from './hooks'

export type SignalLike<T> = { value: T } | T

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'

/**
 * RexUI Sizer add() configuration
 * These are NOT properties of the widget itself, but parameters for parent.add(child, config)
 */
export interface RexUIAddConfig {
  expand?: boolean
  proportion?: number
  align?: 'left' | 'center' | 'right' | 'top' | 'bottom' | string
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number }
}

/**
 * Props for RexLabel widget
 */
export interface RexLabelProps extends RexUIAddConfig {
  key?: string | number
  x?: number
  y?: number
  text?: string
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  background?: { radius?: number; color?: number }
  space?: Partial<Record<'left' | 'right' | 'top' | 'bottom' | 'item', number>>
  align?: 'left' | 'center' | 'right' | 'justify'
  onPointerdown?: () => void
  children?: VNode[]
  size?: Size
  textColor?: string
  backgroundColor?: string
  wordWrap?: Phaser.Types.GameObjects.Text.TextWordWrap
  weight?: 'bold' | 'normal'
  shadow?: boolean
}

/**
 * Props for RexSizer layout container
 */
export interface RexSizerProps extends RexUIAddConfig {
  key?: string | number
  x?: number
  y?: number
  width?: number
  height?: number
  orientation?: Sizer.OrientationTypes
  rtl?: boolean
  space?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
    item?: number
  }
  align?: 'left' | 'center' | 'right' | 'justify'
  background?: { radius?: number; color?: number }
  onPointerdown?: (() => void) | undefined
  children?: VNode | VNode[] | null | undefined
}

/**
 * Props for Phaser Text game object
 */
export interface TextProps extends RexUIAddConfig {
  key?: string | number
  x?: number
  y?: number
  text?: string
  style?: Phaser.Types.GameObjects.Text.TextStyle
  onPointerdown?: () => void
  children?: VNode | VNode[] | null | undefined
}

/**
 * rexUI Sizer type (layout container)
 */
export type RexSizerType = Phaser.GameObjects.Container & {
  layout: () => void
  add: (child: Phaser.GameObjects.GameObject) => void
  remove: (child: Phaser.GameObjects.GameObject, destroy?: boolean) => void
  getTopmostSizer?: () => RexSizerType
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

// JSX type definitions for type-safe props
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      RexSizer: RexSizerProps
      RexLabel: RexLabelProps
      Text: TextProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
