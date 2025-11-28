import { vi } from 'vitest'

// Forward declarations for circular references
let MockScene: typeof MockSceneClass
let MockContainer: typeof MockContainerClass

// Mock Phaser Scene class
class MockSceneClass {
  sys = {
    settings: {
      active: true,
    },
  }
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
  add = {
    container: vi.fn((x: number, y: number) => new MockContainer(this)),
  }
}

MockScene = MockSceneClass

// Mock Phaser Container class
class MockContainerClass {
  scene: MockSceneClass
  x = 0
  y = 0
  width = 0
  height = 0
  displayWidth = 0
  displayHeight = 0
  displayOriginX = 0
  displayOriginY = 0
  list: unknown[] = []

  constructor(scene: MockSceneClass) {
    this.scene = scene
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  setSize(w: number, h: number) {
    this.width = w
    this.height = h
    this.displayWidth = w
    this.displayHeight = h
    return this
  }

  setVisible(visible: boolean) {
    return this
  }

  getChildren() {
    return this.list
  }

  add(child: unknown) {
    this.list.push(child)
    return child
  }
}

MockContainer = MockContainerClass

// Mock Phaser namespace
const PhaserMock = {
  Scene: MockScene,
  GameObjects: {
    Container: MockContainer,
  },
}

// Mock Phaser to prevent initialization issues in tests
vi.mock('phaser', () => ({
  default: PhaserMock,
  Scene: MockScene,
}))

// Make Phaser available globally for instanceof checks
;(globalThis as unknown as { Phaser: typeof PhaserMock }).Phaser = PhaserMock
