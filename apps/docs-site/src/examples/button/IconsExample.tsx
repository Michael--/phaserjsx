/**
 * Button with Icons Example - Combining buttons with icon components
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Icon, Text, View } from '@phaserjsx/ui'

export function IconsButtonExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <Button>
        <View direction="row" gap={8} alignItems="center">
          <Icon name="play" size={20} />
          <Text text="Play" />
        </View>
      </Button>

      <Button variant="secondary">
        <View direction="row" gap={8} alignItems="center">
          <Icon name="settings" size={20} />
          <Text text="Settings" />
        </View>
      </Button>

      <Button variant="outline">
        <View direction="row" gap={8} alignItems="center">
          <Text text="Download" />
          <Icon name="download" size={20} />
        </View>
      </Button>
    </View>
  )
}
