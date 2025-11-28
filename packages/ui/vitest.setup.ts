import { vi } from 'vitest'

// Mock Phaser Scene class
class MockScene {
  data = {
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(() => false),
  }
  textures = {
    exists: vi.fn(() => true),
    remove: vi.fn(),
    addCanvas: vi.fn(),
  }
}

// Mock Phaser to prevent initialization issues in tests
vi.mock('phaser', () => ({
  default: {
    Scene: MockScene,
    GameObjects: {
      Container: class MockContainer {
        constructor() {
          this.x = 0
          this.y = 0
          this.width = 0
          this.height = 0
          this.displayWidth = 0
          this.displayHeight = 0
          this.displayOriginX = 0
          this.displayOriginY = 0
          this.list = []
        }
        setPosition(x, y) {
          this.x = x
          this.y = y
          return this
        }
        setSize(w, h) {
          this.width = w
          this.height = h
          this.displayWidth = w
          this.displayHeight = h
          return this
        }
        getChildren() {
          return this.list
        }
        add(child) {
          this.list.push(child)
          return child
        }
      },
    },
  },
  Scene: MockScene,
}))
