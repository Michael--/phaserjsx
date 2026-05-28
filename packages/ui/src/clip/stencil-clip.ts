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
import {
  mergeMaskState,
  toMaskState,
  type BitmapMaskState,
  type MaskState,
} from './stencil-clip-state'
import type {
  StencilBitmapTexture,
  StencilClipHandle,
  StencilClipSource,
} from './stencil-clip-types'

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

type GLPolyfilled = WebGLRenderingContext & {
  bindVertexArray(vao: WebGLVertexArrayObject | null): void
}

// ── Per-GL-context stencil depth counter ─────────────────────────────────────

/**
 * Shared depth counter per GL context.
 * Incremented before each clip's INCR pass, decremented after the DECR pass.
 * Reset to 0 at the start of every frame via a `prerender` hook.
 */
const _depthByGl = new WeakMap<WebGLRenderingContext, { value: number }>()

function getDepth(gl: WebGLRenderingContext): { value: number } {
  let d = _depthByGl.get(gl)
  if (!d) {
    d = { value: 0 }
    _depthByGl.set(gl, d)
  }
  return d
}

const _prerenderHooked = new WeakSet<Phaser.Game>()

/**
 * Registers a per-frame `prerender` listener that resets the depth counter.
 * Registered at most once per Phaser.Game instance.
 */
function ensurePrerenderReset(gl: WebGLRenderingContext, game: Phaser.Game): void {
  if (_prerenderHooked.has(game)) return
  _prerenderHooked.add(game)
  game.events.on('prerender', () => {
    const d = _depthByGl.get(gl)
    if (d) d.value = 0
    // Safety reset: rendering should start each frame on the main framebuffer.
    const fbo = _fboPatchByGl.get(gl)
    if (fbo) {
      fbo.current = null
      fbo.saved = null
    }
  })
}

// ── FBO / PostFX stencil-state bridge ────────────────────────────────────────

/**
 * Saved stencil state captured just before entering an off-screen FBO.
 * All fields are raw GL enum values / integers from `gl.getParameter`.
 */
interface SavedStencil {
  func: number
  ref: number
  valueMask: number
  fail: number
  zfail: number
  zpass: number
  writeMask: number
}

interface FboPatchState {
  /** Last framebuffer bound through the patched bindFramebuffer call. */
  current: WebGLFramebuffer | null
  /** Stencil state saved when transitioning from main framebuffer to an FBO. */
  saved: SavedStencil | null
}

const _fboPatchByGl = new WeakMap<WebGLRenderingContext, FboPatchState>()

/**
 * Patches `gl.bindFramebuffer` once per GL context so that the stencil test
 * is automatically disabled when Phaser switches to an off-screen FBO (for
 * PostFX / RenderTexture rendering) and restored when switching back.
 *
 * Without this, a PostFX child rendered inside a stencil-clipped container
 * would be invisible: the FBO's stencil buffer starts at 0 while the active
 * stencil test requires `EQUAL(myDepth + 1)`, causing every fragment to fail.
 *
 * The patch is installed once per GL context and remains active for the
 * lifetime of the renderer.  It is a no-op when no stencil clip is active.
 */
function ensureFboPatch(gl: WebGLRenderingContext): void {
  if (_fboPatchByGl.has(gl)) return

  const state: FboPatchState = { current: null, saved: null }
  _fboPatchByGl.set(gl, state)

  const origBind = gl.bindFramebuffer.bind(gl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(gl as any).bindFramebuffer = (target: number, fb: WebGLFramebuffer | null) => {
    const wasMain = state.current === null
    const willBeMain = fb === null
    const enteringOffscreen = wasMain && !willBeMain
    const leavingOffscreen = !wasMain && willBeMain

    if (enteringOffscreen && (gl.getParameter(gl.STENCIL_TEST) as boolean)) {
      // First FBO entry while stencil is active: save full state and disable.
      state.saved = {
        func: gl.getParameter(gl.STENCIL_FUNC) as number,
        ref: gl.getParameter(gl.STENCIL_REF) as number,
        valueMask: gl.getParameter(gl.STENCIL_VALUE_MASK) as number,
        fail: gl.getParameter(gl.STENCIL_FAIL) as number,
        zfail: gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL) as number,
        zpass: gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS) as number,
        writeMask: gl.getParameter(gl.STENCIL_WRITEMASK) as number,
      }
      gl.disable(gl.STENCIL_TEST)
    }

    origBind(target, fb)
    state.current = fb

    if (leavingOffscreen && state.saved) {
      // Back to main framebuffer: restore the stencil state.
      gl.enable(gl.STENCIL_TEST)
      gl.stencilFunc(state.saved.func, state.saved.ref, state.saved.valueMask)
      gl.stencilOp(state.saved.fail, state.saved.zfail, state.saved.zpass)
      gl.stencilMask(state.saved.writeMask)
      state.saved = null
    }
  }
}

// ── SDF stencil mask shader ───────────────────────────────────────────────────

/**
 * Vertex attributes:
 *   a_ndc  vec2 — NDC clip-space position (CPU-computed from world transform)
 *   a_loc  vec2 — position relative to the clip rect's center (for SDF)
 *
 * All four corners are pre-transformed on the CPU so the vertex shader is a
 * pure pass-through.  This correctly handles translation, scale, and rotation
 * without a matrix uniform.
 */
const ROUND_RECT_VERT_SRC = `
attribute vec2 a_ndc;
attribute vec2 a_loc;
varying vec2 v_loc;
void main(){gl_Position=vec4(a_ndc,0.,1.);v_loc=a_loc;}
`

/**
 * SDF rounded-rectangle fragment shader.
 *
 * sdRoundedBox uses the IQ per-corner-radius technique:
 *   r.xy = p.x > 0 ? r.yz : r.xw   (right → tr/br, left → tl/bl)
 *   r.x  = p.y > 0 ? r.y  : r.x    (bottom or top within that pair)
 *
 * u_radii layout: (tl, tr, br, bl).
 *
 * For plain rectangles u_radii = vec4(0.0) and sdRoundedBox returns ≤ 0 for
 * all fragments inside the quad, so `discard` is never executed.
 */
const ROUND_RECT_FRAG_SRC = `
precision mediump float;
varying vec2 v_loc;
uniform vec2 u_halfSize;
uniform vec4 u_radii;
float sdRoundedBox(vec2 p,vec2 b,vec4 r){
  r.xy=p.x>0.?r.yz:r.xw;
  r.x =p.y>0.?r.y :r.x;
  vec2 q=abs(p)-b+r.x;
  return length(max(q,0.))+min(max(q.x,q.y),0.)-r.x;
}
void main(){
  if(sdRoundedBox(v_loc,u_halfSize,u_radii)>0.)discard;
  gl_FragColor=vec4(0.);
}
`

const BITMAP_VERT_SRC = `
attribute vec2 a_ndc;
attribute vec2 a_uv;
varying vec2 v_uv;
void main(){gl_Position=vec4(a_ndc,0.,1.);v_uv=a_uv;}
`

const BITMAP_FRAG_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_alphaThreshold;
uniform float u_invertAlpha;
void main(){
  float a=texture2D(u_texture,v_uv).a;
  bool keep=u_invertAlpha>0.5 ? a<u_alphaThreshold : a>=u_alphaThreshold;
  if(!keep)discard;
  gl_FragColor=vec4(0.);
}
`

const _roundRectProgByGl = new WeakMap<WebGLRenderingContext, WebGLProgram>()
const _bitmapProgByGl = new WeakMap<WebGLRenderingContext, WebGLProgram>()

/**
 * Returns (or lazily creates) the SDF stencil shader program for a GL context.
 * @param gl - The WebGL context.
 * @returns Compiled and linked WebGLProgram.
 */
function createProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
  const vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
  gl.shaderSource(vs, vertSrc)
  gl.compileShader(vs)

  const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
  gl.shaderSource(fs, fragSrc)
  gl.compileShader(fs)

  const prog = gl.createProgram() as WebGLProgram
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)

  return prog
}

function getRoundRectProg(gl: WebGLRenderingContext): WebGLProgram {
  let prog = _roundRectProgByGl.get(gl)
  if (prog) return prog

  prog = createProgram(gl, ROUND_RECT_VERT_SRC, ROUND_RECT_FRAG_SRC)
  _roundRectProgByGl.set(gl, prog)
  return prog
}

function getBitmapProg(gl: WebGLRenderingContext): WebGLProgram {
  let prog = _bitmapProgByGl.get(gl)
  if (prog) return prog

  prog = createProgram(gl, BITMAP_VERT_SRC, BITMAP_FRAG_SRC)
  _bitmapProgByGl.set(gl, prog)
  return prog
}

/** Cached attribute and uniform locations resolved once per shader program. */
interface RoundRectShaderLocs {
  ndc: number
  loc: number
  halfSize: WebGLUniformLocation | null
  radii: WebGLUniformLocation | null
}

interface BitmapShaderLocs {
  ndc: number
  uv: number
  texture: WebGLUniformLocation | null
  alphaThreshold: WebGLUniformLocation | null
  invertAlpha: WebGLUniformLocation | null
}

const _roundRectLocsByProg = new WeakMap<WebGLProgram, RoundRectShaderLocs>()
const _bitmapLocsByProg = new WeakMap<WebGLProgram, BitmapShaderLocs>()

/**
 * Returns (or resolves and caches) the attribute/uniform locations for a program.
 * @param gl - The WebGL context.
 * @param prog - The shader program.
 * @returns Cached locations.
 */
function getRoundRectShaderLocs(
  gl: WebGLRenderingContext,
  prog: WebGLProgram
): RoundRectShaderLocs {
  let l = _roundRectLocsByProg.get(prog)
  if (!l) {
    l = {
      ndc: gl.getAttribLocation(prog, 'a_ndc'),
      loc: gl.getAttribLocation(prog, 'a_loc'),
      halfSize: gl.getUniformLocation(prog, 'u_halfSize'),
      radii: gl.getUniformLocation(prog, 'u_radii'),
    }
    _roundRectLocsByProg.set(prog, l)
  }
  return l
}

function getBitmapShaderLocs(gl: WebGLRenderingContext, prog: WebGLProgram): BitmapShaderLocs {
  let l = _bitmapLocsByProg.get(prog)
  if (!l) {
    l = {
      ndc: gl.getAttribLocation(prog, 'a_ndc'),
      uv: gl.getAttribLocation(prog, 'a_uv'),
      texture: gl.getUniformLocation(prog, 'u_texture'),
      alphaThreshold: gl.getUniformLocation(prog, 'u_alphaThreshold'),
      invertAlpha: gl.getUniformLocation(prog, 'u_invertAlpha'),
    }
    _bitmapLocsByProg.set(prog, l)
  }
  return l
}

// ── Mask quad drawing ─────────────────────────────────────────────────────────

/** Stride in bytes: 4 floats × 4 bytes. */
const STRIDE = 16

/**
 * Transforms the four clip-rect corners through the container's world matrix,
 * uploads them to the vertex buffer, and draws the quad into the stencil.
 *
 * Vertex buffer layout (16 floats / 4 vertices, TRIANGLE_FAN, TL→TR→BR→BL):
 *   [ndcX, ndcY, locX, locY] × 4
 *   where locX/Y is the position relative to the clip rect's center (for SDF).
 *
 * The three GL states tracked by Phaser's `WebGLGlobalWrapper`
 * (`CURRENT_PROGRAM`, `ARRAY_BUFFER_BINDING`, `VERTEX_ARRAY_BINDING`) are
 * saved and restored so its internal caches stay consistent.
 *
 * @param gl - The (VAO-polyfilled) WebGL context.
 * @param matrix - Container's current world transform matrix.
 * @param offsetX - Top-left X of the clip rect in local space.
 * @param offsetY - Top-left Y of the clip rect in local space.
 * @param w - Clip rect width in local units.
 * @param h - Clip rect height in local units.
 * @param logW - Logical game width (`renderer.width`).
 * @param logH - Logical game height (`renderer.height`).
 * @param radii - Per-corner radii tuple `[tl, tr, br, bl]`.
 * @param vertBuf - Persistent WebGLBuffer (64 bytes, DYNAMIC_DRAW).
 * @param verts - Reusable Float32Array(16) to avoid per-frame allocation.
 */
function drawRoundRectMaskShape(
  gl: GLPolyfilled,
  matrix: Phaser.GameObjects.Components.TransformMatrix,
  offsetX: number,
  offsetY: number,
  w: number,
  h: number,
  logW: number,
  logH: number,
  radii: [number, number, number, number],
  vertBuf: WebGLBuffer,
  verts: Float32Array
): void {
  const { a, b, c, d, tx, ty } = matrix
  const hw = w / 2
  const hh = h / 2
  // Center of the clip rect in local space.
  const cx = offsetX + hw
  const cy = offsetY + hh

  // The four corners in local space (TL, TR, BR, BL).
  const corners = [
    [cx - hw, cy - hh],
    [cx + hw, cy - hh],
    [cx + hw, cy + hh],
    [cx - hw, cy + hh],
  ] as const

  for (let i = 0; i < 4; i++) {
    const corner = corners[i] as [number, number]
    const lx = corner[0]
    const ly = corner[1]
    // World position via affine transform.
    const wx = a * lx + c * ly + tx
    const wy = b * lx + d * ly + ty
    // NDC conversion using logical renderer dimensions.
    verts[i * 4 + 0] = (wx / logW) * 2 - 1
    verts[i * 4 + 1] = 1 - (wy / logH) * 2
    // SDF local position: relative to the clip rect's center.
    verts[i * 4 + 2] = lx - cx
    verts[i * 4 + 3] = ly - cy
  }

  // Save the three Phaser-tracked GL states.
  const prevProg = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
  const prevBuf = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null
  // VERTEX_ARRAY_BINDING (0x85B5): hardcoded because Phaser's OES polyfill
  // does NOT add this constant to the gl object.
  const prevVAO = gl.getParameter(0x85b5) as WebGLVertexArrayObject | null

  // Unbind Phaser's VAO so our attrib setup goes into the default VAO.
  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts)

  const prog = getRoundRectProg(gl)
  gl.useProgram(prog)

  const locs = getRoundRectShaderLocs(gl, prog)
  gl.enableVertexAttribArray(locs.ndc)
  gl.vertexAttribPointer(locs.ndc, 2, gl.FLOAT, false, STRIDE, 0)
  gl.enableVertexAttribArray(locs.loc)
  gl.vertexAttribPointer(locs.loc, 2, gl.FLOAT, false, STRIDE, 8)

  gl.uniform2f(locs.halfSize, hw, hh)
  gl.uniform4f(locs.radii, radii[0], radii[1], radii[2], radii[3])

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

  gl.disableVertexAttribArray(locs.ndc)
  gl.disableVertexAttribArray(locs.loc)

  // Restore Phaser-tracked state.
  gl.bindBuffer(gl.ARRAY_BUFFER, prevBuf)
  gl.useProgram(prevProg)
  gl.bindVertexArray(prevVAO)
}

type BitmapFrameInfo = {
  webGLTexture: WebGLTexture
  width: number
  height: number
  u0: number
  v0: number
  u1: number
  v1: number
}

function isTextureFrame(value: StencilBitmapTexture): value is Phaser.Textures.Frame {
  return typeof value === 'object' && value !== null && 'glTexture' in value && 'u0' in value
}

function resolveBitmapFrame(scene: Phaser.Scene, source: BitmapMaskState): BitmapFrameInfo | null {
  const frame = isTextureFrame(source.texture)
    ? source.texture
    : typeof source.texture === 'string'
      ? scene.textures.getFrame(source.texture, source.frame)
      : source.texture.get(source.frame)

  if (!frame?.glTexture?.webGLTexture) return null

  return {
    webGLTexture: frame.glTexture.webGLTexture,
    width: source.width ?? frame.cutWidth ?? frame.realWidth,
    height: source.height ?? frame.cutHeight ?? frame.realHeight,
    u0: frame.u0,
    v0: frame.v0,
    u1: frame.u1,
    v1: frame.v1,
  }
}

function drawBitmapMaskShape(
  gl: GLPolyfilled,
  matrix: Phaser.GameObjects.Components.TransformMatrix,
  source: BitmapMaskState,
  frameInfo: BitmapFrameInfo,
  logW: number,
  logH: number,
  vertBuf: WebGLBuffer,
  verts: Float32Array
): void {
  const { a, b, c, d, tx, ty } = matrix
  const x0 = source.offsetX
  const y0 = source.offsetY
  const x1 = x0 + frameInfo.width
  const y1 = y0 + frameInfo.height

  const corners = [
    [x0, y0, frameInfo.u0, frameInfo.v0],
    [x1, y0, frameInfo.u1, frameInfo.v0],
    [x1, y1, frameInfo.u1, frameInfo.v1],
    [x0, y1, frameInfo.u0, frameInfo.v1],
  ] as const

  for (let i = 0; i < 4; i++) {
    const corner = corners[i] as (typeof corners)[number]
    const lx = corner[0]
    const ly = corner[1]
    const wx = a * lx + c * ly + tx
    const wy = b * lx + d * ly + ty
    verts[i * 4 + 0] = (wx / logW) * 2 - 1
    verts[i * 4 + 1] = 1 - (wy / logH) * 2
    verts[i * 4 + 2] = corner[2]
    verts[i * 4 + 3] = corner[3]
  }

  const prevProg = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
  const prevBuf = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null
  const prevVAO = gl.getParameter(0x85b5) as WebGLVertexArrayObject | null
  const prevActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE) as number

  gl.activeTexture(gl.TEXTURE0)
  const prevTexture = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture | null

  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts)

  const prog = getBitmapProg(gl)
  gl.useProgram(prog)

  const locs = getBitmapShaderLocs(gl, prog)
  gl.enableVertexAttribArray(locs.ndc)
  gl.vertexAttribPointer(locs.ndc, 2, gl.FLOAT, false, STRIDE, 0)
  gl.enableVertexAttribArray(locs.uv)
  gl.vertexAttribPointer(locs.uv, 2, gl.FLOAT, false, STRIDE, 8)

  gl.bindTexture(gl.TEXTURE_2D, frameInfo.webGLTexture)
  gl.uniform1i(locs.texture, 0)
  gl.uniform1f(locs.alphaThreshold, source.alphaThreshold)
  gl.uniform1f(locs.invertAlpha, source.invertAlpha ? 1 : 0)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

  gl.disableVertexAttribArray(locs.ndc)
  gl.disableVertexAttribArray(locs.uv)

  gl.bindTexture(gl.TEXTURE_2D, prevTexture)
  gl.activeTexture(prevActiveTexture)
  gl.bindBuffer(gl.ARRAY_BUFFER, prevBuf)
  gl.useProgram(prevProg)
  gl.bindVertexArray(prevVAO)
}

function drawMaskShape(
  gl: GLPolyfilled,
  scene: Phaser.Scene,
  matrix: Phaser.GameObjects.Components.TransformMatrix,
  source: MaskState,
  logW: number,
  logH: number,
  vertBuf: WebGLBuffer,
  verts: Float32Array
): void {
  if (source.kind === 'bitmap') {
    const frameInfo = resolveBitmapFrame(scene, source)
    if (!frameInfo) return
    drawBitmapMaskShape(gl, matrix, source, frameInfo, logW, logH, vertBuf, verts)
    return
  }

  drawRoundRectMaskShape(
    gl,
    matrix,
    source.offsetX,
    source.offsetY,
    source.width,
    source.height,
    logW,
    logH,
    source.radii,
    vertBuf,
    verts
  )
}

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

  ensurePrerenderReset(gl, container.scene.game)
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
