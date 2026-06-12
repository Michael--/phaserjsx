/**
 * Toolbar Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { IconOnlyToolbarExample } from '@/examples/toolbar/IconOnlyExample'
import IconOnlyToolbarExampleCode from '@/examples/toolbar/IconOnlyExample.tsx?raw'
import { QuickStartToolbarExample } from '@/examples/toolbar/QuickStartExample'
import QuickStartToolbarExampleCode from '@/examples/toolbar/QuickStartExample.tsx?raw'
import { VerticalThemingToolbarExample } from '@/examples/toolbar/VerticalThemingExample'
import VerticalThemingToolbarExampleCode from '@/examples/toolbar/VerticalThemingExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const toolbarContent: ComponentDocs = {
  title: 'Toolbar',
  description:
    'Compact action and toggle button group for editor tools, HUD controls, and debug panels. Toolbar supports action, toggle, separator, and menu-trigger item types, stable item sizing, icon-only usage with tooltips, controlled active state, and theme-based styling.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A controlled toolbar with toggle tools, a separator, and an action button.',
    component: QuickStartToolbarExample,
    height: SCENE_SIZES.medium,
    code: QuickStartToolbarExampleCode,
  },

  examples: [
    {
      id: 'icon-only',
      title: 'Icon-only Tools',
      description:
        'Use density="compact" and showLabels={false} for tool palettes. Item labels remain available as tooltip text.',
      component: IconOnlyToolbarExample,
      height: SCENE_SIZES.medium,
      code: IconOnlyToolbarExampleCode,
    },
    {
      id: 'vertical-theming',
      title: 'Vertical and Themed',
      description:
        'Switch orientation, mix separators and menu triggers, and override Toolbar and nested Button theme slots.',
      component: VerticalThemingToolbarExample,
      height: SCENE_SIZES.medium,
      code: VerticalThemingToolbarExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'items',
      type: 'ToolbarItem[]',
      required: true,
      description: 'Action, toggle, separator, and menu-trigger items rendered in order.',
    },
    {
      name: 'activeId',
      type: 'string',
      default: undefined,
      description: 'Controlled active tool id.',
    },
    {
      name: 'defaultActiveId',
      type: 'string',
      default: 'first defaultPressed toggle',
      description: 'Initial active tool id in uncontrolled mode.',
    },
    {
      name: 'onSelect',
      type: '(id: string, item: ToolbarItem) => void',
      default: undefined,
      description: 'Called when an action, toggle, or menu trigger is selected.',
    },
    {
      name: 'onToggle',
      type: '(id: string, pressed: boolean, item: ToolbarToggleItem) => void',
      default: undefined,
      description: 'Called when a toggle item changes pressed state.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Toolbar layout direction.',
    },
    {
      name: 'density',
      type: "'compact' | 'normal'",
      default: "'normal'",
      description: 'Preset for item dimensions, button size, and icon size.',
    },
  ],

  propsComplete: [
    {
      name: 'items',
      type: 'ToolbarItem[]',
      required: true,
      description:
        "Items support type 'action', 'toggle', 'separator', or 'menu'. Omitted type defaults to action.",
    },
    {
      name: 'activeId',
      type: 'string',
      default: undefined,
      description: 'Controlled active tool id.',
    },
    {
      name: 'defaultActiveId',
      type: 'string',
      default: 'first defaultPressed toggle',
      description: 'Initial active tool id in uncontrolled mode.',
    },
    {
      name: 'onSelect',
      type: '(id: string, item: Exclude<ToolbarItem, ToolbarSeparatorItem>) => void',
      default: undefined,
      description: 'Called when an action, toggle, or menu trigger is selected.',
    },
    {
      name: 'onToggle',
      type: '(id: string, pressed: boolean, item: ToolbarToggleItem) => void',
      default: undefined,
      description: 'Called when a toggle item changes pressed state.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Toolbar layout direction.',
    },
    {
      name: 'density',
      type: "'compact' | 'normal'",
      default: "'normal'",
      description: 'Preset for item dimensions, button size, and icon size.',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      default: 'true for normal, false for compact',
      description:
        'Controls generated label text. Hidden labels are still used as tooltip fallback.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the whole toolbar.',
    },
    {
      name: 'labels',
      type: 'ToolbarLabels',
      default: "{ overflow: 'More', menuIndicator: 'v' }",
      description: 'Localized toolbar labels and menu indicator text.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides, including Toolbar and nested Button theme slots.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'Toolbar forwards layout, transform, background, border, and gesture props to its root View.',
    },
  ],

  relatedLinks: [
    {
      title: 'Button',
      link: '/components/button',
      description: 'Toolbar items are rendered with Button and inherit Button variants and sizing.',
    },
    {
      title: 'Popover / ContextMenu',
      link: '/components/popover',
      description:
        'Use Popover or the upcoming MenuButton pattern when a menu trigger needs overlay content.',
    },
    {
      title: 'SegmentedControl',
      link: '/components/segmented-control',
      description:
        'Use SegmentedControl for small mutually exclusive mode choices without action/separator items.',
    },
  ],
}
