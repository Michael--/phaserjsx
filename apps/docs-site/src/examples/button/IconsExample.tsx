/**
 * Button with Icons Example - Combining buttons with text and emojis
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function IconsButtonExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button>
        <View direction="row" gap={8} alignItems="center">
          <Text text="▶" style={{ fontSize: '18px' }} />
          <Text text="Play" />
        </View>
      </Button>

      <Button variant="secondary">
        <View direction="row" gap={8} alignItems="center">
          <Text text="⚙" style={{ fontSize: '18px' }} />
          <Text text="Settings" />
        </View>
      </Button>

      <Button variant="outline">
        <View direction="row" gap={8} alignItems="center">
          <Text text="Download" />
          <Text text="⬇" style={{ fontSize: '18px' }} />
        </View>
      </Button>
    </View>
  )
}
