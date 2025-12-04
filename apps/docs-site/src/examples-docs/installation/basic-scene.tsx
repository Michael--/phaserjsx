/**
 * Basic scene setup with PhaserJSX
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Mount your PhaserJSX component tree
    mountJSX(this, MainUI, {})
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
