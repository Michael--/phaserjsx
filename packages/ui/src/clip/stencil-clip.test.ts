import * as Phaser from 'phaser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyStencilClip,
  getStencilClipHandle,
  installStencilClipExtension,
  isBitmapStencilClipSource,
  uninstallStencilClipExtension,
} from './index'
import { drawMaskShape, type GLPolyfilled } from './stencil-clip-renderer'

vi.mock('phaser', () => {
  class Container {
    scene: unknown
    _renderSteps: unknown[] = []

    addRenderStep(fn: unknown, index?: number) {
      if (index === undefined) this._renderSteps.push(fn)
      else this._renderSteps.splice(index, 0, fn)
      return this
    }

    destroy(...args: unknown[]) {
      return args
    }
  }

  const PhaserMock = {
    WEBGL: 1,
    GameObjects: {
      Container,
    },
  }

  return {
    ...PhaserMock,
    default: PhaserMock,
  }
})

function makeWebGlContainer() {
  const gl = {
    ARRAY_BUFFER: 0x8892,
    DYNAMIC_DRAW: 0x88e8,
    createBuffer: vi.fn(() => ({ id: 'buffer' })),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteBuffer: vi.fn(),
    bindFramebuffer: vi.fn(),
  }

  const container = new Phaser.GameObjects.Container(null as unknown as Phaser.Scene)
  container.scene = {
    renderer: {
      type: Phaser.WEBGL,
      gl,
      glWrapper: {
        state: {
          bindings: {
            arrayBuffer: null,
          },
        },
        updateBindingsArrayBuffer: vi.fn(),
      },
    },
    game: {
      events: {
        on: vi.fn(),
      },
    },
  } as unknown as Phaser.Scene

  return { container, gl }
}

describe('stencil clip sources', () => {
  it('detects bitmap sources without treating roundRect shapes as bitmap', () => {
    expect(isBitmapStencilClipSource({ kind: 'bitmap', texture: 'mask' })).toBe(true)
    expect(isBitmapStencilClipSource({ width: 100, height: 50 })).toBe(false)
    expect(isBitmapStencilClipSource({ kind: 'roundRect', width: 100, height: 50 })).toBe(false)
  })
})

describe('applyStencilClip', () => {
  it('attaches, reuses, updates, and destroys a WebGL stencil clip handle', () => {
    const { container, gl } = makeWebGlContainer()
    const renderStepContainer = container as Phaser.GameObjects.Container & {
      _renderSteps: unknown[]
    }

    const handle = applyStencilClip(container, { width: 100, height: 50 })
    expect(getStencilClipHandle(container)).toBe(handle)
    expect(renderStepContainer._renderSteps).toHaveLength(1)

    const sameHandle = applyStencilClip(container, {
      kind: 'bitmap',
      texture: 'mask',
      alphaThreshold: 0.25,
    })
    expect(sameHandle).toBe(handle)
    expect(renderStepContainer._renderSteps).toHaveLength(1)

    handle.update({ width: 80, height: 40 })
    handle.destroy()

    expect(gl.deleteBuffer).toHaveBeenCalledWith({ id: 'buffer' })
    expect(getStencilClipHandle(container)).toBeUndefined()
    expect(renderStepContainer._renderSteps).toHaveLength(0)
  })
})

describe('drawMaskShape', () => {
  it('projects mask vertices through the active camera matrix', () => {
    const uploaded: Float32Array[] = []
    const restoreState = vi.fn()
    const gl = {
      ACTIVE_TEXTURE: 0x84e0,
      ARRAY_BUFFER: 0x8892,
      CURRENT_PROGRAM: 0x8b8d,
      ARRAY_BUFFER_BINDING: 0x8894,
      FLOAT: 0x1406,
      FRAGMENT_SHADER: 0x8b30,
      TEXTURE0: 0x84c0,
      TRIANGLE_FAN: 0x0006,
      VERTEX_SHADER: 0x8b31,
      attachShader: vi.fn(),
      bindBuffer: vi.fn(),
      bindVertexArray: vi.fn(),
      bufferSubData: vi.fn((_: number, __: number, data: Float32Array) => {
        uploaded.push(new Float32Array(data))
      }),
      compileShader: vi.fn(),
      createProgram: vi.fn(() => ({ id: 'program' })),
      createShader: vi.fn((type: number) => ({ type })),
      disableVertexAttribArray: vi.fn(),
      drawArrays: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      getAttribLocation: vi.fn((_: unknown, name: string) => (name === 'a_ndc' ? 0 : 1)),
      getParameter: vi.fn(() => null),
      getUniformLocation: vi.fn((_: unknown, name: string) => ({ name })),
      linkProgram: vi.fn(),
      shaderSource: vi.fn(),
      uniform2f: vi.fn(),
      uniform4f: vi.fn(),
      useProgram: vi.fn(),
      vertexAttribPointer: vi.fn(),
    } as unknown as GLPolyfilled

    drawMaskShape(
      gl,
      {
        renderer: {
          glWrapper: {
            state: {
              bindings: {
                activeTexture: 0,
                arrayBuffer: null,
                program: null,
              },
              vao: null,
            },
            update: restoreState,
          },
        },
      } as unknown as Phaser.Scene,
      { a: 1, b: 0, c: 0, d: 1, tx: 10, ty: 20 } as Phaser.GameObjects.Components.TransformMatrix,
      {
        getX: (x: number) => x + 100,
        getY: (_x: number, y: number) => y + 50,
      } as unknown as Phaser.GameObjects.Components.TransformMatrix,
      {
        kind: 'roundRect',
        width: 20,
        height: 10,
        offsetX: 0,
        offsetY: 0,
        radii: [0, 0, 0, 0],
      },
      200,
      100,
      {} as WebGLBuffer,
      new Float32Array(16)
    )

    expect(uploaded).toHaveLength(1)
    const verts = uploaded[0]
    expect(verts?.[0]).toBeCloseTo(0.1)
    expect(verts?.[1]).toBeCloseTo(-0.4)
    expect(verts?.[4]).toBeCloseTo(0.3)
    expect(verts?.[5]).toBeCloseTo(-0.4)
  })

  it('renders bitmap masks through Phaser texture units and restores active texture state', () => {
    const uploaded: Float32Array[] = []
    const previousTexture = { id: 'previous-texture' }
    const maskTexture = { id: 'mask-texture', webGLTexture: { id: 'mask-webgl-texture' } }
    const textureUnits = {
      units: [previousTexture],
      bind: vi.fn((texture: unknown, unit: number) => {
        textureUnits.units[unit] = texture
      }),
    }
    const updateBindingsActiveTexture = vi.fn()
    const gl = {
      ACTIVE_TEXTURE: 0x84e0,
      ARRAY_BUFFER: 0x8892,
      ARRAY_BUFFER_BINDING: 0x8894,
      CURRENT_PROGRAM: 0x8b8d,
      FLOAT: 0x1406,
      FRAGMENT_SHADER: 0x8b30,
      TEXTURE0: 0x84c0,
      TRIANGLE_FAN: 0x0006,
      VERTEX_SHADER: 0x8b31,
      attachShader: vi.fn(),
      bindBuffer: vi.fn(),
      bindVertexArray: vi.fn(),
      bufferSubData: vi.fn((_: number, __: number, data: Float32Array) => {
        uploaded.push(new Float32Array(data))
      }),
      compileShader: vi.fn(),
      createProgram: vi.fn(() => ({ id: 'bitmap-program' })),
      createShader: vi.fn((type: number) => ({ type })),
      disableVertexAttribArray: vi.fn(),
      drawArrays: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      getAttribLocation: vi.fn((_: unknown, name: string) => (name === 'a_ndc' ? 0 : 1)),
      getParameter: vi.fn((parameter: number) => (parameter === 0x84e0 ? 0x84c3 : null)),
      getUniformLocation: vi.fn((_: unknown, name: string) => ({ name })),
      linkProgram: vi.fn(),
      shaderSource: vi.fn(),
      uniform1f: vi.fn(),
      uniform1i: vi.fn(),
      useProgram: vi.fn(),
      vertexAttribPointer: vi.fn(),
    } as unknown as GLPolyfilled

    const scene = {
      renderer: {
        glTextureUnits: textureUnits,
        glWrapper: {
          updateBindingsActiveTexture,
        },
      },
      textures: {
        getFrame: vi.fn(() => ({
          cutHeight: 16,
          cutWidth: 16,
          glTexture: maskTexture,
          u0: 0,
          u1: 1,
          v0: 0,
          v1: 1,
        })),
      },
    } as unknown as Phaser.Scene

    drawMaskShape(
      gl,
      scene,
      { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 } as Phaser.GameObjects.Components.TransformMatrix,
      undefined,
      {
        alphaThreshold: 0.5,
        frame: undefined,
        height: 16,
        invertAlpha: false,
        kind: 'bitmap',
        offsetX: 0,
        offsetY: 0,
        texture: 'mask',
        width: 16,
      },
      100,
      100,
      {} as WebGLBuffer,
      new Float32Array(16)
    )

    expect(uploaded).toHaveLength(1)
    expect(textureUnits.bind).toHaveBeenNthCalledWith(1, maskTexture, 0)
    expect(textureUnits.bind).toHaveBeenNthCalledWith(2, previousTexture, 0)
    expect(updateBindingsActiveTexture).toHaveBeenCalledWith({
      bindings: {
        activeTexture: 3,
      },
    })
  })
})

describe('stencil clip extension', () => {
  beforeEach(() => {
    uninstallStencilClipExtension()
  })

  it('installs Container prototype methods idempotently', () => {
    const proto = Phaser.GameObjects.Container.prototype

    expect(proto.setStencilClip).toBeUndefined()
    installStencilClipExtension()
    const setStencilClip = proto.setStencilClip

    installStencilClipExtension()

    expect(proto.setStencilClip).toBe(setStencilClip)
    expect(typeof proto.updateStencilClip).toBe('function')
    expect(typeof proto.clearStencilClip).toBe('function')
    expect(typeof proto.getStencilClipHandle).toBe('function')
  })

  it('returns the container for chainable extension calls', () => {
    installStencilClipExtension()
    const container = new Phaser.GameObjects.Container(null as unknown as Phaser.Scene)
    container.scene = { renderer: { type: 0 } } as unknown as Phaser.Scene

    expect(container.setStencilClip({ width: 10, height: 20 })).toBe(container)
    expect(container.updateStencilClip({ width: 12 })).toBe(container)
    expect(container.clearStencilClip()).toBe(container)
  })
})
