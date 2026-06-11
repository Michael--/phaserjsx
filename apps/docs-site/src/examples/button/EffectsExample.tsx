/**
 * Button Effects Example - PhaserJSX animations
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, View } from '@number10/phaserjsx'

export function EffectsButtonExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      <Button effect="tada" effectConfig={{ time: 500 }} label="Tada Effect" />

      <Button
        effect="bounce"
        effectConfig={{ time: 600 }}
        variant="secondary"
        label="Bounce Effect"
      />

      <Button effect="pulse" effectConfig={{ time: 800 }} variant="outline" label="Pulse Effect" />

      <Button effect="fade" effectConfig={{ time: 400 }} variant="ghost" label="Fade Effect" />
    </View>
  )
}
