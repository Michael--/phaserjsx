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
  /**
   * Creates the scene and mounts the JSX app
   */
  create() {
    console.log('MainScene.create() called')
    console.log('Scene dimensions:', this.scale.width, 'x', this.scale.height)

    console.log('Mounting App...')
    const tree = { type: App, props: {}, children: [] }
    const result = mount(this, tree)
    console.log('Mount result:', result)
    console.log('Scene children count:', this.children.length)
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d1d1d',
  parent: 'app',
  scene: [MainScene],
})
