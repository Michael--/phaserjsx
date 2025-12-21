/**
 * Joystick component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  CompositeJoystickExample,
  CustomGraphicsJoystickExample,
  QuickStartJoystickExample,
  ThemesJoystickExample,
} from '@/examples/joystick'
// Import source code as raw strings
import CompositeJoystickExampleRaw from '@/examples/joystick/CompositeExample.tsx?raw'
import CustomGraphicsJoystickExampleRaw from '@/examples/joystick/CustomGraphicsExample.tsx?raw'
import QuickStartJoystickExampleRaw from '@/examples/joystick/QuickStartExample.tsx?raw'
import ThemesJoystickExampleRaw from '@/examples/joystick/ThemesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const joystickContent: ComponentDocs = {
  title: 'Joystick',
  description:
    'Interactive directional input control with touch/mouse support. Features multiple theme variants and custom graphics support.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Basic joystick with movement callback',
    component: QuickStartJoystickExample,
    height: SCENE_SIZES.medium,
    code: QuickStartJoystickExampleRaw,
  },

  examples: [
    {
      id: 'themes',
      title: 'Theme Variants',
      description: 'Built-in visual themes with customizable tint colors',
      component: ThemesJoystickExample,
      height: SCENE_SIZES.large,
      code: ThemesJoystickExampleRaw,
    },
    {
      id: 'custom-graphics',
      title: 'Custom Graphics',
      description: 'Use custom Graphics components for base and thumb',
      component: CustomGraphicsJoystickExample,
      height: SCENE_SIZES.medium,
      code: CustomGraphicsJoystickExampleRaw,
    },
    {
      id: 'composite',
      title: 'Composite Elements',
      description: 'Combine any VNodeLike elements - Views, Graphics, Images, Text, Icons',
      component: CompositeJoystickExample,
      height: SCENE_SIZES.medium,
      code: CompositeJoystickExampleRaw,
    },
  ],

  propsEssential: [
    {
      name: 'width',
      type: 'SizeValue',
      required: true,
      description: 'Width of the joystick area',
    },
    {
      name: 'height',
      type: 'SizeValue',
      required: true,
      description: 'Height of the joystick area',
    },
    {
      name: 'onMove',
      type: '(active: boolean, angle: number, force: number) => void',
      description:
        'Callback when joystick moves. active: true while dragging, angle: direction in degrees (0-360), force: distance from center (0.0-1.0)',
    },
    {
      name: 'joystickTheme',
      type: 'JoystickTheme',
      description:
        'Theme configuration object with theme variant and optional tint color. Available themes: default, neon, target, glass, military',
    },
  ],

  propsComplete: [
    {
      name: 'base',
      type: 'VNodeLike',
      description: 'Custom Graphics component for joystick base (background)',
    },
    {
      name: 'thumb',
      type: 'VNodeLike',
      description: 'Custom Graphics component for joystick thumb (control handle)',
    },
    {
      name: 'minForce',
      type: 'number',
      default: '0.0',
      description: 'Minimum force threshold to trigger movement (0.0 to 1.0)',
    },
    {
      name: 'rotateThumb',
      type: 'boolean',
      default: 'false',
      description: 'Enable thumb rotation based on movement angle',
    },
    {
      name: 'onTap',
      type: '() => void',
      description: 'Callback when joystick is tapped without movement',
    },
  ],
}
