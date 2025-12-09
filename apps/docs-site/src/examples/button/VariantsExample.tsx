/**
 * Button Variants Example - Visual styles
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

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
