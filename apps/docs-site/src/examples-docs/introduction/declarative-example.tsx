/**
 * Declarative PhaserJSX example - automatic GameObject management
 * This demonstrates the modern declarative approach with JSX
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, useState } from '@phaserjsx/ui'

function CounterExample() {
  const [counter, setCounter] = useState(0)

  return (
    <View flexDirection="column" gap={20} alignItems="center">
      <Button variant="primary" onClick={() => setCounter(counter + 1)}>
        <Text>Click me</Text>
      </Button>

      <Text fontSize={24}>Count: {counter}</Text>
    </View>
  )
}

export { CounterExample }
