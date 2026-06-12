/**
 * Toast and NotificationStack component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { AutoDismissToastExample } from '@/examples/toast/AutoDismissExample'
import AutoDismissToastExampleCode from '@/examples/toast/AutoDismissExample.tsx?raw'
import { QuickStartToastExample } from '@/examples/toast/QuickStartExample'
import QuickStartToastExampleCode from '@/examples/toast/QuickStartExample.tsx?raw'
import { VariantsToastExample } from '@/examples/toast/VariantsExample'
import VariantsToastExampleCode from '@/examples/toast/VariantsExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const toastContent: ComponentDocs = {
  title: 'Toast / NotificationStack',
  description:
    'Transient non-blocking feedback rendered through Portal. Use Toast for individual messages and NotificationStack for positioned lists with optional auto-dismiss.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Render a controlled notification list and dismiss items manually.',
    component: QuickStartToastExample,
    height: SCENE_SIZES.medium,
    code: QuickStartToastExampleCode,
  },

  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description:
        'Info, success, warning, and error messages share layout but use variant accents.',
      component: VariantsToastExample,
      height: SCENE_SIZES.large,
      code: VariantsToastExampleCode,
    },
    {
      id: 'auto-dismiss',
      title: 'Auto-dismiss',
      description:
        'NotificationStack can dismiss items after a global duration or a per-item duration.',
      component: AutoDismissToastExample,
      height: SCENE_SIZES.medium,
      code: AutoDismissToastExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'items',
      type: 'ToastItem[]',
      required: true,
      description: 'Notifications rendered in the stack.',
    },
    {
      name: 'position',
      type: 'NotificationStackPosition',
      default: "'top-right'",
      description: 'Viewport position for the stack.',
    },
    {
      name: 'duration',
      type: 'number',
      default: '4000',
      description: 'Default auto-dismiss duration in milliseconds. Use 0 to keep items visible.',
    },
    {
      name: 'onDismiss',
      type: '(id: string) => void',
      default: undefined,
      description: 'Called for manual close and auto-dismiss.',
    },
    {
      name: 'labels',
      type: 'ToastLabels',
      default: "{ close: 'x' }",
      description: 'Localized or themed labels for visible toast controls.',
    },
  ],

  propsComplete: [
    {
      name: 'items',
      type: 'ToastItem[]',
      required: true,
      description:
        'Each item supports id, variant, title, message, content, prefix, suffix, action, dismissible, duration, and autoDismiss.',
    },
    {
      name: 'position',
      type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom'",
      default: "'top-right'",
      description: 'Viewport edge or centered edge used by NotificationStack.',
    },
    {
      name: 'width',
      type: 'ViewProps["width"]',
      default: '320',
      description: 'Toast width used by the stack.',
    },
    {
      name: 'gap',
      type: 'number',
      default: '8',
      description: 'Spacing between stacked toasts.',
    },
    {
      name: 'offset',
      type: 'number',
      default: '16',
      description: 'Viewport padding around the stack.',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1200',
      description: 'Portal depth for notification overlays.',
    },
    {
      name: 'duration',
      type: 'number',
      default: '4000',
      description: 'Default auto-dismiss duration in milliseconds.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides for NotificationStack, Toast, Button, and Text slots.',
    },
  ],

  inherits: [
    {
      component: 'Portal',
      link: '/components/portal',
      description:
        'NotificationStack renders through Portal with blockEvents disabled, so feedback does not block the underlying scene.',
    },
  ],

  relatedLinks: [
    {
      title: 'AlertDialog',
      link: '/components/alertdialog',
      description: 'Use AlertDialog for blocking confirmations and destructive decisions.',
    },
    {
      title: 'Badge / Tag',
      link: '/components/badge',
      description: 'Use Badge or Tag for persistent inline status instead of transient feedback.',
    },
  ],
}
