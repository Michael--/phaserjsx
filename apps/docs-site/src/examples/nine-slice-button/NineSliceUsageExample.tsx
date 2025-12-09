/**
 * NineSlice Usage Example (non-button)
 */
/** @jsxImportSource @phaserjsx/ui */
import { NineSlice, Text, View } from '@phaserjsx/ui'

/**
 * Preload function for NineSlice usage example
 * @param scene - Phaser scene instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function preloadNineSliceUsage(scene: Phaser.Scene) {
  scene.load.atlas('ui', '/assets/ui/buttons.png', '/assets/ui/buttons.json')
}

/**
 * Using NineSlice primitive directly for panels and decorative elements
 */
export function NineSliceUsageExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      gap={50}
      padding={20}
      justifyContent="center"
      flexWrap="wrap"
    >
      {/* Panel background */}
      <View direction="stack" width={450} height={120}>
        <NineSlice
          texture="ui"
          frame="ButtonWhite"
          width="100%"
          height="100%"
          leftWidth={14}
          rightWidth={14}
          topHeight={14}
          bottomHeight={14}
          tint={0xccccff}
        />
        {/* Content not as child, added as an extra overlay */}
        <View
          direction="column"
          width={'fill'}
          height={'fill'}
          gap={10}
          padding={20}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            text="Information Panel"
            style={{ fontSize: 24, fontStyle: 'bold', color: '#550' }}
          />
          <Text
            text="Use NineSlice for scalable UI panels"
            style={{ fontSize: 16, color: '#cc0' }}
          />
        </View>
      </View>

      {/* Progress bar background */}
      <View direction="stack" width={450} height={60}>
        <NineSlice
          texture="ui"
          frame="ButtonWhite"
          width="100%"
          height="100%"
          leftWidth={14}
          rightWidth={14}
          topHeight={14}
          bottomHeight={14}
          tint={0x444444}
        />
        <NineSlice
          texture="ui"
          frame="ButtonWhite"
          width="70%"
          height="100%"
          leftWidth={20}
          rightWidth={20}
          topHeight={15}
          bottomHeight={15}
          tint={0x440000}
        />
        <View
          direction="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height={'100%'}
        >
          <Text text="70%" style={{ fontSize: 28, fontStyle: 'bold' }} />
        </View>
      </View>
    </View>
  )
}
