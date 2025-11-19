/**
 * ScrollSlider component for scrollable content areas
 */
import type * as PhaserJSX from '@phaserjsx/ui'
import type { GestureEventData } from '@phaserjsx/ui'
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

  const border = themed.borderWidth ?? 1
  const outer = themed.size ?? 24
  const dimension = outer - border * 2
  const trackSizeInner = trackSize - border * 2
  const minThumbSize = themed.minThumbSize ?? 20
  const thumbSize = Math.max(minThumbSize, (trackSizeInner * sizePercent) / 100)
  const thumbRange = trackSizeInner - thumbSize
  const thumbPosition = (scrollPercent / 100) * thumbRange

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
    const currentThumbPos = (scrollPercent / 100) * thumbRange
    const newThumbPos = Math.max(0, Math.min(thumbRange, currentThumbPos + delta))
    const newScrollPercent = thumbRange > 0 ? (newThumbPos / thumbRange) * 100 : 0

    onScroll(newScrollPercent)
  }

  const handleBackgroundTouch = (data: { localX?: number; localY?: number }) => {
    const localPos = isVertical ? (data.localY ?? 0) : (data.localX ?? 0)
    const effectiveSize = trackSizeInner
    const normalizedPos = Math.max(0, Math.min(1, localPos / effectiveSize))
    const targetScrollPercent = normalizedPos * 100
    onScroll(targetScrollPercent)
  }

  return (
    <View
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
          width={'fill'}
          height={'fill'}
          backgroundColor={themed.trackColor ?? 0xaaaaaa}
          enableGestures={true}
          onTouch={handleBackgroundTouch}
        />
        <View
          width={isVertical ? 'fill' : thumbSize}
          height={isVertical ? thumbSize : 'fill'}
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
