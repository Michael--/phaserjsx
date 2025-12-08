/**
 * Complex Shape Example
 * Demonstrates complex custom shapes
 */
/** @jsxImportSource @phaserjsx/ui */
import { Graphics, Text, View } from '@phaserjsx/ui'

/**
 * Complex shape demo
 */
export function ComplexShapeExample() {
  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Complex Custom Shape" />
      <View width={200} height={200} backgroundColor={0x1e1e1e} direction="stack">
        <Graphics
          x={100}
          y={100}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            // Draw star
            g.fillStyle(0xffff00, 1)
            g.beginPath()
            for (let i = 0; i < 5; i++) {
              const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
              const x = Math.cos(angle) * 50
              const y = Math.sin(angle) * 50
              if (i === 0) {
                g.moveTo(x, y)
              } else {
                g.lineTo(x, y)
              }
            }
            g.closePath()
            g.fillPath()

            // Add outline
            g.lineStyle(3, 0x888800, 1)
            g.strokePath()
          }}
        />
      </View>
    </View>
  )
}
