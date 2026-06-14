/**
 * BottomSheet component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { BackdropBottomSheetExample } from '@/examples/bottom-sheet/BackdropExample'
import BackdropBottomSheetExampleCode from '@/examples/bottom-sheet/BackdropExample.tsx?raw'
import { HandleBottomSheetExample } from '@/examples/bottom-sheet/HandleExample'
import HandleBottomSheetExampleCode from '@/examples/bottom-sheet/HandleExample.tsx?raw'
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
      'A button-triggered sheet with backdrop. Tap the backdrop or drag the handle down to dismiss.',
    component: QuickStartBottomSheetExample,
    height: SCENE_SIZES.medium,
    code: QuickStartBottomSheetExampleCode,
  },

  examples: [
    {
      id: 'backdrop',
      title: 'Backdrop',
      description:
        'Control backdrop visibility and alpha. Set closeOnBackdrop to allow dismissal by tapping outside.',
      component: BackdropBottomSheetExample,
      height: SCENE_SIZES.medium,
      code: BackdropBottomSheetExampleCode,
    },
    {
      id: 'handle',
      title: 'Handle Variants',
      description:
        'Customize the drag handle with pre-built Bar, Grip, or Pill variants. Use handleAreaHeight to adjust the touch target.',
      component: HandleBottomSheetExample,
      height: SCENE_SIZES.medium,
      code: HandleBottomSheetExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'open',
      type: 'boolean',
      default: undefined,
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

  propsAdvanced: [
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'false',
      description:
        'Whether tapping the backdrop closes the sheet. When true, renders a tappable backdrop overlay.',
    },
    {
      name: 'backdropAlpha',
      type: 'number',
      default: '0.5',
      description: 'Backdrop opacity (0–1). Only effective when closeOnBackdrop is true.',
    },
    {
      name: 'showHandle',
      type: 'boolean',
      default: 'true',
      description: 'Show the drag handle at the top of the panel.',
    },
    {
      name: 'handleAreaHeight',
      type: 'number',
      default: '32',
      description:
        'Height in pixels of the drag-handle touch target. Also caps how far the sheet can be dragged down.',
    },
    {
      name: 'renderHandle',
      type: 'VNodeLike | ((props: HandleRenderProps) => VNodeLike)',
      default: undefined,
      description:
        'Custom handle renderer. Receives themed dimensions. Use BottomSheetHandle.Bar, .Grip, or .Pill for pre-built variants.',
    },
    {
      name: 'dismissThreshold',
      type: 'number',
      default: '80',
      description: 'Drag distance in pixels required to dismiss the sheet.',
    },
    {
      name: 'depth',
      type: 'number',
      default: '1100',
      description: 'Portal z-depth. Use BottomSheetDepth constant for relative stacking.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description:
        'Theme overrides via BottomSheet theme slot (handleWidth, handleHeight, handleColor, handleCornerRadius, handleAreaColor, panelCornerRadius, etc.).',
    },
  ],
}
