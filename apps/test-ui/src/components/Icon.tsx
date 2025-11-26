/**
 * Icon system with lazy loading and strong typing
 * Uses auto-generated icon loaders for tree-shaking
 */
import { Image, useEffect, useState, useSVGTexture, type ImageProps } from '@phaserjsx/ui'
import { iconLoaders } from './icon-loaders.generated'
import type { IconType } from './icon-types.generated'

export type { IconType }

/**
 * Cache for loaded icon SVG strings
 */
const iconCache = new Map<IconType, string>()

/**
 * Dynamically import an icon SVG
 * @param type - The icon type to load
 * @returns Promise resolving to SVG string
 */
async function loadIcon(type: IconType): Promise<string> {
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
 * Hook to load an icon lazily with dynamic imports
 * @param type - The icon type to load
 * @returns true when icon is loaded and ready to use
 */
export function useIcon(type: IconType): boolean {
  const [svg, setSvg] = useState<string | null>(iconCache.get(type) || null)

  useEffect(() => {
    if (!iconCache.has(type)) {
      loadIcon(type)
        .then((loadedSvg) => {
          setSvg(loadedSvg)
        })
        .catch((error) => {
          console.error(`Failed to load icon ${type}:`, error)
        })
    }
  }, [type])

  // Only call useSVGTexture when we actually have SVG data
  // This prevents trying to load an empty texture
  const isReady = svg ? useSVGTexture(`use-icon-${type}`, svg, 32, 32) : false

  return isReady
}

/**
 * Props for Icon component
 */
interface IconProps extends Omit<ImageProps, 'texture' | 'displayWidth' | 'displayHeight'> {
  type: IconType // The icon type to display
  size?: number // Icon size in pixels (default: 32)
}

/**
 * Icon component with lazy loading
 * @param type - The icon type to display
 * @param size - Icon size in pixels (default: 32)
 * @param props - Additional props passed to Image
 */
export function Icon(props: IconProps) {
  const ready = useIcon(props.type)
  return (
    <Image
      texture={ready ? `use-icon-${props.type}` : ''}
      displayHeight={props.size}
      displayWidth={props.size}
      {...props}
    />
  )
}
