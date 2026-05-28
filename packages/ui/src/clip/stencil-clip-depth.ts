import type * as Phaser from 'phaser'

/**
 * Shared depth counter per GL context.
 * Incremented before each clip's INCR pass, decremented after the DECR pass.
 */
const _depthByGl = new WeakMap<WebGLRenderingContext, { value: number }>()

const _prerenderHooked = new WeakSet<Phaser.Game>()

export function getDepth(gl: WebGLRenderingContext): { value: number } {
  let d = _depthByGl.get(gl)
  if (!d) {
    d = { value: 0 }
    _depthByGl.set(gl, d)
  }
  return d
}

/**
 * Registers a per-frame prerender listener that resets stencil clip state.
 * Registered at most once per Phaser.Game instance.
 */
export function ensurePrerenderReset(
  gl: WebGLRenderingContext,
  game: Phaser.Game,
  resetFboState: (gl: WebGLRenderingContext) => void
): void {
  if (_prerenderHooked.has(game)) return
  _prerenderHooked.add(game)
  game.events.on('prerender', () => {
    const d = _depthByGl.get(gl)
    if (d) d.value = 0
    resetFboState(gl)
  })
}
