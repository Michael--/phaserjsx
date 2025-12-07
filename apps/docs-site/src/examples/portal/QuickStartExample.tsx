/**
 * Portal Quick Start Example - Basic overlay rendering
 */
/** @jsxImportSource @phaserjsx/ui */
import { Portal, Text, View, useState } from '@phaserjsx/ui'

export function QuickStartExample() {
  const [showPortal, setShowPortal] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Main Content Layer" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setShowPortal(!showPortal)}
        >
          <Text
            text={showPortal ? 'Hide Portal' : 'Show Portal'}
            style={{ fontSize: '16px', color: '#fff' }}
          />
        </View>

        <Text
          text="Click button to toggle portal overlay"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      {/* Portal renders at depth 1000 - above main content */}
      {showPortal && (
        <Portal depth={1000}>
          <View
            x={100}
            y={50}
            width={300}
            height={200}
            backgroundColor={0xef4444}
            cornerRadius={12}
            padding={20}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              text="Portal Content"
              style={{ fontSize: '20px', color: '#fff', fontStyle: 'bold' }}
            />
            <Text
              text="Rendered in separate depth layer"
              style={{ fontSize: '14px', color: '#fff' }}
            />
          </View>
        </Portal>
      )}
    </View>
  )
}
