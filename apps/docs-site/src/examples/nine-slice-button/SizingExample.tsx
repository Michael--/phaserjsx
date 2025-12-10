/**
 * NineSliceButton Sizing Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NineSliceButton, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

/**
 * Preload function for Sizing example
 * @param scene - Phaser scene instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function preloadSizingNineSliceButton(scene: Phaser.Scene) {
  scene.load.atlas(
    'ui',
    resolveAssetPath('assets/ui/buttons.png'),
    resolveAssetPath('assets/ui/buttons.json')
  )
}

/**
 * NineSliceButton scales to any size while preserving corner quality
 */
export function SizingNineSliceButtonExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      gap={20}
      padding={10}
      justifyContent="center"
      flexWrap="wrap"
    >
      <NineSliceButton
        texture="ui"
        frame="ButtonRoundGreen"
        width={200}
        height={60}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text text="Small" style={{ fontSize: 20 }} />
      </NineSliceButton>

      <NineSliceButton
        texture="ui"
        frame="ButtonRoundGreen"
        width={300}
        height={90}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text text="Medium" style={{ fontSize: 28 }} />
      </NineSliceButton>

      <NineSliceButton
        texture="ui"
        frame="ButtonRoundGreen"
        width={400}
        height={120}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
      >
        <Text text="Large" style={{ fontSize: 56 }} />
      </NineSliceButton>
    </View>
  )
}
