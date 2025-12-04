/**
 * Button Effects Example - PhaserJSX animations
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function EffectsButtonExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      <Button effect="tada" effectConfig={{ time: 500 }}>
        <Text text="Tada Effect" />
      </Button>

      <Button effect="bounce" effectConfig={{ time: 600 }} variant="secondary">
        <Text text="Bounce Effect" />
      </Button>

      <Button effect="pulse" effectConfig={{ time: 800 }} variant="outline">
        <Text text="Pulse Effect" />
      </Button>

      <Button effect="fade" effectConfig={{ time: 400 }}>
        <Text text="Fade Effect" />
      </Button>
    </View>
  )
}
