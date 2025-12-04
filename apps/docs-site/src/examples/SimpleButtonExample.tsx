/**
 * Simple Button Example for POC
 * This demonstrates PhaserJSX running in the docs site
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

/**
 * Basic button example
 */
export function SimpleButtonExample() {
  return (
    <View padding={20} gap={20}>
      <Button onClick={() => console.log('Primary clicked!')}>
        <Text text="Primary Button" />
      </Button>
      <Button variant="secondary" onClick={() => console.log('Secondary clicked!')}>
        <Text text="Secondary Button" />
      </Button>
      <Button variant="outline" onClick={() => console.log('Outline clicked!')}>
        <Text text="Outline Button" />
      </Button>
    </View>
  )
}
