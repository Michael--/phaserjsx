/**
 * Icon component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  ButtonIconExample,
  ColorsIconExample,
  InteractiveIconExample,
  PreloadIconExample,
  QuickStartIconExample,
  SizesIconExample,
  VarietyIconExample,
} from '@/examples/icon'
// Import source code as raw strings
import ButtonIconExampleRaw from '@/examples/icon/ButtonExample.tsx?raw'
import ColorsIconExampleRaw from '@/examples/icon/ColorsExample.tsx?raw'
import InteractiveIconExampleRaw from '@/examples/icon/InteractiveExample.tsx?raw'
import PreloadIconExampleRaw from '@/examples/icon/PreloadExample.tsx?raw'
import QuickStartIconExampleRaw from '@/examples/icon/QuickStartExample.tsx?raw'
import SizesIconExampleRaw from '@/examples/icon/SizesExample.tsx?raw'
import VarietyIconExampleRaw from '@/examples/icon/VarietyExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const iconContent: ComponentDocs = {
  title: 'Icon',
  description:
    'Type-safe icon component with automatic tree-shaking and lazy loading. Load Bootstrap Icons on-demand with full IntelliSense support.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic icon usage with common icons. Note: Icons are not directly interactive - for clickable icons, wrap in a View with enableGestures and onTouch, or use Button component.',
    component: QuickStartIconExample,
    height: SCENE_SIZES.compact,
    code: QuickStartIconExampleRaw,
  },

  examples: [
    {
      id: 'sizes',
      title: 'Icon Sizes',
      description: 'Icons scale to any size from tiny to extra large',
      component: SizesIconExample,
      height: SCENE_SIZES.medium,
      code: SizesIconExampleRaw,
    },
    {
      id: 'colors',
      title: 'Colors & Tinting',
      description: 'Apply colors with the tint prop',
      component: ColorsIconExample,
      height: SCENE_SIZES.medium,
      code: ColorsIconExampleRaw,
    },
    {
      id: 'variety',
      title: 'Icon Variety',
      description: 'Browse different icon types from Bootstrap Icons',
      component: VarietyIconExample,
      height: SCENE_SIZES.small,
      code: VarietyIconExampleRaw,
    },
    {
      id: 'with-buttons',
      title: 'Icons with Buttons',
      description: 'Combine icons with buttons for intuitive UI',
      component: ButtonIconExample,
      height: SCENE_SIZES.medium,
      code: ButtonIconExampleRaw,
    },
    {
      id: 'interactive',
      title: 'Interactive Icons',
      description: 'Icons that respond to user interaction',
      component: InteractiveIconExample,
      height: SCENE_SIZES.medium,
      code: InteractiveIconExampleRaw,
    },
    {
      id: 'preload',
      title: 'Preloading',
      description: 'Use useIcon hook to preload critical icons',
      component: PreloadIconExample,
      height: SCENE_SIZES.small,
      code: PreloadIconExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'type',
      type: 'IconType | undefined',
      description:
        'Icon name to load - type-safe with IntelliSense for 2000+ Bootstrap Icons. Example: "check", "gear", "star"',
    },
    {
      name: 'size',
      type: 'number',
      default: '32',
      description: 'Icon size in pixels (width and height). Common sizes: 16, 24, 32, 48, 64',
    },
    {
      name: 'tint',
      type: 'number',
      description:
        'Color tint applied to icon as hex number. Example: 0xff0000 (red), 0x00ff00 (green)',
    },
  ],

  propsComplete: [
    {
      name: 'type',
      type: 'IconType | undefined',
      description: 'Icon name to load - type-safe union of all available icons',
    },
    {
      name: 'size',
      type: 'number',
      default: '32',
      description: 'Icon size in pixels (both width and height)',
    },
    {
      name: 'tint',
      type: 'number',
      description: 'Color tint as hex number (e.g., 0xff0000)',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Opacity from 0 (transparent) to 1 (opaque)',
    },
    {
      name: 'visible',
      type: 'boolean',
      default: 'true',
      description: 'Whether icon is visible',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position in pixels',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position in pixels',
    },
    {
      name: 'margin',
      type: 'number | Margin',
      description: 'Spacing outside icon - number for all sides or object for specific sides',
    },
    {
      name: 'padding',
      type: 'number | Padding',
      description: 'Internal spacing - number for all sides or object for specific sides',
    },
    {
      name: 'originX',
      type: 'number',
      default: '0',
      description: 'Horizontal origin point (0-1) - 0 is left, 0.5 is center, 1 is right',
    },
    {
      name: 'originY',
      type: 'number',
      default: '0',
      description: 'Vertical origin point (0-1) - 0 is top, 0.5 is center, 1 is bottom',
    },
  ],

  relatedLinks: [
    {
      title: 'Icon System Overview',
      link: '/guides/icon-system',
      description: 'Complete architecture and tree-shaking concepts',
    },
    {
      title: 'Generator Configuration',
      link: '/guides/icon-generator-config',
      description: 'Configure icon sources and generation',
    },
    {
      title: 'Custom Icon Component',
      link: '/guides/custom-icon-component',
      description: 'Create your own type-safe icon wrapper',
    },
    {
      title: 'Custom SVG Icons',
      link: '/guides/custom-svg-icons',
      description: 'Add your own icon files',
    },
    {
      title: 'Button Component',
      link: '/components/button',
      description: 'Combine icons with buttons',
    },
  ],
}
