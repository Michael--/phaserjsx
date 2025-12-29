/** @jsxImportSource ../.. */
/**
 * View component wrapper - strict type-safe wrapper around primitive view
 * This component is the public API for View, with controlled prop interface
 */
import type * as Phaser from 'phaser'
import type {
  BackgroundProps,
  GestureProps,
  LayoutProps,
  PhaserProps,
  TransformProps,
} from '../../core-props'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType, PropsDefaultExtension } from '../../types'
import type { VNodeLike } from '../../vdom'

/**
 * Props for View component
 * Explicitly defined to ensure type safety in JSX usage
 */
export interface ViewProps
  extends TransformProps,
    PhaserProps,
    LayoutProps,
    BackgroundProps,
    GestureProps,
    PropsDefaultExtension<Phaser.GameObjects.Container> {
  /** Child components */
  children?: ChildrenType
}

/**
 * View component
 * Primary layout container with background styling and gesture support
 *
 * @example
 * ```tsx
 * <View direction="row" gap={10} padding={20}>
 *   <Text text="Hello" />
 *   <Text text="World" />
 * </View>
 *
 * <View backgroundColor={0x3498db} cornerRadius={8}>
 *   <Text text="Card" />
 * </View>
 *
 * <View enableGestures={true} onTouch={() => console.log('clicked')}>
 *   <Text text="Button" />
 * </View>
 * ```
 */
export function View(props: ViewProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('View', localTheme, props)

  // Cast to any to bypass type checking - the props are correct at runtime
  return <view {...themed} theme={nestedTheme} />
}
