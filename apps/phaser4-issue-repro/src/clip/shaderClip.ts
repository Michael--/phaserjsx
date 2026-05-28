import * as Phaser from 'phaser'
import type { ContainerRenderFn, RNManager, ScissorCache } from './shared'

/** Handle returned by {@link applyShaderClip} to modify or remove the clip at runtime. */
export interface ShaderClipHandle {
  /**
   * Adjusts the clip rectangle without destroying and re-creating the clip.
   * @param options - Partial overrides for width, height, offsetX, offsetY.
   */
  modify(options: { width?: number; height?: number; offsetX?: number; offsetY?: number }): void

  /** Marks cached screen-space coordinates as stale so they are recomputed on next render. */
  invalidate(): void

  /** Removes the shader clip step and restores the container's original render function. */
  destroy(): void
}

// Symbol used to attach the handle to the container object without polluting its type.
const SHADER_HANDLE = Symbol('shaderClipHandle')

/** Per-drawing-context clip rectangle state tracked by the shader clip system. */
interface ShaderClipState {
  enable: boolean
  left: number
  top: number
  width: number
  height: number
}

type BatchProgramManagerLike = {
  getAddition: (name: string) => unknown
  addAddition: (addition: {
    name: string
    additions: {
      fragmentHeader: string
      fragmentProcess: string
    }
    tags: string[]
    disable: boolean
  }) => void
  setUniform: (name: string, value: unknown) => void
}

type BatchHandlerLike = {
  setupUniforms: (drawingContext: Phaser.Renderer.WebGL.DrawingContext) => void
  programManager: BatchProgramManagerLike
  __shaderClipPatched?: boolean
}

type RenderNodeManagerLike = RNManager & {
  getNode: (name: string) => BatchHandlerLike
  __shaderClipInstalled?: boolean
}

const SHADER_CLIP_ADDITION_NAME = 'ShaderClipRect'
const SHADER_CLIP_CTX_KEY = '__shaderClipState'

const SHADER_CLIP_DEFAULT_STATE: ShaderClipState = {
  enable: false,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
}

const SHADER_CLIP_FRAGMENT_HEADER = `
uniform vec4 uShaderClipRect;
uniform float uShaderClipEnabled;
`.trim()

const SHADER_CLIP_FRAGMENT_PROCESS = `
if (uShaderClipEnabled > 0.5)
{
    vec2 shaderClipP = floor(vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y));

    if (
        shaderClipP.x < uShaderClipRect.x ||
        shaderClipP.y < uShaderClipRect.y ||
        shaderClipP.x >= uShaderClipRect.x + uShaderClipRect.z ||
        shaderClipP.y >= uShaderClipRect.y + uShaderClipRect.w
    )
    {
        discard;
    }
}
`.trim()

/**
 * Reads or initializes the shader clip state on a drawing context.
 * @param drawingContext - The drawing context to query.
 * @returns The mutable ShaderClipState attached to this context.
 */
function getShaderClipState(drawingContext: Phaser.Renderer.WebGL.DrawingContext): ShaderClipState {
  const dc = drawingContext as Phaser.Renderer.WebGL.DrawingContext & {
    [SHADER_CLIP_CTX_KEY]?: ShaderClipState
  }

  if (!dc[SHADER_CLIP_CTX_KEY]) {
    dc[SHADER_CLIP_CTX_KEY] = { ...SHADER_CLIP_DEFAULT_STATE }
  }

  return dc[SHADER_CLIP_CTX_KEY]
}

/**
 * Overwrites the shader clip state on a drawing context.
 * @param drawingContext - The drawing context to update.
 * @param next - The new state to apply.
 */
function setShaderClipState(
  drawingContext: Phaser.Renderer.WebGL.DrawingContext,
  next: ShaderClipState
): void {
  const state = getShaderClipState(drawingContext)
  state.enable = next.enable
  state.left = next.left
  state.top = next.top
  state.width = next.width
  state.height = next.height
}

/**
 * Returns true when two ShaderClipState values are identical.
 * @param a - First state.
 * @param b - Second state.
 * @returns Whether the states are equal.
 */
function shaderClipStateEquals(a: ShaderClipState, b: ShaderClipState): boolean {
  return (
    a.enable === b.enable &&
    a.left === b.left &&
    a.top === b.top &&
    a.width === b.width &&
    a.height === b.height
  )
}

/**
 * Intersects the current shader clip state with a new rectangle.
 * @param current - The currently active clip state.
 * @param left - Left edge of the new clip in screen space.
 * @param top - Top edge of the new clip in screen space.
 * @param width - Width of the new clip.
 * @param height - Height of the new clip.
 * @param out - Output intersected clip state.
 */
function intersectShaderClip(
  current: ShaderClipState,
  left: number,
  top: number,
  width: number,
  height: number,
  out: ShaderClipState
): void {
  if (!current.enable) {
    out.enable = true
    out.left = left
    out.top = top
    out.width = width
    out.height = height
    return
  }

  const right = left + width
  const bottom = top + height
  const pRight = current.left + current.width
  const pBottom = current.top + current.height

  const iLeft = Math.max(left, current.left)
  const iTop = Math.max(top, current.top)
  const iWidth = Math.max(0, Math.min(right, pRight) - iLeft)
  const iHeight = Math.max(0, Math.min(bottom, pBottom) - iTop)

  out.enable = true
  out.left = iLeft
  out.top = iTop
  out.width = iWidth
  out.height = iHeight
}

/**
 * Pushes the current shader clip uniforms to the batch handler.
 * @param handler - The batch handler whose program manager receives the uniforms.
 * @param drawingContext - The drawing context that holds the clip state.
 */
function setupShaderClipUniforms(
  handler: BatchHandlerLike,
  drawingContext: Phaser.Renderer.WebGL.DrawingContext
): void {
  const state = getShaderClipState(drawingContext)
  const pm = handler.programManager

  pm.setUniform('uResolution', [drawingContext.width, drawingContext.height])
  pm.setUniform('uShaderClipEnabled', state.enable ? 1 : 0)
  pm.setUniform(
    'uShaderClipRect',
    state.enable ? [state.left, state.top, state.width, state.height] : [0, 0, 0, 0]
  )
}

/**
 * Monkey-patches a batch handler to forward shader clip uniforms on each draw.
 * Idempotent – safe to call multiple times for the same handler.
 * @param handler - The Phaser 4 batch handler to patch.
 */
function patchBatchHandlerForShaderClip(handler: BatchHandlerLike): void {
  if (handler.__shaderClipPatched) {
    return
  }

  const pm = handler.programManager
  if (!pm.getAddition(SHADER_CLIP_ADDITION_NAME)) {
    pm.addAddition({
      name: SHADER_CLIP_ADDITION_NAME,
      additions: {
        fragmentHeader: SHADER_CLIP_FRAGMENT_HEADER,
        fragmentProcess: SHADER_CLIP_FRAGMENT_PROCESS,
      },
      tags: ['SHADER_CLIP'],
      disable: false,
    })
  }

  const originalSetupUniforms = handler.setupUniforms
  handler.setupUniforms = function patchedSetupUniforms(
    this: BatchHandlerLike,
    drawingContext: Phaser.Renderer.WebGL.DrawingContext
  ): void {
    originalSetupUniforms.call(this, drawingContext)
    setupShaderClipUniforms(this, drawingContext)
  }

  handler.__shaderClipPatched = true
}

/**
 * Ensures the BatchHandlerQuad and BatchHandlerTriFlat nodes are patched for shader clip.
 * Idempotent – called once per renderer.
 * @param renderer - The active WebGLRenderer.
 */
function ensureShaderBatchClipPatched(renderer: Phaser.Renderer.WebGL.WebGLRenderer): void {
  const manager = renderer.renderNodes as unknown as RenderNodeManagerLike

  if (manager.__shaderClipInstalled) {
    return
  }

  patchBatchHandlerForShaderClip(manager.getNode('BatchHandlerQuad'))
  patchBatchHandlerForShaderClip(manager.getNode('BatchHandlerTriFlat'))

  manager.__shaderClipInstalled = true
}

/**
 * Applies a fragment-shader clip to a Phaser 4 Container.
 *
 * Patches the batch shaders to discard fragments outside the clip rectangle.
 * Intersects with any parent shader clip that is already active.
 *
 * @param container - The container to clip.
 * @param width - Width of the clip rectangle in world units.
 * @param height - Height of the clip rectangle in world units.
 * @param offsetX - Horizontal offset from the container's origin. Defaults to 0.
 * @param offsetY - Vertical offset from the container's origin. Defaults to 0.
 * @returns A handle to modify or remove the clip.
 */
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

  const renderer = container.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  ensureShaderBatchClipPatched(renderer)

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
  const intersectedState: ShaderClipState = { ...SHADER_CLIP_DEFAULT_STATE }
  const nextState: ShaderClipState = { ...SHADER_CLIP_DEFAULT_STATE }

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
    webglRenderer,
    go,
    drawingContext,
    parentMatrix,
    renderStep,
    displayList,
    displayListIndex
  ) => {
    if (destroyed) {
      original(
        webglRenderer,
        go,
        drawingContext,
        parentMatrix,
        renderStep,
        displayList,
        displayListIndex
      )
      return
    }

    const dc = drawingContext as Phaser.Renderer.WebGL.DrawingContext
    const cam = dc.camera
    if (!cam) {
      original(
        webglRenderer,
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

    const prevState = getShaderClipState(dc)
    const prevSnapshot: ShaderClipState = {
      enable: prevState.enable,
      left: prevState.left,
      top: prevState.top,
      width: prevState.width,
      height: prevState.height,
    }

    intersectShaderClip(prevSnapshot, screenLeft, screenTop, screenW, screenH, intersectedState)

    nextState.enable = true
    nextState.left = intersectedState.left
    nextState.top = intersectedState.top
    nextState.width = intersectedState.width
    nextState.height = intersectedState.height

    const rn = (webglRenderer as unknown as { renderNodes: RNManager }).renderNodes

    const changed = !shaderClipStateEquals(prevSnapshot, nextState)
    if (changed && rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    if (nextState.width <= 0 || nextState.height <= 0) {
      return
    }

    if (changed) {
      setShaderClipState(dc, nextState)
    }

    original(
      webglRenderer,
      go,
      drawingContext,
      parentMatrix,
      renderStep,
      displayList,
      displayListIndex
    )

    if (changed && rn.currentBatchNode !== null) {
      rn.finishBatch()
    }

    if (changed) {
      setShaderClipState(dc, prevSnapshot)
    }
  }

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
      cache = null

      obj._renderSteps[0] = original
      obj.renderWebGL = original
      delete obj[SHADER_HANDLE]
    },
  }

  obj._renderSteps[0] = wrapper
  obj.renderWebGL = wrapper
  obj[SHADER_HANDLE] = handle

  return handle
}
