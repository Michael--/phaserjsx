/**
 * Button with Icons Example - Combining buttons with text and emojis
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'
import { Icon } from '@/components/Icon'

export function IconsButtonExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <View direction="row" gap={12} alignItems="center" justifyContent="center">
        <Button>
          <Icon type="play-fill" />
          <Text text="Play" />
        </Button>

        <Button variant="secondary">
          <Icon type="gear-fill" />
          <Text text="Settings" />
        </Button>
      </View>

      <View direction="row" gap={12} alignItems="center" justifyContent="center">
        <Button variant="outline">
          <Text text="Download" />
          <Icon type="download" />
        </Button>

        <Button variant="danger">
          <Icon type="trash-fill" />
          <Text text="Delete" />
        </Button>
      </View>
    </View>
  )
}
