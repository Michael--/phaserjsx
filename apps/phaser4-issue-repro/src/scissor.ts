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
  // If no parent scissor is active the full viewport is visible — no intersection needed.
  if (!dc.state.scissor.enable) {
    return [left, top, w, h]
  }

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
 * Minimal view of the RenderNodeManager needed to conditionally flush the batch.
 * `currentBatchNode` is null when the batch is empty — we check this to avoid
 * issuing a flush (and a GL draw call) when there is nothing pending.
 */
type RNManager = {
  currentBatchNode: unknown
  finishBatch: () => void
}

/**
 * Screen-space scissor rect cache.
 * Stores the pre-intersection [screenLeft, screenTop, screenW, screenH]
 * together with the container/camera values they were derived from.
 * The intersection with the parent scissor is kept out of the cache because
 * the parent state can change independently (nested clips).
 */
interface ScissorCache {
  worldCX: number
  worldCY: number
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

/**
 * Patches a Container's renderWebGL to clip its children using the WebGL
 * scissor test instead of a filter/mask.
 *
 * Characteristics vs. the Mask filter approach:
 * - Axis-aligned only – rotation of the clip rect is NOT supported
 * - Sharp, binary clip: no alpha blending at the boundary
 * - Nesting works correctly via intersection with the parent scissor state
 * - Near-zero overhead for static containers:
 *   - Screen rect is cached and reused when container + camera are unchanged
 *   - dc state is mutated directly — no DrawingContext clone/allocation per frame
 *   - Batch is only flushed when actually non-empty (currentBatchNode !== null)
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

  // Cached screen-space rect — invalidated when container or camera state changes.
  let cache: ScissorCache | null = null

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

    // World position of the clip center
    const worldCX = container.x + offsetX
    const worldCY = container.y + offsetY

    // Re-use cached screen rect when container and camera are unchanged.
    let screenLeft: number
    let screenTop: number
    let screenW: number
    let screenH: number

    if (
      cache !== null &&
      cache.worldCX === worldCX &&
      cache.worldCY === worldCY &&
      cache.camScrollX === cam.scrollX &&
      cache.camScrollY === cam.scrollY &&
      cache.camZoom === cam.zoom &&
      cache.camX === cam.x &&
      cache.camY === cam.y
    ) {
      ;({ screenLeft, screenTop, screenW, screenH } = cache)
    } else {
      // World → screen-space. Round edges first, derive W/H from them to
      // avoid 1-pixel gaps between adjacent cells caused by independent rounding.
      const zoom = cam.zoom
      const scx = (worldCX - cam.scrollX) * zoom + cam.x
      const scy = (worldCY - cam.scrollY) * zoom + cam.y
      const hw = (clipW * zoom) / 2
      const hh = (clipH * zoom) / 2
      screenLeft = Math.round(scx - hw)
      screenTop = Math.round(scy - hh)
      screenW = Math.round(scx + hw) - screenLeft
      screenH = Math.round(scy + hh) - screenTop
      cache = {
        worldCX,
        worldCY,
        camScrollX: cam.scrollX,
        camScrollY: cam.scrollY,
        camZoom: cam.zoom,
        camX: cam.x,
        camY: cam.y,
        screenLeft,
        screenTop,
        screenW,
        screenH,
      }
    }

    // Intersect with the parent scissor so nested clips are correct.
    // Done live (not cached) because parent state can change independently.
    const [iLeft, iTop, iW, iH] = intersectWithContextScissor(
      dc,
      screenLeft,
      screenTop,
      screenW,
      screenH
    )

    // Save scissor state (box is in WebGL bottom-left coords).
    // setScissorBox() replaces the box array with a new one, so we save the
    // four values individually and restore by reassigning — not by mutating
    // the old reference which dc would no longer hold after setScissorBox.
    const prevEnable = dc.state.scissor.enable
    const prevBox = dc.state.scissor.box.slice() as [number, number, number, number]

    // Flush the pending batch before changing scissor state so that any draws
    // already queued (from earlier objects in the display list) are rendered
    // with the old scissor. Skip the GL draw call entirely when the batch is empty.
    const rn = (renderer as unknown as { renderNodes: RNManager }).renderNodes
    if (rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    // Apply the new scissor directly to the existing dc — no clone/allocation.
    // Each child's beginDraw() re-applies dc.state to GL before every draw call.
    dc.setScissorEnable(true)
    dc.setScissorBox(iLeft, iTop, iW, iH)

    original(renderer, go, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)

    // Flush children's draws before restoring the scissor state.
    if (rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    // Restore scissor state. Reassign the box (not mutate) because setScissorBox
    // already replaced dc.state.scissor.box with a new array — the old reference
    // is gone. The next beginDraw() will push the restored state to GL before
    // any subsequent draw, so no immediate GL call is needed here.
    dc.state.scissor.box = prevBox
    dc.setScissorEnable(prevEnable)
  }

  obj._renderSteps[0] = wrapper
  obj.renderWebGL = wrapper // keep the property in sync for any direct callers
}
