/** @jsxImportSource ../.. */
/**
 * WrapText component - Text that automatically wraps to parent container width
 * Eliminates boilerplate for text wrapping by detecting parent dimensions
 * @module components/custom/WrapText
 */
import { useCallback, useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import { Text, View, type TextProps } from '../index'

/**
 * WrapText component props
 */
export interface WrapTextProps extends TextProps {
  /** Enable/disable automatic wrapping (default: true) */
  wrap?: boolean
  /** Optional cache key to persist measured width across remounts */
  cacheKey?: string
}

const widthCache = new Map<string, number>()

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
  const paddingOffset = themed.paddingOffset ?? 0

  // Get parent container width for text wrapping
  type ContainerWithLayout = Phaser.GameObjects.Container & {
    __getLayoutSize?: () => { width: number; height: number }
  }
  const textKey = typeof props.text === 'string' ? props.text : null
  let cacheKey: string | null = null
  if (typeof props.cacheKey === 'string') {
    cacheKey = props.cacheKey
  } else if (typeof props.key === 'string') {
    cacheKey = textKey ? `${props.key}::${textKey}` : props.key
  } else if (textKey) {
    cacheKey = textKey
  }

  const cachedWidth = cacheKey ? (widthCache.get(cacheKey) ?? 0) : 0

  // Start with cached width (if any) to prevent layout flash across remounts
  const [containerWidth, setContainerWidth] = useState(cachedWidth)
  const lastWidthRef = useRef(cachedWidth)
  const containerRef = useRef<ContainerWithLayout | null>(null)
  const measureRafRef = useRef<number | null>(null)

  const measureWidth = useCallback(
    (container: ContainerWithLayout) => {
      if (!wrap) return

      const performMeasure = () => {
        if (!container.__getLayoutSize) return

        const size = container.__getLayoutSize()
        const nextWidth = size.width

        if (nextWidth > 0 && nextWidth !== lastWidthRef.current && nextWidth !== containerWidth) {
          lastWidthRef.current = nextWidth
          if (cacheKey) {
            widthCache.set(cacheKey, nextWidth)
          }
          setContainerWidth(nextWidth)
        }
      }

      // Schedule measure on next frame to allow layout to settle
      if (measureRafRef.current !== null) {
        return
      }

      measureRafRef.current = requestAnimationFrame(() => {
        measureRafRef.current = null
        performMeasure()
      })
    },
    [containerWidth, wrap]
  )

  // Use ref callback to detect container mount/changes
  const containerRefCallback = useCallback(
    (container: ContainerWithLayout | null) => {
      if (containerRef.current === container) return

      containerRef.current = container

      if (!container || !wrap) {
        return
      }

      if (containerWidth > 0) {
        return
      }

      measureWidth(container)
    },
    [containerWidth, measureWidth, wrap]
  )

  // Re-measure if wrap toggles on while mounted and width not yet captured
  useEffect(() => {
    if (!wrap || containerWidth > 0) return

    const container = containerRef.current
    if (container) {
      measureWidth(container)
    }
  }, [containerWidth, measureWidth, wrap])

  useEffect(() => {
    return () => {
      if (measureRafRef.current !== null) {
        cancelAnimationFrame(measureRafRef.current)
        measureRafRef.current = null
      }
    }
  }, [])

  // Calculate effective text width; fall back to last known width when container is temporarily hidden
  const measuredWidth = containerWidth > 0 ? containerWidth : lastWidthRef.current
  const textWidth = measuredWidth > paddingOffset ? measuredWidth - paddingOffset : 0

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
  //if (props.align !== undefined) textProps.align = props.align
  if (props.alpha !== undefined) textProps.alpha = props.alpha
  //if (props.visible !== undefined) textProps.visible = props.visible
  if (props.x !== undefined) textProps.x = props.x
  if (props.y !== undefined) textProps.y = props.y
  //if (props.rotation !== undefined) textProps.rotation = props.rotation
  //if (props.scale !== undefined) textProps.scale = props.scale

  return (
    <View ref={containerRefCallback} width={'fill'}>
      <Text {...textProps} />
    </View>
  )
}
