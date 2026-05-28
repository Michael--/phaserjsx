import type * as Phaser from 'phaser'

/** Per-corner radius specification (values in local/CSS units). */
export type StencilCornerRadius = {
  tl?: number
  tr?: number
  bl?: number
  br?: number
}

/** Describes a rounded-rectangle clip in the container's local coordinate space. */
export interface StencilRoundRectClipSource {
  /**
   * Clip source kind.
   * Omit for backwards-compatible `applyStencilClip(container, { width, height })` calls.
   */
  kind?: 'rect' | 'roundRect'
  /** Width of the clip rect in local units. */
  width: number
  /** Height of the clip rect in local units. */
  height: number
  /** X coordinate of the top-left corner in local space. Defaults to 0. */
  offsetX?: number
  /** Y coordinate of the top-left corner in local space. Defaults to 0. */
  offsetY?: number
  /**
   * Corner radii in local units.
   * A single number applies to all four corners uniformly.
   * An object sets each corner individually; missing corners default to 0.
   */
  cornerRadius?: number | StencilCornerRadius
}

/** Backwards-compatible alias for the original rounded-rectangle shape API. */
export type StencilClipShape = StencilRoundRectClipSource

/** Texture reference accepted by bitmap stencil clips. */
export type StencilBitmapTexture = string | Phaser.Textures.Texture | Phaser.Textures.Frame

/** Describes a bitmap alpha clip in the container's local coordinate space. */
export interface StencilBitmapClipSource {
  /** Selects the texture-alpha mask renderer. */
  kind: 'bitmap'
  /** Texture key, Phaser texture, or Phaser frame to sample for mask alpha. */
  texture: StencilBitmapTexture
  /** Optional frame name/index when `texture` is a key or Texture. */
  frame?: string | number
  /** Width of the bitmap mask in local units. Defaults to the selected frame's pixel width. */
  width?: number
  /** Height of the bitmap mask in local units. Defaults to the selected frame's pixel height. */
  height?: number
  /** X coordinate of the top-left corner in local space. Defaults to 0. */
  offsetX?: number
  /** Y coordinate of the top-left corner in local space. Defaults to 0. */
  offsetY?: number
  /** Minimum sampled alpha required to write the stencil. Defaults to 0.5. */
  alphaThreshold?: number
  /** Inverts the alpha test, clipping inside transparent pixels. Defaults to false. */
  invertAlpha?: boolean
}

/** Any mask source supported by the stencil clip renderer. */
export type StencilClipSource = StencilRoundRectClipSource | StencilBitmapClipSource

/** Partial source updates accepted by an existing clip handle. */
export type StencilClipUpdate =
  | Partial<StencilRoundRectClipSource>
  | Partial<StencilBitmapClipSource>
  | StencilClipSource

/** Handle returned by applyStencilClip to update or remove the clip. */
export interface StencilClipHandle {
  /** Updates the clip source. Changes take effect on the next rendered frame. */
  update(source: StencilClipUpdate): void
  /** Removes the clip and restores the container's original render step. */
  destroy(): void
}
