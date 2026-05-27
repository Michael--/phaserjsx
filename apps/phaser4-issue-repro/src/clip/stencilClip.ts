import * as Phaser from 'phaser'
import type { ContainerRenderFn, RNManager } from './shared'

/** Handle returned by {@link applyStencilClip} to modify or remove the clip at runtime. */
export interface StencilClipHandle {
  /**
   * Adjusts the clip rectangle without destroying and re-creating the clip.
   * @param options - Partial overrides for width, height, offsetX, offsetY.
   */
  modify(options: { width?: number; height?: number; offsetX?: number; offsetY?: number }): void

  /** Removes the stencil clip step and restores the container's original render function. */
  destroy(): void
}

// Symbol used to attach the handle to the container object without polluting its type.
const STENCIL_HANDLE = Symbol('stencilClipHandle')

// ── WebGL type helpers ────────────────────────────────────────────────────────

/**
 * WebGLRenderingContext extended with the VAO methods that Phaser 4 polyfills
 * onto the context at runtime (either native WebGL2 or via OES_vertex_array_object).
 */
type GLPolyfilled = WebGLRenderingContext & {
  bindVertexArray(vao: WebGLVertexArrayObject | null): void
}

// ── Per-renderer stencil depth counter ───────────────────────────────────────

/**
 * Maps each WebGL context to a shared stencil-depth counter.
 *
 * The counter starts at 0 at the beginning of each frame and is incremented
 * before a clip is applied, decremented after.  This allows unlimited nesting
 * (up to 255 levels) without any global clear between containers.
 */
const _depthByGl = new WeakMap<WebGLRenderingContext, { value: number }>()

/**
 * Returns (or creates) the shared depth counter for a GL context.
 * @param gl - The WebGL context.
 * @returns Mutable object with a `value` property.
 */
function getDepth(gl: WebGLRenderingContext): { value: number } {
  let d = _depthByGl.get(gl)
  if (!d) {
    d = { value: 0 }
    _depthByGl.set(gl, d)
  }
  return d
}

/**
 * Tracks which Phaser.Game instances already have the per-frame reset hook
 * registered so we only add it once.
 */
const _prerenderHooked = new WeakSet<Phaser.Game>()

/**
 * Registers a one-time `prerender` listener on the game that resets the
 * stencil depth counter to 0 at the beginning of each frame.
 * @param gl - The WebGL context associated with the renderer.
 * @param game - The Phaser.Game instance.
 */
function ensurePrerenderReset(gl: WebGLRenderingContext, game: Phaser.Game): void {
  if (_prerenderHooked.has(game)) return
  _prerenderHooked.add(game)

  game.events.on('prerender', () => {
    const d = _depthByGl.get(gl)
    if (d) d.value = 0
  })
}

// ── Minimal stencil mask shader ───────────────────────────────────────────────

/**
 * Cached WebGL programs keyed by context.  The stencil mask shader only needs
 * to emit a position; color output is irrelevant because we always draw with
 * color writes disabled.
 */
const _progByGl = new WeakMap<WebGLRenderingContext, WebGLProgram>()

/**
 * Lazily creates and returns the minimal stencil mask shader program for the
 * given GL context.
 * @param gl - The WebGL context.
 * @returns The compiled and linked WebGLProgram.
 */
function getStencilProg(gl: WebGLRenderingContext): WebGLProgram {
  let prog = _progByGl.get(gl)
  if (prog) return prog

  const vs = gl.createShader(gl.VERTEX_SHADER)
  if (!vs) throw new Error('stencilClip: failed to create vertex shader')
  gl.shaderSource(vs, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}')
  gl.compileShader(vs)

  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fs) throw new Error('stencilClip: failed to create fragment shader')
  gl.shaderSource(fs, 'void main(){gl_FragColor=vec4(0.);}')
  gl.compileShader(fs)

  prog = gl.createProgram()
  if (!prog) throw new Error('stencilClip: failed to create shader program')
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)

  _progByGl.set(gl, prog)
  return prog
}

// ── Mask geometry drawing ─────────────────────────────────────────────────────

/**
 * Draws an axis-aligned rectangle into the stencil buffer using a minimal
 * shader, then fully restores the Phaser-tracked GL state.
 *
 * The function saves and restores the three states that Phaser's
 * WebGLGlobalWrapper tracks (CURRENT_PROGRAM, ARRAY_BUFFER_BINDING and
 * VERTEX_ARRAY_BINDING) so its internal cache remains consistent.
 *
 * NDC conversion uses logical game dimensions (`logW`, `logH`) because Phaser 4
 * may not scale the viewport by device-pixel-ratio.
 *
 * @param gl - The (polyfilled) WebGL context.
 * @param worldCX - Centre X of the rectangle in world / logical pixels.
 * @param worldCY - Centre Y of the rectangle in world / logical pixels.
 * @param w - Width of the rectangle in logical pixels.
 * @param h - Height of the rectangle in logical pixels.
 * @param logW - Logical game width (renderer.width).
 * @param logH - Logical game height (renderer.height).
 * @param vertBuf - Persistent Float32 buffer for the four corner vertices.
 * @param verts - Reusable Float32Array(8) to avoid per-frame allocation.
 */
function drawMaskRect(
  gl: GLPolyfilled,
  worldCX: number,
  worldCY: number,
  w: number,
  h: number,
  logW: number,
  logH: number,
  vertBuf: WebGLBuffer,
  verts: Float32Array
): void {
  const hw = w / 2
  const hh = h / 2

  // TRIANGLE_FAN corners (bottom-left winding irrelevant for solid fill):
  //   [-hw,-hh]  [+hw,-hh]  [+hw,+hh]  [-hw,+hh]
  verts[0] = ((worldCX - hw) / logW) * 2 - 1
  verts[1] = 1 - ((worldCY - hh) / logH) * 2
  verts[2] = ((worldCX + hw) / logW) * 2 - 1
  verts[3] = 1 - ((worldCY - hh) / logH) * 2
  verts[4] = ((worldCX + hw) / logW) * 2 - 1
  verts[5] = 1 - ((worldCY + hh) / logH) * 2
  verts[6] = ((worldCX - hw) / logW) * 2 - 1
  verts[7] = 1 - ((worldCY + hh) / logH) * 2

  // Save the three states tracked by Phaser's WebGLGlobalWrapper.
  const prevProg = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
  const prevBuf = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null
  // VERTEX_ARRAY_BINDING (0x85B5): use hardcoded enum because Phaser's OES
  // polyfill does NOT add the constant to the gl object.
  const prevVAO = gl.getParameter(0x85b5) as WebGLVertexArrayObject | null

  // Unbind any VAO so our attribute setup goes into the default VAO and does
  // not touch any of Phaser's VAOs.
  gl.bindVertexArray(null)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts)

  const prog = getStencilProg(gl)
  gl.useProgram(prog)

  const loc = gl.getAttribLocation(prog, 'a')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

  // Clean up the default VAO's attrib state.
  gl.disableVertexAttribArray(loc)

  // Restore Phaser-tracked state.
  gl.bindBuffer(gl.ARRAY_BUFFER, prevBuf)
  gl.useProgram(prevProg)
  gl.bindVertexArray(prevVAO)
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Applies a WebGL stencil-buffer clip to a Phaser 4 Container.
 *
 * Uses the INCR/DECR stencil model so clips can be arbitrarily nested:
 * each level increments the stencil on enter and decrements it on exit,
 * meaning child clips are automatically intersected with their parent clips.
 *
 * The clip mask shape is an axis-aligned rectangle.  Rotation is not supported
 * (use the shader or filter clip for rotated masks).
 *
 * **Nesting**: works with both Phaser scene-graph nesting (container as child
 * of another container) and flat scene-graph nesting (independent containers
 * rendered in order).  The stencil depth counter is shared per GL context.
 *
 * **Static scenes**: the world position is derived from
 * `container.getWorldTransformMatrix()` and recomputed whenever `modify()` is
 * called or the first time after construction.  Call `modify({})` to manually
 * refresh the position (e.g., after a resize).
 *
 * @param container - The container to clip.
 * @param width - Width of the clip rectangle in world units.
 * @param height - Height of the clip rectangle in world units.
 * @param offsetX - Horizontal offset from the container's world origin. Defaults to 0.
 * @param offsetY - Vertical offset from the container's world origin. Defaults to 0.
 * @returns A handle to modify or remove the clip.
 */
export function applyStencilClip(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0
): StencilClipHandle {
  const obj = container as unknown as {
    renderWebGL: ContainerRenderFn
    _renderSteps: Array<ContainerRenderFn | undefined>
    [STENCIL_HANDLE]?: StencilClipHandle
  }

  if (obj[STENCIL_HANDLE]) {
    obj[STENCIL_HANDLE].modify({ width, height, offsetX, offsetY })
    return obj[STENCIL_HANDLE]
  }

  if (container.scene.renderer.type !== Phaser.WEBGL) {
    return {
      modify() {},
      destroy() {},
    }
  }

  const original = obj._renderSteps[0]

  if (!original) {
    return {
      modify() {},
      destroy() {},
    }
  }

  const renderer = container.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  const gl = renderer.gl as GLPolyfilled

  // Register a per-frame depth reset (safety net for unbalanced INCR/DECR).
  ensurePrerenderReset(gl, container.scene.game)

  // Persistent vertex buffer – reused every frame to avoid GC pressure.
  const vertBuf = gl.createBuffer()
  if (!vertBuf) throw new Error('stencilClip: failed to create vertex buffer')
  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(8), gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const verts = new Float32Array(8)

  let clipW = width
  let clipH = height
  let clipOffsetX = offsetX
  let clipOffsetY = offsetY
  let destroyed = false

  // Cached world-space centre (recomputed on first render after construction
  // or after modify()).
  let worldCX = 0
  let worldCY = 0
  let dirty = true

  /**
   * Recomputes world-space centre from the container's current world transform.
   */
  function rebuildWorldPos(): void {
    const m = container.getWorldTransformMatrix()
    worldCX = m.tx + clipOffsetX
    worldCY = m.ty + clipOffsetY
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

    if (dirty) rebuildWorldPos()

    const rn = (webglRenderer as unknown as { renderNodes: RNManager }).renderNodes
    const depth = getDepth(gl)

    // Capture this clip's depth level BEFORE incrementing so nested children
    // see a higher value.
    const myDepth = depth.value++

    const logW = webglRenderer.width
    const logH = webglRenderer.height

    // ── Push: write mask geometry into stencil buffer ─────────────────────
    rn.finishBatch()

    if (myDepth === 0) gl.enable(gl.STENCIL_TEST)

    gl.colorMask(false, false, false, false)
    gl.stencilMask(0xff)
    // Draw mask only where stencil already equals myDepth (parent level).
    // INCR writes myDepth+1 in the mask area.
    gl.stencilFunc(gl.EQUAL, myDepth, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR)

    drawMaskRect(gl, worldCX, worldCY, clipW, clipH, logW, logH, vertBuf, verts)

    // ── Content render: test for myDepth+1, protect stencil ───────────────
    gl.colorMask(true, true, true, true)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.stencilMask(0x00)

    original(
      webglRenderer,
      go,
      drawingContext,
      parentMatrix,
      renderStep,
      displayList,
      displayListIndex
    )

    // ── Pop: restore stencil to parent's depth via DECR ───────────────────
    rn.finishBatch()

    gl.colorMask(false, false, false, false)
    gl.stencilMask(0xff)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR)

    drawMaskRect(gl, worldCX, worldCY, clipW, clipH, logW, logH, vertBuf, verts)

    gl.colorMask(true, true, true, true)

    depth.value--

    if (myDepth === 0) {
      // Outermost level: disable stencil test and reset mask write protection.
      gl.disable(gl.STENCIL_TEST)
      gl.stencilMask(0xff)
    } else {
      // Nested level: restore the parent's content-render stencil state so
      // the parent's remaining children are still clipped correctly.
      gl.stencilFunc(gl.EQUAL, myDepth, 0xff)
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
      gl.stencilMask(0x00)
    }
  }

  const handle: StencilClipHandle = {
    modify(options) {
      if (options.width !== undefined) clipW = options.width
      if (options.height !== undefined) clipH = options.height
      if (options.offsetX !== undefined) clipOffsetX = options.offsetX
      if (options.offsetY !== undefined) clipOffsetY = options.offsetY
      dirty = true
    },

    destroy() {
      if (destroyed) return
      destroyed = true

      gl.deleteBuffer(vertBuf)

      obj._renderSteps[0] = original
      obj.renderWebGL = original
      delete obj[STENCIL_HANDLE]
    },
  }

  obj._renderSteps[0] = wrapper
  obj.renderWebGL = wrapper
  obj[STENCIL_HANDLE] = handle

  return handle
}
