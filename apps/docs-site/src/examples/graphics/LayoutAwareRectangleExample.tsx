/**
 * Layout-Aware Rectangle Example
 * Demonstrates Graphics with layout integration
 */
/** @jsxImportSource @phaserjsx/ui */
import { Graphics, Text, View } from '@phaserjsx/ui'

/**
 * Rectangle with layout integration
 */
export function LayoutAwareRectangleExample() {
  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Layout-Aware Rectangle" />
      <View direction="row" gap={10}>
        <Graphics
          headless={false}
          width={100}
          height={60}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(0x00ff00, 1)
            g.fillRect(0, 0, 100, 60)
          }}
        />
        <Graphics
          headless={false}
          width={100}
          height={60}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(0x0000ff, 1)
            g.fillRect(0, 0, 100, 60)
          }}
        />
      </View>
    </View>
  )
}
