/**
 * Minimal Phaser bootstrap that mounts the JSX tree into a Scene.
 */
import { mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'
import { App } from './App'

/**
 * Main Phaser scene
 */
class MainScene extends Phaser.Scene {
  preload() {
    // Load local assets
    this.load.atlas('ui', 'assets/ui/nine-slice.png', 'assets/ui/nine-slice.json')
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

    // Mount the JSX app into this scene, this is where the UI tree starts
    // Could be mounted into a Container instead of the Scene directly
    mountJSX(this, App, {
      width: this.scale.width,
      height: this.scale.height,
    })
  }
}

new Phaser.Game({
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
