import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View } from '@phaserjsx/ui'
import { RadioGroup, type RadioGroupOption } from './components'
import { AdvancedLayoutExample } from './examples/AdvancedLayoutExample'
import { BorderExample } from './examples/BorderExample'
import { ButtonExample } from './examples/ButtonExample'
import { ColorModeExample } from './examples/ColorModeExample'
import { ConstraintsExample } from './examples/ConstraintsExample'
import { DesignTokensExample } from './examples/DesignTokensExample'
import { FlexAdvancedExample } from './examples/FlexAdvancedExample'
import { FlexExample } from './examples/FlexExample'
import { FlexGridExample } from './examples/FlexGridExample'
import { GameObjectEffectsExample } from './examples/GameObjectEffectsExample'
import { GestureExample } from './examples/GestureExample'
import { GraphicsExample } from './examples/GraphicsExample'
import { ImageExample } from './examples/ImageExample'
import { NineSliceExample } from './examples/NineSliceExample'
import { OriginExample } from './examples/OriginExample'
import { RefExample } from './examples/RefExample'
import { ScrollExample } from './examples/ScrollExamples'
import { SpringAnimationExample } from './examples/SpringAnimationExample'
import { SpriteExample } from './examples/SpriteExample'
import { StackExample } from './examples/StackExample'
import { TestExample } from './examples/TestExample'
import { ThemeExample } from './examples/ThemeExample'
import { ThemePreviewExample } from './examples/ThemePreviewExample'

// Module augmentation to add Sidebar theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    ExampleContainer: {
      // default is empty
    } & PhaserJSX.NestedComponentThemes
  }
}

const examples = {
  advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
  button: { label: 'Button Variants', component: ButtonExample },
  gesture: { label: 'Gesture System', component: GestureExample },
  graphics: { label: 'Graphics Component', component: GraphicsExample },
  image: { label: 'Image Component', component: ImageExample },
  sprite: { label: 'Sprite Component', component: SpriteExample },
  stack: { label: 'Stack', component: StackExample },
  flex: { label: 'Flex vs Spacer', component: FlexExample },
  flexAdvanced: { label: 'Flex Shrink/Basis', component: FlexAdvancedExample },
  flexGrid: { label: 'Flex Grid (Wrap)', component: FlexGridExample },
  constraints: { label: 'Min/Max Constraints', component: ConstraintsExample },
  border: { label: 'Border & Corners', component: BorderExample },
  ref: { label: 'Ref Example', component: RefExample },
  nineslice: { label: 'NineSlice UI', component: NineSliceExample },
  springAnimation: { label: 'Spring Animation', component: SpringAnimationExample },
  scroll: { label: 'Scroll Example', component: ScrollExample },
  theme: { label: 'Theme System', component: ThemeExample },
  themePreview: { label: 'Theme Preview', component: ThemePreviewExample },
  colorMode: { label: 'Color Mode', component: ColorModeExample },
  effects: { label: 'Object Effects', component: GameObjectEffectsExample },
  origin: { label: 'Origin View', component: OriginExample },
  designToken: { label: 'Design Tokens', component: DesignTokensExample },
  test: { label: 'Test', component: TestExample },
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
    <View width={'100%'} key={`container-${props.selectedExample}`} theme={nestedTheme} flex={1}>
      <Component />
    </View>
  )
}
