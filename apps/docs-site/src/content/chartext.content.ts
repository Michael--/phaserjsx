/**
 * CharText Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartCharTextExample } from '@/examples/chartext/QuickStartExample'
import QuickStartCharTextExampleCode from '@/examples/chartext/QuickStartExample.tsx?raw'
import { WrappingCharTextExample } from '@/examples/chartext/WrappingExample'
import WrappingCharTextExampleCode from '@/examples/chartext/WrappingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * CharText component documentation configuration
 */
export const chartextContent: ComponentDocs = {
  title: 'CharText',
  description:
    "⚠️ **Low-level component for advanced use cases.** CharText renders text using individual Phaser.GameObjects.Text per character, providing full control over each character's position, style, and behavior. This component was primarily developed to enable CharTextInput (text input with cursor and selection). For regular text display, use Text or WrapText instead. Direct use of CharText is discouraged unless you need character-level control for advanced features like per-character animations or custom text input implementations.",

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic CharText usage. Note: For most use cases, prefer Text or WrapText components.',
    component: QuickStartCharTextExample,
    height: SCENE_SIZES.small,
    code: QuickStartCharTextExampleCode,
  },

  examples: [
    {
      id: 'wrapping',
      title: 'Multi-line Wrapping',
      description:
        'Basic word wrapping and line height control. Still experimental and limited compared to WrapText.',
      component: WrappingCharTextExample,
      height: SCENE_SIZES.large,
      code: WrappingCharTextExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'The text content to display.',
    },
    {
      name: 'charSpacing',
      type: 'number',
      default: '0',
      description: 'Spacing between individual characters in pixels.',
    },
    {
      name: 'textStyle',
      type: 'TextStyle',
      default: undefined,
      description: 'Phaser text style applied to each character.',
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-line text wrapping.',
    },
  ],

  propsComplete: [
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: 'The text content to display as individual character objects.',
    },
    {
      name: 'textStyle',
      type: 'Phaser.Types.GameObjects.Text.TextStyle',
      default: undefined,
      description: 'Phaser text style object applied to each character individually.',
    },
    {
      name: 'charSpacing',
      type: 'number',
      default: '0',
      description: 'Horizontal spacing between characters in pixels.',
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: 'Enable automatic line breaking when text exceeds width.',
    },
    {
      name: 'wordWrap',
      type: 'boolean',
      default: 'true',
      description: 'When multiline=true, break at word boundaries instead of mid-word.',
    },
    {
      name: 'lineHeight',
      type: 'number',
      default: '1.2',
      description: 'Line height multiplier for multi-line text.',
    },
    {
      name: 'maxLines',
      type: 'number',
      default: undefined,
      description: 'Maximum number of lines before truncation.',
    },
    {
      name: 'textOverflow',
      type: "'clip' | 'ellipsis'",
      default: "'clip'",
      description: 'How to handle text overflow when maxLines is reached.',
    },
    {
      name: 'showCursor',
      type: 'boolean',
      default: 'false',
      description: 'Show blinking cursor at cursorPosition (used by CharTextInput).',
    },
    {
      name: 'cursorPosition',
      type: 'number',
      default: '0',
      description: 'Character index where cursor should appear.',
    },
    {
      name: 'selectionStart',
      type: 'number',
      default: '-1',
      description: 'Start index of text selection (used by CharTextInput).',
    },
    {
      name: 'selectionEnd',
      type: 'number',
      default: '-1',
      description: 'End index of text selection (used by CharTextInput).',
    },
    {
      name: 'onCursorPositionChange',
      type: '(position: number) => void',
      default: undefined,
      description: 'Callback when cursor position changes via click/interaction.',
    },
    {
      name: 'onSelectionChange',
      type: '(start: number, end: number) => void',
      default: undefined,
      description: 'Callback when text selection changes via drag interaction.',
    },
    {
      name: 'width',
      type: 'number',
      default: undefined,
      description: 'Width constraint for multi-line wrapping.',
    },
    {
      name: 'height',
      type: 'number',
      default: undefined,
      description: 'Height constraint for text container.',
    },
  ],
}
