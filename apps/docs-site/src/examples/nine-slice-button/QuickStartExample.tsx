/**
 * NineSliceButton Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { NineSliceButton, Text, View } from '@phaserjsx/ui'

/**
 * Preload function for Quick Start example
 * @param scene - Phaser scene instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function preloadQuickStartNineSliceButton(scene: Phaser.Scene) {
  scene.load.atlas('ui', '/assets/ui/buttons.png', '/assets/ui/buttons.json')
}

/**
 * Basic NineSliceButton usage
 */
export function QuickStartNineSliceButtonExample() {
  return (
    <View width={'fill'} height={'fill'} gap={20} alignItems="center" justifyContent="center">
      <NineSliceButton
        texture="ui"
        frame="ButtonWhite"
        width={250}
        height={80}
        leftWidth={14} // Specify the corner sizes
        rightWidth={14}
        topHeight={14}
        bottomHeight={14}
        onClick={() => console.log('Button clicked!')}
      >
        <Text text="Click Me!" style={{ fontSize: 24, color: '#0' }} />
      </NineSliceButton>
    </View>
  )
}
