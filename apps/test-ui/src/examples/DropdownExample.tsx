/** @jsxImportSource @number10/phaserjsx */
/**
 * Dropdown/Select component examples
 * Demonstrates single-select, multi-select, filterable, and custom rendering
 */
import {
  Dropdown,
  ScrollView,
  Text,
  useState,
  useThemeTokens,
  View,
  type DropdownOption,
  type EdgeInsets,
} from '@number10/phaserjsx'
import { Icon } from '../components/Icon'
import { ViewLevel2 } from './Helper'

/**
 * Basic dropdown options
 */
const basicOptions: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

const margin: EdgeInsets = { right: 10 }
/**
 * Options with icons
 */
const iconOptions: DropdownOption[] = [
  { value: 'home', label: 'Home', prefix: <Icon type="house" size={16} margin={margin} /> },
  {
    value: 'user',
    label: 'Profile',
    prefix: <Icon type="person-circle" size={16} margin={margin} />,
  },
  { value: 'settings', label: 'Settings', prefix: <Icon type="gear" size={16} margin={margin} /> },
  { value: 'mail', label: 'Messages', prefix: <Icon type="envelope" size={16} margin={margin} /> },
]

/**
 * Large options list for scrolling and filtering demo
 */
const largeOptions: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'avocado', label: 'Avocado' },
  { value: 'banana', label: 'Banana' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'cranberry', label: 'Cranberry' },
  { value: 'date', label: 'Date' },
  { value: 'dragonfruit', label: 'Dragon Fruit' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'grapefruit', label: 'Grapefruit' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'lime', label: 'Lime' },
  { value: 'mango', label: 'Mango' },
  { value: 'melon', label: 'Melon' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'peach', label: 'Peach' },
  { value: 'pear', label: 'Pear' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'plum', label: 'Plum' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'raspberry', label: 'Raspberry' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'tangerine', label: 'Tangerine' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'almond', label: 'Almond' },
  { value: 'cashew', label: 'Cashew' },
  { value: 'chestnut', label: 'Chestnut' },
  { value: 'hazelnut', label: 'Hazelnut' },
  { value: 'macadamia', label: 'Macadamia' },
  { value: 'pecan', label: 'Pecan' },
  { value: 'pistachio', label: 'Pistachio' },
  { value: 'walnut', label: 'Walnut' },
  { value: 'artichoke', label: 'Artichoke' },
  { value: 'asparagus', label: 'Asparagus' },
  { value: 'broccoli', label: 'Broccoli' },
  { value: 'carrot', label: 'Carrot' },
  { value: 'cauliflower', label: 'Cauliflower' },
  { value: 'celery', label: 'Celery' },
  { value: 'cucumber', label: 'Cucumber' },
  { value: 'eggplant', label: 'Eggplant' },
  { value: 'garlic', label: 'Garlic' },
  { value: 'lettuce', label: 'Lettuce' },
  { value: 'mushroom', label: 'Mushroom' },
  { value: 'onion', label: 'Onion' },
  { value: 'pepper', label: 'Pepper' },
  { value: 'potato', label: 'Potato' },
  { value: 'spinach', label: 'Spinach' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'zucchini', label: 'Zucchini' },
]

function BasicSelectExample() {
  const tokens = useThemeTokens()
  const [selected1, setSelected1] = useState<string>('')

  /* Basic Single Select */
  return (
    <View direction="column" gap={8}>
      <Text text="Basic Single Select" style={tokens?.textStyles.large} />
      <Dropdown
        options={basicOptions}
        value={selected1}
        onChange={(value) => setSelected1(value as string)}
        placeholder="Select a fruit..."
        width={300}
      />
      <Text
        text={`Selected: ${basicOptions.find((opt) => opt.value === selected1)?.label || 'None'}`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </View>
  )
}

function MultiSelectExample() {
  const tokens = useThemeTokens()
  const [selected3, setSelected3] = useState<string[]>([])

  return (
    <View direction="column" gap={8}>
      <Text text="Multi-Select" style={tokens?.textStyles.large} />
      <Dropdown
        options={basicOptions}
        value={selected3}
        onChange={(value) => setSelected3(value as string[])}
        placeholder="Select multiple fruits..."
        multiple={true}
        width={300}
      />
      <Text
        text={`Selected: ${selected3.length > 0 ? selected3.map((v) => basicOptions.find((opt) => opt.value === v)?.label).join(', ') : 'None'}`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </View>
  )
}

function FilterableSelectExample() {
  const tokens = useThemeTokens()
  const [selected2, setSelected2] = useState<string>('')

  return (
    <View direction="column" gap={8}>
      <Text text="Filterable Dropdown" style={tokens?.textStyles.large} />
      <Dropdown
        options={largeOptions}
        value={selected2}
        onChange={(value) => setSelected2(value as string)}
        placeholder="Filter options..."
        isFilterable={true}
        width={300}
        maxHeight={200}
      />
      <Text
        text={`Selected: ${largeOptions.find((opt) => opt.value === selected2)?.label || 'None'}`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </View>
  )
}

function CustomRenderIconsExample() {
  const [selected4, setSelected4] = useState<string>('')
  const tokens = useThemeTokens()

  return (
    <View direction="column" gap={8}>
      <Text text="Dropdown with Icons" style={tokens?.textStyles.large} />
      <Dropdown
        options={iconOptions}
        value={selected4}
        onChange={(value) => setSelected4(value as string)}
        placeholder="Select a page..."
        arrow={<Icon type="chevron-down" size={16} />}
        width={300}
      />
      <Text
        text={`Selected: ${iconOptions.find((opt) => opt.value === selected4)?.label || 'None'}`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </View>
  )
}

function DisabledExample() {
  const tokens = useThemeTokens()

  return (
    <View direction="column" gap={8}>
      <Text text="Disabled Dropdown" style={tokens?.textStyles.large} />
      <Dropdown
        options={basicOptions}
        value="apple"
        placeholder="Disabled dropdown"
        disabled={true}
        width={300}
      />
    </View>
  )
}

function PlacementExample() {
  const tokens = useThemeTokens()
  const [selected5, setSelected5] = useState<string>('')

  return (
    <View>
      <Text text={`Placement down`} style={tokens?.textStyles.large} />
      <View direction="column" height={500} width={300} padding={10}>
        {/* Custom Placement */}
        <View direction="column" gap={8}>
          <Dropdown
            options={basicOptions}
            value={selected5}
            onChange={(value) => setSelected5(value as string)}
            placeholder="Placement..."
            placement="bottom"
          />
        </View>
        <View flex={1}></View>
        <View direction="column" gap={8}>
          <Dropdown
            options={basicOptions}
            value={selected5}
            onChange={(value) => setSelected5(value as string)}
            placeholder="Placement..."
            placement="top"
          />
        </View>
        <Text text={`Placement up`} style={tokens?.textStyles.large} margin={{ top: 10 }} />
      </View>
    </View>
  )
}

function CustomRenderExample() {
  const tokens = useThemeTokens()
  const [selected1, setSelected1] = useState<string>('')

  return (
    <View direction="column" gap={8}>
      <Text text="Custom Render" style={tokens?.textStyles.large} />
      <Dropdown
        options={basicOptions}
        value={selected1}
        onChange={(value) => setSelected1(value as string)}
        placeholder="Custom render..."
        width={300}
        renderValue={(selected) => {
          if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <Text text="🎨 Choose a fruit" style={tokens?.textStyles.small} alpha={0.7} />
          }
          const option = Array.isArray(selected) ? selected[0] : selected
          if (!option) return null
          return (
            <View direction="row" gap={8} alignItems="center">
              <Text text="🍎" style={{ fontSize: '16px' }} />
              <Text text={option.label} style={tokens?.textStyles.small} />
            </View>
          )
        }}
        renderOption={(option, isSelected) => (
          <View direction="row" gap={8} alignItems="center">
            <Text
              text={isSelected ? '✓' : '○'}
              style={{
                ...tokens?.textStyles.small,
                color: tokens?.colors.primary.DEFAULT.toString() ?? '#4a9eff',
              }}
            />
            <Text text={option.label} style={tokens?.textStyles.small} />
          </View>
        )}
      />
    </View>
  )
}

export function DropdownExample() {
  const tokens = useThemeTokens()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView width="100%" height="100%">
        <ViewLevel2 width="fill">
          <Text text="Dropdown/Select Examples" style={tokens?.textStyles.title} />
          <View direction="stack" width={1500} gap={20}>
            {/* here could be view with any background, meed to draw before dropdown */}
            {/** this is necessary because of the current situation in the layout system */}
            <View gap={300}>
              <View direction="row" gap={20}>
                <BasicSelectExample />
                <MultiSelectExample />
                <FilterableSelectExample />
                <CustomRenderIconsExample />
              </View>
            </View>
            <View gap={400}>
              <View />
              <View direction="row" gap={20}>
                <DisabledExample />
                <PlacementExample />
                <CustomRenderExample />
              </View>
            </View>
          </View>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
