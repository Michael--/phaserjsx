/**
 * Minimal Phaser bootstrap that mounts the JSX tree into a Scene.
 */
import { mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'
import { App } from './App'

type DemoMode = 'Default' | 'Separated' | 'Effects' | 'MovingSprite'
const demo: DemoMode = 'MovingSprite'

/**
 * Main Phaser scene
 */
class MainScene extends Phaser.Scene {
  preload() {
    // Load local assets
    this.load.atlas('ui', 'assets/ui/buttons.png', 'assets/ui/buttons.json')
    this.load.image('phaser-planet', 'assets/images/phaser-planet-small.png')
    this.load.image('phaser-jsx-logo', 'assets/images/phaser-jsx-logo.png')
    this.load.image('test-image', 'assets/images/test.png')
    this.load.image('back', 'assets/images/back.png')
    this.load.image('wideline', 'assets/images/wideline.png')
    this.load.image('eye', 'assets/images/lance-overdose-loader-eye.png')
  }

  debugLoadedAssets() {
    console.log('=== Loaded Assets Debug ===')

    // Textures
    const textureKeys = this.textures.getTextureKeys()
    console.log(`Textures (${textureKeys.length}):`)
    textureKeys.forEach((key) => {
      const texture = this.textures.get(key)
      const source = texture.source[0]
      if (source) {
        console.log(
          `  - ${key}: ${source.width}x${source.height} (${source.image ? 'Image' : 'Canvas'})`
        )
        // Check for atlas frames
        const frameNames = Object.keys(texture.frames)
        if (frameNames.length > 0) {
          console.log(
            `    Frames (${frameNames.length}): ${frameNames.slice(0, 10).join(', ')}${frameNames.length > 10 ? ', ...(more)...' : ''}`
          )
        }
      } else {
        console.log(`  - ${key}: (no source)`)
      }
    })

    console.log('=== End Assets Debug ===')
  }

  /**
   * Creates the scene and mounts the JSX app
   */
  create() {
    this.debugLoadedAssets()

    console.log('MainScene.create() scene dimensions:', this.scale.width, 'x', this.scale.height)

    // Listen for orientation changes and reload the page
    this.scale.on('orientationchange', (orientation: string) => {
      console.log('Orientation changed to:', orientation)
      window.location.reload()
    })

    // Add a rasterized background layer for testing performance with many UI elements
    const graphics = this.add.graphics()
    graphics.lineStyle(1, 0xffffff, 0.2)
    const gridSize = 20
    for (let x = 0; x < this.scale.width; x += gridSize) {
      graphics.moveTo(x, 0)
      graphics.lineTo(x, this.scale.height)
    }
    for (let y = 0; y < this.scale.height; y += gridSize) {
      graphics.moveTo(0, y)
      graphics.lineTo(this.scale.width, y)
    }
    graphics.strokePath()

    if (demo === 'Default') {
      // Mount single JSX app instance
      mountJSX(this, App, {
        width: this.scale.width,
        height: this.scale.height,
      })
    } else if (demo === 'Separated') {
      const container = this.add.container(200, 200)
      container.setSize(800, 800)

      // Mount first JSX app instance
      mountJSX(container, App, {
        width: 800,
        height: 800,
      })

      const container2 = this.add.container(1200, 100)
      container2.setSize(800, 800)

      // Mount second JSX app instance (testing dual mount support)
      mountJSX(container2, App, {
        width: 800,
        height: 800,
      })
    } else if (demo === 'Effects') {
      const size = 1000
      const container = this.add.container(
        (this.scale.width - size) / 2,
        (this.scale.height - size) / 2
      )
      container.setSize(size, size)
      container.setRotation(0.3)

      // Mount first JSX app instance
      mountJSX(container, App, {
        width: size,
        height: size,
      })
    } else if (demo === 'MovingSprite') {
      const size = 1000
      const container = this.add.container(
        (this.scale.width - size) / 2,
        (this.scale.height - size) / 2
      )
      container.setSize(size, size)

      // Mount first JSX app instance
      mountJSX(container, App, {
        width: size,
        height: size,
      })

      // Animate the container
      this.tweens.add({
        targets: container,
        x: { from: 200, to: 600, duration: 20000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 },
        rotation: {
          from: 0,
          to: Math.PI / 8,
          duration: 80000,
          ease: 'Linear',
          yoyo: true,
          repeat: -1,
        },
      })
    }
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  input: {
    mouse: true,
    touch: true,
    activePointers: 2,
  },
  disableContextMenu: true,
  backgroundColor: '#1d1d1d',
  parent: 'app',
  scene: [MainScene],
})

// Expose game instance for debug access
;(window as { game?: Phaser.Game }).game = game
