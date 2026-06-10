/**
 * TileSprite Scrolling Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, TileSprite, useState, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function ScrollingTileSpriteExample() {
  const [offset, setOffset] = useState(0)

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <View direction="row" gap={10}>
        <Button onClick={() => setOffset((value) => value - 24)}>
          <Text text="Left" />
        </Button>
        <Button onClick={() => setOffset((value) => value + 24)}>
          <Text text="Right" />
        </Button>
      </View>
      <TileSprite texture="tile-wideline" width={420} height={90} tilePositionX={offset} />
      <Text text={`tilePositionX: ${offset}`} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadScrollingTileSprite(scene: Phaser.Scene) {
  scene.load.image('tile-wideline', resolveAssetPath('assets/images/wideline.png'))
}
