/**
 * Accordion component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AnimatedAccordionExample,
  BasicAccordionExample,
  ControlledAccordionExample,
  CustomTitleAccordionExample,
  NestedAccordionExample,
} from '@/examples/accordion'
// Import source code as raw strings
import AnimatedAccordionExampleRaw from '@/examples/accordion/AnimatedAccordionExample.tsx?raw'
import BasicAccordionExampleRaw from '@/examples/accordion/BasicAccordionExample.tsx?raw'
import ControlledAccordionExampleRaw from '@/examples/accordion/ControlledAccordionExample.tsx?raw'
import CustomTitleAccordionExampleRaw from '@/examples/accordion/CustomTitleAccordionExample.tsx?raw'
import NestedAccordionExampleRaw from '@/examples/accordion/NestedAccordionExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const accordionContent: ComponentDocs = {
  title: 'Accordion',
  description:
    'The Accordion component provides collapsible sections with optional smooth animations. Perfect for organizing content in expandable panels.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic accordion with title and content.',
    component: BasicAccordionExample,
    height: SCENE_SIZES.medium,
    code: BasicAccordionExampleRaw,
  },

  examples: [
    {
      id: 'basic-accordion',
      title: 'Basic Accordion',
      description: 'Simple collapsible content sections',
      component: BasicAccordionExample,
      height: SCENE_SIZES.medium,
      code: BasicAccordionExampleRaw,
    },
    {
      id: 'animated-accordion',
      title: 'Animated Accordion',
      description: 'Accordion with smooth height transitions',
      component: AnimatedAccordionExample,
      height: SCENE_SIZES.medium,
      code: AnimatedAccordionExampleRaw,
    },
    {
      id: 'controlled-accordion',
      title: 'Controlled Accordion',
      description: 'Accordion controlled by external state',
      component: ControlledAccordionExample,
      height: SCENE_SIZES.medium,
      code: ControlledAccordionExampleRaw,
    },
    {
      id: 'custom-title',
      title: 'Custom Title',
      description: 'Accordion with custom JSX title content',
      component: CustomTitleAccordionExample,
      height: SCENE_SIZES.medium,
      code: CustomTitleAccordionExampleRaw,
    },
    {
      id: 'nested-accordions',
      title: 'Nested Accordions',
      description: 'Accordions inside other accordions for hierarchical content',
      component: NestedAccordionExample,
      height: SCENE_SIZES.large,
      code: NestedAccordionExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'title',
      type: 'string | ChildrenType',
      description: 'Title displayed in the header. Can be a string or custom JSX elements.',
    },
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Content to display when the accordion is open.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial open state for uncontrolled accordions.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Controlled open state. Makes the accordion controlled.',
    },
    {
      name: 'onToggle',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the accordion is toggled.',
    },
    {
      name: 'animated',
      type: 'boolean',
      default: 'false',
      description: 'Enable smooth height animation when opening/closing.',
    },
  ],

  propsComplete: [
    {
      name: 'title',
      type: 'string | ChildrenType',
      description: 'Title displayed in the header. Can be a string or custom JSX elements.',
    },
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Content to display when the accordion is open.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial open state for uncontrolled accordions.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Controlled open state. Makes the accordion controlled.',
    },
    {
      name: 'onToggle',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the accordion is toggled.',
    },
    {
      name: 'animated',
      type: 'boolean',
      default: 'false',
      description: 'Enable smooth height animation when opening/closing.',
    },
    {
      name: 'maxHeight',
      type: 'number',
      default: '200',
      description: 'Maximum height for animated accordions.',
    },
    {
      name: 'autoHeight',
      type: 'boolean',
      default: 'false',
      description: 'Automatically measure content height for precise animation.',
    },
    {
      name: 'animationConfig',
      type: 'AnimationConfig',
      default: '"gentle"',
      description: 'Spring animation configuration for smooth transitions.',
    },
    {
      name: 'onAnimationEnd',
      type: '() => void',
      description: 'Callback fired when animation completes.',
    },
    // Effect props
    {
      name: 'effect',
      type: 'string',
      description: 'Visual effect to apply when toggling (e.g., "press", "flash").',
    },
    {
      name: 'effectConfig',
      type: 'Record<string, unknown>',
      description: 'Configuration for the toggle effect.',
    },
  ],
}
