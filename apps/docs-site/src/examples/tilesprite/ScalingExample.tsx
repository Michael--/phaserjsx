/**
 * TileSprite Scaling Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, TileSprite, useState, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function ScalingTileSpriteExample() {
  const [scale, setScale] = useState(1)

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <Button onClick={() => setScale((value) => (value >= 2 ? 0.5 : value + 0.25))}>
        <Text text="Change Tile Scale" />
      </Button>
      <TileSprite
        texture="tile-scale"
        width={360}
        height={120}
        tileScaleX={scale}
        tileScaleY={scale}
      />
      <Text text={`tileScale: ${scale.toFixed(2)}`} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadScalingTileSprite(scene: Phaser.Scene) {
  scene.load.image('tile-scale', resolveAssetPath('assets/images/back.png'))
}
