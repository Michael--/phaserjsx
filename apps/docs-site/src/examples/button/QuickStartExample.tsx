/**
 * Button Quick Start Example - Most basic usage
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function QuickStartButtonExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Button onClick={() => console.log('Button clicked!')}>
        <Text text="Click Me" />
      </Button>
    </View>
  )
}
