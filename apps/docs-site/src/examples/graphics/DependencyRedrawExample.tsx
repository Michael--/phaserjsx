/**
 * Dependency-Based Redraw Example
 * Demonstrates redraw when dependencies change
 */
/** @jsxImportSource @number10/phaserjsx */
import { Graphics, Text, View, useState } from '@number10/phaserjsx'

/**
 * Dependency-based redraw demo
 */
export function DependencyRedrawExample() {
  const [color, setColor] = useState(0xff0000)
  const [radius, setRadius] = useState(40)

  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Dependency-Based Redraw" />
      <View direction="row" gap={10}>
        <View
          width={100}
          height={100}
          backgroundColor={0x222222}
          direction="stack"
          enableGestures={true}
          onTouch={() => {
            // Cycle colors
            setColor((c) => (c === 0xff0000 ? 0x00ff00 : c === 0x00ff00 ? 0x0000ff : 0xff0000))
          }}
        >
          <Graphics
            x={50}
            y={50}
            dependencies={[color]}
            onDraw={(g: Phaser.GameObjects.Graphics) => {
              g.fillStyle(color, 1)
              g.fillCircle(0, 0, radius)
            }}
          />
        </View>
        <View
          width={100}
          height={100}
          backgroundColor={0x222222}
          direction="stack"
          enableGestures={true}
          onTouch={() => {
            // Change radius
            setRadius((r) => (r === 40 ? 30 : r === 30 ? 20 : 40))
          }}
        >
          <Graphics
            x={50}
            y={50}
            dependencies={[radius]}
            onDraw={(g: Phaser.GameObjects.Graphics) => {
              g.fillStyle(0xffff00, 1)
              g.fillCircle(0, 0, radius)
            }}
          />
        </View>
      </View>
      <Text text="Click squares to change color/radius" />
    </View>
  )
}
