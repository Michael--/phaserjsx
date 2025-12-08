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
    'A convenient overlay component built on top of Portal that provides backdrop, animations, and keyboard handling. Modal automatically centers content, manages z-depth, and provides smooth fade animations for professional-looking overlays. Includes state machine for proper animation sequencing.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic modal with backdrop and built-in animations. Control visibility with the show prop. Use onRequestClose to handle backdrop/Escape close requests.',
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
        'Modal includes smooth fade animations with 500ms duration. Customize with viewOpenEffect and viewCloseEffect props.',
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
      name: 'show',
      type: 'boolean',
      default: 'required',
      description: 'Controls whether the modal is visible',
    },
    {
      name: 'onRequestClose',
      type: '() => void',
      default: 'undefined',
      description:
        'Callback when modal requests to close (via backdrop click or Escape key). Parent should set show=false.',
    },
    {
      name: 'onOpen',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when modal opening animation starts',
    },
    {
      name: 'onClosed',
      type: '() => void',
      default: 'undefined',
      description: 'Callback when modal closing animation completes and modal is fully hidden',
    },
    {
      name: 'children',
      type: 'ChildrenType',
      default: 'undefined',
      description: 'Content to display in the modal',
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Whether clicking the backdrop triggers onRequestClose',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Whether pressing Escape triggers onRequestClose',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1000',
      description: 'Portal depth for z-ordering. Higher values appear on top.',
    },
    {
      name: 'viewOpenEffect',
      type: 'EffectFn',
      default: 'fade in',
      description: 'Custom effect for modal content opening animation',
    },
    {
      name: 'viewCloseEffect',
      type: 'EffectFn',
      default: 'fade out',
      description: 'Custom effect for modal content closing animation',
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
