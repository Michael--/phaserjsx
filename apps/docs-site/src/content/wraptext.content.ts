/**
 * WrapText Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { ContainerWidthsWrapTextExample } from '@/examples/wraptext/ContainerWidthsExample'
import ContainerWidthsWrapTextExampleCode from '@/examples/wraptext/ContainerWidthsExample.tsx?raw'
import { OptionsWrapTextExample } from '@/examples/wraptext/OptionsExample'
import OptionsWrapTextExampleCode from '@/examples/wraptext/OptionsExample.tsx?raw'
import { QuickStartWrapTextExample } from '@/examples/wraptext/QuickStartExample'
import QuickStartWrapTextExampleCode from '@/examples/wraptext/QuickStartExample.tsx?raw'
import { StylingWrapTextExample } from '@/examples/wraptext/StylingExample'
import StylingWrapTextExampleCode from '@/examples/wraptext/StylingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * WrapText component documentation configuration
 */
export const wraptextContent: ComponentDocs = {
  title: 'WrapText',
  description:
    'Automatic text wrapping component that eliminates manual wordWrap configuration. WrapText detects its parent container width and automatically wraps text to fit. The parent container MUST have an explicit width (width={number} or width="fill").',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic WrapText usage with automatic wrapping. Parent container requires explicit width.',
    component: QuickStartWrapTextExample,
    height: SCENE_SIZES.small,
    code: QuickStartWrapTextExampleCode,
  },

  examples: [
    {
      id: 'container-widths',
      title: 'Container Widths',
      description: 'WrapText adapts to different container widths automatically.',
      component: ContainerWidthsWrapTextExample,
      height: SCENE_SIZES.xl,
      code: ContainerWidthsWrapTextExampleCode,
    },
    {
      id: 'styling',
      title: 'Styling',
      description: 'Apply custom styles while maintaining automatic wrapping behavior.',
      component: StylingWrapTextExample,
      height: SCENE_SIZES.xl,
      code: StylingWrapTextExampleCode,
    },
    {
      id: 'options',
      title: 'Options',
      description: 'Control wrapping behavior and use multiple paragraphs.',
      component: OptionsWrapTextExample,
      height: SCENE_SIZES.xl,
      code: OptionsWrapTextExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'The text content to display with automatic wrapping.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      default: 'true',
      description: 'Enable/disable automatic text wrapping.',
    },
    {
      name: 'style',
      type: 'TextStyle',
      default: undefined,
      description: 'Phaser text style object (fontSize, color, fontFamily, align, etc.).',
    },
  ],

  propsComplete: [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description:
        'The text content to display. Automatically wraps based on parent container width.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      default: 'true',
      description:
        'Enable/disable automatic wrapping. When false, text behaves like regular Text component.',
    },
    {
      name: 'style',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      default: undefined,
      description:
        'Complete Phaser text style object. WordWrap settings are automatically added when wrap=true.',
    },
    {
      name: 'paddingOffset',
      type: 'number',
      default: '0',
      description:
        'Offset to account for parent container padding. Use paddingOffset={48} for padding={24} (left + right).',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity (0-1).',
    },
    {
      name: 'x',
      type: 'number',
      default: '0',
      description: 'X position offset.',
    },
    {
      name: 'y',
      type: 'number',
      default: '0',
      description: 'Y position offset.',
    },
  ],
}
