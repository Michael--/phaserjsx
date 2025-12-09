/**
 * Test component to verify PhaserJSX installation
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View, mountJSX, useState } from '@number10/phaserjsx'
import Phaser from 'phaser'

class TestScene extends Phaser.Scene {
  create() {
    mountJSX(this, TestComponent, { width: this.scale.width, height: this.scale.height })
  }
}

function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <View
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
      gap={20}
    >
      <Text text="PhaserJSX is working!" style={{ fontSize: '32px', color: '#ffffff' }} />

      <Button variant="primary" onClick={() => setCount(count + 1)}>
        <Text text={`Clicks: ${count}`} />
      </Button>
    </View>
  )
}

export { TestComponent, TestScene }
