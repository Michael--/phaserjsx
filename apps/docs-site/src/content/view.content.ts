/**
 * View component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  AlignmentViewExample,
  BasicLayoutViewExample,
  FlexDirectionViewExample,
  QuickStartViewExample,
} from '@/examples/view'
import type { ComponentDocs } from '@/types/docs'

export const viewContent: ComponentDocs = {
  title: 'View',
  description:
    'The fundamental layout container for PhaserJSX. View is the building block for all UI layouts, providing flexbox-like positioning, backgrounds, borders, and gesture support.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic View with background color and content. Note: An empty View without background is invisible.',
    component: QuickStartViewExample,
    height: SCENE_SIZES.compact,
    code: `/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function MyComponent() {
  return (
    <View padding={20} justifyContent="center" alignItems="center">
      <View backgroundColor={0x3498db} width={200} height={100} cornerRadius={8}>
        <Text text="I'm a View!" style={{ fontSize: '20px', color: '#ffffff' }} />
      </View>
    </View>
  )
}`,
  },

  examples: [
    {
      id: 'basic-layout',
      title: 'Basic Layout',
      description: 'Dimensions, padding, and nested Views',
      component: BasicLayoutViewExample,
      height: SCENE_SIZES.medium,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function BasicLayoutExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* With explicit dimensions */}
      <View backgroundColor={0xe74c3c} width={150} height={80} padding={10}>
        <Text text="150x80" style={{ color: '#ffffff' }} />
      </View>

      {/* With padding */}
      <View backgroundColor={0x2ecc71} padding={20}>
        <Text text="Auto-sized with padding" style={{ color: '#ffffff' }} />
      </View>

      {/* Nested Views */}
      <View backgroundColor={0x9b59b6} padding={15} cornerRadius={12}>
        <View backgroundColor={0xecf0f1} padding={10} cornerRadius={8}>
          <Text text="Nested Views" style={{ color: '#2c3e50' }} />
        </View>
      </View>
    </View>
  )
}`,
    },
    {
      id: 'flex-direction',
      title: 'Flex Direction',
      description: 'Row and column layouts with gap spacing',
      component: FlexDirectionViewExample,
      height: SCENE_SIZES.medium,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function FlexDirectionExample() {
  return (
    <View padding={20} gap={24} justifyContent="center" alignItems="center">
      {/* Column (default) */}
      <View direction="column" gap={8}>
        <Text text="Column Layout (default):" style={{ fontSize: '14px', color: '#888888' }} />
        <View backgroundColor={0x3498db} padding={10}>
          <Text text="First" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0xe74c3c} padding={10}>
          <Text text="Second" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0x2ecc71} padding={10}>
          <Text text="Third" style={{ color: '#ffffff' }} />
        </View>
      </View>

      {/* Row */}
      <View direction="row" gap={8}>
        <View backgroundColor={0x3498db} padding={10}>
          <Text text="First" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0xe74c3c} padding={10}>
          <Text text="Second" style={{ color: '#ffffff' }} />
        </View>
        <View backgroundColor={0x2ecc71} padding={10}>
          <Text text="Third" style={{ color: '#ffffff' }} />
        </View>
      </View>
    </View>
  )
}`,
    },
    {
      id: 'alignment',
      title: 'Alignment',
      description: 'Positioning content with justifyContent and alignItems',
      component: AlignmentViewExample,
      height: SCENE_SIZES.medium,
      code: `/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function AlignmentExample() {
  const Box = ({ label }: { label: string }) => (
    <View backgroundColor={0xe74c3c} padding={8} cornerRadius={4}>
      <Text text={label} style={{ color: '#ffffff', fontSize: '12px' }} />
    </View>
  )

  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Center (default) */}
      <View width={250} height={80} backgroundColor={0x34495e} justifyContent="center" alignItems="center">
        <Box label="Center (default)" />
      </View>

      {/* Flex Start */}
      <View width={250} height={80} backgroundColor={0x34495e} justifyContent="flex-start" alignItems="flex-start" padding={8}>
        <Box label="Flex Start" />
      </View>

      {/* Flex End */}
      <View width={250} height={80} backgroundColor={0x34495e} justifyContent="flex-end" alignItems="flex-end" padding={8}>
        <Box label="Flex End" />
      </View>

      {/* Space Between */}
      <View direction="row" width={250} height={60} backgroundColor={0x34495e} justifyContent="space-between" alignItems="center" padding={8}>
        <Box label="Start" />
        <Box label="End" />
      </View>
    </View>
  )
}`,
    },
  ],

  propsEssential: [
    {
      name: 'direction',
      type: '"row" | "column"',
      default: '"column"',
      description: 'Flex direction for child layout',
    },
    {
      name: 'width',
      type: 'number | "fill"',
      description: 'Width in pixels or "fill" to take full available width',
    },
    {
      name: 'height',
      type: 'number | "fill"',
      description: 'Height in pixels or "fill" to take full available height',
    },
    {
      name: 'padding',
      type: 'number',
      description: 'Inner spacing on all sides',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Spacing between child elements',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (e.g., 0x3498db)',
    },
    {
      name: 'justifyContent',
      type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around"',
      default: '"center"',
      description: 'Main axis alignment',
    },
    {
      name: 'alignItems',
      type: '"flex-start" | "center" | "flex-end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment',
    },
  ],

  propsComplete: [
    {
      name: 'direction',
      type: '"row" | "column"',
      default: '"column"',
      description: 'Flex direction for child layout',
    },
    {
      name: 'width',
      type: 'number | "fill"',
      description: 'Width in pixels or "fill" to take full available width',
    },
    {
      name: 'height',
      type: 'number | "fill"',
      description: 'Height in pixels or "fill" to take full available height',
    },
    {
      name: 'minWidth',
      type: 'number',
      description: 'Minimum width constraint',
    },
    {
      name: 'minHeight',
      type: 'number',
      description: 'Minimum height constraint',
    },
    {
      name: 'maxWidth',
      type: 'number',
      description: 'Maximum width constraint',
    },
    {
      name: 'maxHeight',
      type: 'number',
      description: 'Maximum height constraint',
    },
    {
      name: 'padding',
      type: 'number',
      description: 'Inner spacing on all sides',
    },
    {
      name: 'paddingTop',
      type: 'number',
      description: 'Top padding',
    },
    {
      name: 'paddingRight',
      type: 'number',
      description: 'Right padding',
    },
    {
      name: 'paddingBottom',
      type: 'number',
      description: 'Bottom padding',
    },
    {
      name: 'paddingLeft',
      type: 'number',
      description: 'Left padding',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Spacing between child elements',
    },
    {
      name: 'backgroundColor',
      type: 'number',
      description: 'Background color as hex number (e.g., 0x3498db)',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
      default: '1',
      description: 'Background opacity (0-1)',
    },
    {
      name: 'cornerRadius',
      type: 'number',
      description: 'Border radius for rounded corners',
    },
    {
      name: 'borderWidth',
      type: 'number',
      description: 'Border thickness',
    },
    {
      name: 'borderColor',
      type: 'number',
      description: 'Border color as hex number',
    },
    {
      name: 'borderAlpha',
      type: 'number',
      default: '1',
      description: 'Border opacity (0-1)',
    },
    {
      name: 'justifyContent',
      type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around"',
      default: '"center"',
      description: 'Main axis alignment',
    },
    {
      name: 'alignItems',
      type: '"flex-start" | "center" | "flex-end" | "stretch"',
      default: '"center"',
      description: 'Cross axis alignment',
    },
    {
      name: 'wrap',
      type: '"wrap" | "nowrap"',
      default: '"nowrap"',
      description: 'Whether children should wrap to next line',
    },
    {
      name: 'overflow',
      type: '"visible" | "hidden"',
      default: '"visible"',
      description: 'How to handle content that exceeds bounds',
    },
    {
      name: 'enableGestures',
      type: 'boolean',
      default: 'false',
      description: 'Enable touch/click gesture detection',
    },
    {
      name: 'onTouch',
      type: '() => void',
      description: 'Touch/click event handler (requires enableGestures)',
    },
    {
      name: 'x',
      type: 'number',
      description: 'X position offset',
    },
    {
      name: 'y',
      type: 'number',
      description: 'Y position offset',
    },
    {
      name: 'alpha',
      type: 'number',
      default: '1',
      description: 'Overall opacity (0-1)',
    },
    {
      name: 'visible',
      type: 'boolean',
      default: 'true',
      description: 'Whether the View is visible',
    },
    {
      name: 'children',
      type: 'VNode | VNode[]',
      description: 'Child components',
    },
  ],

  inherits: [],
}
