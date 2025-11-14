import type Phaser from 'phaser'
import type { TextBaseProps, ViewBaseProps } from './core-types'
import type { VNode } from './hooks'

export type SignalLike<T> = { value: T } | T

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'

/**
 * Type for parent objects that can contain children
 */
export type ParentType = Phaser.Scene | Phaser.GameObjects.Container

/**
 * Props for View (Container) component - extends base props with JSX-specific props
 */
export interface ViewProps extends ViewBaseProps {
  key?: string | number
  children?: VNode | VNode[] | null | undefined
}

/**
 * Props for Text component - extends base props with JSX-specific props
 */
export interface TextProps extends TextBaseProps {
  key?: string | number
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
