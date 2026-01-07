/** @jsxImportSource @number10/phaserjsx */
/**
 * Icon component for dev-playground using Lucide Icons
 * Type-safe icon loading with automatic tree-shaking
 */
import {
  Icon as GenericIcon,
  getThemedProps,
  useIconPreload,
  useTheme,
  type IconProps as GenericIconProps,
} from '@number10/phaserjsx'
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

export type { IconType }

/**
 * Cache for loaded icon SVG strings
 * Prevents redundant loading of the same icon
 */
const iconCache = new Map<IconType, string>()

/**
 * Icon loader function
 * Loads icons from the generated icon loaders registry
 */
async function iconLoader(type: IconType): Promise<string> {
  const cached = iconCache.get(type)
  if (cached) {
    return cached
  }

  const loader = iconLoaders[type]

  if (!loader) {
    throw new Error(
      `Icon not registered: ${type}. Run 'pnpm run generate-icons' to update the registry.`
    )
  }

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
 * Icon component - strongly typed for Lucide Icons with theme support
 */
export function Icon(props: IconProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('Icon', localTheme, {})

  const size = props.size ?? themed.size ?? 32
  const tint = props.tint ?? themed.tint

  return <GenericIcon {...props} size={size} tint={tint} loader={iconLoader} />
}

/**
 * Hook to preload an icon and check if it's ready
 */
export function useIcon(type: IconType): boolean {
  return useIconPreload(type, iconLoader)
}
