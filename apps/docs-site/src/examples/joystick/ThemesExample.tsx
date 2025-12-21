/**
 * Joystick Themes Example - Different visual themes
 */
/** @jsxImportSource @number10/phaserjsx */
import { Joystick, Text, View } from '@number10/phaserjsx'

export function ThemesJoystickExample() {
  return (
    <View padding={20} gap={30}>
      <View direction="row" gap={30} justifyContent="center" flexWrap="wrap">
        <View gap={10} alignItems="center">
          <Joystick width={150} height={150} joystickTheme={{ theme: 'default', tint: 0x00ff00 }} />
          <Text text="Default" />
        </View>

        <View gap={10} alignItems="center">
          <Joystick width={150} height={150} joystickTheme={{ theme: 'neon', tint: 0x00ffff }} />
          <Text text="Neon" />
        </View>

        <View gap={10} alignItems="center">
          <Joystick width={150} height={150} joystickTheme={{ theme: 'target', tint: 0xff0000 }} />
          <Text text="Target" />
        </View>
      </View>

      <View direction="row" gap={30} justifyContent="center" flexWrap="wrap">
        <View gap={10} alignItems="center">
          <Joystick width={150} height={150} joystickTheme={{ theme: 'glass', tint: 0xffffff }} />
          <Text text="Glass" />
        </View>

        <View gap={10} alignItems="center">
          <Joystick
            width={150}
            height={150}
            joystickTheme={{ theme: 'military', tint: 0x00ff00 }}
          />
          <Text text="Military" />
        </View>
      </View>
    </View>
  )
}
