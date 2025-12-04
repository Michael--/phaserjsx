/**
 * Phaser Bridge - Creates Phaser Scenes from PhaserJSX components
 * This bridges the gap between React (docs UI) and PhaserJSX (examples)
 */
import { mountJSX, type VNode } from '@phaserjsx/ui'
import Phaser from 'phaser'
// Import theme setup (initializes global theme)
import '../theme'

/**
 * Creates a Phaser Scene class that mounts a PhaserJSX component
 * @param component - PhaserJSX component function
 * @param props - Optional props to pass to component
 * @returns Phaser Scene class
 */
export function createPhaserScene(
  component: (props: unknown) => VNode,
  props?: Record<string, unknown>
) {
  return class ExampleScene extends Phaser.Scene {
    private container?: Phaser.GameObjects.Container

    constructor() {
      super({ key: 'ExampleScene' })
    }

    create() {
      // Create a container to hold the mounted PhaserJSX components
      this.container = this.add.container(0, 0)

      // Mount PhaserJSX component into the container using mountJSX
      // This properly handles the component lifecycle and props
      mountJSX(this.container, component, {
        width: this.scale.width,
        height: this.scale.height,
        ...props,
      })
    }
  }
}
