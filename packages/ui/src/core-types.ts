/**
 * Core type system for native Phaser GameObject primitives
 * Defines the mapping between node type names and their corresponding Phaser types
 */
import type Phaser from 'phaser'

/**
 * Maps node type names to Phaser GameObject classes
 */
export interface NodeMap {
  View: Phaser.GameObjects.Container
  Text: Phaser.GameObjects.Text
}

/**
 * Maps node type names to their props interfaces
 */
export interface NodePropsMap {
  View: {
    x?: number
    y?: number
    visible?: boolean
    depth?: number
    alpha?: number
    scaleX?: number
    scaleY?: number
    rotation?: number
    width?: number
    height?: number
    onPointerDown?: (pointer: Phaser.Input.Pointer) => void
    onPointerUp?: (pointer: Phaser.Input.Pointer) => void
    onPointerOver?: (pointer: Phaser.Input.Pointer) => void
    onPointerOut?: (pointer: Phaser.Input.Pointer) => void
  }
  Text: {
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
}

/**
 * Union of all supported node type names
 */
export type NodeType = keyof NodeMap

/**
 * Get the instance type for a given node type
 */
export type NodeInstance<T extends NodeType = NodeType> = NodeMap[T]

/**
 * Get the props type for a given node type
 */
export type NodeProps<T extends NodeType = NodeType> = NodePropsMap[T]
