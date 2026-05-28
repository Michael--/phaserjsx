/**
 * Saved stencil state captured just before entering an off-screen FBO.
 * All fields are raw GL enum values / integers from gl.getParameter.
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

export function resetFboPatchState(gl: WebGLRenderingContext): void {
  const fbo = _fboPatchByGl.get(gl)
  if (fbo) {
    fbo.current = null
    fbo.saved = null
  }
}

/**
 * Patches gl.bindFramebuffer once per GL context so that the stencil test is
 * disabled while Phaser renders PostFX / RenderTextures into off-screen FBOs.
 */
export function ensureFboPatch(gl: WebGLRenderingContext): void {
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
      gl.enable(gl.STENCIL_TEST)
      gl.stencilFunc(state.saved.func, state.saved.ref, state.saved.valueMask)
      gl.stencilOp(state.saved.fail, state.saved.zfail, state.saved.zpass)
      gl.stencilMask(state.saved.writeMask)
      state.saved = null
    }
  }
}
