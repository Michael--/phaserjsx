/**
 * ScrollSlider component for scrollable content areas
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import type { GestureEventData, LayoutSize, SizeValue } from '@phaserjsx/ui'
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
  /** Size of the track - can be number (pixels) or string ("100vh", "50%", etc.) */
  trackSize: SizeValue
  /** Scroll information from ScrollView */
  scrollInfo: { scrollX: number; scrollY: number; width: number; height: number }
  /** Callback when slider is scrolled */
  onScroll: (percent: number) => void
}

/**
 * ScrollSlider component providing slider functionality for ScrollView
 * @param props - ScrollSlider properties
 * @returns JSX element
 */
export function ScrollSlider(props: ScrollSliderProps) {
  const { direction, trackSize, scrollInfo, onScroll } = props
  const { props: themed } = getThemedProps('ScrollSlider', undefined, {})
  const sliderRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)
  const trackContainerRef = useRef<Phaser.GameObjects.Container | null>(null)

  const isVertical = direction === 'vertical'
  const scrollPercent = isVertical ? scrollInfo.scrollY : scrollInfo.scrollX
  const sizePercent = isVertical ? scrollInfo.height : scrollInfo.width

  const border = themed.borderWidth ?? 1
  const outer = themed.size ?? 24
  const dimension = outer - border * 2

  // Get actual resolved track size from the container after layout
  // Use __getLayoutSize if available (more reliable than container.width/height)
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
      : typeof trackSize === 'number'
        ? trackSize
        : 800 // fallback

  const trackSizeInner = resolvedTrackSize - border * 2
  const minThumbSize = themed.minThumbSize ?? 20
  const thumbSize = Math.max(minThumbSize, (trackSizeInner * sizePercent) / 100)
  const thumbRange = trackSizeInner - thumbSize
  const thumbPosition = (scrollPercent / 100) * thumbRange

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
    const currentThumbPos = (scrollPercent / 100) * thumbRange
    const newThumbPos = Math.max(0, Math.min(thumbRange, currentThumbPos + delta))
    const newScrollPercent = thumbRange > 0 ? (newThumbPos / thumbRange) * 100 : 0

    onScroll(newScrollPercent)
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

    // Calculate scroll percent from thumb position
    const targetScrollPercent = thumbRange > 0 ? (targetThumbPos / thumbRange) * 100 : 0

    onScroll(Math.max(0, Math.min(100, targetScrollPercent)))
  }

  return (
    <View
      ref={trackContainerRef}
      width={isVertical ? outer : trackSize}
      height={isVertical ? trackSize : outer}
      backgroundColor={themed.borderColor ?? 0x000000}
      padding={border}
    >
      <View
        ref={sliderRef}
        width={isVertical ? dimension : trackSizeInner}
        height={isVertical ? trackSizeInner : dimension}
        backgroundColor={themed.trackColor ?? 0xdddddd}
        direction="stack"
        padding={0}
      >
        <View
          width={isVertical ? dimension : trackSizeInner}
          height={isVertical ? trackSizeInner : dimension}
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
