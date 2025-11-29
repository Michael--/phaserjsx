/** @jsxImportSource ../.. */
/**
 * ScrollSlider component for scrollable content areas
 */
import type Phaser from 'phaser'
import type { GestureEventData } from '../../core-props'
import { useRef } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { LayoutSize } from '../index'
import { View } from '../index'

/** Size variants for the scroll slider */
export type SliderSize = 'large' | 'medium' | 'small' | 'tiny' | undefined

/**
 * Calculate slider dimensions based on size variant and theme
 * @param size - Size variant
 * @returns Calculated dimensions
 */
export function calculateSliderSize(size: SliderSize) {
  const { props: themed } = getThemedProps('ScrollSlider', undefined, {})
  const sizeFactor = size === 'large' ? 1.25 : size === 'small' ? 0.75 : size === 'tiny' ? 0.5 : 1 // medium or undefined
  const border = (themed.borderWidth ?? 1) * sizeFactor
  const outer = (themed.size ?? 24) * sizeFactor
  const dimension = outer - border * 2

  return { border, outer, dimension }
}

/**
 * Props for ScrollSlider component
 */
export interface ScrollSliderProps {
  /** Direction of the slider */
  direction: 'vertical' | 'horizontal'
  /** Whether to a size variant, default is medium */
  size?: SliderSize
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
  const { border, outer, dimension } = calculateSliderSize(props.size)

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
