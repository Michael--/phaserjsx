/** @jsxImportSource ../.. */
/**
 * WrapText component - Text that automatically wraps to parent container width
 * Eliminates boilerplate for text wrapping by detecting parent dimensions
 * @module components/custom/WrapText
 */
import { useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import { Text, View } from '../index'

/**
 * WrapText component props
 */
export interface WrapTextProps {
  /** Text content to display */
  text?: string | undefined

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
 * **IMPORTANT:** Parent container MUST have explicit width!
 * - Use `width={300}` or `width="fill"` on parent
 * - `maxWidth` alone does NOT work (layout system limitation)
 *
 * @param props - WrapText props
 * @returns WrapText component
 *
 * @example
 * ```tsx
 * // ✅ CORRECT: Parent with explicit width
 * <View width={400}>
 *   <WrapText text="This text will wrap at 400px" />
 * </View>
 *
 * // ✅ CORRECT: Parent with fill (if its parent has size)
 * <View width="fill">
 *   <WrapText text="This text wraps to parent width" />
 * </View>
 *
 * // ❌ WRONG: Only maxWidth (text won't wrap correctly)
 * <View maxWidth={400}>
 *   <WrapText text="This won't work as expected" />
 * </View>
 *
 * // With styling
 * <View width={300}>
 *   <WrapText
 *     text="Styled text"
 *     style={{ fontSize: '16px', color: '#333' }}
 *     align="center"
 *   />
 * </View>
 *
 * // Disable wrapping
 * <View width={300}>
 *   <WrapText text="Single line" wrap={false} />
 * </View>
 *
 * // With padding offset
 * <View width={400} padding={24}>
 *   <WrapText text="Text" paddingOffset={48} />
 * </View>
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
  // Start with initialWidth to prevent layout flash
  const [containerWidth, setContainerWidth] = useState(0)
  const lastWidthRef = useRef(0)

  // Use ref callback to detect container mount/changes
  const containerRefCallback = (container: ContainerWithLayout | null) => {
    if (!container || !wrap) {
      return
    }

    // Check size after layout completes
    const checkSize = () => {
      if (container.__getLayoutSize) {
        const size = container.__getLayoutSize()
        // Only update if width actually changed
        if (
          size.width > 0 &&
          size.width !== lastWidthRef.current &&
          size.width !== containerWidth
        ) {
          lastWidthRef.current = size.width
          //console.log('WrapText detected container props:', props)
          //console.log('WrapText detected container cont:', container)
          //console.log('WrapText detected container width:', containerWidth, size.width)
          setContainerWidth(size.width)
        }
      }
    }
    setTimeout(() => {
      checkSize()
    }, 0)
  }

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
    <View ref={containerRefCallback} width={'fill'}>
      <Text {...textProps} />
    </View>
  )
}
