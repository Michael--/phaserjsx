/**
 * Basic scene setup with PhaserJSX
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View, mountJSX } from '@number10/phaserjsx'
import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Mount your PhaserJSX component tree
    mountJSX(this, MainUI, { width: this.scale.width, height: this.scale.height })
  }
}

// Your component using PhaserJSX
function MainUI() {
  return (
    <View width="100vw" height="100vh" alignItems="center" justifyContent="center" gap={20}>
      <Text text="Welcome to PhaserJSX!" />

      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        <Text text="Get Started" />
      </Button>
    </View>
  )
}

export { GameScene }
