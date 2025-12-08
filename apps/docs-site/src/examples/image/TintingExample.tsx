/**
 * Image Tinting - Apply color tints to images
 */
/** @jsxImportSource @phaserjsx/ui */
import { Image, Text, View } from '@phaserjsx/ui'

export function TintingImageExample() {
  return (
    <View width="100%" height="100%" padding={20} gap={30} flexWrap="wrap">
      <View direction="column" alignItems="center" gap={10}>
        <Text text="Original" />
        <Image texture="test" width={64} height={64} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Red Tint" />
        <Image texture="test" width={64} height={64} tint={0xff0000} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Green Tint" />
        <Image texture="test" width={64} height={64} tint={0x00ff00} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Blue Tint" />
        <Image texture="test" width={64} height={64} tint={0x0000ff} />
      </View>

      <View direction="column" alignItems="center" gap={10}>
        <Text text="Gold Tint" />
        <Image texture="test" width={64} height={64} tint={0xffd700} />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadTintingImage(scene: Phaser.Scene) {
  scene.load.image('test', '/assets/images/test.png')
}
