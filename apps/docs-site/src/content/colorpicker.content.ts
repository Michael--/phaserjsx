/**
 * ColorPicker Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { LocalizedColorPickerExample } from '@/examples/colorpicker/LocalizedExample'
import LocalizedColorPickerExampleCode from '@/examples/colorpicker/LocalizedExample.tsx?raw'
import { QuickStartColorPickerExample } from '@/examples/colorpicker/QuickStartExample'
import QuickStartColorPickerExampleCode from '@/examples/colorpicker/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * ColorPicker component documentation configuration
 */
export const colorPickerContent: ComponentDocs = {
  title: 'ColorPicker',
  description:
    'HSL color selection component built from the existing Slider and RadioGroup controls. ColorPicker supports controlled and uncontrolled usage, generated shade swatches, optional tone controls, localized labels, and theme-based styling.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Controlled ColorPicker with a Phaser color number value and onChange handler. The selected color is emitted as a number such as 0x2f80ed.',
    component: QuickStartColorPickerExample,
    height: SCENE_SIZES.large,
    code: QuickStartColorPickerExampleCode,
  },

  examples: [
    {
      id: 'localized',
      title: 'Localized Labels and Theme',
      description:
        'All visible labels can be supplied through props, while component dimensions, colors, and text styles can be supplied through the ColorPicker theme slot.',
      component: LocalizedColorPickerExample,
      height: SCENE_SIZES.large,
      code: LocalizedColorPickerExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current Phaser color number in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: '0x2f80ed',
      description: 'Initial Phaser color number in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(color: number, state: ColorPickerState) => void',
      default: undefined,
      description:
        'Callback fired when hue, saturation, lightness, tone, or swatch selection changes.',
    },
    {
      name: 'labels',
      type: 'ColorPickerLabels',
      default: 'English labels',
      description:
        'Localized labels and value formatters for title, tone, slider names, close text, and RGB output.',
    },
    {
      name: 'showTone',
      type: 'boolean',
      default: 'true',
      description: 'Shows or hides the vivid/muted tone controls.',
    },
    {
      name: 'showSwatches',
      type: 'boolean',
      default: 'true',
      description: 'Shows or hides generated darker/lighter shade swatches.',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current Phaser color number in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: '0x2f80ed',
      description: 'Initial Phaser color number in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(color: number, state: ColorPickerState) => void',
      default: undefined,
      description:
        'Callback fired with the selected Phaser color number and HSL/tone state whenever the selection changes.',
    },
    {
      name: 'tone',
      type: "'vivid' | 'muted'",
      default: undefined,
      description: 'Current tone control value in controlled mode.',
    },
    {
      name: 'defaultTone',
      type: "'vivid' | 'muted'",
      default: "'vivid'",
      description: 'Initial tone control value in uncontrolled mode.',
    },
    {
      name: 'onToneChange',
      type: "(tone: 'vivid' | 'muted') => void",
      default: undefined,
      description: 'Callback fired when the tone control changes.',
    },
    {
      name: 'onClose',
      type: '() => void',
      default: undefined,
      description: 'Optional close button callback.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: 'true when onClose is provided',
      description: 'Controls visibility of the close button.',
    },
    {
      name: 'showTone',
      type: 'boolean',
      default: 'true',
      description: 'Shows or hides the vivid/muted tone controls.',
    },
    {
      name: 'showSwatches',
      type: 'boolean',
      default: 'true',
      description: 'Shows or hides generated darker/lighter shade swatches.',
    },
    {
      name: 'showRgbLabel',
      type: 'boolean',
      default: 'true',
      description: 'Shows or hides the RGB text below the preview.',
    },
    {
      name: 'labels',
      type: 'ColorPickerLabels',
      default: 'English labels',
      description:
        'Localized labels and formatter callbacks for displayed text. Theme defaults can also provide labels.',
    },
    {
      name: 'trackLength',
      type: 'number',
      default: '280',
      description: 'Slider track length in pixels.',
    },
    {
      name: 'previewSize',
      type: 'number',
      default: '116',
      description: 'Main preview swatch width and height in pixels.',
    },
    {
      name: 'gradientSteps',
      type: 'number',
      default: '32',
      description: 'Number of segments used to draw each gradient track.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides, including the ColorPicker component theme slot.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'ColorPicker forwards layout, transform, background, border, and gesture props to its root View.',
    },
  ],

  relatedLinks: [
    {
      title: 'Slider',
      link: '/components/slider',
      description: 'ColorPicker uses Slider for hue, saturation, and lightness controls.',
    },
    {
      title: 'RadioButton',
      link: '/components/radiobutton',
      description: 'ColorPicker uses RadioGroup for the optional tone control.',
    },
    {
      title: 'Theme System',
      link: '/guides/theme-system',
      description: 'Customize ColorPicker through theme props or the global theme.',
    },
  ],
}
