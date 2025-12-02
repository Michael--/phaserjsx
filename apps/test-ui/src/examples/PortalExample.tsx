/**
 * PortalExample - Demonstrates Portal system basics
 */
import {
  Button,
  Portal,
  ScrollView,
  Text,
  Toggle,
  useEffect,
  useRedraw,
  useState,
  View,
} from '@phaserjsx/ui'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function Example() {
  const [showPortal1, setShowPortal1] = useState(false)
  const [showPortal2, setShowPortal2] = useState(false)
  const [showPortal3, setShowPortal3] = useState(false)
  const [backgroundClicks, setBackgroundClicks] = useState(0)
  const [portal1Clicks, setPortal1Clicks] = useState(0)
  const [portal2Clicks, setPortal2Clicks] = useState(0)
  const redraw = useRedraw()

  // Redraw when portal visibility changes
  useEffect(() => {
    redraw()
  }, [showPortal1, showPortal2, showPortal3])

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <SectionHeader title="Portal System - Foundation Test" />
      </View>

      {/* Portal Controls */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Portal Controls" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={showPortal1}
          onChange={setShowPortal1}
          label="Show Portal 1 (depth: 1000)"
        />
        <Toggle
          checked={showPortal2}
          onChange={setShowPortal2}
          label="Show Portal 2 (depth: 2000)"
        />
        <Toggle
          checked={showPortal3}
          onChange={setShowPortal3}
          label="Show Portal 3 (depth: 3000)"
        />
        <Button
          onClick={() => {
            setShowPortal1(true)
            setShowPortal2(true)
            setShowPortal3(true)
          }}
        >
          <Text text="Open All" />
        </Button>
      </ViewLevel3>

      {/* Event Test Area */}
      <ViewLevel3 gap={10} direction="column" padding={10} width={'fill'}>
        <Text text="Event Handling Test:" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Text text={`Background clicks: ${backgroundClicks}`} />
        <Text text={`Portal 1 clicks: ${portal1Clicks}`} />
        <Text text={`Portal 2 clicks: ${portal2Clicks}`} />
        <Text text="👆 Click on background or portals to test event handling" />
      </ViewLevel3>

      {/* Click Test Background */}
      <View width={800} height={600} backgroundColor={0x34495e} cornerRadius={8} padding={20}>
        <View direction="column" gap={10}>
          <Text text="Click Test Area" style={{ fontSize: 16, color: '#ecf0f1' }} />
          <Button onClick={() => setBackgroundClicks((c) => c + 1)}>
            <Text text="Click Background Button" />
          </Button>
        </View>
      </View>

      {/* Portal Info */}
      <ViewLevel3 gap={10} direction="column" padding={10} width={'fill'}>
        <Text text="Portal System Concept:" />
        <Text text="• Portals render content in a separate tree" />
        <Text text="• Each portal has a depth (z-index)" />
        <Text text="• Higher depth = more in foreground" />
        <Text text="• Should block click-through when active" />
        <Text text="• Perfect for modals, tooltips, overlays" />
      </ViewLevel3>

      {/* Portals */}
      {showPortal1 && (
        <Portal depth={1000}>
          <View
            x={100}
            y={200}
            width={300}
            height={250}
            backgroundColor={0x3498db}
            cornerRadius={8}
            padding={20}
            direction="column"
            gap={10}
          >
            <Text text="Portal 1" style={{ fontSize: 20, fontStyle: 'bold' }} />
            <Text text="Depth: 1000" />
            <Text text="This is rendered in a separate tree!" />
            <Button onClick={() => setPortal1Clicks((c) => c + 1)}>
              <Text text="Click Portal 1" />
            </Button>
            <Button onClick={() => setShowPortal1(false)}>
              <Text text="Close" />
            </Button>
          </View>
        </Portal>
      )}

      {showPortal2 && (
        <Portal depth={2000}>
          <View
            x={250}
            y={250}
            width={300}
            height={250}
            backgroundColor={0xe74c3c}
            cornerRadius={8}
            padding={20}
            direction="column"
            gap={10}
          >
            <Text text="Portal 2" style={{ fontSize: 20, fontStyle: 'bold' }} />
            <Text text="Depth: 2000" />
            <Text text="I'm above Portal 1!" />
            <Text text="(Events should NOT pass through)" style={{ fontSize: 12 }} />
            <Button onClick={() => setPortal2Clicks((c) => c + 1)}>
              <Text text="Click Portal 2" />
            </Button>
            <Button onClick={() => setShowPortal2(false)}>
              <Text text="Close" />
            </Button>
          </View>
        </Portal>
      )}

      {showPortal3 && (
        <Portal depth={3000}>
          <View
            x={400}
            y={300}
            width={300}
            height={200}
            backgroundColor={0x2ecc71}
            cornerRadius={8}
            padding={20}
            direction="column"
            gap={10}
          >
            <Text text="Portal 3" style={{ fontSize: 20, fontStyle: 'bold' }} />
            <Text text="Depth: 3000" />
            <Text text="I'm on top of everything!" />
            <Button onClick={() => setShowPortal3(false)}>
              <Text text="Close" />
            </Button>
          </View>
        </Portal>
      )}
    </ViewLevel2>
  )
}

export function PortalExample() {
  return (
    <ScrollView width={'100%'} height={'100%'}>
      <Example />
    </ScrollView>
  )
}
