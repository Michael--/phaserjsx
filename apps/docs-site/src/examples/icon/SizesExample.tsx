/**
 * Icon Sizes Example - Different icon sizes
 */
/** @jsxImportSource @phaserjsx/ui */
import { Icon } from '@/components/Icon'
import { Text, View } from '@phaserjsx/ui'

export function SizesIconExample() {
  return (
    <View padding={20} gap={30}>
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Small (16px)" />
        <Icon type="check" size={16} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Medium (32px)" />
        <Icon type="check" size={32} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Large (48px)" />
        <Icon type="check" size={48} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Extra Large (64px)" />
        <Icon type="check" size={64} />
      </View>
    </View>
  )
}
