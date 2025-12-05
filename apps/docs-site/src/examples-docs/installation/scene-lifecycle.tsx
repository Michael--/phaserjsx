/**
 * Scene lifecycle with manual unmount
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View, mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'

class LifecycleScene extends Phaser.Scene {
  private rootNode?: Phaser.GameObjects.GameObject

  create() {
    // Mount and store root node
    this.rootNode = mountJSX(this, MyUI, { width: this.scale.width, height: this.scale.height })
  }

  shutdown() {
    // Manually destroy if needed (usually automatic)
    this.rootNode?.destroy()
  }
}

function MyUI() {
  return (
    <View>
      <Text text="My UI" />
    </View>
  )
}

export { LifecycleScene }
