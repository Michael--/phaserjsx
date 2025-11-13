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
    this.input.on('gameobjectdown', (_p: unknown, go: { onPointerdown?: () => void }) =>
      go?.onPointerdown?.()
    )

    // Create centered layout container
    const { width, height } = this.scale
    const centerContainer = this.createCenterContentBox(width, height)

    console.log('Mounting App...')
    const tree = { type: App, props: {}, children: [] }
    const result = mount(centerContainer.innerBox, tree)
    console.log('Mount result:', result)
    console.log('Scene children count:', this.children.length)

    // Layout the outer container to fill the scene
    centerContainer.outerBox.layout()
  }

  /**
   * Creates a centered content box that fills the scene
   * @param width - Scene width
   * @param height - Scene height
   * @returns Object containing outerBox and innerBox
   */
  createCenterContentBox(width: number, height: number) {
    const outerBox = this.rexUI.add.sizer({
      x: width / 2,
      y: height / 2,
      width,
      height,
      orientation: 'y',
    }) as unknown as Phaser.GameObjects.Container & {
      add: (child: unknown, config?: unknown) => unknown
      layout: () => void
    }

    const midBox = this.rexUI.add.sizer({
      orientation: 'x',
    }) as unknown as Phaser.GameObjects.Container & {
      add: (child: unknown, config?: unknown) => unknown
    }

    // Vertical centering: top spacer, content, bottom spacer
    outerBox.add(this.add.zone(0, 0, 1, 1), { proportion: 1, align: 'center' })
    outerBox.add(midBox, { expand: true })
    outerBox.add(this.add.zone(0, 0, 1, 1), { proportion: 1, align: 'center' })

    const innerBox = this.rexUI.add.sizer({
      orientation: 'y',
    }) as unknown as Phaser.GameObjects.Container

    // Horizontal centering: left spacer, content, right spacer
    midBox.add(this.add.zone(0, 0, 1, 1), { proportion: 1, align: 'center' })
    midBox.add(innerBox, { align: 'center' })
    midBox.add(this.add.zone(0, 0, 1, 1), { proportion: 1, align: 'center' })

    return { outerBox, innerBox }
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
