/**
 * Image Scaling - Different scaling modes
 */
/** @jsxImportSource @phaserjsx/ui */
import { Image, Text, View } from '@phaserjsx/ui'

export function ScalingImageExample() {
  return (
    <View width="100%" height="100%" padding={20} gap={30} flexWrap="wrap">
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Original (32x32)" />
        <Image texture="test" displayWidth={32} displayHeight={32} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="2x Scale" />
        <Image texture="test" displayWidth={64} displayHeight={64} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="4x Scale" />
        <Image texture="test" displayWidth={128} displayHeight={128} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Stretched" />
        <Image texture="wideline" displayWidth={200} displayHeight={60} />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadScalingImage(scene: Phaser.Scene) {
  scene.load.image('test', '/assets/images/test.png')
  scene.load.image('wideline', '/assets/images/wideline.png')
}
