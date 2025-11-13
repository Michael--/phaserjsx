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
      addBackground: (bg: unknown) => void
    }

    // Add blue background to outerBox
    const outerBg = this.rexUI.add.roundRectangle(
      0,
      0,
      width,
      height,
      0,
      0x0000ff
    ) as Phaser.GameObjects.Shape
    outerBg.setAlpha(0.3)
    outerBox.addBackground(outerBg)

    const midBox = this.rexUI.add.sizer({
      orientation: 'x',
    }) as unknown as Phaser.GameObjects.Container & {
      add: (child: unknown, config?: unknown) => unknown
      addBackground: (bg: unknown) => void
    }

    // Add green background to midBox
    const midBg = this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x00ff00) as Phaser.GameObjects.Shape
    midBg.setAlpha(0.3)
    midBox.addBackground(midBg)

    // Vertical centering: top spacer, content, bottom spacer
    outerBox.add(this.add.zone(0, 0, 1, 1), { proportion: 0, align: 'center' })
    outerBox.add(midBox, { proportion: 1, expand: true })
    outerBox.add(this.add.zone(0, 0, 1, 1), { proportion: 0, align: 'center' })

    const innerBox = this.rexUI.add.sizer({
      orientation: 'y',
    }) as unknown as Phaser.GameObjects.Container & {
      addBackground: (bg: unknown) => void
    }

    // Add yellow background to innerBox
    const innerBg = this.rexUI.add.roundRectangle(
      0,
      0,
      0,
      0,
      0,
      0xffff00
    ) as Phaser.GameObjects.Shape
    innerBg.setAlpha(0.5)
    innerBox.addBackground(innerBg)

    // Horizontal centering: left spacer, content, right spacer
    midBox.add(this.add.zone(0, 0, 1, 1), { proportion: 0, align: 'center' })
    midBox.add(innerBox, { proportion: 1, expand: true })
    midBox.add(this.add.zone(0, 0, 1, 1), { proportion: 0, align: 'center' })

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
