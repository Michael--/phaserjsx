import * as Phaser from 'phaser'

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

export interface ShaderClipHandle {
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
const SHADER_HANDLE = Symbol('shaderClipHandle')

const SHADER_CLIP_NODE = 'FilterShaderClipRect'

const SHADER_CLIP_FRAGMENT_SOURCE = `
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec4 uClipRect;
uniform vec2 uFramebufferSize;

varying vec2 outTexCoord;

void main ()
{
    vec2 p = floor(outTexCoord * uFramebufferSize);

    if (
        p.x < uClipRect.x ||
        p.y < uClipRect.y ||
        p.x >= uClipRect.x + uClipRect.z ||
        p.y >= uClipRect.y + uClipRect.w
    )
    {
        discard;
    }

    gl_FragColor = texture2D(uMainSampler, outTexCoord);
}
`.trim()

type RenderNodeManagerLike = {
  addNodeConstructor: (name: string, ctor: new (...args: never[]) => unknown) => void
  _nodeConstructors?: Record<string, unknown>
}

class ShaderClipFilter extends Phaser.Filters.Controller {
  readonly clipRect: [number, number, number, number]

  constructor(camera: Phaser.Cameras.Scene2D.Camera, width: number, height: number) {
    super(camera, SHADER_CLIP_NODE)
    this.clipRect = [0, 0, width, height]
    this.setPaddingOverride(0, 0, 0, 0)
  }

  setClipRect(x: number, y: number, width: number, height: number): void {
    this.clipRect[0] = x
    this.clipRect[1] = y
    this.clipRect[2] = width
    this.clipRect[3] = height
  }
}

class FilterShaderClipRect extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
    super(SHADER_CLIP_NODE, manager, undefined, SHADER_CLIP_FRAGMENT_SOURCE)
  }

  override setupUniforms(
    controller: ShaderClipFilter,
    drawingContext: Phaser.Renderer.WebGL.DrawingContext
  ): void {
    this.programManager.setUniform('uClipRect', controller.clipRect)
    this.programManager.setUniform('uFramebufferSize', [
      drawingContext.width,
      drawingContext.height,
    ])
  }
}

function ensureShaderClipNode(renderer: Phaser.Renderer.WebGL.WebGLRenderer): void {
  const manager = renderer.renderNodes as unknown as RenderNodeManagerLike

  if (manager._nodeConstructors?.[SHADER_CLIP_NODE]) {
    return
  }

  manager.addNodeConstructor(
    SHADER_CLIP_NODE,
    FilterShaderClipRect as unknown as new (...args: never[]) => unknown
  )
}

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

export function applyShaderClip(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0
): ShaderClipHandle {
  const obj = container as unknown as {
    renderWebGL: ContainerRenderFn
    _renderSteps: Array<ContainerRenderFn | undefined>
    filterCamera?: Phaser.Cameras.Scene2D.Camera
    filters?: {
      internal?: {
        add: (filter: Phaser.Filters.Controller, index?: number) => Phaser.Filters.Controller
        remove: (filter: Phaser.Filters.Controller, forceDestroy?: boolean) => unknown
      }
    } | null
    [SHADER_HANDLE]?: ShaderClipHandle
  }

  if (obj[SHADER_HANDLE]) {
    obj[SHADER_HANDLE].modify({ width, height, offsetX, offsetY })
    return obj[SHADER_HANDLE]
  }

  const rendererType = container.scene.renderer.type
  if (rendererType !== Phaser.WEBGL) {
    return {
      modify() {},
      invalidate() {},
      destroy() {},
    }
  }

  container.enableFilters()

  const renderer = container.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  ensureShaderClipNode(renderer)

  const internalFilters = obj.filters?.internal
  const filterCamera = obj.filterCamera

  const original = obj._renderSteps[0]

  if (!internalFilters || !filterCamera || !original) {
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
  let destroyed = false

  const prevWidth = container.width
  const prevHeight = container.height
  const prevFiltersFocusContext = container.filtersFocusContext
  const prevFiltersAutoFocus = container.filtersAutoFocus

  const clipFilter = new ShaderClipFilter(filterCamera, clipW, clipH)
  internalFilters.add(clipFilter)

  function syncClip(): void {
    const safeW = Math.max(1, Math.round(clipW) + 1)
    const safeH = Math.max(1, Math.round(clipH) + 1)
    const clipLeft = Math.round(clipOffsetX)
    const clipTop = Math.round(clipOffsetY)

    // Container defaults to width/height = 0, which makes Phaser focus filters on the whole context.
    // For shader clipping we need object-space filtering to keep per-container locality and nesting behavior.
    container.setSize(safeW, safeH)
    container.setFiltersFocusContext(false)
    container.setFiltersAutoFocus(true)

    // Offset uses the same semantics as scissor:
    // clip center is shifted in container local space by (offsetX, offsetY).
    clipFilter.setClipRect(clipLeft, clipTop, safeW, safeH)
  }

  function invalidate(): void {
    syncClip()
  }

  syncClip()

  const handle: ShaderClipHandle = {
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

      internalFilters.remove(clipFilter, true)

      container.setSize(prevWidth, prevHeight)
      container.setFiltersFocusContext(prevFiltersFocusContext)
      container.setFiltersAutoFocus(prevFiltersAutoFocus)

      obj._renderSteps[0] = original
      obj.renderWebGL = original
      delete obj[SHADER_HANDLE]
    },
  }

  obj._renderSteps[0] = original
  obj.renderWebGL = original
  obj[SHADER_HANDLE] = handle

  return handle
}
