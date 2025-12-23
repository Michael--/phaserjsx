/**
 * Tabs component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  ControlledTabsExample,
  CustomizedTabsExample,
  QuickStartTabsExample,
  ScrollableTabsExample,
} from '@/examples/tabs'
import type { ComponentDocs } from '@/types/docs'
// Import source code as raw strings
import ControlledTabsExampleRaw from '@/examples/tabs/ControlledExample.tsx?raw'
import CustomizedTabsExampleRaw from '@/examples/tabs/CustomizedExample.tsx?raw'
import QuickStartTabsExampleRaw from '@/examples/tabs/QuickStartExample.tsx?raw'
import ScrollableTabsExampleRaw from '@/examples/tabs/ScrollableExample.tsx?raw'

export const tabsContent: ComponentDocs = {
  title: 'Tabs',
  description:
    'Tabs organize related content into switchable panels. Use <Tab> for headers and <TabPanel> for content, matched by order.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic tabs with three panels.',
    component: QuickStartTabsExample,
    height: SCENE_SIZES.medium,
    code: QuickStartTabsExampleRaw,
  },

  examples: [
    {
      id: 'controlled-tabs',
      title: 'Controlled Tabs',
      description: 'Drive the active tab with external state and onChange.',
      component: ControlledTabsExample,
      height: SCENE_SIZES.medium,
      code: ControlledTabsExampleRaw,
    },
    {
      id: 'scrollable-tabs',
      title: 'Scrollable Tab List',
      description: 'Enable horizontal scrolling for long tab lists.',
      component: ScrollableTabsExample,
      height: SCENE_SIZES.medium,
      code: ScrollableTabsExampleRaw,
    },
    {
      id: 'customized-tabs',
      title: 'Customized Tabs',
      description: 'Tabs with custom styles applied via theme overrides.',
      component: CustomizedTabsExample,
      height: SCENE_SIZES.medium,
      code: CustomizedTabsExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Tabs require a sequence of <Tab> headers followed by <TabPanel> content.',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      default: '0',
      description: 'Initial active tab index for uncontrolled usage.',
    },
    {
      name: 'activeIndex',
      type: 'number',
      description: 'Controlled active tab index. Use with onChange.',
    },
    {
      name: 'onChange',
      type: '(index: number) => void',
      description: 'Callback fired when a new tab is selected.',
    },
    {
      name: 'scrollableTabs',
      type: 'boolean',
      default: 'true',
      description: 'Enable horizontal scrolling for the tab list.',
    },
    {
      name: 'tabListScrollProps',
      type: "Omit<ScrollViewProps, 'children'>",
      description: 'ScrollView props applied to the tab list when scrollableTabs is enabled.',
    },
  ],

  propsComplete: [
    {
      name: 'children',
      type: 'ChildrenType',
      description: 'Tabs require a sequence of <Tab> headers followed by <TabPanel> content.',
    },
    {
      name: 'activeIndex',
      type: 'number',
      description: 'Controlled active tab index. Use with onChange.',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      default: '0',
      description: 'Initial active tab index for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: '(index: number) => void',
      description: 'Callback fired when a new tab is selected.',
    },
    {
      name: 'scrollableTabs',
      type: 'boolean',
      default: 'true',
      description: 'Enable horizontal scrolling for the tab list.',
    },
    {
      name: 'tabListScrollProps',
      type: "Omit<ScrollViewProps, 'children'>",
      description: 'ScrollView props applied to the tab list when scrollableTabs is enabled.',
    },
  ],

  inherits: [
    {
      component: 'View',
      link: '/components/view',
      description:
        'Tabs is built on View and inherits layout and styling props like width, height, padding, backgroundColor, and alignment.',
    },
  ],

  relatedLinks: [
    {
      title: 'ScrollView',
      link: '/components/scroll-view',
      description: 'Use ScrollView props for tabListScrollProps when tabs are scrollable.',
    },
  ],
}
