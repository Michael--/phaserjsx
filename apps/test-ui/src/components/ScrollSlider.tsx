/**
 * ScrollSlider component for scrollable content areas
 */
import type { GestureEventData } from '@phaserjsx/ui'
import { getThemedProps, useRef, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

// Module augmentation to add ScrollSlider theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    ScrollSlider: {
      thumbColor?: number
      trackColor?: number
      minThumbSize?: number
      borderWidth?: number
    }
  }
}

/**
 * Props for ScrollSlider component
 */
export interface ScrollSliderProps {
  /** Direction of the slider */
  direction: 'vertical' | 'horizontal'
  /** Size of the track */
  trackSize: number
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

  const isVertical = direction === 'vertical'
  const scrollPercent = isVertical ? scrollInfo.scrollY : scrollInfo.scrollX
  const sizePercent = isVertical ? scrollInfo.height : scrollInfo.width

  const minThumbSize = themed.minThumbSize ?? 20
  const thumbSize = Math.max(minThumbSize, (trackSize * sizePercent) / 100)
  const thumbPosition = (scrollPercent / 100) * (trackSize - thumbSize)

  const handleThumbTouchMove = (data: GestureEventData) => {
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
    const trackRange = trackSize - thumbSize
    const currentThumbPos = (scrollPercent / 100) * trackRange
    const newThumbPos = Math.max(0, Math.min(trackRange, currentThumbPos + delta))
    const newScrollPercent = trackRange > 0 ? (newThumbPos / trackRange) * 100 : 0

    onScroll(newScrollPercent)
  }

  const handleBackgroundTouch = (data: { localX?: number; localY?: number }) => {
    const localPos = isVertical ? (data.localY ?? 0) : (data.localX ?? 0)
    const effectiveSize = trackSize - 2
    const normalizedPos = (localPos - 1) / effectiveSize
    const targetScrollPercent = Math.max(0, Math.min(100, normalizedPos * 100))
    onScroll(targetScrollPercent)
  }

  return (
    <View
      ref={sliderRef}
      width={isVertical ? 24 : trackSize}
      height={isVertical ? trackSize : 24}
      backgroundColor={themed.trackColor ?? 0xdddddd}
      direction="stack"
      padding={themed.borderWidth ?? 1}
    >
      <View
        width={'fill'}
        height={'fill'}
        backgroundColor={0xaaaaaa}
        enableGestures={true}
        onTouch={handleBackgroundTouch}
      />
      <View
        width={isVertical ? 'fill' : thumbSize}
        height={isVertical ? thumbSize : 'fill'}
        x={isVertical ? (themed.borderWidth ?? 1) : thumbPosition}
        y={isVertical ? thumbPosition : (themed.borderWidth ?? 1)}
        backgroundColor={themed.thumbColor ?? 0xeeeebb}
        enableGestures={true}
        onTouchMove={handleThumbTouchMove}
      />
    </View>
  )
}
