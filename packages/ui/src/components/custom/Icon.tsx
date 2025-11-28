/** @jsxImportSource ../.. */
/**
 * Generic Icon component with pluggable loader system
 * Supports any icon library through a loader function
 */
import { useEffect, useState } from '../../hooks'
import { useSVGTexture } from '../../hooks-svg'
import type { ImageProps } from '../image'
import { Image } from '../index'

/**
 * Icon loader function type
 * Takes an icon type string and returns a promise resolving to SVG string
 */
export interface IconLoaderFn<T extends string = string> {
  (type: T): Promise<string>
}

/**
 * Props for the generic Icon component
 */
export interface IconProps<T extends string = string>
  extends Omit<ImageProps, 'texture' | 'displayWidth' | 'displayHeight'> {
  /** The icon type/name to load */
  type: T
  /** Loader function that fetches the icon SVG */
  loader: IconLoaderFn<T>
  /** Icon size in pixels (default: 32) */
  size?: number
}

/**
 * Generic Icon component
 * Loads and displays an icon using the provided loader function
 *
 * @example
 * ```tsx
 * <Icon
 *   type="check"
 *   loader={myIconLoader}
 *   size={24}
 * />
 * ```
 */
export function Icon<T extends string = string>(props: IconProps<T>) {
  const { type, loader, size = 32, ...imageProps } = props
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    loader(type)
      .then(setSvg)
      .catch((err) => console.error(`Failed to load icon ${type}:`, err))
  }, [type, loader])

  const ready = svg ? useSVGTexture(`icon-${type}`, svg, size, size) : false

  return (
    <Image
      texture={ready ? `icon-${type}` : ''}
      displayWidth={size}
      displayHeight={size}
      {...imageProps}
    />
  )
}

/**
 * Factory function to create a typed Icon component with a specific loader
 * This allows creating strongly-typed icon components for specific icon libraries
 *
 * @param loader - The icon loader function
 * @returns A typed Icon component that doesn't require the loader prop
 *
 * @example
 * ```tsx
 * // Define your loader
 * async function myIconLoader(type: MyIconType): Promise<string> {
 *   const module = await import(`./icons/${type}.svg`)
 *   return module.default
 * }
 *
 * // Create typed component
 * export const MyIcon = createIconComponent<MyIconType>(myIconLoader)
 *
 * // Use without loader prop
 * <MyIcon type="check" size={24} />
 * ```
 */
export function createIconComponent<T extends string>(loader: IconLoaderFn<T>) {
  return function TypedIcon(props: Omit<IconProps<T>, 'loader'>) {
    return <Icon {...props} loader={loader} />
  }
}

/**
 * Hook to preload an icon and check if it's ready
 * Useful for loading icons before they're displayed
 *
 * @param type - The icon type to load
 * @param loader - The icon loader function
 * @returns true when the icon is loaded and ready to use
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const iconReady = useIcon('check', myIconLoader)
 *
 *   return iconReady ? <Icon type="check" loader={myIconLoader} /> : <Text text="Loading..." />
 * }
 * ```
 */
export function useIcon<T extends string>(type: T, loader: IconLoaderFn<T>): boolean {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    loader(type)
      .then(setSvg)
      .catch((err) => console.error(`Failed to load icon ${type}:`, err))
  }, [type, loader])

  return svg !== null
}
