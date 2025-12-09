/**
 * Icon Preloading Example - Using useIcon hook
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon, useIcon } from '@/components/Icon'
import { Text, View } from '@number10/phaserjsx'

export function PreloadIconExample() {
  const logoReady = useIcon('bootstrap')
  const gearReady = useIcon('gear')
  const starReady = useIcon('star')

  return (
    <View padding={20} gap={20} alignItems="center">
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Preloaded Icons" />
        <View direction="row" gap={15}>
          {logoReady && <Icon type="bootstrap" size={48} />}
          {gearReady && <Icon type="gear" size={48} />}
          {starReady && <Icon type="star" size={48} />}
        </View>
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text
          text={`Status: ${logoReady && gearReady && starReady ? 'All Ready' : 'Loading...'}`}
        />
      </View>
    </View>
  )
}
