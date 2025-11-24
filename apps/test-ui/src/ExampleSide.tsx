import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, Text, View, type VNode } from '@phaserjsx/ui'
import { RadioGroup } from './components'
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
import { ViewLevel2 } from './examples/Helper'
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

const groupedExamples = {
  components: {
    button: { label: 'Button Variants', component: ButtonExample },
    graphics: { label: 'Graphics Component', component: GraphicsExample },
    image: { label: 'Image Component', component: ImageExample },
    sprite: { label: 'Sprite Component', component: SpriteExample },
    nineslice: { label: 'NineSlice UI', component: NineSliceExample },
  },
  layout: {
    stack: { label: 'Stack', component: StackExample },
    flex: { label: 'Flex vs Spacer', component: FlexExample },
    flexAdvanced: { label: 'Flex Shrink/Basis', component: FlexAdvancedExample },
    flexGrid: { label: 'Flex Grid (Wrap)', component: FlexGridExample },
    constraints: { label: 'Min/Max Constraints', component: ConstraintsExample },
    advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
  },
  interactions: {
    gesture: { label: 'Gesture System', component: GestureExample },
    scroll: { label: 'Scroll Example', component: ScrollExample },
    ref: { label: 'Ref Example', component: RefExample },
  },
  themes: {
    theme: { label: 'Theme System', component: ThemeExample },
    themePreview: { label: 'Theme Preview', component: ThemePreviewExample },
    colorMode: { label: 'Color Mode', component: ColorModeExample },
    designToken: { label: 'Design Tokens', component: DesignTokensExample },
    border: { label: 'Border & Corners', component: BorderExample },
  },
  effects: {
    springAnimation: { label: 'Spring Animation', component: SpringAnimationExample },
    effects: { label: 'Object Effects', component: GameObjectEffectsExample },
    origin: { label: 'Origin View', component: OriginExample },
  },
  miscellaneous: {
    test: { label: 'Test', component: TestExample },
  },
} as const

export type ExampleKey =
  | 'button'
  | 'graphics'
  | 'image'
  | 'sprite'
  | 'nineslice'
  | 'stack'
  | 'flex'
  | 'flexAdvanced'
  | 'flexGrid'
  | 'constraints'
  | 'advanced'
  | 'gesture'
  | 'scroll'
  | 'ref'
  | 'theme'
  | 'themePreview'
  | 'colorMode'
  | 'designToken'
  | 'border'
  | 'springAnimation'
  | 'effects'
  | 'origin'
  | 'test'

type ExampleConfig = { label: string; component: () => VNode }

function getExample(key: ExampleKey): ExampleConfig {
  for (const group of Object.values(groupedExamples)) {
    if (key in group) {
      return group[key as keyof typeof group]
    }
  }
  throw new Error(`Example ${key} not found`)
}

export function ExampleSide(props: {
  selectedExample: ExampleKey
  onChange: (value: ExampleKey) => void
}) {
  const groupLabels = {
    components: 'Components',
    layout: 'Layout',
    interactions: 'Interactions',
    themes: 'Themes & Styling',
    effects: 'Effects & Animations',
    miscellaneous: 'Miscellaneous',
  } as const

  return (
    <>
      {...Object.entries(groupedExamples).map(([groupKey, groupExamples]) => (
        <ViewLevel2 key={groupKey} width={'100%'}>
          <Text text={groupLabels[groupKey as keyof typeof groupLabels]} />
          <RadioGroup
            options={Object.entries(groupExamples).map(([value, config]) => ({
              value: value as ExampleKey,
              label: config.label,
            }))}
            value={props.selectedExample}
            onChange={(value: string) => props.onChange(value as ExampleKey)}
          />
        </ViewLevel2>
      ))}
    </>
  )
}

export function ExampleContainer(props: { selectedExample: ExampleKey }) {
  const { nestedTheme } = getThemedProps('ExampleContainer', undefined, {})
  const Component = getExample(props.selectedExample).component

  return (
    <View width={'100%'} key={`container-${props.selectedExample}`} theme={nestedTheme} flex={1}>
      <Component />
    </View>
  )
}
