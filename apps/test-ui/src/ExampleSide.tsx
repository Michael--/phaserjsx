import { Text, View } from '@phaserjsx/ui'
import { RadioGroup, type RadioGroupOption } from './components'
import { AdvancedLayoutExample } from './examples/AdvancedLayoutExample'
import { BorderExample } from './examples/BorderExample'
import { FlexExample } from './examples/FlexExample'
import { LayoutExample } from './examples/LayoutExample'
import { RefExample } from './examples/RefExample'
import { StackExample } from './examples/StackExample'
import { ToggleButtonExample } from './examples/ToggleButtonExample'

const examples = {
  layout: { label: 'Layout System', component: LayoutExample },
  advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
  toggle: { label: 'Toggle Buttons', component: ToggleButtonExample },
  stack: { label: 'Stack', component: StackExample },
  flex: { label: 'Flex vs Spacer', component: FlexExample },
  border: { label: 'Border & Corners', component: BorderExample },
  ref: { label: 'Ref Example', component: RefExample },
} as const

export type ExampleKey = keyof typeof examples

export function ExampleSide(props: {
  selectedExample: ExampleKey
  onChange: (value: ExampleKey) => void
}) {
  const exampleOptions: RadioGroupOption[] = Object.entries(examples).map(([value, config]) => ({
    value: value as ExampleKey,
    label: config.label,
  }))

  return (
    <>
      <Text text="Examples" color={'cyan'} style={{ fontSize: 18 }} />
      <RadioGroup
        options={exampleOptions}
        value={props.selectedExample}
        onChange={(value: string) => props.onChange(value as ExampleKey)}
        gap={8}
        selectedColor={0x4ecdc4}
        unselectedColor={0x555555}
      />
    </>
  )
}

export function DemoContainer(props: { selectedDemo: ExampleKey }) {
  const Component = examples[props.selectedDemo].component
  return (
    <View key="demo-container">
      <Component key={props.selectedDemo} />
    </View>
  )
}
