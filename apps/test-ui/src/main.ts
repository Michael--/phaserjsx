/**
 * Minimal Phaser bootstrap that mounts the JSX tree into a Scene.
 * Installs rexUI scene plugin under the "rexUI" key.
 */
import { mount } from '@phaserjsx/ui'
import Phaser from 'phaser'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import { App } from './App'

/**
 * Main Phaser scene
 */
class MainScene extends Phaser.Scene {
  rexUI!: {
    add: {
      sizer: (config: unknown) => unknown
      roundRectangle: (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        color: number
      ) => unknown
      label: (config: unknown) => unknown
    }
  }

  /**
   * Creates the scene and mounts the JSX app
   */
  create() {
    console.log('MainScene.create() called')
    console.log('Scene dimensions:', this.scale.width, 'x', this.scale.height)
    console.log('rexUI available?', this.rexUI)
    console.log('Scene plugins:', Object.keys(this))

    // Install a simple bridge for pointerdown mapped in host.patch
    this.input.on('gameobjectdown', (_p: unknown, go: { onPointerdown?: () => void }) => {
      console.log('Game object pointerdown event')
      go?.onPointerdown?.()
    })

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
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
})
