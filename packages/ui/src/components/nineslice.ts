/**
 * NineSlice component implementation - native Phaser NineSlice GameObject
 * Used for scalable UI elements like buttons, panels, progress bars
 */
import type Phaser from 'phaser'
import type { LayoutProps, TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'
import { applyNineSliceProps } from './appliers/applyNineSlice'
import { applyNineSliceLayout } from './appliers/applyNineSliceLayout'
import { applyTransformProps } from './appliers/applyTransform'
import { createNineSliceLayout } from './creators/createNineSliceLayout'
import { createTransform } from './creators/createTransform'

/**
 * Inner bounds of a NineSlice - the content area excluding slices
 */
export interface NineSliceInnerBounds {
  /**
   * X offset from left edge (equals leftWidth)
   */
  x: number
  /**
   * Y offset from top edge (equals topHeight)
   */
  y: number
  /**
   * Width of inner content area (totalWidth - leftWidth - rightWidth)
   */
  width: number
  /**
   * Height of inner content area (totalHeight - topHeight - bottomHeight)
   */
  height: number
}

/**
 * Extended NineSlice reference with slice information and inner bounds
 */
export interface NineSliceRef {
  /**
   * The underlying Phaser NineSlice GameObject
   */
  node: Phaser.GameObjects.NineSlice | null
  /**
   * Width of the left slice in pixels
   */
  leftWidth: number
  /**
   * Width of the right slice in pixels
   */
  rightWidth: number
  /**
   * Height of the top slice in pixels (0 for 3-slice mode)
   */
  topHeight: number
  /**
   * Height of the bottom slice in pixels (0 for 3-slice mode)
   */
  bottomHeight: number
  /**
   * Inner content bounds excluding slices
   * Useful for positioning content within the NineSlice
   */
  innerBounds: NineSliceInnerBounds
}

/**
 * NineSlice-specific properties for texture and slice configuration
 */
export interface NineSliceSpecificProps {
  /**
   * Texture key to use for the NineSlice
   */
  texture: string

  /**
   * Optional frame within the texture atlas
   */
  frame?: string | number

  /**
   * Width of the left slice (in pixels of source texture)
   */
  leftWidth: number

  /**
   * Width of the right slice (in pixels of source texture)
   */
  rightWidth: number

  /**
   * Height of the top slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  topHeight?: number

  /**
   * Height of the bottom slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  bottomHeight?: number
}

/**
 * Base props for NineSlice - composing shared prop groups
 * Note: No InteractionProps - interaction should be handled by parent View container
 */
export interface NineSliceBaseProps extends TransformProps, LayoutProps, NineSliceSpecificProps {}

/**
 * Props for NineSlice component - extends base props with JSX-specific props
 */
export interface NineSliceProps
  extends NineSliceBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.NineSlice> {}

/**
 * NineSlice creator - creates a Phaser NineSlice object
 */
export const nineSliceCreator: HostCreator<'NineSlice'> = (scene, props) => {
  // For width/height, use a small default that will be overridden by layout system
  // This prevents the NineSlice from being created with huge dimensions
  const initialWidth = typeof props.width === 'number' ? props.width : 64
  const initialHeight = typeof props.height === 'number' ? props.height : 64

  const nineSlice = scene.add.nineslice(
    props.x ?? 0,
    props.y ?? 0,
    props.texture,
    props.frame,
    initialWidth,
    initialHeight,
    props.leftWidth,
    props.rightWidth,
    props.topHeight,
    props.bottomHeight
  )
  nineSlice.setOrigin(0, 0) // Top-left origin for easier layout handling as it is in UI

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(nineSlice, props)

  // Setup layout system (props and size provider)
  createNineSliceLayout(nineSlice, props)

  return nineSlice
}

/**
 * NineSlice patcher - updates NineSlice properties
 */
export const nineSlicePatcher: HostPatcher<'NineSlice'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, prev, next)

  // Apply NineSlice-specific props (texture, frame, slice dimensions)
  applyNineSliceProps(node, prev, next)

  // Apply layout props and update size provider if needed
  applyNineSliceLayout(node, prev, next)
}
