/**
 * Icon system with lazy loading and strong typing
 */
import { Image, useSVGTexture, type ImageProps } from '@phaserjsx/ui'

// Import SVG strings (these could be from any icon library)
import bell from 'bootstrap-icons/icons/bell-fill.svg'
import boxes from 'bootstrap-icons/icons/boxes.svg'
import bricks from 'bootstrap-icons/icons/bricks.svg'
import check from 'bootstrap-icons/icons/check.svg'
import minus from 'bootstrap-icons/icons/dash.svg'
import square from 'bootstrap-icons/icons/square.svg'

/**
 * Available icon types with strong typing
 */
export type IconType = 'bell' | 'boxes' | 'bricks' | 'check' | 'square' | 'minus'

/**
 * Icon registry mapping types to SVG strings
 */
const iconRegistry: Record<IconType, string> = {
  bell,
  boxes,
  bricks,
  check,
  square,
  minus,
}

/**
 * Hook to load an icon lazily
 * @param type - The icon type to load
 * @returns true when icon is loaded and ready to use
 */
export function useIcon(type: IconType): boolean {
  const svg = iconRegistry[type]
  return useSVGTexture(`use-icon-${type}`, svg)
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
