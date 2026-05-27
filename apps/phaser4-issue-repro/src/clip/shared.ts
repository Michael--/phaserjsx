import type * as Phaser from 'phaser'

/**
 * Phaser 4 DrawingContext extended with scissor state (internal Phaser 4 structure).
 * @internal
 */
export type DC = Phaser.Renderer.WebGL.DrawingContext & {
  state: {
    scissor: {
      box: [number, number, number, number]
      enable: boolean
    }
  }
}

/**
 * Signature of a Phaser 4 container render step function.
 * Matches the internal _renderSteps element type used by Phaser 4.
 * @internal
 */
export type ContainerRenderFn = (
  renderer: Phaser.Renderer.WebGL.WebGLRenderer,
  container: Phaser.GameObjects.Container,
  drawingContext: DC,
  parentMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
  renderStep: number | undefined,
  displayList: Phaser.GameObjects.GameObject[] | undefined,
  displayListIndex: number | undefined
) => void

/**
 * Minimal Phaser 4 RenderNodeManager interface (internal).
 * @internal
 */
export type RNManager = {
  currentBatchNode: unknown
  finishBatch: () => void
}

/**
 * Camera-keyed cache for screen-space clip coordinates.
 * @internal
 */
export interface ScissorCache {
  camScrollX: number
  camScrollY: number
  camZoom: number
  camX: number
  camY: number
  screenLeft: number
  screenTop: number
  screenW: number
  screenH: number
}
