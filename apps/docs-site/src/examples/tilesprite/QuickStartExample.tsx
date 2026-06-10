/**
 * TileSprite Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { TileSprite, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function QuickStartTileSpriteExample() {
  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Text text="TileSprite repeats a texture across a fixed area." />
      <TileSprite texture="tile-back" width={360} height={120} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadQuickStartTileSprite(scene: Phaser.Scene) {
  scene.load.image('tile-back', resolveAssetPath('assets/images/back.png'))
}
