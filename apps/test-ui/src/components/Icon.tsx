/**
 * Icon system with lazy loading and strong typing
 * Uses dynamic imports for tree-shaking - only used icons are bundled
 */
import { Image, useEffect, useState, useSVGTexture, type ImageProps } from '@phaserjsx/ui'
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

  // Dynamic import - Vite will code-split this automatically
  // Only used icons will be included in the bundle
  const module = await import(`bootstrap-icons/icons/${type}.svg`)
  const svg = module.default as string

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
  const [isLoaded, setIsLoaded] = useState(iconCache.has(type))

  useEffect(() => {
    if (!isLoaded) {
      loadIcon(type).then((loadedSvg) => {
        setSvg(loadedSvg)
        setIsLoaded(true)
      })
    }
  }, [type, isLoaded])

  return useSVGTexture(`use-icon-${type}`, svg || '')
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
