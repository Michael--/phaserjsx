/**
 * Test component to verify PhaserJSX installation
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, mountJSX, useState } from '@phaserjsx/ui'
import Phaser from 'phaser'

class TestScene extends Phaser.Scene {
  create() {
    mountJSX(this, TestComponent, {})
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
      flexDirection="column"
      gap={20}
    >
      <Text fontSize={32} fill="#ffffff">
        PhaserJSX is working!
      </Text>

      <Button variant="primary" onClick={() => setCount(count + 1)}>
        <Text>Clicks: {count}</Text>
      </Button>
    </View>
  )
}

export { TestComponent, TestScene }
