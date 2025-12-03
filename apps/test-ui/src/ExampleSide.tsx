import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, RadioButton, Text, View, type VNode } from '@phaserjsx/ui'
import { Accordion, Icon, type IconType } from './components'
import { AccordionExample } from './examples/AccordionExample'
import { AdvancedLayoutExample } from './examples/AdvancedLayoutExample'
import { AlertDialogExample } from './examples/AlertDialogExample'
import { BorderExample } from './examples/BorderExample'
import { ButtonExample } from './examples/ButtonExample'
import { ColorModeExample } from './examples/ColorModeExample'
import { ConstraintsExample } from './examples/ConstraintsExample'
import { DesignTokensExample } from './examples/DesignTokensExample'
import { DialogExample } from './examples/DialogExample'
import { FlexAdvancedExample } from './examples/FlexAdvancedExample'
import { FlexExample } from './examples/FlexExample'
import { FlexGridExample } from './examples/FlexGridExample'
import { GameObjectEffectsExample } from './examples/GameObjectEffectsExample'
import { GestureExample } from './examples/GestureExample'
import { GraphicsExample } from './examples/GraphicsExample'

import { ChartTextExample } from './examples/CharTextExample'
import { ChartTextInputExample } from './examples/CharTextInputExample'
import { CheckboxExample } from './examples/CheckboxExample'
import { CustomEffectsExample } from './examples/CustomEffectsExample'
import { DropdownExample } from './examples/DropdownExample'
import { ImageExample } from './examples/ImageExample'
import { ModalExample } from './examples/ModalExample'
import { NineSliceExample } from './examples/NineSliceExample'
import { OriginExample } from './examples/OriginExample'
import { PortalExample } from './examples/PortalExample'
import { RefExample } from './examples/RefExample'
import { ScrollExample } from './examples/ScrollExamples'
import { SliderExample } from './examples/SliderExample'
import { SpringAnimationExample } from './examples/SpringAnimationExample'
import { SpriteExample } from './examples/SpriteExample'
import { StackExample } from './examples/StackExample'
import { TestExample } from './examples/TestExample'
import { ThemeExample } from './examples/ThemeExample'
import { ThemePreviewExample } from './examples/ThemePreviewExample'
import { ToggleExample } from './examples/ToggleExample'
import { WrapTextExample } from './examples/WrapTextExample'

// Module augmentation to add Sidebar theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    ExampleContainer: {
      // default is empty
    } & PhaserJSX.NestedComponentThemes
  }
}

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
  | 'accordion'
  | 'charText'
  | 'charTextInput'
  | 'customEffects'
  | 'checkbox'
  | 'dropdown'
  | 'slider'
  | 'toggle'
  | 'portal'
  | 'modal'
  | 'dialog'
  | 'alertDialog'
  | 'wrapText'

type ExampleConfig = { label: string; component: () => VNode }

type GroupedExamples = Record<
  string,
  { label: string; iconType?: IconType; examples: Partial<Record<ExampleKey, ExampleConfig>> }
>

const groupedExamples: GroupedExamples = {
  components: {
    label: 'Components',
    iconType: 'gear',
    examples: {
      button: { label: 'Button Variants', component: ButtonExample },
      checkbox: { label: 'Checkbox Component', component: CheckboxExample },
      toggle: { label: 'Toggle/Switch Component', component: ToggleExample },
      graphics: { label: 'Graphics Component', component: GraphicsExample },
      image: { label: 'Image Component', component: ImageExample },
      sprite: { label: 'Sprite Component', component: SpriteExample },
      nineslice: { label: 'NineSlice UI', component: NineSliceExample },
      accordion: { label: 'Accordion Component', component: AccordionExample },
      charText: { label: 'CharText Component', component: ChartTextExample },
      charTextInput: { label: 'CharTextInput Component', component: ChartTextInputExample },
      dropdown: { label: 'Dropdown Component', component: DropdownExample },
      slider: { label: 'Slider Component', component: SliderExample },
      portal: { label: 'Portal System (Foundation)', component: PortalExample },
      modal: { label: 'Modal Component', component: ModalExample },
      dialog: { label: 'Dialog Component', component: DialogExample },
      alertDialog: { label: 'AlertDialog Component', component: AlertDialogExample },
      wrapText: { label: 'WrapText Component', component: WrapTextExample },
    },
  },
  layout: {
    label: 'Layout',
    iconType: 'grid',
    examples: {
      stack: { label: 'Stack', component: StackExample },
      flex: { label: 'Flex vs Spacer', component: FlexExample },
      flexAdvanced: { label: 'Flex Shrink/Basis', component: FlexAdvancedExample },
      flexGrid: { label: 'Flex Grid (Wrap)', component: FlexGridExample },
      constraints: { label: 'Min/Max Constraints', component: ConstraintsExample },
      advanced: { label: 'Advanced Layouts', component: AdvancedLayoutExample },
    },
  },
  interactions: {
    label: 'Interactions',
    iconType: 'hand-index',
    examples: {
      gesture: { label: 'Gesture System', component: GestureExample },
      scroll: { label: 'Scroll Example', component: ScrollExample },
      ref: { label: 'Ref Example', component: RefExample },
    },
  },
  themes: {
    label: 'Themes & Styling',
    iconType: 'palette',
    examples: {
      theme: { label: 'Theme System', component: ThemeExample },
      themePreview: { label: 'Theme Preview', component: ThemePreviewExample },
      colorMode: { label: 'Color Mode', component: ColorModeExample },
      designToken: { label: 'Design Tokens', component: DesignTokensExample },
      border: { label: 'Border & Corners', component: BorderExample },
    },
  },
  effects: {
    label: 'Effects & Animations',
    iconType: 'stars',
    examples: {
      springAnimation: { label: 'Spring Animation', component: SpringAnimationExample },
      effects: { label: 'Object Effects', component: GameObjectEffectsExample },
      origin: { label: 'Origin View', component: OriginExample },
      customEffects: { label: 'Custom Effects', component: CustomEffectsExample },
    },
  },
  miscellaneous: {
    label: 'Miscellaneous',
    iconType: 'question-circle',
    examples: {
      test: { label: 'Test', component: TestExample },
    },
  },
} as const

function getExample(key: ExampleKey): ExampleConfig {
  for (const group of Object.values(groupedExamples)) {
    const config = group.examples[key]
    if (config !== undefined) {
      return config
    }
  }
  throw new Error(`Example ${key} not found`)
}

export function ExampleSide(props: {
  selectedExample: ExampleKey
  onChange: (value: ExampleKey) => void
}) {
  return (
    <>
      {Object.entries(groupedExamples).map(([groupKey, group]) => {
        const isOpen = group.examples[props.selectedExample] !== undefined
        return (
          <Accordion
            key={groupKey}
            title={
              <>
                <Icon type={group.iconType} />
                <Text text={group.label} />
              </>
            }
            {...(group.iconType && { icon: group.iconType })}
            defaultOpen={isOpen}
          >
            {Object.entries(group.examples).map(([value, config]) => (
              <RadioButton
                key={value}
                label={config.label}
                selected={props.selectedExample === value}
                onClick={() => props.onChange(value as ExampleKey)}
              />
            ))}
          </Accordion>
        )
      })}
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
