/**
 * BottomSheet component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { QuickStartBottomSheetExample } from '@/examples/bottom-sheet/QuickStartExample'
import QuickStartBottomSheetExampleCode from '@/examples/bottom-sheet/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const bottomSheetContent: ComponentDocs = {
  title: 'BottomSheet',
  description:
    'Slide-up panel with backdrop and drag-to-dismiss. Perfect for mobile menus, settings, filters, and inventory panels.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'A button-triggered sheet with a few settings items. Drag the handle down to dismiss.',
    component: QuickStartBottomSheetExample,
    height: SCENE_SIZES.medium,
    code: QuickStartBottomSheetExampleCode,
  },

  examples: [],

  propsEssential: [
    {
      name: 'open',
      type: 'boolean',
      default: undefined,
      description: 'Controlled open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      default: undefined,
      description: 'Called on backdrop tap or drag dismiss.',
    },
    {
      name: 'height',
      type: 'number',
      default: '0.5',
      description: 'Panel height as fraction of viewport (0.1–1.0).',
    },
    {
      name: 'children',
      type: 'ChildrenType',
      required: true,
      description: 'Content rendered inside the sheet.',
    },
  ],
}
