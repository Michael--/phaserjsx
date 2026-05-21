import type * as Phaser from 'phaser'

/**
 * Internal alias for DrawingContext exposing the scissor state fields
 * that are not present in the public type declarations.
 */
type DC = Phaser.Renderer.WebGL.DrawingContext & {
  state: {
    scissor: {
      /** Scissor rect in WebGL bottom-left coords: [x, y_gl, w, h] */
      box: [number, number, number, number]
      enable: boolean
    }
  }
}

/**
 * Phaser 4 ContainerWebGLRenderer call signature.
 * Differs from Phaser 3: camera is embedded in DrawingContext, not a direct arg.
 */
type ContainerRenderFn = (
  renderer: Phaser.Renderer.WebGL.WebGLRenderer,
  container: Phaser.GameObjects.Container,
  drawingContext: DC,
  parentMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
  renderStep: number | undefined,
  displayList: Phaser.GameObjects.GameObject[] | undefined,
  displayListIndex: number | undefined
) => void

/**
 * Intersects a candidate screen-space rect with the one currently stored
 * in the drawing context (which is kept in WebGL bottom-left coords).
 *
 * @param dc - The active drawing context
 * @param left - Candidate left edge in screen-space (top-left origin)
 * @param top - Candidate top edge in screen-space (top-left origin)
 * @param w - Candidate width
 * @param h - Candidate height
 * @returns Intersected rect as [left, top, w, h] in screen-space
 */
function intersectWithContextScissor(
  dc: DC,
  left: number,
  top: number,
  w: number,
  h: number
): [number, number, number, number] {
  // state.scissor.box is stored in WebGL space (y from bottom) → convert to screen
  const prev = dc.state.scissor.box
  const pLeft = prev[0]
  const pTop = dc.height - prev[1] - prev[3]
  const pW = prev[2]
  const pH = prev[3]

  const iLeft = Math.max(left, pLeft)
  const iTop = Math.max(top, pTop)
  const iW = Math.max(0, Math.min(left + w, pLeft + pW) - iLeft)
  const iH = Math.max(0, Math.min(top + h, pTop + pH) - iTop)
  return [iLeft, iTop, iW, iH]
}

/**
 * Patches a Container's renderWebGL to clip its children using the WebGL
 * scissor test instead of a filter/mask.
 *
 * Characteristics vs. the Mask filter approach:
 * - No filter pipeline overhead (zero extra draw passes)
 * - Axis-aligned only – rotation of the clip rect is NOT supported
 * - Sharp, binary clip: no alpha blending at the boundary
 * - Nesting works correctly via DrawingContext cloning + intersection
 *
 * @param container - The Container to clip
 * @param clipW - Clip rect width in world units
 * @param clipH - Clip rect height in world units
 * @param offsetX - Horizontal offset of the clip center from the container
 *   origin, in world units. Defaults to 0 (clip centered on container).
 * @param offsetY - Vertical offset of the clip center from the container
 *   origin, in world units. Defaults to 0.
 */
export function applyScissorClip(
  container: Phaser.GameObjects.Container,
  clipW: number,
  clipH: number,
  offsetX = 0,
  offsetY = 0
): void {
  const obj = container as unknown as {
    renderWebGL: ContainerRenderFn
    _renderSteps: Array<ContainerRenderFn | undefined>
  }

  // In Phaser 4, renderWebGLStep dispatches via _renderSteps[], NOT renderWebGL directly.
  // The constructor captures `this.renderWebGL` into _renderSteps[0] at creation time,
  // so patching the property alone is invisible to the render loop.
  const original = obj._renderSteps[0]
  if (!original) return

  const wrapper: ContainerRenderFn = (
    renderer,
    go,
    drawingContext,
    parentMatrix,
    renderStep,
    displayList,
    displayListIndex
  ) => {
    const dc = drawingContext as DC
    const cam = dc.camera
    if (!cam) {
      original(
        renderer,
        go,
        drawingContext,
        parentMatrix,
        renderStep,
        displayList,
        displayListIndex
      )
      return
    }
    const zoom = cam.zoom

    // World position of the clip center
    const worldCX = container.x + offsetX
    const worldCY = container.y + offsetY

    // World → screen-space (top-left origin, game/CSS pixels)
    const screenLeft = Math.round((worldCX - cam.scrollX) * zoom + cam.x - (clipW * zoom) / 2)
    const screenTop = Math.round((worldCY - cam.scrollY) * zoom + cam.y - (clipH * zoom) / 2)
    const screenW = Math.round(clipW * zoom)
    const screenH = Math.round(clipH * zoom)

    // Intersect with the parent scissor so nested clips are correct
    const [iLeft, iTop, iW, iH] = intersectWithContextScissor(
      dc,
      screenLeft,
      screenTop,
      screenW,
      screenH
    )

    // Clone the context, apply the new scissor, activate, render, restore.
    // Cloning is the Phaser 4 idiomatic approach: each call to beginDraw()
    // (which precedes every GL draw call) re-applies the context's full state,
    // so scissor is automatically restored when the outer context is next used.
    const cloned = dc.getClone() as DC
    cloned.setScissorEnable(true)
    cloned.setScissorBox(iLeft, iTop, iW, iH)
    cloned.use() // flush any pending batch before changing scissor state

    original(
      renderer,
      go,
      cloned as unknown as DC,
      parentMatrix,
      renderStep,
      displayList,
      displayListIndex
    )

    cloned.release() // flush last batch of children; scissor restores automatically
  }

  obj._renderSteps[0] = wrapper
  obj.renderWebGL = wrapper // keep the property in sync for any direct callers
}
