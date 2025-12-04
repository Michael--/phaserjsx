/**
 * Multiple mount points example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View, mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'

class MultiMountScene extends Phaser.Scene {
  create() {
    // Main UI in scene root
    mountJSX(this, GameUI, {})

    // Separate HUD in a fixed container
    const hudContainer = this.add.container(0, 0)
    hudContainer.setScrollFactor(0) // Fixed to camera
    mountJSX(hudContainer, HUD, {})
  }
}

function GameUI() {
  return (
    <View>
      <Text>Game UI</Text>
    </View>
  )
}

function HUD() {
  return (
    <View>
      <Text>HUD</Text>
    </View>
  )
}

export { MultiMountScene }
