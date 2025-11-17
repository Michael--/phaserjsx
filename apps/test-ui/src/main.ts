/**
 * Minimal Phaser bootstrap that mounts the JSX tree into a Scene.
 */
import { mount } from '@phaserjsx/ui'
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

    // Mount the JSX app into this scene, this is where the UI tree starts
    mount(this, {
      type: App,
      props: {
        width: this.scale.width,
        height: this.scale.height,
        scene: this,
      },
    })
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 1200,
  backgroundColor: '#1d1d1d',
  parent: 'app',
  scene: [MainScene],
})
