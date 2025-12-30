/**
 * Phaser Bridge - Creates Phaser Scenes from PhaserJSX components
 * This bridges the gap between React (docs UI) and PhaserJSX (examples)
 */
import phaserJsxLogo from '@/assets/phaser-jsx-logo.png'
import {
  addSceneBackground,
  DEFAULT_BACKGROUND,
  mountJSX,
  type BackgroundConfig,
  type SceneBackgroundHandle,
  type VNode,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

const DEFAULT_LOGO_KEY = 'phaser-jsx-logo'

/**
 * Creates a Phaser Scene class that mounts a PhaserJSX component
 * @param component - PhaserJSX component function
 * @param background - Optional background configuration
 * @returns Phaser Scene class
 */
export function createPhaserScene(component: () => VNode, background?: BackgroundConfig) {
  const bgConfig = background || DEFAULT_BACKGROUND

  return class ExampleScene extends Phaser.Scene {
    private container?: Phaser.GameObjects.Container
    private backgroundHandle?: SceneBackgroundHandle | null

    constructor() {
      super({ key: 'ExampleScene' })
    }

    preload() {
      if (bgConfig.type === 'logo' && !bgConfig.logoKey) {
        this.load.image(DEFAULT_LOGO_KEY, phaserJsxLogo)
      }
    }

    create() {
      this.backgroundHandle = addSceneBackground(this, bgConfig)

      // Create a container to hold the mounted PhaserJSX components
      this.container = this.add.container(0, 0)

      // Mount PhaserJSX component with automatic SceneWrapper for percentage-based sizing
      // The new mountJSX API requires width/height and automatically wraps components
      mountJSX(this.container, component, { width: this.scale.width, height: this.scale.height })
    }

    destroy() {
      this.backgroundHandle?.destroy()
      this.backgroundHandle = null
    }
  }
}
