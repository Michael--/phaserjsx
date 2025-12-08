/**
 * Image Quick Start - Basic image loading from Phaser assets
 */
/** @jsxImportSource @phaserjsx/ui */
import { Image, Text, View } from '@phaserjsx/ui'

export function QuickStartImageExample() {
  return (
    <View width="100%" height="100%" padding={20} gap={20}>
      <Text text="Images require preloaded Phaser assets:" />

      <View gap={20} direction="row" flexWrap="wrap">
        <Image texture="test" width={64} height={64} />
        <Image texture="back" width={64} height={64} />
        <Image texture="wideline" width={64} height={64} />
      </View>
    </View>
  )
}

/**
 * Preload function - load assets before mounting
 */
// eslint-disable-next-line react-refresh/only-export-components
export function preloadQuickStartImage(scene: Phaser.Scene) {
  scene.load.image('test', '/assets/images/test.png')
  scene.load.image('back', '/assets/images/back.png')
  scene.load.image('wideline', '/assets/images/wideline.png')
}
