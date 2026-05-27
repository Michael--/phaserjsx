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

// ── Internal Phaser type helpers ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContainerRenderFn = (renderer: any, go: any, ...rest: any[]) => void

type RNManager = { finishBatch(): void }

type GLPolyfilled = WebGLRenderingContext & {
  bindVertexArray(vao: WebGLVertexArrayObject | null): void
}

// ── Public API types ──────────────────────────────────────────────────────────

/** Per-corner radius specification (values in local/CSS units). */
export type StencilCornerRadius = {
  tl?: number
  tr?: number
  bl?: number
  br?: number
}

/** Describes the clip rectangle in the container's local coordinate space. */
export interface StencilClipShape {
  /** Width of the clip rect in local units. */
  width: number
  /** Height of the clip rect in local units. */
  height: number
  /**
   * X coordinate of the top-left corner in local space.
   * Defaults to 0 (the container's local origin).
   */
  offsetX?: number
  /**
   * Y coordinate of the top-left corner in local space.
   * Defaults to 0 (the container's local origin).
   */
  offsetY?: number
  /**
   * Corner radii in local units.
   * A single number applies to all four corners uniformly.
   * An object sets each corner individually; missing corners default to 0.
   */
  cornerRadius?: number | StencilCornerRadius
}

/** Handle returned by {@link applyStencilClip} to update or remove the clip. */
export interface StencilClipHandle {
  /**
   * Updates the clip shape.  Changes take effect on the next rendered frame.
   * @param shape - Partial overrides merged with the current shape.
   */
  update(shape: Partial<StencilClipShape>): void
  /** Removes the clip and restores the container's original render step. */
  destroy(): void
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
  })
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
const VERT_SRC = `
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
const FRAG_SRC = `
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

const _progByGl = new WeakMap<WebGLRenderingContext, WebGLProgram>()

/**
 * Returns (or lazily creates) the SDF stencil shader program for a GL context.
 * @param gl - The WebGL context.
 * @returns Compiled and linked WebGLProgram.
 */
function getStencilProg(gl: WebGLRenderingContext): WebGLProgram {
  let prog = _progByGl.get(gl)
  if (prog) return prog

  const vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
  gl.shaderSource(vs, VERT_SRC)
  gl.compileShader(vs)

  const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
  gl.shaderSource(fs, FRAG_SRC)
  gl.compileShader(fs)

  prog = gl.createProgram() as WebGLProgram
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)

  _progByGl.set(gl, prog)
  return prog
}

/** Cached attribute and uniform locations resolved once per shader program. */
interface ShaderLocs {
  ndc: number
  loc: number
  halfSize: WebGLUniformLocation | null
  radii: WebGLUniformLocation | null
}

const _locsByProg = new WeakMap<WebGLProgram, ShaderLocs>()

/**
 * Returns (or resolves and caches) the attribute/uniform locations for a program.
 * @param gl - The WebGL context.
 * @param prog - The shader program.
 * @returns Cached locations.
 */
function getShaderLocs(gl: WebGLRenderingContext, prog: WebGLProgram): ShaderLocs {
  let l = _locsByProg.get(prog)
  if (!l) {
    l = {
      ndc: gl.getAttribLocation(prog, 'a_ndc'),
      loc: gl.getAttribLocation(prog, 'a_loc'),
      halfSize: gl.getUniformLocation(prog, 'u_halfSize'),
      radii: gl.getUniformLocation(prog, 'u_radii'),
    }
    _locsByProg.set(prog, l)
  }
  return l
}

// ── Corner radius helpers ─────────────────────────────────────────────────────

/**
 * Resolves the `cornerRadius` field to `[tl, tr, br, bl]` order matching the
 * `u_radii` vec4 uniform layout.
 * @param r - Raw corner radius value from the clip shape.
 * @returns Tuple `[tl, tr, br, bl]`.
 */
function resolveRadii(
  r: number | StencilCornerRadius | undefined
): [number, number, number, number] {
  if (!r) return [0, 0, 0, 0]
  if (typeof r === 'number') return [r, r, r, r]
  return [r.tl ?? 0, r.tr ?? 0, r.br ?? 0, r.bl ?? 0]
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
function drawMaskShape(
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
    const lx = corners[i]![0]
    const ly = corners[i]![1]
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

  const prog = getStencilProg(gl)
  gl.useProgram(prog)

  const locs = getShaderLocs(gl, prog)
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

// ── Attachment symbol ─────────────────────────────────────────────────────────

const STENCIL_HANDLE = Symbol('stencilClipHandle')

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
 * @param shape - Clip rect geometry in local units.
 * @returns A handle to modify dimensions / corner radii or remove the clip.
 */
export function applyStencilClip(
  container: Phaser.GameObjects.Container,
  shape: StencilClipShape
): StencilClipHandle {
  const obj = container as unknown as {
    renderWebGL: ContainerRenderFn
    _renderSteps: Array<ContainerRenderFn | undefined>
    [STENCIL_HANDLE]?: StencilClipHandle
  }

  // Re-use existing handle if already attached.
  if (obj[STENCIL_HANDLE]) {
    obj[STENCIL_HANDLE].update(shape)
    return obj[STENCIL_HANDLE]
  }

  // No-op for non-WebGL renderers.
  if (container.scene.renderer.type !== Phaser.WEBGL) {
    return { update() {}, destroy() {} }
  }

  const original = obj._renderSteps[0]
  if (!original) {
    return { update() {}, destroy() {} }
  }

  const renderer = container.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
  const gl = renderer.gl as GLPolyfilled

  ensurePrerenderReset(gl, container.scene.game)

  // Persistent vertex buffer: 4 vertices × 4 floats × 4 bytes = 64 bytes.
  const vertBuf = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(16), gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const verts = new Float32Array(16)

  let clipW = shape.width
  let clipH = shape.height
  let clipOffsetX = shape.offsetX ?? 0
  let clipOffsetY = shape.offsetY ?? 0
  let radii = resolveRadii(shape.cornerRadius)
  let destroyed = false

  const wrapper: ContainerRenderFn = (webglRenderer, go, ...rest) => {
    if (destroyed) {
      original(webglRenderer, go, ...rest)
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

    drawMaskShape(
      gl,
      matrix,
      clipOffsetX,
      clipOffsetY,
      clipW,
      clipH,
      logW,
      logH,
      radii,
      vertBuf,
      verts
    )

    // ── Content render: test for myDepth+1, protect stencil ──────────────
    gl.colorMask(true, true, true, true)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.stencilMask(0x00)

    original(webglRenderer, go, ...rest)

    // ── Pop: restore parent depth via DECR ────────────────────────────────
    rn.finishBatch()

    gl.colorMask(false, false, false, false)
    gl.stencilMask(0xff)
    gl.stencilFunc(gl.EQUAL, myDepth + 1, 0xff)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR)

    drawMaskShape(
      gl,
      matrix,
      clipOffsetX,
      clipOffsetY,
      clipW,
      clipH,
      logW,
      logH,
      radii,
      vertBuf,
      verts
    )

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
      if (s.width !== undefined) clipW = s.width
      if (s.height !== undefined) clipH = s.height
      if (s.offsetX !== undefined) clipOffsetX = s.offsetX
      if (s.offsetY !== undefined) clipOffsetY = s.offsetY
      if ('cornerRadius' in s) radii = resolveRadii(s.cornerRadius)
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
