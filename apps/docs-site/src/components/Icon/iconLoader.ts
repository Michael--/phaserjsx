/**
 * Icon loader function for docs-site
 * Handles loading and caching of Bootstrap Icons
 */
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

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
export async function iconLoader(type: IconType): Promise<string> {
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
