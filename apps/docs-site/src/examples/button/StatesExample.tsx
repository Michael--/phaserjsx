/**
 * Button States Example - Disabled and interactive states
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, useState, View } from '@number10/phaserjsx'

export function StatesButtonExample() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button width={'auto'} onClick={() => setClickCount(clickCount + 1)}>
        <Text text={`Clicked ${clickCount} times`} />
      </Button>

      <Button disabled>
        <Text text="Disabled Button" />
      </Button>
    </View>
  )
}
