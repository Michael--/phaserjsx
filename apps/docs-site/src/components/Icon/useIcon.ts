/**
 * Hook to preload an icon and check if it's ready
 */
import { useIconPreload } from '@number10/phaserjsx'
import type { IconType } from './icon-types.generated'
import { iconLoader } from './iconLoader'

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
