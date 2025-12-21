/**
 * Joystick Composite Example - Using any VNodeLike elements
 */
/** @jsxImportSource @number10/phaserjsx */
import { Graphics, Joystick, Text, useState, View } from '@number10/phaserjsx'

export function CompositeJoystickExample() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Base: Image with Graphics overlay
  const customBase = (
    <View direction="stack">
      <Graphics
        x={0}
        y={0}
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Outer glow
          g.fillStyle(0x4a90e2, 0.2)
          g.fillCircle(0, 0, 85)
          // Main ring
          g.lineStyle(3, 0x4a90e2, 0.8)
          g.strokeCircle(0, 0, 75)
          // Inner ring
          g.lineStyle(1, 0x4a90e2, 0.4)
          g.strokeCircle(0, 0, 60)
        }}
      />
      <View
        backgroundColor={0xff0000}
        backgroundAlpha={0.25}
        width={200}
        height={200}
        x={-100}
        y={-100}
        cornerRadius={50}
      ></View>
    </View>
  )

  // Thumb: Composite with Image and Text
  const customThumb = (
    <View direction="stack">
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Shadow
          g.fillStyle(0x000000, 0.4)
          g.fillCircle(3, 3, 28)
          // Main button
          g.fillStyle(0x4a90e2, 1)
          g.fillCircle(0, 0, 25)
          // Inner circle
          g.fillStyle(0x5da3f0, 1)
          g.fillCircle(0, 0, 18)
          // Highlight
          g.fillStyle(0xffffff, 0.5)
          g.fillCircle(-6, -6, 8)
        }}
      />
      <Text text="GO" style={{ fontSize: '16px', color: '#ffff00', fontStyle: 'bold' }} y={-6} />
    </View>
  )

  return (
    <View padding={20} gap={20} justifyContent="center" alignItems="center">
      <View gap={15} alignItems="center">
        <Joystick
          width={200}
          height={200}
          base={customBase}
          thumb={customThumb}
          minForce={0.1}
          onMove={(active, angle, force) => {
            if (active) {
              const rad = (angle * Math.PI) / 180
              const y = Math.sin(rad) * force * 50
              const x = Math.cos(rad) * force * 50
              setPosition({ x: Math.round(x), y: Math.round(y) })
            } else {
              setPosition({ x: 0, y: 0 })
            }
          }}
        />
        <Text text={`X: ${position.x}, Y: ${position.y}`} style={{ fontSize: '16px' }} />
      </View>
    </View>
  )
}
