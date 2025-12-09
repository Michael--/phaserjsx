/**
 * Multiple mount points example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View, mountJSX } from '@number10/phaserjsx'
import Phaser from 'phaser'

class MultiMountScene extends Phaser.Scene {
  create() {
    // Main UI in scene root fullscreen container
    mountJSX(this, GameUI, { width: this.scale.width, height: this.scale.height })

    // Separate HUD in a fixed container with defined size
    const hudContainer = this.add.container(0, 0).setSize(200, 100)
    hudContainer.setScrollFactor(0) // Fixed to camera
    mountJSX(hudContainer, HUD, { width: hudContainer.width, height: hudContainer.height })
  }
}

function GameUI() {
  return (
    <View>
      <Text text="Game UI" />
    </View>
  )
}

function HUD() {
  return (
    <View>
      <Text text="HUD" />
    </View>
  )
}

export { MultiMountScene }
