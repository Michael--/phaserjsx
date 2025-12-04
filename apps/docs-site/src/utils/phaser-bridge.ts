/**
 * Phaser Bridge - Creates Phaser Scenes from PhaserJSX components
 * This bridges the gap between React (docs UI) and PhaserJSX (examples)
 */
import { mount } from '@phaserjsx/ui'
import Phaser from 'phaser'

/**
 * Creates a Phaser Scene class that mounts a PhaserJSX component
 * @param component - PhaserJSX component function that returns VNode
 * @returns Phaser Scene class
 */
export function createPhaserScene(component: () => unknown) {
  return class ExampleScene extends Phaser.Scene {
    private container?: Phaser.GameObjects.Container

    constructor() {
      super({ key: 'ExampleScene' })
    }

    create() {
      // Create a container to hold the mounted PhaserJSX components
      this.container = this.add.container(0, 0)

      // Mount PhaserJSX component into the container
      const vnode = component()
      if (vnode && typeof vnode === 'object') {
        mount(this.container, vnode as any)
      }
    }
  }
}
