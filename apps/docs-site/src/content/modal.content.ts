/**
 * Modal Component Documentation
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AnimationsExample,
  BackdropExample,
  NestedExample,
  QuickStartExample,
} from '@/examples/modal'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import AnimationsExampleRaw from '@/examples/modal/AnimationsExample.tsx?raw'
import BackdropExampleRaw from '@/examples/modal/BackdropExample.tsx?raw'
import NestedExampleRaw from '@/examples/modal/NestedExample.tsx?raw'
import QuickStartExampleRaw from '@/examples/modal/QuickStartExample.tsx?raw'

export const modalContent: ComponentDocs = {
  title: 'Modal',
  description:
    'A convenient overlay component built on top of Portal that provides backdrop, animations, and keyboard handling. Modal automatically centers content, manages z-depth, and provides smooth zoom/fade animations for professional-looking overlays.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic modal with backdrop and built-in animations. Closes on backdrop click or Escape key.',
    component: QuickStartExample,
    height: SCENE_SIZES.medium,
    code: QuickStartExampleRaw,
  },

  examples: [
    {
      id: 'backdrop',
      title: 'Backdrop Behavior',
      description:
        'Control whether clicking the backdrop closes the modal using the closeOnBackdrop prop',
      component: BackdropExample,
      height: SCENE_SIZES.medium,
      code: BackdropExampleRaw,
    },
    {
      id: 'animations',
      title: 'Built-in Animations',
      description:
        'Modal includes smooth zoom and fade animations with 500ms duration, no configuration needed',
      component: AnimationsExample,
      height: SCENE_SIZES.medium,
      code: AnimationsExampleRaw,
    },
    {
      id: 'nested',
      title: 'Nested Modals',
      description:
        'Multiple modals can be stacked using different depth values. Higher depth appears on top.',
      component: NestedExample,
      height: SCENE_SIZES.medium,
      code: NestedExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'isOpen',
      type: 'boolean',
      default: 'required',
      description: 'Controls whether the modal is visible',
    },
    {
      name: 'onClose',
      type: '() => void',
      default: 'undefined',
      description: 'Callback function called when modal should close',
    },
    {
      name: 'children',
      type: 'ReactNode',
      default: 'undefined',
      description: 'Content to display in the modal',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Whether clicking the backdrop closes the modal',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Whether pressing Escape closes the modal',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1000',
      description: 'Portal depth for z-ordering. Higher values appear on top.',
    },
  ],

  propsComplete: [],

  inherits: [
    {
      component: 'Portal',
      link: '/components/portal',
      description:
        'Modal uses Portal internally for rendering above the main UI. All Portal depth and blocking features apply.',
    },
  ],
}
