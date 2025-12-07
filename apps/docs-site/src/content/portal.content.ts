/**
 * Portal Component Documentation
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  DepthOrderingExample,
  EventBlockingExample,
  ModalPatternExample,
  QuickStartExample,
} from '@/examples/portal'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import DepthOrderingExampleRaw from '@/examples/portal/DepthOrderingExample.tsx?raw'
import EventBlockingExampleRaw from '@/examples/portal/EventBlockingExample.tsx?raw'
import ModalPatternExampleRaw from '@/examples/portal/ModalPatternExample.tsx?raw'
import QuickStartExampleRaw from '@/examples/portal/QuickStartExample.tsx?raw'

export const portalContent: ComponentDocs = {
  title: 'Portal',
  description:
    'An advanced composition primitive that renders content into a separate depth layer, isolated from the parent component tree. Portal is the foundation for overlay components like Modal, Dialog, and Tooltip, enabling proper z-ordering and event handling for UI elements that need to appear above the main content.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic portal usage - renders content at a higher depth layer, independent of parent layout',
    component: QuickStartExample,
    height: SCENE_SIZES.medium,
    code: QuickStartExampleRaw,
  },

  examples: [
    {
      id: 'depth-ordering',
      title: 'Depth Ordering',
      description:
        'Multiple portals can coexist at different depth levels. Higher depth values render on top.',
      component: DepthOrderingExample,
      height: SCENE_SIZES.medium,
      code: DepthOrderingExampleRaw,
    },
    {
      id: 'event-blocking',
      title: 'Event Blocking',
      description:
        'Control whether portal content blocks events from reaching underlying content. Default is true (blocking).',
      component: EventBlockingExample,
      height: SCENE_SIZES.medium,
      code: EventBlockingExampleRaw,
    },
    {
      id: 'modal-pattern',
      title: 'Modal Pattern',
      description:
        'Example of building a modal-like overlay using Portal with backdrop and centered content',
      component: ModalPatternExample,
      height: SCENE_SIZES.large,
      code: ModalPatternExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'children',
      type: 'ReactNode',
      default: 'required',
      description: 'Content to render in the portal',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1000',
      description: 'Z-depth for portal rendering. Higher values appear on top.',
    },
    {
      name: 'blockEvents',
      type: 'boolean',
      default: 'true',
      description: 'Whether to block touch/click events from reaching content behind the portal',
    },
    {
      name: 'id',
      type: 'string',
      default: 'undefined',
      description: 'Optional custom portal ID for advanced use cases',
    },
  ],

  propsComplete: [],

  inherits: [],
}
