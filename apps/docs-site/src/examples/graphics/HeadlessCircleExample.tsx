/**
 * Headless Circle Example
 * Demonstrates headless Graphics (default mode)
 */
/** @jsxImportSource @number10/phaserjsx */
import { Graphics, Text, View } from '@number10/phaserjsx'

/**
 * Simple circle with headless mode (default)
 */
export function HeadlessCircleExample() {
  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Headless Circle" />

      <View width={200} height={200} backgroundColor={0x1e1e1e} direction="stack">
        <Graphics
          x={100}
          y={100}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(0xff0000, 1)
            g.fillCircle(0, 0, 50)
          }}
        />
        <Graphics
          x={125}
          y={125}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(0xffff00, 1)
            g.fillCircle(0, 0, 25)
          }}
        />
      </View>
    </View>
  )
}
