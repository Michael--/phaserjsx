/**
 * MenuButton Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { ControlledMenuButtonExample } from '@/examples/menu-button/ControlledExample'
import ControlledMenuButtonExampleCode from '@/examples/menu-button/ControlledExample.tsx?raw'
import { CustomTriggerMenuButtonExample } from '@/examples/menu-button/CustomTriggerExample'
import CustomTriggerMenuButtonExampleCode from '@/examples/menu-button/CustomTriggerExample.tsx?raw'
import { QuickStartMenuButtonExample } from '@/examples/menu-button/QuickStartExample'
import QuickStartMenuButtonExampleCode from '@/examples/menu-button/QuickStartExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const menuButtonContent: ComponentDocs = {
  title: 'MenuButton',
  description:
    'A compact trigger for action menus. MenuButton combines Button, ContextMenu, Popover, and Portal behavior while keeping item callbacks, controlled open state, placement, and theming available.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'A file action menu with item callbacks, icons, and selection feedback.',
    component: QuickStartMenuButtonExample,
    height: SCENE_SIZES.medium,
    code: QuickStartMenuButtonExampleCode,
  },

  examples: [
    {
      id: 'custom-trigger',
      title: 'Custom Trigger',
      description:
        'Use the trigger render prop when the menu should be opened from a custom chip, avatar, toolbar item, or HUD control.',
      component: CustomTriggerMenuButtonExample,
      height: SCENE_SIZES.medium,
      code: CustomTriggerMenuButtonExampleCode,
    },
    {
      id: 'controlled-open',
      title: 'Controlled State',
      description:
        'Control the menu externally, customize placement, and combine normal, disabled, and danger items.',
      component: ControlledMenuButtonExample,
      height: SCENE_SIZES.medium,
      code: ControlledMenuButtonExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'items',
      type: 'ContextMenuItem[]',
      required: true,
      description: 'Menu items shown when the trigger is clicked.',
    },
    {
      name: 'label',
      type: 'string | number',
      default: undefined,
      description: 'Convenience label for the generated default Button trigger.',
    },
    {
      name: 'icon',
      type: 'ChildrenType',
      default: undefined,
      description: 'Optional icon content rendered before the default trigger label.',
    },
    {
      name: 'onSelect',
      type: '(item: ContextMenuItem) => void',
      default: undefined,
      description: 'Called after a selectable menu item is activated.',
    },
    {
      name: 'placement',
      type: 'PopoverPlacement',
      default: "'bottom-start'",
      description: 'Placement relative to the trigger.',
    },
  ],

  propsComplete: [
    {
      name: 'children',
      type: 'ChildrenType',
      default: undefined,
      description: 'Custom content rendered inside the generated Button trigger.',
    },
    {
      name: 'trigger',
      type: '(props: MenuButtonTriggerRenderProps) => ChildrenType',
      default: undefined,
      description:
        'Custom trigger renderer. Receives isOpen and disabled and replaces the generated Button.',
    },
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
      description: 'Called whenever the menu requests an open-state change.',
    },
    {
      name: 'buttonVariant',
      type: 'ButtonVariant',
      default: "'secondary'",
      description: 'Variant used by the generated Button trigger.',
    },
    {
      name: 'buttonSize',
      type: 'ButtonSize',
      default: "'medium'",
      description: 'Size used by the generated Button trigger.',
    },
    {
      name: 'buttonProps',
      type: "Omit<ButtonProps, 'children' | 'label' | 'text' | 'onClick' | 'disabled' | 'variant' | 'size' | 'theme'>",
      default: undefined,
      description:
        'Additional props forwarded to the generated Button trigger, such as width, height, or tooltip callbacks.',
    },
    {
      name: 'width',
      type: 'number',
      default: 'theme.MenuButton.width',
      description: 'Menu width override.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables trigger interaction and prevents opening.',
    },
    {
      name: 'triggerProps',
      type: "Omit<ViewProps, 'children'>",
      default: undefined,
      description: 'Props applied to the Popover trigger wrapper.',
    },
    {
      name: 'theme',
      type: 'PartialTheme',
      default: undefined,
      description: 'Local theme overrides for MenuButton and nested Button/ContextMenu slots.',
    },
  ],

  inherits: [
    {
      component: 'ContextMenu',
      link: '/components/popover',
      description:
        'MenuButton reuses ContextMenu items, disabled/danger item states, Popover placement, and Portal overlay behavior.',
    },
  ],

  relatedLinks: [
    {
      title: 'Button',
      link: '/components/button',
      description: 'The default trigger is a Button and accepts Button variant and size options.',
    },
    {
      title: 'Toolbar',
      link: '/components/toolbar',
      description: 'Toolbar menu items use MenuButton for overlay-backed tool menus.',
    },
  ],
}
