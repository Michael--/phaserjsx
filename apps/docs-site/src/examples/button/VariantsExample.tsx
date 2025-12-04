/**
 * Button Variants Example - Visual styles
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function VariantsButtonExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button variant="primary">
        <Text text="Primary" />
      </Button>

      <Button variant="secondary">
        <Text text="Secondary" />
      </Button>

      <Button variant="outline">
        <Text text="Outline" />
      </Button>
    </View>
  )
}
