/**
 * Popover and ContextMenu component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  ContextMenuPopoverExample,
  PlacementsPopoverExample,
  QuickStartPopoverExample,
} from '@/examples/popover'
import ContextMenuPopoverExampleRaw from '@/examples/popover/ContextMenuExample.tsx?raw'
import PlacementsPopoverExampleRaw from '@/examples/popover/PlacementsExample.tsx?raw'
import QuickStartPopoverExampleRaw from '@/examples/popover/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const popoverContent: ComponentDocs = {
  title: 'Popover / ContextMenu',
  description:
    'Portal-based overlays for contextual information and item/action menus. Trigger layout stays in place while content is rendered above the scene.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A trigger rendered in normal layout opens portal content above the UI.',
    component: QuickStartPopoverExample,
    height: SCENE_SIZES.medium,
    code: QuickStartPopoverExampleRaw,
  },

  examples: [
    {
      id: 'placements',
      title: 'Placements',
      description: 'Top, bottom, left, and right placement with viewport clamping.',
      component: PlacementsPopoverExample,
      height: SCENE_SIZES.large,
      code: PlacementsPopoverExampleRaw,
    },
    {
      id: 'context-menu',
      title: 'ContextMenu',
      description: 'Menu items with disabled and danger states, built on Popover.',
      component: ContextMenuPopoverExample,
      height: SCENE_SIZES.medium,
      code: ContextMenuPopoverExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'trigger',
      type: 'ChildrenType',
      description: 'Content rendered in normal layout and used as the overlay anchor.',
      required: true,
    },
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Popover content rendered through Portal.',
      required: true,
    },
    {
      name: 'placement',
      type: 'PopoverPlacement',
      default: '"bottom"',
      description: 'Overlay placement relative to the trigger.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called when the popover opens or closes.',
    },
    {
      name: 'contentWidth',
      type: 'number',
      description:
        'Optional fixed width override. By default Popover measures the rendered content after layout.',
    },
  ],

  propsComplete: [
    {
      name: 'trigger',
      type: 'ChildrenType',
      description: 'Content rendered in normal layout and used as the overlay anchor.',
      required: true,
    },
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Popover content rendered through Portal.',
      required: true,
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial open state for uncontrolled usage.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called when open state should change.',
    },
    {
      name: 'placement',
      type: 'PopoverPlacement',
      default: '"bottom"',
      description: 'Placement: top, bottom, left, right, and start/end aligned variants.',
    },
    {
      name: 'offset',
      type: 'number',
      default: '8',
      description: 'Distance between trigger and content.',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1100',
      description: 'Portal depth.',
    },
    {
      name: 'closeOnOutside',
      type: 'boolean',
      default: 'true',
      description: 'Close when the transparent portal backdrop is clicked.',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Close on Escape key.',
    },
    {
      name: 'matchTriggerWidth',
      type: 'boolean',
      default: 'false',
      description: 'Use the trigger width when it is larger than measured or fixed content width.',
    },
    {
      name: 'items',
      type: 'ContextMenuItem[]',
      description: 'ContextMenu only: menu item definitions.',
    },
  ],

  inherits: [
    {
      component: 'Portal',
      link: '/components/portal',
      description:
        'Popover and ContextMenu render overlay content through Portal to avoid parent-layout height and clipping issues.',
    },
  ],
}
