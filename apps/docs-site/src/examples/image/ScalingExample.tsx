/**
 * Image Scaling - Different scaling modes
 */
/** @jsxImportSource @number10/phaserjsx */
import { Image, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function ScalingImageExample() {
  return (
    <View width="100%" height="100%" padding={20} gap={30} flexWrap="wrap">
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Original (32x32)" />
        <Image texture="test" width={32} height={32} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="2x Scale" />
        <Image texture="test" width={64} height={64} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="4x Scale" />
        <Image texture="test" width={128} height={128} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Stretched" />
        <Image texture="wideline" width={200} height={60} />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadScalingImage(scene: Phaser.Scene) {
  scene.load.image('test', resolveAssetPath('assets/images/test.png'))
  scene.load.image('wideline', resolveAssetPath('assets/images/wideline.png'))
}
