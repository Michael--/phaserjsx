import * as Phaser from 'phaser'
import type { DC, ContainerRenderFn, RNManager, ScissorCache } from './shared'

/** Handle returned by {@link applyScissorClip} to modify or remove the clip at runtime. */
export interface ScissorClipHandle {
  /**
   * Adjusts the clip rectangle without destroying and re-creating the clip.
   * @param options - Partial overrides for width, height, offsetX, offsetY.
   */
  modify(options: { width?: number; height?: number; offsetX?: number; offsetY?: number }): void

  /** Marks cached screen-space coordinates as stale so they are recomputed on next render. */
  invalidate(): void

  /** Removes the scissor clip step and restores the container's original render function. */
  destroy(): void
}

// Symbol used to attach the handle to the container object without polluting its type.
const SCISSOR_HANDLE = Symbol('scissorClipHandle')

/**
 * Converts the raw scissor box from DrawingContext (bottom-left GL origin) to
 * screen-space (top-left origin) and intersects it with the requested rectangle.
 * @param dc - The current drawing context.
 * @param left - Left edge in screen space (top-left origin).
 * @param top - Top edge in screen space (top-left origin).
 * @param w - Width of the requested clip.
 * @param h - Height of the requested clip.
 * @param out - Output array [left, top, width, height] in screen space.
 * @internal
 */
function intersectScissor(
  dc: DC,
  left: number,
  top: number,
  w: number,
  h: number,
  out: [number, number, number, number]
): void {
  if (!dc.state.scissor.enable) {
    out[0] = left
    out[1] = top
    out[2] = w
    out[3] = h
    return
  }

  const prev = dc.state.scissor.box

  const pLeft = prev[0]
  const pTop = dc.height - prev[1] - prev[3]
  const pRight = pLeft + prev[2]
  const pBottom = pTop + prev[3]

  const right = left + w
  const bottom = top + h

  const iLeft = Math.max(left, pLeft)
  const iTop = Math.max(top, pTop)

  out[0] = iLeft
  out[1] = iTop
  out[2] = Math.max(0, Math.min(right, pRight) - iLeft)
  out[3] = Math.max(0, Math.min(bottom, pBottom) - iTop)
}

/**
 * Applies a scissor-test clip to a Phaser 4 Container.
 *
 * Prepends a render step wrapper that sets up the GL scissor rectangle before
 * rendering the container's children and restores the previous scissor state
 * afterwards.  Intersects with any parent scissor that is already active so
 * nesting is respected automatically.
 *
 * @param container - The container to clip.
 * @param width - Width of the clip rectangle in world units.
 * @param height - Height of the clip rectangle in world units.
 * @param offsetX - Horizontal offset from the container's origin. Defaults to 0.
 * @param offsetY - Vertical offset from the container's origin. Defaults to 0.
 * @returns A handle to modify or remove the clip.
 */
export function applyScissorClip(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0
): ScissorClipHandle {
  const obj = container as unknown as {
    renderWebGL: ContainerRenderFn
    _renderSteps: Array<ContainerRenderFn | undefined>
    [SCISSOR_HANDLE]?: ScissorClipHandle
  }

  if (obj[SCISSOR_HANDLE]) {
    obj[SCISSOR_HANDLE].modify({ width, height, offsetX, offsetY })
    return obj[SCISSOR_HANDLE]
  }

  const original = obj._renderSteps[0]

  if (!original) {
    return {
      modify() {},
      invalidate() {},
      destroy() {},
    }
  }

  let clipW = width
  let clipH = height
  let clipOffsetX = offsetX
  let clipOffsetY = offsetY

  let worldCX = 0
  let worldCY = 0
  let dirty = true
  let destroyed = false

  let cache: ScissorCache | null = null

  const intersected: [number, number, number, number] = [0, 0, 0, 0]

  /**
   * Marks the cached world position as stale.
   */
  function invalidate(): void {
    dirty = true
    cache = null
  }

  /**
   * Recomputes world-space center from container position and offset.
   */
  function rebuildStaticValues(): void {
    worldCX = container.x + clipOffsetX
    worldCY = container.y + clipOffsetY
    dirty = false
  }

  const wrapper: ContainerRenderFn = (
    renderer,
    go,
    drawingContext,
    parentMatrix,
    renderStep,
    displayList,
    displayListIndex
  ) => {
    if (destroyed) {
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

    if (dirty) {
      rebuildStaticValues()
    }

    const camScrollX = cam.scrollX
    const camScrollY = cam.scrollY
    const camZoom = cam.zoom
    const camX = cam.x
    const camY = cam.y

    let screenLeft: number
    let screenTop: number
    let screenW: number
    let screenH: number

    if (
      cache &&
      cache.camScrollX === camScrollX &&
      cache.camScrollY === camScrollY &&
      cache.camZoom === camZoom &&
      cache.camX === camX &&
      cache.camY === camY
    ) {
      screenLeft = cache.screenLeft
      screenTop = cache.screenTop
      screenW = cache.screenW
      screenH = cache.screenH
    } else {
      const scx = (worldCX - camScrollX) * camZoom + camX
      const scy = (worldCY - camScrollY) * camZoom + camY
      const hw = (clipW * camZoom) / 2
      const hh = (clipH * camZoom) / 2

      screenLeft = Math.round(scx - hw)
      screenTop = Math.round(scy - hh)
      screenW = Math.round(scx + hw) - screenLeft
      screenH = Math.round(scy + hh) - screenTop

      cache = {
        camScrollX,
        camScrollY,
        camZoom,
        camX,
        camY,
        screenLeft,
        screenTop,
        screenW,
        screenH,
      }
    }

    intersectScissor(dc, screenLeft, screenTop, screenW, screenH, intersected)

    const iLeft = intersected[0]
    const iTop = intersected[1]
    const iW = intersected[2]
    const iH = intersected[3]

    const rn = (renderer as unknown as { renderNodes: RNManager }).renderNodes

    if (rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    if (iW <= 0 || iH <= 0) {
      return
    }

    const prevEnable = dc.state.scissor.enable
    const prevBox = dc.state.scissor.box
    const prevX = prevBox[0]
    const prevY = prevBox[1]
    const prevW = prevBox[2]
    const prevH = prevBox[3]

    const curBox = dc.state.scissor.box
    const sameScissor =
      dc.state.scissor.enable &&
      curBox[0] === iLeft &&
      curBox[1] === iTop &&
      curBox[2] === iW &&
      curBox[3] === iH

    if (!sameScissor) {
      dc.setScissorEnable(true)
      dc.setScissorBox(iLeft, iTop, iW, iH)
    }

    original(renderer, go, drawingContext, parentMatrix, renderStep, displayList, displayListIndex)

    if (rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    dc.state.scissor.box = [prevX, prevY, prevW, prevH]
    dc.setScissorEnable(prevEnable)
  }

  const handle: ScissorClipHandle = {
    modify(options) {
      if (options.width !== undefined) clipW = options.width
      if (options.height !== undefined) clipH = options.height
      if (options.offsetX !== undefined) clipOffsetX = options.offsetX
      if (options.offsetY !== undefined) clipOffsetY = options.offsetY

      invalidate()
    },

    invalidate,

    destroy() {
      if (destroyed) return

      destroyed = true
      cache = null

      obj._renderSteps[0] = original
      obj.renderWebGL = original
      delete obj[SCISSOR_HANDLE]
    },
  }

  obj._renderSteps[0] = wrapper
  obj.renderWebGL = wrapper
  obj[SCISSOR_HANDLE] = handle

  return handle
}
