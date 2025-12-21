/**
 * Joystick Quick Start Example - Basic usage
 */
/** @jsxImportSource @number10/phaserjsx */
import { Joystick, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartJoystickExample() {
  const [angle, setAngle] = useState(0)
  const [force, setForce] = useState(0)

  return (
    <View padding={20} gap={20} justifyContent="center" alignItems="center">
      <Joystick
        width={200}
        height={200}
        onMove={(active, angle, force) => {
          if (active) {
            setAngle(angle)
            setForce(force)
          }
        }}
      />
      <View gap={10}>
        <Text text={`Angle: ${Math.round(angle)}°`} />
        <Text text={`Force: ${force.toFixed(2)}`} />
      </View>
    </View>
  )
}
