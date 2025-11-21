/**
 * Core type system for native Phaser GameObject primitives
 * Defines the mapping between node type names and their corresponding Phaser types
 */
import type Phaser from 'phaser'
import type { GraphicsBaseProps } from './components/graphics'
import type { ImageBaseProps } from './components/image'
import type { NineSliceBaseProps } from './components/nineslice'
import type { SpriteBaseProps } from './components/sprite'
import type { TextBaseProps } from './components/text'
import type { TileSpriteBaseProps } from './components/tilesprite'
import type { ViewBaseProps } from './components/view'

/**
 * Maps node type names to Phaser GameObject classes
 */
export interface NodeMap {
  View: Phaser.GameObjects.Container
  Text: Phaser.GameObjects.Text
  NineSlice: Phaser.GameObjects.NineSlice
  Sprite: Phaser.GameObjects.Sprite
  Image: Phaser.GameObjects.Image
  Graphics: Phaser.GameObjects.Graphics
  TileSprite: Phaser.GameObjects.TileSprite
}

/**
 * Maps node type names to their props interfaces
 */
export interface NodePropsMap {
  View: ViewBaseProps
  Text: TextBaseProps
  NineSlice: NineSliceBaseProps
  Sprite: SpriteBaseProps
  Image: ImageBaseProps
  Graphics: GraphicsBaseProps
  TileSprite: TileSpriteBaseProps
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
