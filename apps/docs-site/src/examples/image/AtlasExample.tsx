/**
 * Image from Atlas - Using texture atlas frames
 */
/** @jsxImportSource @number10/phaserjsx */
import { Image, Text, View } from '@number10/phaserjsx'

export function AtlasImageExample() {
  return (
    <View width="100%" height="100%" padding={20} gap={20} direction="column">
      <Text text="Atlas frames (for sprites, 9slice, etc):" />

      <View gap={20} alignItems="center" flexWrap="wrap" direction="row">
        <View direction="column" alignItems="center" gap={10}>
          <Text text="Button White" />
          <Image texture="buttons" frame="ButtonWhite" width={120} height={30} />
        </View>

        <View direction="column" alignItems="center" gap={10}>
          <Text text="Button Green" />
          <Image texture="buttons" frame="ButtonRoundGreen" width={120} height={50} />
        </View>

        <View direction="column" alignItems="center" gap={10}>
          <Text text="Button Red" />
          <Image texture="buttons" frame="ButtonRoundRed" width={120} height={50} />
        </View>

        <View direction="column" alignItems="center" gap={10}>
          <Text text="Player Sprite" />
          <Image texture="buttons" frame="Player" width={64} height={64} />
        </View>
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadAtlasImage(scene: Phaser.Scene) {
  scene.load.atlas('buttons', '/assets/ui/buttons.png', '/assets/ui/buttons.json')
}
