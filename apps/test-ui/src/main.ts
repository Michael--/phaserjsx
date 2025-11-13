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
  /**
   * Creates the scene and mounts the JSX app
   */
  create() {
    // Install a simple bridge for pointerdown mapped in host.patch
    this.input.on('gameobjectdown', (_p: unknown, go: { onPointerdown?: () => void }) =>
      go?.onPointerdown?.()
    )
    const tree = { type: App, props: {}, children: [] }
    mount(this, tree)
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
    scene: [{ key: 'rexuiplugin', plugin: RexUIPlugin, mapping: 'rexUI' }],
  },
})
