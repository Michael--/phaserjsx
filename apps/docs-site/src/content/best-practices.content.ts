/**
 * Best Practices documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { VisibilityExample } from '@/examples/best-practices'
// Import source code as raw strings
import VisibilityExampleRaw from '@/examples/best-practices/VisibilityExample.tsx?raw'
import type { ExampleDefinition } from '@/types/docs'

export const visibilityExample: ExampleDefinition = {
  id: 'visibility-demo',
  title: 'Visibility Approaches Comparison',
  description: 'Compare the three different ways to control visibility',
  component: VisibilityExample,
  height: SCENE_SIZES.medium,
  code: VisibilityExampleRaw,
}
