/**
 * Portal Depth Ordering Example - Multiple portals at different depths
 */
/** @jsxImportSource @phaserjsx/ui */
import { Portal, Text, View, useState } from '@phaserjsx/ui'

export function DepthOrderingExample() {
  const [showAll, setShowAll] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Depth Ordering Demo" style={{ fontSize: '18px' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setShowAll(!showAll)}
        >
          <Text
            text={showAll ? 'Hide Portals' : 'Show Portals'}
            style={{ fontSize: '16px', color: '#fff' }}
          />
        </View>

        <Text
          text="Portals are rendered by depth: 500 → 1000 → 1500"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      {/* Background Portal - depth 500 */}
      {showAll && (
        <Portal depth={500}>
          <View
            x={150}
            y={70}
            width={250}
            height={100}
            backgroundColor={0x10b981}
            cornerRadius={8}
            padding={16}
            justifyContent="start"
            alignItems="center"
          >
            <Text text="Depth: 500" style={{ fontSize: '18px', color: '#fff' }} />
            <Text text="Background layer" style={{ fontSize: '12px', color: '#fff' }} />
          </View>
        </Portal>
      )}

      {/* Middle Portal - depth 1000 */}
      {showAll && (
        <Portal depth={1000}>
          <View
            x={200}
            y={140}
            width={250}
            height={100}
            backgroundColor={0xf59e0b}
            cornerRadius={8}
            padding={16}
            justifyContent="start"
            alignItems="center"
          >
            <Text text="Depth: 1000" style={{ fontSize: '18px', color: '#fff' }} />
            <Text text="Middle layer" style={{ fontSize: '12px', color: '#fff' }} />
          </View>
        </Portal>
      )}

      {/* Foreground Portal - depth 1500 */}
      {showAll && (
        <Portal depth={1500}>
          <View
            x={250}
            y={210}
            width={250}
            height={100}
            backgroundColor={0xef4444}
            cornerRadius={8}
            padding={16}
            justifyContent="start"
            alignItems="center"
          >
            <Text text="Depth: 1500" style={{ fontSize: '18px', color: '#fff' }} />
            <Text text="Foreground layer" style={{ fontSize: '12px', color: '#fff' }} />
          </View>
        </Portal>
      )}
    </View>
  )
}
