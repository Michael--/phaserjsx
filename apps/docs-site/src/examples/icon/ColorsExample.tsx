/**
 * Icon Colors Example - Tinting icons with colors
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { Text, View } from '@number10/phaserjsx'

export function ColorsIconExample() {
  return (
    <View width={'100%'} height="100%" padding={20} gap={30} flexWrap="wrap">
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Default" />
        <Icon type="star" size={48} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="White" />
        <Icon type="star" size={48} tint={0xffffff} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Blue" />
        <Icon type="star" size={48} tint={0x3b82f6} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Green" />
        <Icon type="star" size={48} tint={0x22c55e} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Red" />
        <Icon type="star" size={48} tint={0xef4444} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Gold" />
        <Icon type="star" size={48} tint={0xffd700} />
      </View>
    </View>
  )
}
