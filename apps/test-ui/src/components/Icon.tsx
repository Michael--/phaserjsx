/**
 * Icons implementation using the generic Icon system
 * This is a specialized wrapper that provides type-safe Icons
 */
import { createIconComponent, useIconPreload } from '@phaserjsx/ui'
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
 * Icons loader function
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
      `Icon not registered: ${type}. Run 'pnpm run generate-icon-loaders' to update the registry.`
    )
  }

  // Load the icon (Vite will code-split this automatically)
  const module = await loader()
  const svg = module.default
  iconCache.set(type, svg)
  return svg
}

/**
 * Icon component - strongly typed for Icons
 *
 * @example
 * ```tsx
 * <Icon type="check" size={24} />
 * <Icon type="gear" size={32} tint={0xff0000} />
 * ```
 */
export const Icon = createIconComponent<IconType>(iconLoader)

/**
 * Hook to preload a icon and check if it's ready
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
