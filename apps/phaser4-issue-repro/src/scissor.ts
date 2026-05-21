import type * as Phaser from 'phaser'

type DC = Phaser.Renderer.WebGL.DrawingContext & {
  state: {
    scissor: {
      box: [number, number, number, number]
      enable: boolean
    }
  }
}

type ContainerRenderFn = (
  renderer: Phaser.Renderer.WebGL.WebGLRenderer,
  container: Phaser.GameObjects.Container,
  drawingContext: DC,
  parentMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
  renderStep: number | undefined,
  displayList: Phaser.GameObjects.GameObject[] | undefined,
  displayListIndex: number | undefined
) => void

type RNManager = {
  currentBatchNode: unknown
  finishBatch: () => void
}

interface ScissorCache {
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

export interface ScissorClipHandle {
  modify(options: { width?: number; height?: number; offsetX?: number; offsetY?: number }): void

  invalidate(): void
  destroy(): void
}

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

const SCISSOR_HANDLE = Symbol('scissorClipHandle')

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

  function invalidate(): void {
    dirty = true
    cache = null
  }

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
