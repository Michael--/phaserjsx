/**
 * NineSliceButton Interactive Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NineSliceButton, Text, View, useState } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

/**
 * Preload function for Interactive example
 * @param scene - Phaser scene instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function preloadInteractiveNineSliceButton(scene: Phaser.Scene) {
  scene.load.atlas(
    'ui',
    resolveAssetPath('assets/ui/buttons.png'),
    resolveAssetPath('assets/ui/buttons.json')
  )
}

/**
 * Interactive buttons with effects and state
 */
export function InteractiveNineSliceButtonExample() {
  const [count, setCount] = useState(0)

  return (
    <View
      width={'fill'}
      height={'fill'}
      gap={50}
      padding={30}
      justifyContent="center"
      flexWrap="wrap"
    >
      <Text text={`Count: ${count}`} style={{ fontSize: 32, fontStyle: 'bold' }} />

      <NineSliceButton
        texture="ui"
        frame="ButtonRoundGreen"
        width={250}
        height={80}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
        effect="jello"
        effectConfig={{ time: 600 }}
        onClick={() => setCount(count + 1)}
      >
        <Text text="Increment" style={{ fontSize: 24 }} />
      </NineSliceButton>

      <NineSliceButton
        texture="ui"
        frame="ButtonRoundRed"
        width={250}
        height={80}
        leftWidth={20}
        rightWidth={20}
        topHeight={15}
        bottomHeight={15}
        effect="bounce"
        effectConfig={{ time: 400 }}
        onClick={() => setCount(count - 1)}
      >
        <Text text="Decrement" style={{ fontSize: 24 }} />
      </NineSliceButton>

      <NineSliceButton
        texture="ui"
        frame="ButtonWhite"
        width={250}
        height={80}
        leftWidth={14}
        rightWidth={14}
        topHeight={14}
        bottomHeight={14}
        effect="fade"
        effectConfig={{ time: 500 }}
        onClick={() => setCount(0)}
      >
        <Text text="Reset" style={{ fontSize: 24, color: '#0' }} />
      </NineSliceButton>
    </View>
  )
}
