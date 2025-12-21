/**
 * Joystick Custom Graphics Example - Custom base and thumb
 */
/** @jsxImportSource @number10/phaserjsx */
import { Graphics, Joystick, Text, useState, View } from '@number10/phaserjsx'

export function CustomGraphicsJoystickExample() {
  const [direction, setDirection] = useState('Center')

  const customBase = (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        // Custom octagon base
        g.fillStyle(0x333333, 0.8)
        g.lineStyle(3, 0xffaa00, 1)
        const sides = 8
        const radius = 80
        g.beginPath()
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
        g.closePath()
        g.fillPath()
        g.strokePath()
      }}
    />
  )

  const customThumb = (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        // Custom star thumb
        g.fillStyle(0xffaa00, 1)
        g.lineStyle(2, 0xffffff, 1)
        const spikes = 5
        const outerRadius = 25
        const innerRadius = 12
        g.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
        g.closePath()
        g.fillPath()
        g.strokePath()
      }}
    />
  )

  return (
    <View padding={20} gap={20} justifyContent="center" alignItems="center">
      <Joystick
        width={200}
        height={200}
        base={customBase}
        thumb={customThumb}
        rotateThumb={true}
        onMove={(active, angle) => {
          if (active) {
            const deg = Math.round(angle)
            if (deg >= 337.5 || deg < 22.5) setDirection('Up')
            else if (deg >= 22.5 && deg < 67.5) setDirection('Up-Right')
            else if (deg >= 67.5 && deg < 112.5) setDirection('Right')
            else if (deg >= 112.5 && deg < 157.5) setDirection('Down-Right')
            else if (deg >= 157.5 && deg < 202.5) setDirection('Down')
            else if (deg >= 202.5 && deg < 247.5) setDirection('Down-Left')
            else if (deg >= 247.5 && deg < 292.5) setDirection('Left')
            else if (deg >= 292.5 && deg < 337.5) setDirection('Up-Left')
          } else {
            setDirection('Center')
          }
        }}
      />
      <Text text={`Direction: ${direction}`} />
    </View>
  )
}
