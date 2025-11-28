/**
 * Bootstrap Icons implementation using the generic Icon system
 * This is a specialized wrapper that provides type-safe Bootstrap Icons
 */
import { createIconComponent, useIcon as useGenericIcon } from '@phaserjsx/ui'
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

// Re-export the IconType for convenience
export type { IconType }
export type BootstrapIconType = IconType

/**
 * Cache for loaded icon SVG strings
 * Prevents redundant loading of the same icon
 */
const iconCache = new Map<IconType, string>()

/**
 * Bootstrap Icons loader function
 * Loads icons from the generated icon loaders registry
 *
 * @param type - The Bootstrap icon type to load
 * @returns Promise resolving to SVG string
 * @throws Error if icon is not registered in the loaders
 */
async function bootstrapIconLoader(type: IconType): Promise<string> {
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
 * Bootstrap Icon component - strongly typed for Bootstrap Icons
 *
 * @example
 * ```tsx
 * <BootstrapIcon type="check" size={24} />
 * <BootstrapIcon type="gear" size={32} tint={0xff0000} />
 * ```
 */
export const BootstrapIcon = createIconComponent<IconType>(bootstrapIconLoader)

/**
 * Hook to preload a Bootstrap icon and check if it's ready
 *
 * @param type - The Bootstrap icon type to load
 * @returns true when the icon is loaded and ready to use
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const iconReady = useBootstrapIcon('check')
 *   return iconReady ? <BootstrapIcon type="check" /> : <Text text="Loading..." />
 * }
 * ```
 */
export function useBootstrapIcon(type: IconType): boolean {
  return useGenericIcon(type, bootstrapIconLoader)
}

// Legacy export for backward compatibility
// TODO: Remove in next major version
export const Icon = BootstrapIcon
export const useIcon = useBootstrapIcon
