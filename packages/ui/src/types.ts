import type Phaser from 'phaser'
import type { VNode } from './hooks'
import type { PartialTheme } from './theme'

export type SignalLike<T> = { value: T } | T

/**
 * Type for parent objects that can contain children
 */
export type ParentType = Phaser.Scene | Phaser.GameObjects.Container

/**
 * Ref callback that receives the underlying Phaser object instance
 */
export type RefCallback<T> = (instance: T | null) => void

/**
 * Ref object that holds a reference to the underlying Phaser object
 */
export interface RefObject<T> {
  current: T | null
}

/**
 * Ref type - can be either a callback or an object
 */
export type Ref<T> = RefCallback<T> | RefObject<T>

export interface PropsDefaultExtension<T = unknown> {
  key?: string | number | undefined
  ref?: Ref<T> | undefined
  theme?: PartialTheme | undefined
}

export type VNodeChild = VNode | null | undefined | false

export type VNodeLike = VNodeChild | VNodeLike[]

export type ChildrenType = VNodeLike

export interface PropsContainerExtension {
  children?: ChildrenType
}
