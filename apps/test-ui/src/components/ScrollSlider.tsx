/**
 * ScrollSlider component for scrollable content areas
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import type { GestureEventData, LayoutSize } from '@phaserjsx/ui'
import { getThemedProps, useRef, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

// Module augmentation to add ScrollSlider theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    ScrollSlider: {
      borderColor?: number
      trackColor?: number
      thumbColor?: number
      borderWidth?: number
      size?: number
      minThumbSize?: number
    } & PhaserJSX.NestedComponentThemes
  }
}

/**
 * Props for ScrollSlider component
 */
export interface ScrollSliderProps {
  /** Direction of the slider */
  direction: 'vertical' | 'horizontal'
  /** Current scroll position in pixels */
  scrollPosition: number
  /** Viewport size in pixels */
  viewportSize: number
  /** Content size in pixels */
  contentSize: number
  /** Callback when slider is scrolled, returns new scroll position in pixels */
  onScroll: (scrollPosition: number) => void
}

/**
 * ScrollSlider component providing slider functionality for ScrollView
 * @param props - ScrollSlider properties
 * @returns JSX element
 */
export function ScrollSlider(props: ScrollSliderProps) {
  const { direction, scrollPosition, viewportSize, contentSize, onScroll } = props
  const { props: themed } = getThemedProps('ScrollSlider', undefined, {})
  const sliderRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)
  const trackContainerRef = useRef<Phaser.GameObjects.Container | null>(null)

  const isVertical = direction === 'vertical'

  const border = themed.borderWidth ?? 1
  const outer = themed.size ?? 24
  const dimension = outer - border * 2

  // Get actual resolved track size from the container after layout
  const containerWithLayout = trackContainerRef.current as
    | (Phaser.GameObjects.Container & {
        __getLayoutSize?: () => LayoutSize
      })
    | null

  const resolvedTrackSize = containerWithLayout?.__getLayoutSize
    ? isVertical
      ? containerWithLayout.__getLayoutSize().height
      : containerWithLayout.__getLayoutSize().width
    : containerWithLayout && containerWithLayout.width > 0 && containerWithLayout.height > 0
      ? isVertical
        ? containerWithLayout.height
        : containerWithLayout.width
      : 800 // fallback

  const trackSizeInner = resolvedTrackSize - border * 2
  const minThumbSize = themed.minThumbSize ?? 20

  // Calculate thumb size based on viewport to content ratio
  const maxScroll = Math.max(0, contentSize - viewportSize)
  const visibleRatio = contentSize > 0 ? viewportSize / contentSize : 1
  const thumbSize = Math.max(minThumbSize, trackSizeInner * visibleRatio)
  const thumbRange = trackSizeInner - thumbSize

  // Calculate thumb position from scroll position
  const thumbPosition = maxScroll > 0 ? (scrollPosition / maxScroll) * thumbRange : 0

  const handleThumbTouchMove = (data: GestureEventData) => {
    // Stop event propagation to prevent ScrollView from receiving the event
    data.stopPropagation()

    if (data.state === 'start') {
      isDraggingRef.current = true
      return
    }

    if (data.state === 'end') {
      isDraggingRef.current = false
      return
    }

    if (!isDraggingRef.current) return

    const delta = isVertical ? (data.dy ?? 0) : (data.dx ?? 0)
    const newThumbPos = Math.max(0, Math.min(thumbRange, thumbPosition + delta))
    const newScrollPos = thumbRange > 0 ? (newThumbPos / thumbRange) * maxScroll : 0

    onScroll(newScrollPos)
  }

  const handleBackgroundTouch = (data: GestureEventData) => {
    // Stop event propagation to prevent ScrollView from receiving the event
    data.stopPropagation()

    // localY/localX is relative to the background view which has the full trackSizeInner dimensions
    const localPos = isVertical ? (data.localY ?? 0) : (data.localX ?? 0)

    // Calculate the center position of where the thumb should be
    const targetThumbCenter = Math.max(
      thumbSize / 2,
      Math.min(trackSizeInner - thumbSize / 2, localPos)
    )

    // Convert to thumb position (top-left corner)
    const targetThumbPos = targetThumbCenter - thumbSize / 2

    // Calculate scroll position in pixels from thumb position
    const targetScrollPos = thumbRange > 0 ? (targetThumbPos / thumbRange) * maxScroll : 0

    onScroll(Math.max(0, Math.min(maxScroll, targetScrollPos)))
  }

  return (
    <View
      ref={trackContainerRef}
      width={isVertical ? outer : '100%'}
      height={isVertical ? '100%' : outer}
      backgroundColor={themed.borderColor ?? 0x000000}
      padding={border}
    >
      <View
        ref={sliderRef}
        width={isVertical ? dimension : '100%'}
        height={isVertical ? '100%' : dimension}
        backgroundColor={themed.trackColor ?? 0xdddddd}
        direction="stack"
        padding={0}
      >
        <View
          width={isVertical ? dimension : '100%'}
          height={isVertical ? '100%' : dimension}
          x={0}
          y={0}
          backgroundColor={themed.trackColor ?? 0xaaaaaa}
          enableGestures={true}
          onTouch={handleBackgroundTouch}
        />
        <View
          width={isVertical ? dimension : thumbSize}
          height={isVertical ? thumbSize : dimension}
          x={isVertical ? 0 : thumbPosition}
          y={isVertical ? thumbPosition : 0}
          backgroundColor={themed.thumbColor ?? 0xeeeebb}
          enableGestures={true}
          onTouchMove={handleThumbTouchMove}
        />
      </View>
    </View>
  )
}
