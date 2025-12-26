import { beforeEach, describe, expect, it, vi } from 'vitest'
import type Phaser from 'phaser'
import { GestureManager } from './gesture-manager'

type HitArea = {
  width: number
  height: number
  contains: (x: number, y: number) => boolean
}

const createHitArea = (width: number, height: number): HitArea => ({
  width,
  height,
  contains: (x: number, y: number) => x >= 0 && y >= 0 && x <= width && y <= height,
})

const createContainer = () => ({
  visible: true,
  active: true,
  alpha: 1,
  depth: 0,
  parentContainer: null,
  getWorldTransformMatrix: () => ({
    invert: () => ({
      transformPoint: (x: number, y: number) => ({ x, y }),
    }),
  }),
  once: vi.fn(),
})

const createScene = (pointer: Phaser.Input.Pointer) => ({
  input: {
    on: vi.fn(),
    activePointer: pointer,
  },
  events: {
    once: vi.fn(),
  },
  game: {
    canvas: {
      width: 800,
      height: 600,
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    },
  },
  cameras: {
    main: { zoom: 1 },
  },
})

describe('GestureManager (zoom-aware)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses world coordinates for hit testing under camera zoom', () => {
    const pointer = {
      id: 1,
      x: 200,
      y: 200,
      worldX: 50,
      worldY: 50,
    } as Phaser.Input.Pointer
    const scene = createScene(pointer)
    const manager = new GestureManager(scene as unknown as Phaser.Scene)
    const onTouch = vi.fn()
    const container = createContainer()
    const hitArea = createHitArea(100, 100)

    manager.registerContainer(
      container as unknown as Phaser.GameObjects.Container,
      { onTouch },
      hitArea
    )

    // Screen position is outside, world position is inside (zoomed camera case).
    ;(
      manager as unknown as { handlePointerDown: (p: Phaser.Input.Pointer) => void }
    ).handlePointerDown(pointer)
    ;(manager as unknown as { handlePointerUp: (p: Phaser.Input.Pointer) => void }).handlePointerUp(
      pointer
    )

    expect(onTouch).toHaveBeenCalledTimes(1)
  })

  it('updates world point before wheel hit testing', () => {
    const pointer = {
      id: 1,
      x: 0,
      y: 0,
      worldX: 0,
      worldY: 0,
      camera: { zoom: 2 },
      updateWorldPoint: vi.fn(() => {
        pointer.worldX = pointer.x / 2
        pointer.worldY = pointer.y / 2
        return pointer
      }),
    } as Phaser.Input.Pointer
    const scene = createScene(pointer)
    const manager = new GestureManager(scene as unknown as Phaser.Scene)
    const onWheel = vi.fn()
    const container = createContainer()
    const hitArea = createHitArea(150, 150)

    manager.registerContainer(
      container as unknown as Phaser.GameObjects.Container,
      { onWheel },
      hitArea
    )

    const wheelEvent = {
      clientX: 200,
      clientY: 200,
      deltaX: 1,
      deltaY: 2,
      deltaZ: 0,
      deltaMode: 0,
      preventDefault: vi.fn(),
    } as unknown as WheelEvent

    ;(manager as unknown as { handleWheel: (e: WheelEvent) => void }).handleWheel(wheelEvent)

    expect(pointer.updateWorldPoint).toHaveBeenCalledWith(pointer.camera)
    expect(onWheel).toHaveBeenCalledTimes(1)
  })

  it('computes move deltas in world space', () => {
    const pointer = {
      id: 1,
      x: 200,
      y: 200,
      worldX: 100,
      worldY: 100,
    } as Phaser.Input.Pointer
    const scene = createScene(pointer)
    const manager = new GestureManager(scene as unknown as Phaser.Scene)
    const container = createContainer()
    const hitArea = createHitArea(300, 300)
    const moves: Array<{ dx?: number; dy?: number }> = []

    manager.registerContainer(
      container as unknown as Phaser.GameObjects.Container,
      {
        onTouchMove: (data) => {
          moves.push({ dx: data.dx, dy: data.dy })
        },
      },
      hitArea
    )
    ;(
      manager as unknown as { handlePointerDown: (p: Phaser.Input.Pointer) => void }
    ).handlePointerDown(pointer)

    pointer.x = 220
    pointer.y = 220
    pointer.worldX = 110
    pointer.worldY = 110
    ;(
      manager as unknown as { handlePointerMove: (p: Phaser.Input.Pointer) => void }
    ).handlePointerMove(pointer)

    pointer.x = 240
    pointer.y = 240
    pointer.worldX = 120
    pointer.worldY = 120
    ;(
      manager as unknown as { handlePointerMove: (p: Phaser.Input.Pointer) => void }
    ).handlePointerMove(pointer)

    expect(moves[moves.length - 1]).toEqual({ dx: 10, dy: 10 })
  })
})
