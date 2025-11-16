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
  const nineSlice = scene.add.nineslice(
    props.x ?? 0,
    props.y ?? 0,
    props.texture,
    props.frame,
    typeof props.width === 'number' ? props.width : 256,
    typeof props.height === 'number' ? props.height : 256,
    props.leftWidth,
    props.rightWidth,
    props.topHeight,
    props.bottomHeight
  )

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
