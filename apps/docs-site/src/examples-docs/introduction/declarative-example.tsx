/**
 * Declarative PhaserJSX example - automatic GameObject management
 * This demonstrates the modern declarative approach with JSX
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View, useState } from '@phaserjsx/ui'

function CounterExample() {
  const [counter, setCounter] = useState(0)

  return (
    <View gap={20} alignItems="center">
      <Button variant="primary" onClick={() => setCounter(counter + 1)}>
        <Text text="Click me" />
      </Button>

      <Text text={`Count: {counter}`} />
    </View>
  )
}

export { CounterExample }
