/**
 * CharTextInput Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { CustomizationCharTextInputExample } from '@/examples/chartextinput/CustomizationExample'
import CustomizationCharTextInputExampleCode from '@/examples/chartextinput/CustomizationExample.tsx?raw'
import { MultilineCharTextInputExample } from '@/examples/chartextinput/MultilineExample'
import MultilineCharTextInputExampleCode from '@/examples/chartextinput/MultilineExample.tsx?raw'
import { QuickStartCharTextInputExample } from '@/examples/chartextinput/QuickStartExample'
import QuickStartCharTextInputExampleCode from '@/examples/chartextinput/QuickStartExample.tsx?raw'
import { StatesCharTextInputExample } from '@/examples/chartextinput/StatesExample'
import StatesCharTextInputExampleCode from '@/examples/chartextinput/StatesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * CharTextInput component documentation configuration
 */
export const chartextinputContent: ComponentDocs = {
  title: 'CharTextInput',
  description:
    'A fully functional text input component built on CharText, providing native-like text editing without HTML inputs. Features include cursor positioning, text selection, keyboard shortcuts (Ctrl/Cmd+A, Home/End, Shift+Arrow), and multi-line support. Note: Copy/paste functionality is planned but not yet implemented.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic text input with cursor and keyboard support. Click to focus, type to edit.',
    component: QuickStartCharTextInputExample,
    height: SCENE_SIZES.small,
    code: QuickStartCharTextInputExampleCode,
  },

  examples: [
    {
      id: 'states',
      title: 'Input States',
      description: 'Placeholder text, max length validation, and disabled state.',
      component: StatesCharTextInputExample,
      height: SCENE_SIZES.large,
      code: StatesCharTextInputExampleCode,
    },
    {
      id: 'multiline',
      title: 'Multi-line Input',
      description: 'Text area with multiple lines and line height control.',
      component: MultilineCharTextInputExample,
      height: SCENE_SIZES.medium,
      code: MultilineCharTextInputExampleCode,
    },
    {
      id: 'customization',
      title: 'Customization',
      description: 'Custom cursor style, selection colors, and submit handler.',
      component: CustomizationCharTextInputExample,
      height: SCENE_SIZES.xl,
      code: CustomizationCharTextInputExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'string',
      default: "''",
      description: 'Input value (controlled mode).',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Callback when input value changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: undefined,
      description: 'Placeholder text shown when input is empty.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables text editing and interaction.',
    },
    {
      name: 'maxLength',
      type: 'number',
      default: undefined,
      description: 'Maximum number of characters allowed.',
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-line text input (text area mode).',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'string',
      default: "''",
      description: 'Input value in controlled mode. Manage state externally with onChange.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: undefined,
      description: 'Placeholder text displayed when input is empty and unfocused.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables all text editing, cursor, and keyboard interaction.',
    },
    {
      name: 'maxLength',
      type: 'number',
      default: undefined,
      description: 'Maximum character limit. Further input is prevented when reached.',
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: 'Enable multi-line text area mode with Enter key creating new lines.',
    },
    {
      name: 'textStyle',
      type: 'TextStyle',
      default: undefined,
      description: 'Phaser text style object for input text appearance.',
    },
    {
      name: 'charSpacing',
      type: 'number',
      default: '0',
      description: 'Horizontal spacing between characters in pixels.',
    },
    {
      name: 'lineHeight',
      type: 'number',
      default: '1.2',
      description: 'Line height multiplier for multi-line inputs.',
    },
    {
      name: 'maxLines',
      type: 'number',
      default: undefined,
      description: 'Maximum number of lines in multi-line mode.',
    },
    {
      name: 'textOverflow',
      type: "'clip' | 'ellipsis'",
      default: "'clip'",
      description: 'How to handle text overflow when maxLines is reached.',
    },
    {
      name: 'wordWrap',
      type: 'boolean',
      default: 'true',
      description: 'Word wrapping behavior in multi-line mode.',
    },
    {
      name: 'cursorColor',
      type: 'number',
      default: '0x000000',
      description: 'Color of the blinking text cursor (hex color).',
    },
    {
      name: 'cursorWidth',
      type: 'number',
      default: '2',
      description: 'Width of the cursor in pixels.',
    },
    {
      name: 'cursorBlinkSpeed',
      type: 'number',
      default: '500',
      description: 'Cursor blink interval in milliseconds.',
    },
    {
      name: 'selectionColor',
      type: 'number',
      default: '0x4a90e2',
      description: 'Background color for selected text (hex color).',
    },
    {
      name: 'selectionAlpha',
      type: 'number',
      default: '0.3',
      description: 'Opacity of selection background (0-1).',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: undefined,
      description: 'Called when input value changes via keyboard or interaction.',
    },
    {
      name: 'onFocus',
      type: '() => void',
      default: undefined,
      description: 'Called when input receives focus (clicked).',
    },
    {
      name: 'onBlur',
      type: '() => void',
      default: undefined,
      description: 'Called when input loses focus (clicked outside).',
    },
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      default: undefined,
      description:
        'Called when Enter key is pressed (single-line mode). Value is passed as argument.',
    },
    {
      name: 'width',
      type: 'number | "fill"',
      default: undefined,
      description: 'Input width. Required for proper text wrapping in multi-line mode.',
    },
    {
      name: 'height',
      type: 'number',
      default: undefined,
      description: 'Input height. Use minHeight for multi-line auto-expanding inputs.',
    },
    {
      name: 'padding',
      type: 'number | EdgeInsets',
      default: '0',
      description: 'Internal padding around text content.',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      default: undefined,
      description: 'Background color for input container (hex color).',
    },
    {
      name: 'cornerRadius',
      type: 'number',
      default: '0',
      description: 'Border radius for rounded input corners.',
    },
  ],
}
