/**
 * Sprite Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Sprite, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function QuickStartSpriteExample() {
  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Text text="Sprites render Phaser textures as layout-independent game objects." />
      <View width={300} height={150} direction="stack" backgroundColor={0x20283a} cornerRadius={8}>
        <Sprite texture="sprite-eye" x={105} y={75} scale={0.85} />
        <Sprite texture="sprite-eye" x={195} y={75} scale={0.85} alpha={0.65} />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadQuickStartSprite(scene: Phaser.Scene) {
  scene.load.image('sprite-eye', resolveAssetPath('assets/images/lance-overdose-loader-eye.png'))
}
