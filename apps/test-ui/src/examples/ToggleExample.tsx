/**
 * ToggleExample - Demonstrates various Toggle/Switch variants, states, and configurations
 */
import { createTheme, ScrollView, Text, Toggle, useState, View } from '@number10/phaserjsx'
import { Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function Example() {
  const [basicToggle, setBasicToggle] = useState(false)
  const [enabledFeature, setEnabledFeature] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(false)

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="toggle-on" />
        <SectionHeader title="Toggle/Switch Component" />
      </View>

      {/* Basic Toggles */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Basic Toggles" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle checked={false} label="Disabled/Off" />
        <Toggle checked={true} label="Enabled/On" />
        <Toggle
          checked={basicToggle}
          onChange={setBasicToggle}
          label={`Interactive (${basicToggle ? 'ON' : 'OFF'})`}
        />
      </ViewLevel3>

      {/* Label Positioning */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Label Positioning" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle checked={true} label="Label on right (default)" labelPosition="right" />
        <Toggle checked={true} label="Label on left" labelPosition="left" />
        <Toggle checked={true} labelPosition="none" />
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
          checked={darkMode}
          onChange={setDarkMode}
          label="Dark Mode"
          prefix={<Icon type="sun" size={20} />}
          suffix={<Icon type="moon" size={20} />}
        />
        <Toggle
          checked={notifications}
          onChange={setNotifications}
          label="Notifications"
          prefix={<Icon type="bell" size={20} />}
        />
        <Toggle
          checked={wifi}
          onChange={setWifi}
          label="WiFi"
          suffix={<Icon type="wifi" size={20} />}
        />
      </ViewLevel3>

      {/* Custom Sizes via Theme */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Sizes" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={true}
          label="Small Toggle"
          theme={createTheme({
            Toggle: {
              width: 40,
              height: 22,
              thumbSize: 18,
            },
          })}
        />
        <Toggle checked={true} label="Medium Toggle (default)" />
        <Toggle
          checked={true}
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
          checked={true}
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
          checked={true}
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
          checked={true}
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
            <Toggle checked={enabledFeature} onChange={setEnabledFeature} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Auto-Save" />
            <Toggle checked={autoSave} onChange={setAutoSave} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Dark Mode" />
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Notifications" />
            <Toggle checked={notifications} onChange={setNotifications} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="WiFi" />
            <Toggle checked={wifi} onChange={setWifi} />
          </View>
          <View direction="row" justifyContent="space-between" width="100%">
            <Text text="Bluetooth" />
            <Toggle checked={bluetooth} onChange={setBluetooth} />
          </View>
        </View>
      </ViewLevel3>

      {/* Fast Animation */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Animation Speed" style={{ fontSize: 18, fontStyle: 'bold' }} />
        <Toggle
          checked={false}
          label="Instant (0ms)"
          theme={createTheme({
            Toggle: {
              duration: 0,
            },
          })}
        />
        <Toggle
          checked={false}
          label="Fast (100ms)"
          theme={createTheme({
            Toggle: {
              duration: 100,
            },
          })}
        />
        <Toggle checked={false} label="Normal (200ms, default)" />
        <Toggle
          checked={false}
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
