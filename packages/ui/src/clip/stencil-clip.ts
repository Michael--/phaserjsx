/**
 * WebGL stencil-buffer clip for Phaser 4 Containers.
 *
 * Supports arbitrary nesting via the INCR/DECR model: each clip level
 * increments the stencil on enter and decrements on exit, so child clips are
 * automatically intersected with their parent clips at the hardware level.
 *
 * Shape variants:
 *   - Plain rectangle   (cornerRadius omitted or 0)
 *   - Rounded rectangle (uniform radius or per-corner object)
 *
 * A single SDF-based shader handles both variants.  For plain rectangles
 * u_radii is vec4(0) and the `discard` branch never fires — no overhead
 * compared to a rectangle-only shader.
 *
 * Transforms (translate, scale, rotation) are fully supported: the quad
 * corners are transformed through `container.getWorldTransformMatrix()` at
 * render time, so no per-layout world-position tracking is needed.
 */
import * as Phaser from 'phaser'
import { getDepth, ensurePrerenderReset } from './stencil-clip-depth'
import { ensureFboPatch, resetFboPatchState } from './stencil-clip-fbo-bridge'
import { drawMaskShape, type GLPolyfilled } from './stencil-clip-renderer'
import { mergeMaskState, toMaskState } from './stencil-clip-state'
import type { StencilClipHandle, StencilClipSource } from './stencil-clip-types'

export type {
  StencilBitmapClipSource,
  StencilBitmapTexture,
  StencilClipHandle,
  StencilClipShape,
  StencilClipSource,
  StencilClipUpdate,
  StencilCornerRadius,
  StencilRoundRectClipSource,
} from './stencil-clip-types'
export { isBitmapStencilClipSource } from './stencil-clip-state'

// ── Internal Phaser type helpers ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContainerRenderFn = (renderer: any, go: any, ...rest: any[]) => void

type RNManager = { finishBatch(): void }

// ── Attachment symbol ─────────────────────────────────────────────────────────

const STENCIL_HANDLE = Symbol('stencilClipHandle')

/** Returns the active stencil clip handle attached to a container, if any. */
export function getStencilClipHandle(
  container: Phaser.GameObjects.Container
): StencilClipHandle | undefined {
  return (container as unknown as { [STENCIL_HANDLE]?: StencilClipHandle })[STENCIL_HANDLE]
}

/** Removes any active stencil clip from a container. */
export function clearStencilClip(container: Phaser.GameObjects.Container): void {
  getStencilClipHandle(container)?.destroy()
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Applies a WebGL stencil-buffer clip to a Phaser 4 Container.
 *
 * The clip rectangle is expressed in the container's **local coordinate
 * space**.  `offsetX`/`offsetY` mark the top-left corner (default 0/0), so
 * a container whose visual area starts at its local origin can be clipped with
 * `applyStencilClip(container, { width, height })`.
 *
 * **Nesting** is handled transparently: each clip level occupies one stencil
 * value (0 = no clip, 1 = depth 0, 2 = depth 1, …).  Child clips are always
 * the intersection of their own shape and all ancestor shapes.
 *
 * **Transforms** (translate, scale, rotation) are re-evaluated from
 * `container.getWorldTransformMatrix()` on every frame, so animated or
 * scroll-driven containers clip correctly without any manual update call.
 *
 * If a stencil clip is already attached to the container, calling this
 * function again calls `handle.update(shape)` on the existing handle and
 * returns it.
 *
 * @param container - The container to clip.
 * @param source - Clip source in the container's local coordinate space.
 * @returns A handle to modify dimensions / corner radii or remove the clip.
 */
export function applyStencilClip(
  container: Phaser.GameObjects.Container,
  source: StencilClipSource
): StencilClipHandle {
  const obj = container as unknown as {
    _renderSteps: Array<ContainerRenderFn | undefined>
    addRenderStep(fn: ContainerRenderFn, index?: number): Phaser.GameObjects.Container
    [STENCIL_HANDLE]?: StencilClipHandle
  }

  // Re-use existing handle if already attached.
  if (obj[STENCIL_HANDLE]) {
    obj[STENCIL_HANDLE].update(source)
    return obj[STENCIL_HANDLE]
  }

  // No-op for non-WebGL renderers.
  if (container.scene.renderer.type !== Phaser.WEBGL) {
    return { update() {}, destroy() {} }
  }

  const renderer = container.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  const gl = renderer.gl as GLPolyfilled

  ensurePrerenderReset(gl, container.scene.game, resetFboPatchState)
  ensureFboPatch(gl)

  // Persistent vertex buffer: 4 vertices × 4 floats × 4 bytes = 64 bytes.
  const vertBuf = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(16), gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const verts = new Float32Array(16)

  let maskSource = toMaskState(source)
  let destroyed = false

  const wrapper: ContainerRenderFn = (
    webglRenderer,
    go,
    drawingContext,
    parentMatrix,
    renderStep = 0,
    displayList,
    displayListIndex
  ) => {
    const renderNext = () => {
      go.renderWebGLStep(
        webglRenderer,
        go,
        drawingContext,
        parentMatrix,
        renderStep + 1,
        displayList,
        displayListIndex
      )
    }

    if (destroyed) {
      renderNext()
      return
    }

    const matrix = container.getWorldTransformMatrix()
    const rn = (webglRenderer as unknown as { renderNodes: RNManager }).renderNodes
    const depth = getDepth(gl)
    const myDepth = depth.value++

    const logW = webglRenderer.width as number
    const logH = webglRenderer.height as number

    // ── Push: write clip shape into stencil buffer ────────────────────────
    rn.finishBatch()

    if (myDepth === 0) gl.enable(gl.STENCIL_TEST)

    gl.colorMask(false, false, false, false)
    gl.stencilMask(0xff)
    // Write only where the stencil already equals myDepth (parent's level).
    gl.stencilFunc(gl.EQUAL, myDepth, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR)

    drawMaskShape(gl, container.scene, matrix, maskSource, logW, logH, vertBuf, verts)

    // ── Content render: test for myDepth+1, protect stencil ──────────────
    gl.colorMask(true, true, true, true)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.stencilMask(0x00)

    renderNext()

    // ── Pop: restore parent depth via DECR ────────────────────────────────
    rn.finishBatch()

    gl.colorMask(false, false, false, false)
    gl.stencilMask(0xff)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR)

    drawMaskShape(gl, container.scene, matrix, maskSource, logW, logH, vertBuf, verts)

    gl.colorMask(true, true, true, true)
    depth.value--

    if (myDepth === 0) {
      // Outermost clip: disable stencil test and lift write protection.
      gl.disable(gl.STENCIL_TEST)
      gl.stencilMask(0xff)
    } else {
      // Nested clip: restore the parent's content-render stencil state so
      // remaining siblings of this container are still clipped correctly.
      gl.stencilFunc(gl.EQUAL, myDepth, 0xff)
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
      gl.stencilMask(0x00)
    }
  }

  const handle: StencilClipHandle = {
    update(s) {
      maskSource = mergeMaskState(maskSource, s)
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      gl.deleteBuffer(vertBuf)
      const index = obj._renderSteps.indexOf(wrapper)
      if (index !== -1) obj._renderSteps.splice(index, 1)
      delete obj[STENCIL_HANDLE]
    },
  }

  obj.addRenderStep(wrapper, 0)
  obj[STENCIL_HANDLE] = handle

  return handle
}
