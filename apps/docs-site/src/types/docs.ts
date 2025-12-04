/**
 * Type definitions for documentation content
 */
import type { SceneSize } from '@/constants/scene-sizes'
import type { VNode } from '@phaserjsx/ui'

/**
 * Definition for a single example
 */
export interface ExampleDefinition {
  /** Unique identifier */
  id: string
  /** Display title */
  title: string
  /** Brief description */
  description: string
  /** PhaserJSX component function */
  component: (props: Record<string, unknown>) => VNode
  /** Scene height (use SCENE_SIZES or custom number) */
  height: SceneSize
  /** Source code to display */
  code: string
}

/**
 * Definition for a component prop
 */
export interface PropDefinition {
  name: string
  type: string
  default?: string
  description: string
}

/**
 * Inherited component reference
 */
export interface InheritedComponent {
  /** Parent component name */
  component: string
  /** Link to parent component docs */
  link: string
  /** Description of inherited functionality */
  description: string
}

/**
 * Complete component documentation structure
 */
export interface ComponentDocs {
  /** Component name */
  title: string
  /** Brief overview */
  description: string
  /** Quick start example (always shown first) */
  quickStart: ExampleDefinition
  /** Progressive examples (basic to advanced) */
  examples: ExampleDefinition[]
  /** Essential props (top 5-7) */
  propsEssential: PropDefinition[]
  /** All props (complete reference) */
  propsComplete: PropDefinition[]
  /** Inherited components and their props */
  inherits?: InheritedComponent[]
}
