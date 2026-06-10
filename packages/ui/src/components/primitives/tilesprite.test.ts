/**
 * TileSprite component tests
 */
import { describe, expect, it, vi } from 'vitest'
import { tileSpriteCreator, tileSpritePatcher } from './tilesprite'

function createMockTileSprite() {
  return {
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    originX: 0,
    originY: 0,
    width: 320,
    height: 180,
    tilePositionX: 0,
    tilePositionY: 0,
    tileScaleX: 1,
    tileScaleY: 1,
    visible: true,
    setOrigin: vi.fn(function (this: { originX: number; originY: number }, x: number, y: number) {
      this.originX = x
      this.originY = y
      return this
    }),
    setScale: vi.fn().mockReturnThis(),
    setAlpha: vi.fn().mockReturnThis(),
    setDepth: vi.fn().mockReturnThis(),
    setTexture: vi.fn().mockReturnThis(),
    setSize: vi.fn(function (
      this: { width: number; height: number },
      width: number,
      height: number
    ) {
      this.width = width
      this.height = height
      return this
    }),
    setTint: vi.fn().mockReturnThis(),
    clearTint: vi.fn().mockReturnThis(),
  }
}

describe('TileSprite Component', () => {
  describe('tileSpriteCreator', () => {
    it('creates a TileSprite with default top-left origin', () => {
      const mockTileSprite = createMockTileSprite()
      const mockScene = {
        add: {
          tileSprite: vi.fn().mockReturnValue(mockTileSprite),
        },
      } as unknown as Phaser.Scene

      const props = {
        x: 10,
        y: 20,
        width: 320,
        height: 180,
        texture: 'tiles',
        frame: 'grid',
      }

      const tileSprite = tileSpriteCreator(mockScene, props)

      expect(mockScene.add.tileSprite).toHaveBeenCalledWith(10, 20, 320, 180, 'tiles', 'grid')
      expect(mockTileSprite.setOrigin).toHaveBeenCalledWith(0, 0)
      expect(tileSprite).toBe(mockTileSprite)
    })

    it('attaches layout infrastructure based on TileSprite size', () => {
      const mockTileSprite = createMockTileSprite()
      const mockScene = {
        add: {
          tileSprite: vi.fn().mockReturnValue(mockTileSprite),
        },
      } as unknown as Phaser.Scene

      tileSpriteCreator(mockScene, {
        width: 320,
        height: 180,
        texture: 'tiles',
      })

      expect(mockTileSprite).toHaveProperty('__layoutProps')
      expect(mockTileSprite).toHaveProperty('__getLayoutSize')
      expect(mockTileSprite.__getLayoutSize?.()).toEqual({ width: 320, height: 180 })
    })
  })

  describe('tileSpritePatcher', () => {
    it('updates texture, size and tile properties', () => {
      const mockTileSprite = {
        ...createMockTileSprite(),
        __layoutProps: {},
        __getLayoutSize: vi.fn().mockReturnValue({ width: 320, height: 180 }),
      } as unknown as Phaser.GameObjects.TileSprite

      tileSpritePatcher(
        mockTileSprite,
        {
          texture: 'tiles-a',
          frame: 'a',
          width: 320,
          height: 180,
          tilePositionX: 0,
          tilePositionY: 0,
          tileScaleX: 1,
          tileScaleY: 1,
        },
        {
          texture: 'tiles-b',
          frame: 'b',
          width: 480,
          height: 240,
          tilePositionX: 12,
          tilePositionY: 24,
          tileScaleX: 2,
          tileScaleY: 3,
        }
      )

      expect(mockTileSprite.setTexture).toHaveBeenCalledWith('tiles-b', 'b')
      expect(mockTileSprite.setSize).toHaveBeenCalledWith(480, 240)
      expect(mockTileSprite.tilePositionX).toBe(12)
      expect(mockTileSprite.tilePositionY).toBe(24)
      expect(mockTileSprite.tileScaleX).toBe(2)
      expect(mockTileSprite.tileScaleY).toBe(3)
    })
  })
})
