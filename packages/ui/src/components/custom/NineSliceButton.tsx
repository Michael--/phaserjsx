/** @jsxImportSource ../.. */
/**
 * NineSliceButton - Convenience component for creating buttons with NineSlice backgrounds
 *
 * This component simplifies the creation of scalable buttons by automatically handling
 * the stack layout pattern and inner content positioning.
 */
import type { ViewProps } from '..'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useEffect, useRef, useState } from '../../hooks'
import { getThemedProps } from '../../theme'
import { NineSlice } from './NineSlice'
import { View } from './View'

/**
 * Props for NineSliceButton component
 *
 * @remarks
 * This component creates a button with a NineSlice background and a content area.
 * The content area is automatically sized to exclude the slice borders.
 *
 * **IMPORTANT - Atlas/Texture Configuration:**
 *
 * The slice dimensions (leftWidth, rightWidth, topHeight, bottomHeight) must match
 * the actual design of your texture asset in the texture atlas. These values define
 * which parts of the source image are the "corners" and "edges" vs the "center".
 *
 * **Things to consider:**
 * - Inspect your texture atlas to determine the correct slice values
 * - The slice values are in pixels of the SOURCE texture, not the scaled button
 * - Sum of leftWidth + rightWidth should be less than the source texture width
 * - Sum of topHeight + bottomHeight should be less than the source texture height
 * - Width and height props define the FINAL size of the button after scaling
 * - The center area will stretch, but corners and edges maintain their size
 *
 * @example
 * ```tsx
 * // For a button texture that is 64x32 in the atlas with 8px corners:
 * <NineSliceButton
 *   texture="ui"
 *   frame="button-green"
 *   width={200}          // Final button width
 *   height={80}          // Final button height
 *   leftWidth={8}        // Left edge is 8px in source texture
 *   rightWidth={8}       // Right edge is 8px in source texture
 *   topHeight={8}        // Top edge is 8px in source texture
 *   bottomHeight={8}     // Bottom edge is 8px in source texture
 *   onClick={() => console.log('clicked')}
 * >
 *   <Text text="Click Me" />
 * </NineSliceButton>
 * ```
 *
 * @example
 * ```tsx
 * // Horizontal-only (3-slice) button - omit topHeight/bottomHeight:
 * <NineSliceButton
 *   texture="ui"
 *   frame="progress-bar"
 *   width={300}
 *   height={40}
 *   leftWidth={10}
 *   rightWidth={10}
 * >
 *   <Text text="Progress: 75%" />
 * </NineSliceButton>
 * ```
 */
export interface NineSliceButtonProps extends ViewProps, EffectDefinition {
  /**
   * Texture key from the loaded texture atlas
   * Must be loaded before use (e.g., in a preload scene)
   */
  texture: string

  /**
   * Frame name or index within the texture atlas
   * Optional if the texture is not an atlas
   */
  frame?: string | number

  /**
   * Width of the left slice in pixels of the SOURCE texture
   * This defines the non-stretching left border/corner area
   */
  leftWidth: number

  /**
   * Width of the right slice in pixels of the SOURCE texture
   * This defines the non-stretching right border/corner area
   */
  rightWidth: number

  /**
   * Height of the top slice in pixels of the SOURCE texture
   * This defines the non-stretching top border/corner area
   * Optional - omit for 3-slice (horizontal only) mode
   */
  topHeight?: number

  /**
   * Height of the bottom slice in pixels of the SOURCE texture
   * This defines the non-stretching bottom border/corner area
   * Optional - omit for 3-slice (horizontal only) mode
   */
  bottomHeight?: number

  /**
   * Click handler for button interaction
   */
  onClick?: () => void

  //* Optional disabled state - if true, button will not respond to clicks */
  disabled?: boolean
}

/**
 * NineSliceButton component - creates a scalable button with NineSlice background
 *
 * This is a convenience wrapper around NineSlice + View that handles:
 * - Stack layout for background and content
 * - Automatic inner content area calculation
 * - Click interaction handling
 * - Proper content alignment
 *
 * @param props - NineSliceButton properties
 * @returns JSX element representing a button with NineSlice background
 *
 * @example
 * ```tsx
 * <NineSliceButton
 *   texture="ui"
 *   frame="button-blue"
 *   width={250}
 *   height={100}
 *   leftWidth={20}
 *   rightWidth={20}
 *   topHeight={15}
 *   bottomHeight={15}
 *   onClick={() => console.log('Button clicked!')}
 *   alignItems="center"
 *   justifyContent="center"
 * >
 *   <Text text="Click Me!" style={{ fontSize: 24 }} />
 * </NineSliceButton>
 * ```
 */

export function NineSliceButton(props: NineSliceButtonProps) {
  const {
    texture,
    frame,
    leftWidth,
    rightWidth,
    topHeight,
    bottomHeight,
    onClick,
    disabled,
    visible,
    // Inner view layout props - used for content area, get here and not passed to outer View
    children: innerChildren,
    direction: innerDirection,
    gap: innerGap,
    padding: innerPadding,
    borderWidth: innerBorderWidth,
    borderColor: innerBorderColor,
    alignItems: innerAlignItems,
    justifyContent: innerJustifyContent,
    // Rest goes to outer view
    ...viewProps
  } = props

  const { props: themed } = getThemedProps('NineSliceButton', undefined, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect, stopEffects } = useGameObjectEffect(ref)

  // Force redraw after mount to ensure dimensions are calculated
  // and show content after that to avoid visual glitches
  const [show, setShow] = useState(false)

  useEffect(() => {
    // redraw to catch any layout adjustments and slider dimensions
    const timer = setTimeout(() => setShow(true), 0)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const innerWidth = (ref.current?.width ?? 0) - leftWidth - rightWidth
  const innerHeight = (ref.current?.height ?? 0) - (topHeight ?? 0) - (bottomHeight ?? 0)

  const handleTouch =
    !disabled && onClick
      ? () => {
          onClick?.()

          // Stop any running effects to prevent position drift
          stopEffects()

          // Apply effect: props override theme, theme overrides default
          const resolved = resolveEffect(props, themed as EffectDefinition)
          applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
        }
      : undefined

  return (
    <View
      ref={ref}
      direction="stack"
      backgroundAlpha={0.0}
      enableGestures={!disabled}
      visible={show && (visible ?? true)}
      {...themed}
      {...viewProps}
      {...(handleTouch && { onTouch: handleTouch })}
    >
      <NineSlice
        texture={texture}
        {...(frame !== undefined && { frame })}
        width="100%"
        height="100%"
        leftWidth={leftWidth}
        rightWidth={rightWidth}
        {...(topHeight !== undefined && { topHeight })}
        {...(bottomHeight !== undefined && { bottomHeight })}
      />
      <View
        backgroundAlpha={0.0}
        direction={innerDirection ?? 'column'}
        x={leftWidth}
        y={topHeight ?? 0}
        width={innerWidth}
        height={innerHeight}
        alignItems={innerAlignItems ?? 'center'}
        justifyContent={innerJustifyContent ?? 'center'}
        {...(innerGap !== undefined && { gap: innerGap })}
        {...(innerPadding !== undefined && { padding: innerPadding })}
        {...(innerBorderWidth !== undefined && { borderWidth: innerBorderWidth })}
        {...(innerBorderColor !== undefined && { borderColor: innerBorderColor })}
      >
        {innerChildren}
      </View>
    </View>
  )
}
