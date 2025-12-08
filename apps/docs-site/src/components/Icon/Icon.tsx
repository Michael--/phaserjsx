/** @jsxImportSource @phaserjsx/ui */
/**
 * Icon component for docs-site using Bootstrap Icons
 * Type-safe icon loading with automatic tree-shaking
 */
import {
  Icon as GenericIcon,
  getThemedProps,
  useTheme,
  type IconProps as GenericIconProps,
} from '@phaserjsx/ui'
import type { IconType } from './icon-types.generated'
import { iconLoader } from './iconLoader'

// Re-export the IconType for convenience
export type { IconType }

/**
 * Props for Icon component
 */
export interface IconProps extends Omit<GenericIconProps<IconType>, 'loader'> {
  /** The icon type to load */
  type: IconType | undefined
}

/**
 * Icon component - strongly typed for Bootstrap Icons with theme support
 *
 * @example
 * ```tsx
 * <Icon type="check" size={24} />
 * <Icon type="gear" size={32} tint={0xff0000} />
 * ```
 */
export function Icon(props: IconProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('Icon', localTheme, {})

  // Merge themed props with component props (props override theme)
  const size = props.size ?? themed.size ?? 32

  return <GenericIcon {...props} size={size} loader={iconLoader} />
}
