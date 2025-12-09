/**
 * Button Quick Start Example - Most basic usage
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function QuickStartButtonExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Button onClick={() => console.log('Button clicked!')}>
        <Text text="Click Me" />
      </Button>
    </View>
  )
}
