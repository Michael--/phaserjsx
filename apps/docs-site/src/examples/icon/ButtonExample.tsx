/**
 * Icon with Button Example - Icons combined with buttons
 */
/** @jsxImportSource @phaserjsx/ui */
import { Icon } from '@/components/Icon'
import { Button, Text, View } from '@phaserjsx/ui'

export function ButtonIconExample() {
  return (
    <View padding={20} gap={20} alignItems="center">
      <Button onClick={() => console.log('Settings clicked')}>
        <View direction="row" gap={8} alignItems="center">
          <Icon type="gear" size={20} />
          <Text text="Settings" />
        </View>
      </Button>

      <Button variant="secondary" onClick={() => console.log('Profile clicked')}>
        <View direction="row" gap={8} alignItems="center">
          <Icon type="person" size={20} />
          <Text text="Profile" />
        </View>
      </Button>

      <Button onClick={() => console.log('Download clicked')}>
        <View direction="row" gap={8} alignItems="center">
          <Icon type="download" size={20} />
          <Text text="Download" />
        </View>
      </Button>

      <Button onClick={() => console.log('Starred')}>
        <View direction="row" gap={8} alignItems="center">
          <Text text="Favorite" />
          <Icon type="star" size={20} tint={0xffd700} />
        </View>
      </Button>
    </View>
  )
}
