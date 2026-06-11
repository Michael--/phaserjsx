/**
 * Button States Example - Disabled and interactive states
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, useState, View } from '@number10/phaserjsx'

export function StatesButtonExample() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button
        width={180}
        label={`Clicked ${clickCount} times`}
        onClick={() => setClickCount(clickCount + 1)}
      />

      <Button disabled label="Disabled Button" />
    </View>
  )
}
