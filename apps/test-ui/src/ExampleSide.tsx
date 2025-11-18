import { Text, View } from '@phaserjsx/ui'
import { RadioGroup, type RadioGroupOption } from './components'
import { AdvancedLayoutExample } from './examples/AdvancedLayoutExample'
import { BorderExample } from './examples/BorderExample'
import { FlexExample } from './examples/FlexExample'
import { LayoutExample } from './examples/LayoutExample'
import { NineSliceExample } from './examples/NineSliceExample'
import { RefExample } from './examples/RefExample'
import { ScrollExample } from './examples/ScrollExamples'
import { StackExample } from './examples/StackExample'
import { ThemeExample } from './examples/ThemeExample'
import { ToggleButtonExample } from './examples/ToggleButtonExample'

const examples = {
  layout: { label: 'Layout System', component: LayoutExample },
  advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
  toggle: { label: 'Toggle Buttons', component: ToggleButtonExample },
  stack: { label: 'Stack', component: StackExample },
  flex: { label: 'Flex vs Spacer', component: FlexExample },
  border: { label: 'Border & Corners', component: BorderExample },
  ref: { label: 'Ref Example', component: RefExample },
  nineslice: { label: 'NineSlice UI', component: NineSliceExample },
  scroll: { label: 'Scroll Example', component: ScrollExample },
  theme: { label: 'Theme System', component: ThemeExample },
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
      <Text text="Examples" />
      <RadioGroup
        options={exampleOptions}
        value={props.selectedExample}
        onChange={(value: string) => props.onChange(value as ExampleKey)}
      />
    </>
  )
}

export function ExampleContainer(props: { selectedExample: ExampleKey }) {
  const Component = examples[props.selectedExample].component
  return (
    <View key="demo-container">
      <Component key={props.selectedExample} />
    </View>
  )
}
