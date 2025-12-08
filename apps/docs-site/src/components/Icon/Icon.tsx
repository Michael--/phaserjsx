/* eslint-disable react-refresh/only-export-components */
/** @jsxImportSource @phaserjsx/ui */
/**
 * Icon component for docs-site using Bootstrap Icons
 * Type-safe icon loading with automatic tree-shaking
 */
import {
  Icon as GenericIcon,
  getThemedProps,
  useIconPreload,
  useTheme,
  type IconProps as GenericIconProps,
} from '@phaserjsx/ui'
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

// Re-export the IconType for convenience
export type { IconType }

/**
 * Cache for loaded icon SVG strings
 * Prevents redundant loading of the same icon
 */
const iconCache = new Map<IconType, string>()

/**
 * Icon loader function
 * Loads icons from the generated icon loaders registry
 *
 * @param type - The icon type to load
 * @returns Promise resolving to SVG string
 * @throws Error if icon is not registered in the loaders
 */
async function iconLoader(type: IconType): Promise<string> {
  // Check cache first
  const cached = iconCache.get(type)
  if (cached) {
    return cached
  }

  // Get loader function from generated registry
  const loader = iconLoaders[type]

  if (!loader) {
    throw new Error(
      `Icon not registered: ${type}. Run 'pnpm run generate-icons' to update the registry.`
    )
  }

  // Load the icon (Vite will code-split this automatically)
  const module = await loader()
  const svg = module.default
  iconCache.set(type, svg)
  return svg
}

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

/**
 * Hook to preload an icon and check if it's ready
 *
 * @param type - The icon type to load
 * @returns true when the icon is loaded and ready to use
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const iconReady = useIcon('check')
 *   return iconReady ? <Icon type="check" /> : <Text text="Loading..." />
 * }
 * ```
 */
export function useIcon(type: IconType): boolean {
  return useIconPreload(type, iconLoader)
}
