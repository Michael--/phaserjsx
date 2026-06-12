/**
 * NumberInput Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { BoundsNumberInputExample } from '@/examples/number-input/BoundsExample'
import BoundsNumberInputExampleCode from '@/examples/number-input/BoundsExample.tsx?raw'
import { ButtonPlacementNumberInputExample } from '@/examples/number-input/ButtonPlacementExample'
import ButtonPlacementNumberInputExampleCode from '@/examples/number-input/ButtonPlacementExample.tsx?raw'
import { QuickStartNumberInputExample } from '@/examples/number-input/QuickStartExample'
import QuickStartNumberInputExampleCode from '@/examples/number-input/QuickStartExample.tsx?raw'
import { ThemingNumberInputExample } from '@/examples/number-input/ThemingExample'
import ThemingNumberInputExampleCode from '@/examples/number-input/ThemingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * NumberInput component documentation configuration
 */
export const numberInputContent: ComponentDocs = {
  title: 'NumberInput',
  description:
    'Numeric stepper control for bounded values. NumberInput displays a formatted value between decrement and increment buttons, supports controlled and uncontrolled usage, and avoids free-form text entry.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Controlled NumberInput with min/max constraints. The value changes only through the stepper buttons.',
    component: QuickStartNumberInputExample,
    height: SCENE_SIZES.medium,
    code: QuickStartNumberInputExampleCode,
  },

  examples: [
    {
      id: 'bounds',
      title: 'Bounds and Step',
      description:
        'Use min, max, step, and precision to keep values in range and avoid floating-point display drift.',
      component: BoundsNumberInputExample,
      height: SCENE_SIZES.large,
      code: BoundsNumberInputExampleCode,
    },
    {
      id: 'button-placement',
      title: 'Button Placement',
      description:
        'Place both step buttons on one side, keep them split around the value, use custom button content, and enable press-and-hold repeat.',
      component: ButtonPlacementNumberInputExample,
      height: SCENE_SIZES.large,
      code: ButtonPlacementNumberInputExampleCode,
    },
    {
      id: 'theming',
      title: 'Formatting and Theme',
      description:
        'Format displayed values, localize button labels, and customize the NumberInput theme slot.',
      component: ThemingNumberInputExample,
      height: SCENE_SIZES.medium,
      code: ThemingNumberInputExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current value in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: 'min ?? 0',
      description: 'Initial value in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired when the value changes through the stepper buttons.',
    },
    {
      name: 'min',
      type: 'number',
      default: undefined,
      description: 'Minimum allowed value.',
    },
    {
      name: 'max',
      type: 'number',
      default: undefined,
      description: 'Maximum allowed value.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'Value delta applied by the decrement and increment buttons.',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      default: undefined,
      description: 'Formatter for the displayed value.',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current value in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: 'min ?? 0',
      description: 'Initial value in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired with the normalized next value.',
    },
    {
      name: 'min',
      type: 'number',
      default: undefined,
      description: 'Minimum allowed value. Reversed bounds are normalized defensively.',
    },
    {
      name: 'max',
      type: 'number',
      default: undefined,
      description: 'Maximum allowed value. Reversed bounds are normalized defensively.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'Positive increment/decrement amount. Invalid steps fall back to 1.',
    },
    {
      name: 'precision',
      type: 'number',
      default: 'inferred from step',
      description: 'Decimal places used when normalizing values.',
    },
    {
      name: 'label',
      type: 'string',
      default: undefined,
      description: 'Optional visible label. If omitted, labels.value can provide fallback text.',
    },
    {
      name: 'labelPosition',
      type: "'left' | 'right' | 'top' | 'bottom' | 'none'",
      default: "'left'",
      description: 'Position of the label relative to the stepper control.',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      default: undefined,
      description: 'Formatter for the displayed value.',
    },
    {
      name: 'labels',
      type: 'NumberInputLabels',
      default: "{ decrement: '-', increment: '+', value: 'Value' }",
      description: 'Localized labels for the buttons and fallback value label.',
    },
    {
      name: 'decrementContent',
      type: 'VNode',
      default: undefined,
      description: 'Custom decrement button content. Useful for icon components.',
    },
    {
      name: 'incrementContent',
      type: 'VNode',
      default: undefined,
      description: 'Custom increment button content. Useful for icon components.',
    },
    {
      name: 'renderButtonContent',
      type: '(props: NumberInputButtonRenderProps) => VNode',
      default: undefined,
      description:
        'Render decrement/increment button content with action, disabled state, current value, next value, size, and theme colors.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables both stepper buttons and applies disabled alpha.',
    },
    {
      name: 'buttonVariant',
      type: 'ButtonVariant',
      default: "'secondary'",
      description: 'Variant forwarded to the internal Button controls.',
    },
    {
      name: 'buttonPlacement',
      type: "'split' | 'left' | 'right'",
      default: "'split'",
      description:
        'Where step buttons are placed relative to the value. Split places decrement left and increment right.',
    },
    {
      name: 'buttonDirection',
      type: "'row' | 'column'",
      default: "'row'",
      description: 'Direction used when both step buttons are placed on the left or right side.',
    },
    {
      name: 'buttonSize',
      type: 'ButtonSize',
      default: "'small'",
      description: 'Size forwarded to the internal Button controls.',
    },
    {
      name: 'buttonTextStyle',
      type: 'TextStyle',
      default: undefined,
      description: 'Text style forwarded to generated decrement/increment labels.',
    },
    {
      name: 'buttonIndicatorColor',
      type: 'number',
      default: '0xffffff',
      description: 'Base color passed to renderButtonContent.',
    },
    {
      name: 'buttonIndicatorActiveColor',
      type: 'number',
      default: '0xffffff',
      description: 'Active color passed to renderButtonContent.',
    },
    {
      name: 'repeatOnHold',
      type: 'boolean',
      default: 'true',
      description: 'Repeat value changes after a long press.',
    },
    {
      name: 'holdDelay',
      type: 'number',
      default: '350',
      description: 'Delay before hold repeat starts in milliseconds.',
    },
    {
      name: 'repeatInterval',
      type: 'number',
      default: '90',
      description: 'Interval used while holding a step button in milliseconds.',
    },
    {
      name: 'valueWidth',
      type: 'number',
      default: '78',
      description: 'Width of the displayed value area.',
    },
    {
      name: 'controlHeight',
      type: 'number',
      default: '34',
      description: 'Height of the value area.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides, including the NumberInput component theme slot.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'NumberInput forwards layout, transform, background, border, and gesture props to its root View.',
    },
  ],

  relatedLinks: [
    {
      title: 'Button',
      link: '/components/button',
      description: 'NumberInput uses Button for decrement and increment controls.',
    },
    {
      title: 'Theme System',
      link: '/guides/theme-system',
      description: 'Customize NumberInput through theme props or the global theme.',
    },
  ],
}
