import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View } from '@phaserjsx/ui'
import { RadioGroup, type RadioGroupOption } from './components'
import { AdvancedLayoutExample } from './examples/AdvancedLayoutExample'
import { BorderExample } from './examples/BorderExample'
import { ButtonExample } from './examples/ButtonExample'
import { FlexExample } from './examples/FlexExample'
import { GameObjectEffectsExample } from './examples/GameObjectEffectsExample'
import { GestureExample } from './examples/GestureExample'
import { LayoutExample } from './examples/LayoutExample'
import { NineSliceExample } from './examples/NineSliceExample'
import { OriginExample } from './examples/OriginExample'
import { RefExample } from './examples/RefExample'
import { ScrollExample } from './examples/ScrollExamples'
import { SpringAnimationExample } from './examples/SpringAnimationExample'
import { StackExample } from './examples/StackExample'
import { ThemeExample } from './examples/ThemeExample'

// Module augmentation to add Sidebar theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    ExampleContainer: {
      // default is empty
    } & PhaserJSX.NestedComponentThemes
  }
}

const examples = {
  layout: { label: 'Layout System', component: LayoutExample },
  advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
  button: { label: 'Button Variants', component: ButtonExample },
  gesture: { label: 'Gesture System', component: GestureExample },
  stack: { label: 'Stack', component: StackExample },
  flex: { label: 'Flex vs Spacer', component: FlexExample },
  border: { label: 'Border & Corners', component: BorderExample },
  ref: { label: 'Ref Example', component: RefExample },
  nineslice: { label: 'NineSlice UI', component: NineSliceExample },
  springAnimation: { label: 'Spring Animation', component: SpringAnimationExample },
  scroll: { label: 'Scroll Example', component: ScrollExample },
  theme: { label: 'Theme System', component: ThemeExample },
  effects: { label: 'Object Effects', component: GameObjectEffectsExample },
  origin: { label: 'Origin View', component: OriginExample },
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
  const { nestedTheme } = getThemedProps('ExampleContainer', undefined, {})
  const Component = examples[props.selectedExample].component
  return (
    <View key="demo-container" theme={nestedTheme}>
      <Component key={props.selectedExample} />
    </View>
  )
}
