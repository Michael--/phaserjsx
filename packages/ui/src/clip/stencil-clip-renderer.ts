import type * as Phaser from 'phaser'
import type { BitmapMaskState, MaskState } from './stencil-clip-state'
import type { StencilBitmapTexture } from './stencil-clip-types'

export type GLPolyfilled = WebGLRenderingContext & {
  bindVertexArray(vao: WebGLVertexArrayObject | null): void
}

const ROUND_RECT_VERT_SRC = `
attribute vec2 a_ndc;
attribute vec2 a_loc;
varying vec2 v_loc;
void main(){gl_Position=vec4(a_ndc,0.,1.);v_loc=a_loc;}
`

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

const STRIDE = 16

function drawRoundRectMaskShape(
  gl: GLPolyfilled,
  matrix: Phaser.GameObjects.Components.TransformMatrix,
  cameraMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
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
  const cx = offsetX + hw
  const cy = offsetY + hh

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
    const wx = a * lx + c * ly + tx
    const wy = b * lx + d * ly + ty
    const sx = cameraMatrix ? cameraMatrix.getX(wx, wy) : wx
    const sy = cameraMatrix ? cameraMatrix.getY(wx, wy) : wy
    verts[i * 4 + 0] = (sx / logW) * 2 - 1
    verts[i * 4 + 1] = 1 - (sy / logH) * 2
    verts[i * 4 + 2] = lx - cx
    verts[i * 4 + 3] = ly - cy
  }

  const prevProg = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
  const prevBuf = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null
  const prevVAO = gl.getParameter(0x85b5) as WebGLVertexArrayObject | null

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
  cameraMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
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
    const sx = cameraMatrix ? cameraMatrix.getX(wx, wy) : wx
    const sy = cameraMatrix ? cameraMatrix.getY(wx, wy) : wy
    verts[i * 4 + 0] = (sx / logW) * 2 - 1
    verts[i * 4 + 1] = 1 - (sy / logH) * 2
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

export function drawMaskShape(
  gl: GLPolyfilled,
  scene: Phaser.Scene,
  matrix: Phaser.GameObjects.Components.TransformMatrix,
  cameraMatrix: Phaser.GameObjects.Components.TransformMatrix | undefined,
  source: MaskState,
  logW: number,
  logH: number,
  vertBuf: WebGLBuffer,
  verts: Float32Array
): void {
  if (source.kind === 'bitmap') {
    const frameInfo = resolveBitmapFrame(scene, source)
    if (!frameInfo) return
    drawBitmapMaskShape(gl, matrix, cameraMatrix, source, frameInfo, logW, logH, vertBuf, verts)
    return
  }

  drawRoundRectMaskShape(
    gl,
    matrix,
    cameraMatrix,
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
