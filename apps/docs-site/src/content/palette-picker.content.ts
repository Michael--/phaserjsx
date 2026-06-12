/**
 * PalettePicker Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { CustomSwatchPalettePickerExample } from '@/examples/palette-picker/CustomSwatchExample'
import CustomSwatchPalettePickerExampleCode from '@/examples/palette-picker/CustomSwatchExample.tsx?raw'
import { QuickStartPalettePickerExample } from '@/examples/palette-picker/QuickStartExample'
import QuickStartPalettePickerExampleCode from '@/examples/palette-picker/QuickStartExample.tsx?raw'
import { ThemePalettePickerExample } from '@/examples/palette-picker/ThemePaletteExample'
import ThemePalettePickerExampleCode from '@/examples/palette-picker/ThemePaletteExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const palettePickerContent: ComponentDocs = {
  title: 'PalettePicker',
  description:
    'Fixed color palette picker for curated colors, theme tokens, recently used colors, and compact editor controls. PalettePicker accepts Phaser color numbers or option objects, supports controlled and uncontrolled usage, custom swatch rendering, disabled colors, and empty-state labels.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Controlled PalettePicker with an array of Phaser color numbers.',
    component: QuickStartPalettePickerExample,
    height: SCENE_SIZES.medium,
    code: QuickStartPalettePickerExampleCode,
  },

  examples: [
    {
      id: 'theme-palette',
      title: 'Theme Palette',
      description:
        'Use option objects for labels and disabled colors, then show hex values below each swatch.',
      component: ThemePalettePickerExample,
      height: SCENE_SIZES.large,
      code: ThemePalettePickerExampleCode,
    },
    {
      id: 'custom-swatch',
      title: 'Custom Swatches and Empty State',
      description:
        'Use renderSwatch for custom content and labels.empty for an empty recent-color palette.',
      component: CustomSwatchPalettePickerExample,
      height: SCENE_SIZES.medium,
      code: CustomSwatchPalettePickerExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'colors',
      type: 'Array<number | PalettePickerOption>',
      required: true,
      description:
        'Palette colors as Phaser color numbers or option objects with value, label, and disabled.',
    },
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current Phaser color number in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: 'first enabled color',
      description: 'Initial Phaser color number in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(color: number, option: NormalizedPalettePickerOption) => void',
      default: undefined,
      description: 'Callback fired when a selectable swatch is selected.',
    },
    {
      name: 'columns',
      type: 'number',
      default: '6',
      description: 'Number of columns before wrapping to a new row.',
    },
    {
      name: 'showHex',
      type: 'boolean',
      default: 'false',
      description: 'Shows formatted hex text below each swatch.',
    },
  ],

  propsComplete: [
    {
      name: 'colors',
      type: 'Array<number | PalettePickerOption>',
      required: true,
      description:
        'Palette colors as Phaser color numbers or objects: { value: number; label?: string; disabled?: boolean }.',
    },
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current Phaser color number in controlled mode.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: 'first enabled color',
      description: 'Initial Phaser color number in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(color: number, option: NormalizedPalettePickerOption) => void',
      default: undefined,
      description: 'Callback fired with the normalized selected color and option metadata.',
    },
    {
      name: 'columns',
      type: 'number',
      default: '6',
      description: 'Number of columns before wrapping to a new row.',
    },
    {
      name: 'swatchSize',
      type: 'number',
      default: '28',
      description: 'Swatch width and height in pixels.',
    },
    {
      name: 'showTitle',
      type: 'boolean',
      default: 'true',
      description: 'Shows labels.title above the palette.',
    },
    {
      name: 'showHex',
      type: 'boolean',
      default: 'false',
      description: 'Shows formatted hex text below each swatch.',
    },
    {
      name: 'labels',
      type: 'PalettePickerLabels',
      default: "{ title: 'Palette', empty: 'No colors' }",
      description:
        'Localized title, empty-state text, and optional formatHex callback for displayed hex text.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the whole palette and prevents selection changes.',
    },
    {
      name: 'renderSwatch',
      type: '(props: PalettePickerSwatchRenderProps) => VNode',
      default: undefined,
      description:
        'Render custom swatch content with color, hex, selected, disabled, index, size, and contrast colors.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides, including the PalettePicker component theme slot.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'PalettePicker forwards layout, transform, background, border, and gesture props to its root View.',
    },
  ],

  relatedLinks: [
    {
      title: 'ColorPicker',
      link: '/components/colorpicker',
      description:
        'Use ColorPicker when users need continuous HSL selection; use PalettePicker for curated or recent colors.',
    },
    {
      title: 'Color Utilities',
      link: '/guides/theme-system',
      description:
        'Use exported helpers like numberToHex, hslToNumber, numberToHsl, lighten, darken, and ensureContrast when building color tools.',
    },
  ],
}
