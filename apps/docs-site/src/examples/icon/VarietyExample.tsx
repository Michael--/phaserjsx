/**
 * Icon Variety Example - Showcase different icon types
 */
/** @jsxImportSource @phaserjsx/ui */
import { Icon } from '@/components/Icon'
import { View } from '@phaserjsx/ui'

export function VarietyIconExample() {
  return (
    <View padding={20} gap={20}>
      <View direction="row" gap={15} justifyContent="center">
        <Icon type="check" size={32} />
        <Icon type="gear" size={32} />
        <Icon type="star" size={32} />
        <Icon type="house" size={32} />
        <Icon type="person" size={32} />
      </View>

      <View direction="row" gap={15} justifyContent="center">
        <Icon type="envelope" size={32} />
        <Icon type="bell" size={32} />
        <Icon type="trash" size={32} />
        <Icon type="search" size={32} />
        <Icon type="heart" size={32} />
      </View>

      <View direction="row" gap={15} justifyContent="center">
        <Icon type="folder" size={32} />
        <Icon type="calendar" size={32} />
        <Icon type="clock" size={32} />
        <Icon type="download" size={32} />
        <Icon type="upload" size={32} />
      </View>
    </View>
  )
}
