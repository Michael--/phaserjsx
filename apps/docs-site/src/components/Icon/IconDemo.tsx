/**
 * Quick demo of Icon component in docs-site
 * Shows a simple icon to verify the system works
 */
import { Icon } from '@/components/Icon'
import { View } from '@phaserjsx/ui'

export function IconDemo() {
  return (
    <View width={800} height={600}>
      <Icon type="check" size={64} x={100} y={100} />
      <Icon type="gear" size={64} x={200} y={100} />
    </View>
  )
}
