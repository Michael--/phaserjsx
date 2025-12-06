/**
 * Text Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { AlignmentTextExample } from '@/examples/text/AlignmentExample'
import AlignmentTextExampleCode from '@/examples/text/AlignmentExample.tsx?raw'
import { QuickStartTextExample } from '@/examples/text/QuickStartExample'
import QuickStartTextExampleCode from '@/examples/text/QuickStartExample.tsx?raw'
import { StylesTextExample } from '@/examples/text/StylesExample'
import StylesTextExampleCode from '@/examples/text/StylesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * Text component documentation configuration
 */
export const textContent: ComponentDocs = {
  title: 'Text',
  description:
    'A fundamental component for displaying text with full Phaser styling support. Text supports multiple lines, alignment, colors, fonts, shadows, and all standard Phaser.GameObjects.Text features.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic text rendering with and without custom styles.',
    component: QuickStartTextExample,
    height: SCENE_SIZES.small,
    code: QuickStartTextExampleCode,
  },

  examples: [
    {
      id: 'styles',
      title: 'Text Styles',
      description: 'Font size, color, weight, family, shadow effects, and alpha transparency.',
      component: StylesTextExample,
      height: SCENE_SIZES.large,
      code: StylesTextExampleCode,
    },
    {
      id: 'alignment',
      title: 'Text Alignment',
      description: 'Left, center, and right text alignment for multi-line content.',
      component: AlignmentTextExample,
      height: SCENE_SIZES.large,
      code: AlignmentTextExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'The text content to display. Use \\n for line breaks.',
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
      description: 'The text content to display. Supports multi-line text with \\n.',
    },
    {
      name: 'style',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      default: undefined,
      description:
        'Complete Phaser text style object: fontSize, color, fontFamily, fontWeight, align, shadow, backgroundColor, stroke, padding, wordWrap, etc.',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity (0-1).',
    },
    {
      name: 'visible',
      type: 'boolean',
      default: 'true',
      description: 'Visibility state.',
    },
    {
      name: 'margin',
      type: 'EdgeInsets',
      default: undefined,
      description: 'Margin for layout system (top, right, bottom, left).',
    },
  ],
}
