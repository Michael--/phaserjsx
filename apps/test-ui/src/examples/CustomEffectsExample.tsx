/**
 * Custom Effects Example
 * Demonstrates how to use custom effects in components
 */
import { Button, Text, View } from '@phaserjsx/ui'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

function Example() {
  return (
    <ViewLevel2>
      {/* Using custom effect via string name */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button effect="squash" effectConfig={{ time: 300, intensity: 1.3 }} onClick={() => {}}>
          <Text text="Squash Effect" />
        </Button>
      </ViewLevel3>

      {/* Compare with built-in effects */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button effect="pulse" onClick={() => {}}>
          <Text text="Built-in Pulse" />
        </Button>
        <Button effect="tada" onClick={() => {}}>
          <Text text="Built-in Tada" />
        </Button>
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function CustomEffectsExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <Example />
    </View>
  )
}
