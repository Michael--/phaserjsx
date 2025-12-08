/**
 * AlertDialog Component Documentation
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AsyncExample,
  CustomButtonsExample,
  DestructiveExample,
  QuickStartExample,
  VariantsExample,
} from '@/examples/alertdialog'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import AsyncExampleRaw from '@/examples/alertdialog/AsyncExample.tsx?raw'
import CustomButtonsExampleRaw from '@/examples/alertdialog/CustomButtonsExample.tsx?raw'
import DestructiveExampleRaw from '@/examples/alertdialog/DestructiveExample.tsx?raw'
import QuickStartExampleRaw from '@/examples/alertdialog/QuickStartExample.tsx?raw'
import VariantsExampleRaw from '@/examples/alertdialog/VariantsExample.tsx?raw'

export const alertdialogContent: ComponentDocs = {
  title: 'AlertDialog',
  description:
    'A simplified Dialog component for common confirmation and alert patterns. AlertDialog provides predefined variants (info, warning, destructive, success) with automatic button styling and async operation support. Perfect for quick confirmations, delete actions, and notifications.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic confirmation dialog with title, description, and Cancel/OK buttons. Auto-closes after confirmation.',
    component: QuickStartExample,
    height: SCENE_SIZES.medium,
    code: QuickStartExampleRaw,
  },

  examples: [
    {
      id: 'variants',
      title: 'Visual Variants',
      description:
        'Four built-in variants with theme-configured styling: info (blue), warning (yellow), destructive (red), success (green).',
      component: VariantsExample,
      height: SCENE_SIZES.medium,
      code: VariantsExampleRaw,
    },
    {
      id: 'destructive',
      title: 'Destructive Actions',
      description:
        'Common pattern for delete confirmations using the destructive variant with custom button text.',
      component: DestructiveExample,
      height: SCENE_SIZES.medium,
      code: DestructiveExampleRaw,
    },
    {
      id: 'async',
      title: 'Async Operations',
      description:
        'Handle async operations with automatic loading state. Buttons are disabled during processing.',
      component: AsyncExample,
      height: SCENE_SIZES.medium,
      code: AsyncExampleRaw,
    },
    {
      id: 'custom-buttons',
      title: 'Custom Buttons',
      description:
        'Customize button text and hide cancel button for single-action alerts like success messages.',
      component: CustomButtonsExample,
      height: SCENE_SIZES.medium,
      code: CustomButtonsExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'isOpen',
      type: 'boolean',
      default: 'required',
      description: 'Controls whether the alert dialog is visible',
    },
    {
      name: 'title',
      type: 'string',
      default: 'required',
      description: 'Alert dialog title',
    },
    {
      name: 'onConfirm',
      type: '() => void | Promise<void>',
      default: 'undefined',
      description:
        'Callback when confirm button is clicked. Supports async operations with automatic loading state.',
    },
    {
      name: 'onClose',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when dialog should close (cancel button, backdrop, or Escape)',
    },
    {
      name: 'description',
      type: 'string',
      default: 'undefined',
      description: 'Optional description text displayed below title',
    },
    {
      name: 'variant',
      type: "'info' | 'warning' | 'destructive' | 'success'",
      default: 'undefined',
      description: 'Visual variant that determines button styling and theme icon',
    },
    {
      name: 'confirmText',
      type: 'string',
      default: 'OK',
      description: 'Text for the confirm button',
    },
    {
      name: 'cancelText',
      type: 'string',
      default: 'Cancel',
      description: 'Text for the cancel button',
    },
    {
      name: 'showCancel',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show the cancel button',
    },
    {
      name: 'closeOnConfirm',
      type: 'boolean',
      default: 'true',
      description: 'Whether to automatically close dialog after successful confirmation',
    },
  ],

  propsComplete: [
    {
      name: 'key',
      type: 'string',
      default: 'undefined',
      description: 'Unique key for VDOM identification',
    },
    {
      name: 'prefix',
      type: 'ChildrenType',
      default: 'undefined',
      description: 'Custom prefix content (overrides variant icon from theme)',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'undefined',
      description: 'Override internal loading state (for external async control)',
    },
  ],

  inherits: [
    {
      component: 'Dialog',
      link: '/components/dialog',
      description: 'AlertDialog uses Dialog internally with predefined layout and action buttons.',
    },
    {
      component: 'Modal',
      link: '/components/modal',
      description: 'Inherits Modal animation and backdrop features through Dialog component.',
    },
  ],
}
