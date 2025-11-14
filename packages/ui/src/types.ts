import type Phaser from 'phaser'
import type { VNode } from './hooks'

export type SignalLike<T> = { value: T } | T

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'

/**
 * Type for parent objects that can contain children
 */
export type ParentType = Phaser.Scene | Phaser.GameObjects.Container

/**
 * Props for View (Container) component
 */
export interface ViewProps {
  key?: string | number
  x?: number
  y?: number
  visible?: boolean
  depth?: number
  alpha?: number
  scaleX?: number
  scaleY?: number
  rotation?: number
  children?: VNode | VNode[] | null | undefined
}

/**
 * Props for Text component
 */
export interface TextProps {
  key?: string | number
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
  children?: VNode | VNode[] | null | undefined
}

// JSX type definitions for type-safe props
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      View: ViewProps
      Text: TextProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
