/**
 * PortalExample - Demonstrates Portal system basics
 */
import {
  Button,
  Portal,
  ScrollView,
  Text,
  Toggle,
  useCallback,
  useState,
  useThemeTokens,
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
  const tokens = useThemeTokens()

  const handleBackgroundClick = useCallback(() => setBackgroundClicks((c) => c + 1), [])
  const handlePortal1Click = useCallback(() => setPortal1Clicks((c) => c + 1), [])
  const handlePortal2Click = useCallback(() => setPortal2Clicks((c) => c + 1), [])
  const handleToggleAll = useCallback((v: boolean) => {
    setShowPortal1(v)
    setShowPortal2(v)
    setShowPortal3(v)
  }, [])
  const handleClosePortal1 = useCallback(() => setShowPortal1(false), [])
  const handleClosePortal2 = useCallback(() => setShowPortal2(false), [])
  const handleClosePortal3 = useCallback(() => setShowPortal3(false), [])

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <SectionHeader title="Portal System - Foundation Test" />
      </View>

      {/* Portal Controls */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'} alignItems="center">
        <ViewLevel2>
          <Text text="Portal Controls" style={tokens?.textStyles.heading} />
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
          <Toggle
            checked={showPortal1 && showPortal2 && showPortal3}
            onChange={handleToggleAll}
            label="Show All Portals"
          />
        </ViewLevel2>
      </ViewLevel3>

      {/* Event Test Area */}
      <ViewLevel3
        gap={10}
        direction="row"
        padding={10}
        width={'fill'}
        justifyContent="space-around"
      >
        {/* Click Test Background */}
        <View
          width={400}
          height={200}
          backgroundColor={tokens?.colors.background.darkest.toNumber()}
          cornerRadius={8}
          padding={20}
        >
          <View direction="column" gap={10}>
            <Text text="Click Test Area" style={tokens?.textStyles.heading} />
            <Button onClick={handleBackgroundClick}>
              <Text text="Click Background Button" />
            </Button>
          </View>
        </View>

        <ViewLevel2>
          <Text text="Event Handling Test:" style={tokens?.textStyles.heading} />
          <Text text={`Background clicks: ${backgroundClicks}`} />
          <Text text={`Portal 1 clicks: ${portal1Clicks}`} />
          <Text text={`Portal 2 clicks: ${portal2Clicks}`} />
          <Text text="👆 Click on background or portals to test event handling" />
        </ViewLevel2>
      </ViewLevel3>

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
        <Portal key="portal-1" depth={1000}>
          <ViewLevel2
            x={100}
            y={200}
            minWidth={300}
            minHeight={250}
            backgroundColor={tokens?.colors.info.medium.toNumber() ?? 0}
          >
            <Text text="Portal 1" style={tokens?.textStyles.heading} />
            <Text text="Depth: 1000" />
            <Text text="This is rendered in a separate tree!" />
            <Button onClick={handlePortal1Click}>
              <Text text="Click Portal 1" />
            </Button>
            <Button onClick={handleClosePortal1}>
              <Text text="Close" />
            </Button>
          </ViewLevel2>
        </Portal>
      )}

      {showPortal2 && (
        <Portal key="portal-2" depth={2000}>
          <ViewLevel2
            x={200}
            y={250}
            minWidth={300}
            minHeight={250}
            backgroundColor={tokens?.colors.warning.medium.toNumber() ?? 0}
          >
            <Text text="Portal 2" style={tokens?.textStyles.heading} />
            <Text text="Depth: 2000" />
            <Text text="I'm above Portal 1!" />
            <Text text="(Events should NOT pass through)" style={tokens?.textStyles.small} />
            <Button onClick={handlePortal2Click}>
              <Text text="Click Portal 2" />
            </Button>
            <Button onClick={handleClosePortal2}>
              <Text text="Close" />
            </Button>
          </ViewLevel2>
        </Portal>
      )}

      {showPortal3 && (
        <Portal key="portal-3" depth={3000}>
          <ViewLevel2
            x={300}
            y={300}
            minWidth={300}
            minHeight={200}
            backgroundColor={tokens?.colors.success.medium.toNumber() ?? 0}
          >
            <Text text="Portal 3" style={tokens?.textStyles.heading} />
            <Text text="Depth: 3000" />
            <Text text="I'm on top of everything!" />
            <Text text="(Auto event-blocking by Portal)" style={tokens?.textStyles.small} />
            <Button onClick={handleClosePortal3}>
              <Text text="Close" />
            </Button>
          </ViewLevel2>
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
