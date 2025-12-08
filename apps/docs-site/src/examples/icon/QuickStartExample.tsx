/**
 * Icon Quick Start Example - Basic icon usage
 */
/** @jsxImportSource @phaserjsx/ui */
import { Icon } from '@/components/Icon'
import { View } from '@phaserjsx/ui'

export function QuickStartIconExample() {
  return (
    <View padding={20} justifyContent="center" alignItems="center" direction="row" gap={20}>
      <Icon type="check" size={32} />
      <Icon type="gear" size={32} />
      <Icon type="star" size={32} />
    </View>
  )
}
