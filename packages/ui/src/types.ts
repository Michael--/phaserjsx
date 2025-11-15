import type Phaser from 'phaser'
import type { VNode } from './hooks'

export type SignalLike<T> = { value: T } | T

/**
 * Type for parent objects that can contain children
 */
export type ParentType = Phaser.Scene | Phaser.GameObjects.Container
export interface PropsDefaultExtension {
  key?: string | number | undefined
}
export interface PropsContainerExtension {
  children?: VNode | VNode[] | null | undefined
}
