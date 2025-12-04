/**
 * Core type system for native Phaser GameObject primitives
 * Defines the mapping between node type names and their corresponding Phaser types
 */
import type Phaser from 'phaser'
import type { GraphicsBaseProps } from './components/primitives/graphics'
import type { ImageBaseProps } from './components/primitives/image'
import type { NineSliceBaseProps } from './components/primitives/nineslice'
import type { SpriteBaseProps } from './components/primitives/sprite'
import type { TextBaseProps } from './components/primitives/text'
import type { TileSpriteBaseProps } from './components/primitives/tilesprite'
import type { ViewBaseProps } from './components/primitives/view'

/**
 * Maps node type names to Phaser GameObject classes
 */
export interface NodeMap {
  // Primitives (lowercase) - internal use
  view: Phaser.GameObjects.Container
  text: Phaser.GameObjects.Text
  nineslice: Phaser.GameObjects.NineSlice
  sprite: Phaser.GameObjects.Sprite
  image: Phaser.GameObjects.Image
  graphics: Phaser.GameObjects.Graphics
  tilesprite: Phaser.GameObjects.TileSprite
  // Legacy uppercase - backward compatibility
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
  // Primitives (lowercase) - internal use
  view: ViewBaseProps
  text: TextBaseProps
  nineslice: NineSliceBaseProps
  sprite: SpriteBaseProps
  image: ImageBaseProps
  graphics: GraphicsBaseProps
  tilesprite: TileSpriteBaseProps
  // Legacy uppercase - backward compatibility
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
