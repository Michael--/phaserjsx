/**
 * CheckboxExample - Demonstrates various Checkbox variants, states, and configurations
 */
import { createTheme, ScrollView, Text, View } from '@phaserjsx/ui'
import { Checkbox, Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function Example() {
  const handleChange = (checked: boolean | 'indeterminate') => {
    console.log('Checkbox changed:', checked)
  }

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="check-square" />
        <SectionHeader title="Checkbox Component" />
      </View>

      {/* Basic Checkboxes */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Checkbox label="Unchecked checkbox" onChange={handleChange} />
        <Checkbox label="Checked checkbox" checked={true} onChange={handleChange} />
        <Checkbox label="Indeterminate checkbox" checked="indeterminate" onChange={handleChange} />
        <Checkbox label="Static checkbox" checked={true} />
      </ViewLevel3>

      {/* Tristate Mode */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Tristate Checkboxes (cycles through unchecked → checked → indeterminate)" />
        <Checkbox
          label="Tristate: unchecked"
          tristate={true}
          checked={false}
          onChange={handleChange}
        />
        <Checkbox
          label="Tristate: checked"
          tristate={true}
          checked={true}
          onChange={handleChange}
        />
        <Checkbox
          label="Tristate: indeterminate"
          tristate={true}
          checked="indeterminate"
          onChange={handleChange}
        />
      </ViewLevel3>

      {/* Binary Mode (default) */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Binary Checkboxes (cycles through unchecked ↔ checked)" />
        <Checkbox label="Binary mode checkbox" onChange={handleChange} />
      </ViewLevel3>

      {/* Groups of Checkboxes */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Checkbox Groups" />
        <View direction="column" gap={10}>
          <Checkbox label="Option 1" checked={true} />
          <Checkbox label="Option 2" checked={false} />
          <Checkbox label="Option 3" checked={true} />
          <Checkbox label="Option 4" checked={false} />
        </View>
      </ViewLevel3>

      {/* Styled Checkboxes with Theme */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Custom Themed Checkboxes" />
        <View
          direction="column"
          gap={15}
          theme={createTheme({
            Checkbox: {
              size: 28,
              gap: 15,
              labelStyle: {
                fontSize: 18,
                color: '#2ecc71',
              },
            },
          })}
        >
          <Checkbox label="Custom styled unchecked" />
          <Checkbox label="Custom styled checked" checked={true} />
        </View>
      </ViewLevel3>

      {/* Large Checkboxes */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Large Checkboxes" />
        <View
          direction="column"
          gap={15}
          theme={createTheme({
            Checkbox: {
              size: 48,
              gap: 20,
              labelStyle: {
                fontSize: 24,
              },
            },
          })}
        >
          <Checkbox label="Large checkbox 1" checked={false} />
          <Checkbox label="Large checkbox 2" checked={true} />
        </View>
      </ViewLevel3>

      {/* Small Checkboxes */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Small Checkboxes" />
        <View
          direction="column"
          gap={10}
          theme={createTheme({
            Checkbox: {
              size: 16,
              gap: 8,
              labelStyle: {
                fontSize: 12,
              },
            },
          })}
        >
          <Checkbox label="Small checkbox 1" checked={false} />
          <Checkbox label="Small checkbox 2" checked={true} />
          <Checkbox label="Small checkbox 3" checked="indeterminate" tristate={true} />
        </View>
      </ViewLevel3>

      {/* Colored Checkboxes */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Colored Checkboxes with Custom Icons" />
        <View
          direction="column"
          gap={15}
          theme={createTheme({
            Checkbox: {
              size: 32,
              gap: 12,
              bodyIcon: 'circle',
              checkedIcon: 'check-circle-fill',
              intermediateIcon: 'dash-circle-fill',
            },
          })}
        >
          <Checkbox label="Circle style unchecked" checked={false} />
          <Checkbox label="Circle style checked" checked={true} />
          <Checkbox label="Circle style indeterminate" checked="indeterminate" tristate={true} />
        </View>
      </ViewLevel3>

      {/* Use Cases */}
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <Text text="Common Use Cases" />

        {/* Settings Panel */}
        <View direction="column" gap={10} padding={15} backgroundColor={0xaa1a1a} cornerRadius={8}>
          <Text text="Settings" style={{ fontSize: 16, fontStyle: 'bold' }} />
          <Checkbox label="Enable notifications" checked={true} />
          <Checkbox label="Auto-save" checked={true} />
          <Checkbox label="Dark mode" checked={false} />
          <Checkbox label="Analytics" checked={false} />
        </View>

        {/* Permissions Panel */}
        <View direction="column" gap={10} padding={15} backgroundColor={0xaa1a1a} cornerRadius={8}>
          <Text text="Permissions" style={{ fontSize: 16, fontStyle: 'bold' }} />
          <Checkbox label="Read" checked={true} />
          <Checkbox label="Write" checked={true} />
          <Checkbox label="Delete" checked={false} />
          <Checkbox label="Admin" checked={false} />
        </View>

        {/* Master Checkbox with Indeterminate */}
        <View direction="column" gap={10} padding={15} backgroundColor={0xaa1a1a} cornerRadius={8}>
          <Text text="Select Items" style={{ fontSize: 16, fontStyle: 'bold' }} />
          <Checkbox label="Select all" checked="indeterminate" tristate={true} />
          <View padding={{ left: 30 }} direction="column" gap={8}>
            <Checkbox label="Item 1" checked={true} />
            <Checkbox label="Item 2" checked={true} />
            <Checkbox label="Item 3" checked={false} />
          </View>
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function CheckboxExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <Example />
      </ScrollView>
    </View>
  )
}
