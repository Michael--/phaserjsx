/**
 * ToggleExample - Demonstrates various Toggle/Switch variants, states, and configurations
 */
import {
  createTheme,
  ScrollView,
  Text,
  Toggle,
  useEffect,
  useState,
  View,
} from '@number10/phaserjsx'
import { Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

/**
 * Manages a dynamic set of boolean toggle states identified by string keys.
 * Keys are registered on first access, defaulting to `false`.
 * @returns Object with `get`, `set`, and `toggle` functions
 */
function useToggleStateSet() {
  const [states, setStates] = useState<Record<string, boolean>>({})

  /** Returns the current value for the given key (false if unknown) */
  const get = (key: string): boolean => states[key] ?? false

  /** Sets the value for the given key explicitly */
  const set = (key: string, value: boolean): void =>
    setStates((prev) => ({ ...prev, [key]: value }))

  /** Flips the current value for the given key */
  const toggle = (key: string): void => setStates((prev) => ({ ...prev, [key]: !prev[key] }))

  return { get, set, toggle }
}

function Example() {
  const toggles = useToggleStateSet()

  useEffect(() => {
    toggles.set('basicOn', true)
    toggles.set('labelRight', true)
    toggles.set('labelLeft', true)
    toggles.set('labelNone', true)
    toggles.set('sizeSmall', true)
    toggles.set('sizeMedium', true)
    toggles.set('sizeLarge', true)
    toggles.set('colorBlue', true)
    toggles.set('colorPurple', true)
    toggles.set('colorRed', true)
    toggles.set('enabledFeature', true)
    toggles.set('notifications', true)
    toggles.set('wifi', true)
  }, [])

  return (
    <ViewLevel2 direction="column" padding={10} width={600}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="toggle-on" />
        <SectionHeader title="Toggle/Switch Component" />
      </View>

      {/* Basic Toggles */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Basic Toggles" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('basicOff')}
          onChange={(v) => toggles.set('basicOff', v)}
          label="Default Off"
        />
        <Toggle
          checked={toggles.get('basicOn')}
          onChange={(v) => toggles.set('basicOn', v)}
          label="Default On"
        />
      </ViewLevel3>

      {/* Label Positioning */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Label Positioning" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('labelRight')}
          onChange={(v) => toggles.set('labelRight', v)}
          label="Label on right (default)"
          labelPosition="right"
        />
        <Toggle
          checked={toggles.get('labelLeft')}
          onChange={(v) => toggles.set('labelLeft', v)}
          label="Label on left"
          labelPosition="left"
        />
        <Toggle
          checked={toggles.get('labelNone')}
          onChange={(v) => toggles.set('labelNone', v)}
          labelPosition="none"
        />
      </ViewLevel3>

      {/* Disabled State */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Disabled State" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle checked={false} label="Disabled OFF" disabled={true} />
        <Toggle checked={true} label="Disabled ON" disabled={true} />
      </ViewLevel3>

      {/* With Icons (prefix/suffix) */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="With Icons" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('darkMode')}
          onChange={(v) => toggles.set('darkMode', v)}
          label="Dark Mode"
          prefix={<Icon type="sun" size={20} />}
          suffix={<Icon type="moon" size={20} />}
        />
        <Toggle
          checked={toggles.get('notifications')}
          onChange={(v) => toggles.set('notifications', v)}
          label="Notifications"
          prefix={<Icon type="bell" size={20} />}
        />
        <Toggle
          checked={toggles.get('wifi')}
          onChange={(v) => toggles.set('wifi', v)}
          label="WiFi"
          suffix={<Icon type="wifi" size={20} />}
        />
      </ViewLevel3>

      {/* Custom Sizes via Theme */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Sizes" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('sizeSmall')}
          onChange={(v) => toggles.set('sizeSmall', v)}
          label="Small Toggle"
          theme={createTheme({
            Toggle: {
              width: 40,
              height: 22,
              thumbSize: 18,
            },
          })}
        />
        <Toggle
          checked={toggles.get('sizeMedium')}
          onChange={(v) => toggles.set('sizeMedium', v)}
          label="Medium Toggle (default)"
        />
        <Toggle
          checked={toggles.get('sizeLarge')}
          onChange={(v) => toggles.set('sizeLarge', v)}
          label="Large Toggle"
          theme={createTheme({
            Toggle: {
              width: 60,
              height: 34,
              thumbSize: 30,
            },
          })}
        />
      </ViewLevel3>

      {/* Custom Colors */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Colors" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('colorBlue')}
          onChange={(v) => toggles.set('colorBlue', v)}
          label="Blue Theme"
          theme={createTheme({
            Toggle: {
              trackColorOff: 0x666666,
              trackColorOn: 0x2196f3,
              thumbColor: 0xffffff,
            },
          })}
        />
        <Toggle
          checked={toggles.get('colorPurple')}
          onChange={(v) => toggles.set('colorPurple', v)}
          label="Purple Theme"
          theme={createTheme({
            Toggle: {
              trackColorOff: 0x999999,
              trackColorOn: 0x9c27b0,
              thumbColor: 0xfff3e0,
            },
          })}
        />
        <Toggle
          checked={toggles.get('colorRed')}
          onChange={(v) => toggles.set('colorRed', v)}
          label="Red Theme"
          theme={createTheme({
            Toggle: {
              trackColorOff: 0x999999,
              trackColorOn: 0xf44336,
              thumbColor: 0xffffff,
            },
          })}
        />
      </ViewLevel3>

      {/* Settings Panel Simulation */}
      <ViewLevel3 gap={15} direction="column" padding={20} width={'fill'}>
        <Text text="Settings Panel" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <View
          direction="column"
          gap={12}
          theme={createTheme({
            Toggle: {
              gap: 120,
            },
          })}
        >
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Enable Feature" />
            <Toggle
              checked={toggles.get('enabledFeature')}
              onChange={(v) => toggles.set('enabledFeature', v)}
            />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Auto-Save" />
            <Toggle
              checked={toggles.get('autoSave')}
              onChange={(v) => toggles.set('autoSave', v)}
            />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Dark Mode" />
            <Toggle
              checked={toggles.get('darkMode')}
              onChange={(v) => toggles.set('darkMode', v)}
            />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Notifications" />
            <Toggle
              checked={toggles.get('notifications')}
              onChange={(v) => toggles.set('notifications', v)}
            />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="WiFi" />
            <Toggle checked={toggles.get('wifi')} onChange={(v) => toggles.set('wifi', v)} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Bluetooth" />
            <Toggle
              checked={toggles.get('bluetooth')}
              onChange={(v) => toggles.set('bluetooth', v)}
            />
          </View>
        </View>
      </ViewLevel3>

      {/* Fast Animation */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Animation Speed" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={toggles.get('animInstant')}
          onChange={(v) => toggles.set('animInstant', v)}
          label="Instant (0ms)"
          theme={createTheme({
            Toggle: {
              duration: 0,
            },
          })}
        />
        <Toggle
          checked={toggles.get('animFast')}
          onChange={(v) => toggles.set('animFast', v)}
          label="Fast (100ms)"
          theme={createTheme({
            Toggle: {
              duration: 100,
            },
          })}
        />
        <Toggle
          checked={toggles.get('animNormal')}
          onChange={(v) => toggles.set('animNormal', v)}
          label="Normal (200ms, default)"
        />
        <Toggle
          checked={toggles.get('animSlow')}
          onChange={(v) => toggles.set('animSlow', v)}
          label="Slow (500ms)"
          theme={createTheme({
            Toggle: {
              duration: 500,
            },
          })}
        />
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function ToggleExample() {
  return (
    <ScrollView width={'100%'} height={'100%'}>
      <Example />
    </ScrollView>
  )
}
