/**
 * Dialog Component Documentation
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  ActionsExample,
  CustomWidthExample,
  ForcedActionExample,
  IconExample,
  QuickStartExample,
} from '@/examples/dialog'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import ActionsExampleRaw from '@/examples/dialog/ActionsExample.tsx?raw'
import CustomWidthExampleRaw from '@/examples/dialog/CustomWidthExample.tsx?raw'
import ForcedActionExampleRaw from '@/examples/dialog/ForcedActionExample.tsx?raw'
import IconExampleRaw from '@/examples/dialog/IconExample.tsx?raw'
import QuickStartExampleRaw from '@/examples/dialog/QuickStartExample.tsx?raw'

export const dialogContent: ComponentDocs = {
  title: 'Dialog',
  description:
    'A structured modal component with predefined layout sections: header with title/icon, scrollable content area, and optional action footer. Dialog builds on Modal and provides a consistent, opinionated design pattern for common dialog use cases like confirmations, forms, and settings panels.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic dialog with title and content. Includes close button and backdrop.',
    component: QuickStartExample,
    height: SCENE_SIZES.medium,
    code: QuickStartExampleRaw,
  },

  examples: [
    {
      id: 'with-icon',
      title: 'Dialog with Icon',
      description:
        'Add a prefix icon to the header for visual context. Commonly used for settings, warnings, or info dialogs.',
      component: IconExample,
      height: SCENE_SIZES.medium,
      code: IconExampleRaw,
    },
    {
      id: 'with-actions',
      title: 'Dialog with Actions',
      description:
        'Add action buttons in the footer for user decisions. Typically includes Cancel and Confirm/Save buttons.',
      component: ActionsExample,
      height: SCENE_SIZES.medium,
      code: ActionsExampleRaw,
    },
    {
      id: 'forced-action',
      title: 'Forced Action Dialog',
      description:
        'Disable backdrop/Escape closing and hide close button to force user interaction with action buttons.',
      component: ForcedActionExample,
      height: SCENE_SIZES.medium,
      code: ForcedActionExampleRaw,
    },
    {
      id: 'custom-width',
      title: 'Custom Width',
      description: 'Control dialog width with the maxWidth prop. Default is 600px.',
      component: CustomWidthExample,
      height: SCENE_SIZES.medium,
      code: CustomWidthExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'isOpen',
      type: 'boolean',
      default: 'required',
      description: 'Controls whether the dialog is visible',
    },
    {
      name: 'title',
      type: 'string',
      default: 'required',
      description: 'Dialog title displayed in the header',
    },
    {
      name: 'children',
      type: 'ChildrenType',
      default: 'required',
      description: 'Content displayed in the main content area',
    },
    {
      name: 'onClose',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when dialog should close (close button, backdrop, or Escape)',
    },
    {
      name: 'actions',
      type: 'ChildrenType',
      default: 'undefined',
      description: 'Action buttons displayed in the footer. Typically Cancel/Confirm buttons.',
    },
    {
      name: 'prefix',
      type: 'ChildrenType',
      default: 'undefined',
      description: 'Content displayed before the title in header, typically an Icon',
    },
    {
      name: 'showClose',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show the close button in the header',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      default: '600',
      description: 'Maximum width of the dialog container',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Whether clicking the backdrop closes the dialog',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Whether pressing Escape closes the dialog',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1000',
      description: 'Portal depth for z-ordering. Higher values appear on top.',
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
      name: 'forwardRef',
      type: '(ref: Container | null) => void',
      default: 'undefined',
      description: 'Callback to access the dialog container ref',
    },
  ],

  inherits: [
    {
      component: 'Modal',
      link: '/components/modal',
      description:
        'Dialog uses Modal internally. All Modal animation and lifecycle features apply.',
    },
    {
      component: 'View',
      link: '/components/view',
      description:
        'Dialog structure is built with View components. Theme tokens affect layout and styling.',
    },
  ],
}
