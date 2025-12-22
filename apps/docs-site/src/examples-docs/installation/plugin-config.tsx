/**
 * PhaserJSX Plugin configuration
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View, createPhaserJSXPlugin, useState } from '@number10/phaserjsx'
import Phaser from 'phaser'

type CounterProps = {
  title: string
}

// eslint-disable-next-line react-refresh/only-export-components
function CounterUI({ title }: CounterProps) {
  const [count, setCount] = useState(0)

  return (
    <View width="100%" height="100%" justifyContent="center" alignItems="center" gap={16}>
      <Text text={title} style={{ fontSize: '28px', color: '#ffffff' }} />
      <Text text={`Count: ${count}`} style={{ fontSize: '20px', color: '#94a3b8' }} />

      <View direction="row" gap={12}>
        <Button variant="secondary" onClick={() => setCount(count - 1)}>
          <Text text="-" />
        </Button>
        <Button variant="primary" onClick={() => setCount(count + 1)}>
          <Text text="+" />
        </Button>
      </View>
    </View>
  )
}

class GameScene extends Phaser.Scene {
  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0f172a).setOrigin(0)
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: [GameScene],
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: CounterUI,
        props: { title: 'PhaserJSX Plugin' },
        autoResize: true,
        container: { x: 0, y: 0, depth: 100 },
      }),
    ],
  },
}

export const game = new Phaser.Game(config)
