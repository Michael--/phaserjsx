/** @jsxImportSource @phaserjsx/ui */
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
} from '@phaserjsx/ui'
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

/**
 * Options with icons
 */
const iconOptions: DropdownOption[] = [
  { value: 'home', label: 'Home', prefix: <Icon type="house" size={16} /> },
  { value: 'user', label: 'Profile', prefix: <Icon type="person-circle" size={16} /> },
  { value: 'settings', label: 'Settings', prefix: <Icon type="gear" size={16} /> },
  { value: 'mail', label: 'Messages', prefix: <Icon type="envelope" size={16} /> },
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

/**
 * Dropdown examples component
 */
function Example() {
  const [selected1, setSelected1] = useState<string>('')
  const [selected2, setSelected2] = useState<string>('')
  const [selected3, setSelected3] = useState<string[]>([])
  const [selected4, setSelected4] = useState<string>('')
  const [selected5, setSelected5] = useState<string>('')

  return (
    <View direction="column" gap={32} padding={20}>
      <Text text="Dropdown/Select Examples" style={{ fontSize: '24px', color: '#ffffff' }} />

      {/* Basic Single Select */}
      <View direction="column" gap={8}>
        <Text text="1. Basic Single Select" style={{ fontSize: '18px', color: '#4a9eff' }} />
        <Dropdown
          options={basicOptions}
          value={selected1}
          onChange={(value) => setSelected1(value as string)}
          placeholder="Select a fruit..."
          width={300}
        />
        <Text
          text={`Selected: ${basicOptions.find((opt) => opt.value === selected1)?.label || 'None'}`}
          style={{ fontSize: '14px', color: '#999' }}
        />
      </View>

      {/* Multi-Select */}
      <View direction="column" gap={8}>
        <Text text="2. Multi-Select" style={{ fontSize: '18px', color: '#4a9eff' }} />
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
          style={{ fontSize: '14px', color: '#999' }}
        />
      </View>

      {/* Filterable Dropdown */}
      <View direction="column" gap={8}>
        <Text text="3. Filterable Dropdown" style={{ fontSize: '18px', color: '#4a9eff' }} />
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
          style={{ fontSize: '14px', color: '#999' }}
        />
      </View>

      {/* With Icons */}
      <View direction="column" gap={8}>
        <Text text="4. Dropdown with Icons" style={{ fontSize: '18px', color: '#4a9eff' }} />
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
          style={{ fontSize: '14px', color: '#999' }}
        />
      </View>

      {/* Disabled State */}
      <View direction="column" gap={8}>
        <Text text="5. Disabled Dropdown" style={{ fontSize: '18px', color: '#4a9eff' }} />
        <Dropdown
          options={basicOptions}
          value="apple"
          placeholder="Disabled dropdown"
          disabled={true}
          width={300}
        />
      </View>

      {/* Custom Placement */}
      <View direction="column" gap={8}>
        <Text
          text="6. Auto Placement (opens up/down)"
          style={{ fontSize: '18px', color: '#4a9eff' }}
        />
        <Dropdown
          options={basicOptions}
          value={selected5}
          onChange={(value) => setSelected5(value as string)}
          placeholder="Auto placement..."
          placement="auto"
          width={300}
        />
      </View>

      {/* Custom Render */}
      <View direction="column" gap={8}>
        <Text text="7. Custom Render" style={{ fontSize: '18px', color: '#4a9eff' }} />
        <Dropdown
          options={basicOptions}
          value={selected1}
          onChange={(value) => setSelected1(value as string)}
          placeholder="Custom render..."
          width={300}
          renderValue={(selected) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0)) {
              return (
                <Text text="🎨 Choose a fruit" style={{ color: '#666666', fontSize: '14px' }} />
              )
            }
            const option = Array.isArray(selected) ? selected[0] : selected
            if (!option) return null
            return (
              <View direction="row" gap={8} alignItems="center">
                <Text text="🍎" style={{ fontSize: '16px' }} />
                <Text text={option.label} style={{ color: '#ffffff', fontSize: '14px' }} />
              </View>
            )
          }}
          renderOption={(option, isSelected) => (
            <View direction="row" gap={8} alignItems="center">
              <Text text={isSelected ? '✓' : '○'} style={{ fontSize: '14px', color: '#4a9eff' }} />
              <Text text={option.label} style={{ fontSize: '14px' }} />
            </View>
          )}
        />
      </View>
    </View>
  )
}

export function DropdownExample() {
  const tokens = useThemeTokens()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <Text text="Examples" style={tokens?.textStyles.title} />
          <Example />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
