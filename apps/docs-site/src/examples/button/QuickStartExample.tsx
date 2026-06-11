/**
 * Button Quick Start Example - Most basic usage
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, View } from '@number10/phaserjsx'

export function QuickStartButtonExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <Button label="Start Quest" onClick={() => console.log('Button clicked!')} />
    </View>
  )
}
