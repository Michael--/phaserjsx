/**
 * NineSlice component tests
 */
import { describe, expect, it, vi } from 'vitest'
import {
  createNineSliceRef,
  nineSliceCreator,
  nineSlicePatcher,
  useNineSliceRef,
} from './nineslice'

describe('NineSlice Component', () => {
  describe('nineSliceCreator', () => {
    it('creates a NineSlice with basic props', () => {
      const mockScene = {
        add: {
          nineslice: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setScale: vi.fn().mockReturnThis(),
            setRotation: vi.fn().mockReturnThis(),
            width: 256,
            height: 256,
            __layoutProps: undefined,
            __getLayoutSize: undefined,
          }),
        },
      } as unknown as Phaser.Scene

      const props = {
        x: 100,
        y: 200,
        texture: 'ui',
        frame: 'button',
        width: 300,
        height: 100,
        leftWidth: 64,
        rightWidth: 64,
        topHeight: 48,
        bottomHeight: 48,
      }

      const nineSlice = nineSliceCreator(mockScene, props)

      expect(mockScene.add.nineslice).toHaveBeenCalledWith(
        100,
        200,
        'ui',
        'button',
        300,
        100,
        64,
        64,
        48,
        48
      )
      expect(nineSlice.setOrigin).toHaveBeenCalledWith(0, 0)
      expect(nineSlice).toBeDefined()
    })

    it('uses default values for missing props', () => {
      const mockScene = {
        add: {
          nineslice: vi.fn().mockReturnValue({
            setOrigin: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setAlpha: vi.fn().mockReturnThis(),
            setScale: vi.fn().mockReturnThis(),
            setRotation: vi.fn().mockReturnThis(),
            width: 256,
            height: 256,
            __layoutProps: undefined,
            __getLayoutSize: undefined,
          }),
        },
      } as unknown as Phaser.Scene

      const props = {
        texture: 'ui',
        leftWidth: 10,
        rightWidth: 10,
      }

      nineSliceCreator(mockScene, props)

      expect(mockScene.add.nineslice).toHaveBeenCalledWith(
        0, // default x
        0, // default y
        'ui',
        undefined, // no frame
        64, // default width (changed from 256)
        64, // default height (changed from 256)
        10,
        10,
        undefined, // no topHeight (3-slice mode)
        undefined // no bottomHeight (3-slice mode)
      )
    })

    it('attaches layout infrastructure', () => {
      const mockNineSlice = {
        setOrigin: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setRotation: vi.fn().mockReturnThis(),
        width: 300,
        height: 100,
      }

      const mockScene = {
        add: {
          nineslice: vi.fn().mockReturnValue(mockNineSlice),
        },
      } as unknown as Phaser.Scene

      const props = {
        texture: 'ui',
        width: 300,
        height: 100,
        leftWidth: 64,
        rightWidth: 64,
        margin: { top: 10, left: 10 },
      }

      nineSliceCreator(mockScene, props)

      // Layout props should be attached by createNineSliceLayout
      expect(mockNineSlice).toHaveProperty('__layoutProps')
      expect(mockNineSlice).toHaveProperty('__getLayoutSize')
    })
  })

  describe('nineSlicePatcher', () => {
    it('updates texture and frame', () => {
      const mockNineSlice = {
        setTexture: vi.fn().mockReturnThis(),
        setSlices: vi.fn().mockReturnThis(),
        setSize: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setRotation: vi.fn().mockReturnThis(),
        width: 300,
        height: 100,
        __layoutProps: {},
        __getLayoutSize: vi.fn().mockReturnValue({ width: 300, height: 100 }),
      } as unknown as Phaser.GameObjects.NineSlice

      const prev = {
        texture: 'ui',
        frame: 'buttonA',
        leftWidth: 64,
        rightWidth: 64,
      }

      const next = {
        texture: 'ui',
        frame: 'buttonB',
        leftWidth: 64,
        rightWidth: 64,
      }

      nineSlicePatcher(mockNineSlice, prev, next)

      expect(mockNineSlice.setTexture).toHaveBeenCalledWith('ui', 'buttonB')
    })

    it('updates slice dimensions', () => {
      const mockNineSlice = {
        setTexture: vi.fn().mockReturnThis(),
        setSlices: vi.fn().mockReturnThis(),
        setSize: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setRotation: vi.fn().mockReturnThis(),
        width: 300,
        height: 100,
        __layoutProps: {},
        __getLayoutSize: vi.fn().mockReturnValue({ width: 300, height: 100 }),
      } as unknown as Phaser.GameObjects.NineSlice

      const prev = {
        texture: 'ui',
        width: 300,
        height: 100,
        leftWidth: 64,
        rightWidth: 64,
        topHeight: 48,
        bottomHeight: 48,
      }

      const next = {
        texture: 'ui',
        width: 300,
        height: 100,
        leftWidth: 32, // changed
        rightWidth: 32, // changed
        topHeight: 48,
        bottomHeight: 48,
      }

      nineSlicePatcher(mockNineSlice, prev, next)

      expect(mockNineSlice.setSlices).toHaveBeenCalledWith(300, 100, 32, 32, 48, 48)
    })

    it('updates size', () => {
      const mockNineSlice = {
        setTexture: vi.fn().mockReturnThis(),
        setSlices: vi.fn().mockReturnThis(),
        setSize: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setRotation: vi.fn().mockReturnThis(),
        width: 300,
        height: 100,
        __layoutProps: {},
        __getLayoutSize: vi.fn().mockReturnValue({ width: 400, height: 150 }),
      } as unknown as Phaser.GameObjects.NineSlice

      const prev = {
        texture: 'ui',
        width: 300,
        height: 100,
        leftWidth: 64,
        rightWidth: 64,
      }

      const next = {
        texture: 'ui',
        width: 400, // changed
        height: 150, // changed
        leftWidth: 64,
        rightWidth: 64,
      }

      nineSlicePatcher(mockNineSlice, prev, next)

      expect(mockNineSlice.setSize).toHaveBeenCalledWith(400, 150)
    })
  })

  describe('createNineSliceRef', () => {
    it('creates a ref object with inner bounds', () => {
      const mockNineSlice = {
        width: 300,
        height: 100,
      } as Phaser.GameObjects.NineSlice

      const ref = createNineSliceRef(mockNineSlice, {
        leftWidth: 64,
        rightWidth: 64,
        topHeight: 48,
        bottomHeight: 48,
      })

      expect(ref.node).toBe(mockNineSlice)
      expect(ref.leftWidth).toBe(64)
      expect(ref.rightWidth).toBe(64)
      expect(ref.topHeight).toBe(48)
      expect(ref.bottomHeight).toBe(48)
      expect(ref.innerBounds).toEqual({
        x: 64,
        y: 48,
        width: 172, // 300 - 64 - 64
        height: 4, // 100 - 48 - 48
      })
    })

    it('handles 3-slice mode (no top/bottom)', () => {
      const mockNineSlice = {
        width: 200,
        height: 50,
      } as Phaser.GameObjects.NineSlice

      const ref = createNineSliceRef(mockNineSlice, {
        leftWidth: 10,
        rightWidth: 10,
      })

      expect(ref.topHeight).toBe(0)
      expect(ref.bottomHeight).toBe(0)
      expect(ref.innerBounds).toEqual({
        x: 10,
        y: 0,
        width: 180, // 200 - 10 - 10
        height: 50, // full height
      })
    })

    it('updates inner bounds dynamically when node size changes', () => {
      const mockNineSlice = {
        width: 300,
        height: 100,
      } as Phaser.GameObjects.NineSlice

      const ref = createNineSliceRef(mockNineSlice, {
        leftWidth: 64,
        rightWidth: 64,
        topHeight: 48,
        bottomHeight: 48,
      })

      const initialBounds = ref.innerBounds
      expect(initialBounds.width).toBe(172)

      // Simulate node resize
      mockNineSlice.width = 400

      const updatedBounds = ref.innerBounds
      expect(updatedBounds.width).toBe(272) // 400 - 64 - 64
    })
  })

  describe('useNineSliceRef', () => {
    it('creates a ref callback and accessor', () => {
      const refHelper = useNineSliceRef(64, 64, 48, 48)

      expect(refHelper.callback).toBeTypeOf('function')
      expect(refHelper.current).toBeNull()
    })

    it('populates ref data when callback is called', () => {
      const refHelper = useNineSliceRef(64, 64, 48, 48)

      const mockNineSlice = {
        width: 300,
        height: 100,
      } as Phaser.GameObjects.NineSlice

      refHelper.callback(mockNineSlice)

      expect(refHelper.current).not.toBeNull()
      expect(refHelper.current?.node).toBe(mockNineSlice)
      expect(refHelper.current?.innerBounds.width).toBe(172)
    })

    it('clears ref data when callback is called with null', () => {
      const refHelper = useNineSliceRef(64, 64, 48, 48)

      const mockNineSlice = {
        width: 300,
        height: 100,
      } as Phaser.GameObjects.NineSlice

      refHelper.callback(mockNineSlice)
      expect(refHelper.current).not.toBeNull()

      refHelper.callback(null)
      expect(refHelper.current).toBeNull()
    })
  })
})
