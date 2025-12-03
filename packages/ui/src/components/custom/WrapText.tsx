/** @jsxImportSource ../.. */
/**
 * WrapText component - Text that automatically wraps to parent container width
 * Eliminates boilerplate for text wrapping by detecting parent dimensions
 * @module components/custom/WrapText
 */
import { useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import { Text, View } from '../index'

/**
 * WrapText component props
 */
export interface WrapTextProps {
  /** Text content to display */
  text: string

  /** Enable/disable automatic wrapping (default: true) */
  wrap?: boolean

  /** Padding offset to subtract from container width (default: 0) */
  paddingOffset?: number

  /** Text style properties */
  style?: Phaser.Types.GameObjects.Text.TextStyle

  /** Text alignment (convenience prop) */
  align?: 'left' | 'center' | 'right'

  /** Text alpha/opacity */
  alpha?: number

  /** Text visibility */
  visible?: boolean

  /** Additional transform props */
  x?: number
  y?: number
  rotation?: number
  scale?: number

  /** Margin around text */
  margin?: number
}

/**
 * WrapText component
 * Automatically wraps text based on parent container width
 *
 * @param props - WrapText props
 * @returns WrapText component
 *
 * @example
 * ```tsx
 * // Simple auto-wrapping
 * <WrapText text="This text will automatically wrap to fit the container width" />
 *
 * // With styling
 * <WrapText
 *   text="Styled wrapped text"
 *   style={{ fontSize: '16px', color: '#333' }}
 *   align="center"
 * />
 *
 * // Disable wrapping
 * <WrapText text="Single line text" wrap={false} />
 *
 * // With padding offset (e.g., if parent has padding)
 * <WrapText text="Text with offset" paddingOffset={20} />
 * ```
 */
export function WrapText(props: WrapTextProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('WrapText', localTheme, {})

  const wrap = props.wrap ?? themed.wrap ?? true
  const paddingOffset = props.paddingOffset ?? themed.paddingOffset ?? 0

  // Get parent container width for text wrapping
  type ContainerWithLayout = Phaser.GameObjects.Container & {
    __getLayoutSize?: () => { width: number; height: number }
  }
  const containerRef = useRef<ContainerWithLayout | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!wrap) return

    // Check container size after layout completes
    const checkSize = () => {
      if (containerRef.current?.__getLayoutSize) {
        const size = containerRef.current.__getLayoutSize()
        if (size.width > 0 && size.width !== containerWidth) {
          setContainerWidth(size.width)
        }
      }
    }

    // Try immediately
    checkSize()

    // Also check after next frame to catch async layout
    const rafId = requestAnimationFrame(checkSize)
    return () => cancelAnimationFrame(rafId)
  }, [wrap, containerRef.current, containerWidth])

  // Calculate effective text width
  const textWidth = containerWidth > paddingOffset ? containerWidth - paddingOffset : 0

  // Merge themed style with prop style
  const textStyle = {
    ...themed.textStyle,
    ...props.style,
  }

  // Add wordWrap if enabled and width available
  const finalStyle =
    wrap && textWidth > 0
      ? {
          ...textStyle,
          wordWrap: { useAdvancedWrap: true, width: textWidth },
        }
      : textStyle

  // Build Text props conditionally to satisfy exactOptionalPropertyTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textProps: any = { text: props.text, style: finalStyle }
  if (props.align !== undefined) textProps.align = props.align
  if (props.alpha !== undefined) textProps.alpha = props.alpha
  if (props.visible !== undefined) textProps.visible = props.visible
  if (props.x !== undefined) textProps.x = props.x
  if (props.y !== undefined) textProps.y = props.y
  if (props.rotation !== undefined) textProps.rotation = props.rotation
  if (props.scale !== undefined) textProps.scale = props.scale

  return (
    <View ref={containerRef} width={'fill'} borderColor={0xffaa44} borderWidth={3}>
      <Text {...textProps} />
    </View>
  )
}
