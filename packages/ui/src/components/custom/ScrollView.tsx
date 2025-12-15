/** @jsxImportSource ../.. */
/**
 * ScrollView component providing a scrollable area with optional sliders
 */
import Phaser from 'phaser'
import type { ViewProps } from '..'
import type { GestureEventData, WheelEventData } from '../../core-props'
import { useEffect, useRedraw, useRef, useState } from '../../hooks'
import { getRenderContext } from '../../render-context'
import { View } from '../index'
import { calculateSliderSize, ScrollSlider, type SliderSize } from './ScrollSlider'

/**
 * Scroll information data
 */
export interface ScrollInfo {
  /** Current horizontal scroll position */
  dx: number
  /** Current vertical scroll position */
  dy: number
  /** Viewport width */
  viewportWidth: number
  /** Viewport height */
  viewportHeight: number
  /** Content width */
  contentWidth: number
  /** Content height */
  contentHeight: number
  /** Maximum horizontal scroll */
  maxScrollX: number
  /** Maximum vertical scroll */
  maxScrollY: number
}

/**
 * Snap configuration types
 */
export type SnapMode = 'auto' | { positions: number[]; threshold?: number }
export type SnapAlignment = 'start' | 'center' | 'end'

/**
 * Props for ScrollView component
 */
export interface ScrollViewProps extends ViewProps {
  /** Whether to show the vertical scroll slider (default: auto) */
  showVerticalSlider?: boolean | 'auto' | undefined
  /** Whether to show the vertical scroll slider (default: auto) */
  showHorizontalSlider?: boolean | 'auto' | undefined
  /** Size variant for the scroll sliders */
  sliderSize?: SliderSize
  /** Initial scroll position */
  scroll?: { dx: number; dy: number }
  /** Callback when scroll information changes */
  onScrollInfoChange?: (info: ScrollInfo) => void
  /** Snap behavior: false (disabled), 'auto' (to items), or manual positions */
  snap?: boolean | SnapMode
  /** Alignment for snapping */
  snapAlignment?: SnapAlignment
  /** Threshold for snap (pixels) */
  snapThreshold?: number
  /** Enable momentum scrolling */
  momentum?: boolean
}

/**
 * ScrollView component providing a scrollable area with an optional vertical slider
 * @param props - ScrollView properties
 * @returns JSX element
 */
export function ScrollView(props: ScrollViewProps) {
  const {
    children,
    showVerticalSlider = 'auto',
    showHorizontalSlider = 'auto',
    scroll: initialScroll,
    onScrollInfoChange,
    snap = false,
    snapAlignment = 'start',
    snapThreshold = 20,
    momentum = true,
  } = props

  const [scroll, setScroll] = useState(initialScroll ?? { dx: 0, dy: 0 })

  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)

  const [contentHeight, setContentHeight] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  // State for momentum scrolling
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 })
  const [lastTime, setLastTime] = useState(0)
  const tweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  // Get slider size, considering size variant and theme
  const { outer: sliderSize } = calculateSliderSize(props.sliderSize)

  // Calculate if scrolling is needed
  const viewportHeight = viewportRef.current?.height ?? 0
  const viewportWidth = viewportRef.current?.width ?? 0
  const effectiveContentHeight = Math.max(contentHeight, viewportHeight)
  const effectiveContentWidth = Math.max(contentWidth, viewportWidth)

  // Use epsilon threshold to avoid floating-point precision issues
  const epsilon = 0.5
  const needsVerticalScroll = effectiveContentHeight > viewportHeight + epsilon
  const needsHorizontalScroll = effectiveContentWidth > viewportWidth + epsilon

  const showVerticalSliderActual =
    showVerticalSlider === true || (needsVerticalScroll && showVerticalSlider === 'auto')
  const showHorizontalSliderActual =
    showHorizontalSlider === true || (needsHorizontalScroll && showHorizontalSlider === 'auto')

  const maxScrollY = Math.max(0, effectiveContentHeight - viewportHeight)
  const maxScrollX = Math.max(0, effectiveContentWidth - viewportWidth)

  // Update scroll when props.scroll changes
  useEffect(() => {
    if (initialScroll) {
      setScroll(initialScroll)
    }
  }, [initialScroll])

  // Notify parent of scroll info changes
  useEffect(() => {
    if (onScrollInfoChange && viewportWidth > 0 && viewportHeight > 0) {
      onScrollInfoChange({
        dx: scroll.dx,
        dy: scroll.dy,
        viewportWidth,
        viewportHeight,
        contentWidth: effectiveContentWidth,
        contentHeight: effectiveContentHeight,
        maxScrollX,
        maxScrollY,
      })
    }
  }, [
    scroll,
    viewportWidth,
    viewportHeight,
    effectiveContentWidth,
    effectiveContentHeight,
    maxScrollX,
    maxScrollY,
  ])

  // Update content dimensions after layout
  useEffect(() => {
    const update = () => {
      if (contentRef.current) {
        const newHeight = contentRef.current.height
        const newWidth = contentRef.current.width
        if (newHeight !== contentHeight) {
          setContentHeight(newHeight)
        }
        if (newWidth !== contentWidth) {
          setContentWidth(newWidth)
        }
      }
      // Defer again for next layout
      if (contentRef.current?.scene) {
        getRenderContext(contentRef.current.scene).deferLayout(update)
      }
    }
    if (contentRef.current?.scene) {
      getRenderContext(contentRef.current.scene).deferLayout(update)
    }
  }, [])

  const calc = (deltaX: number, deltaY: number) => {
    if (!contentRef.current || !viewportRef.current) return

    // Get viewport and content dimensions
    const viewportHeight = viewportRef.current.height
    const viewportWidth = viewportRef.current.width
    const contentHeight = contentRef.current.height
    const contentWidth = contentRef.current.width
    // Calculate new scroll position
    const maxScrollY = Math.max(0, contentHeight - viewportHeight)
    const maxScrollX = Math.max(0, contentWidth - viewportWidth)
    const newScrollY = Math.max(0, Math.min(maxScrollY, scroll.dy - deltaY))
    const newScrollX = Math.max(0, Math.min(maxScrollX, scroll.dx - deltaX))

    setScroll({ dx: newScrollX, dy: newScrollY })
  }

  const startMomentum = () => {
    if (!contentRef.current?.scene) return

    const scene = contentRef.current.scene
    const duration = Math.min(1000, Math.max(200, Math.abs(velocity.vx) + Math.abs(velocity.vy))) // 200-1000ms
    const targetDx = Math.max(0, Math.min(maxScrollX, scroll.dx - velocity.vx * (duration / 1000)))
    const targetDy = Math.max(0, Math.min(maxScrollY, scroll.dy - velocity.vy * (duration / 1000)))

    tweenRef.current = scene.tweens.add({
      targets: { dx: scroll.dx, dy: scroll.dy },
      dx: targetDx,
      dy: targetDy,
      duration,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => {
        const target = tween.targets[0] as { dx: number; dy: number }
        setScroll({ dx: target.dx, dy: target.dy })
      },
      onComplete: () => {
        tweenRef.current = null
        // After momentum, apply snap if enabled
        if (snap) {
          applySnap()
        }
      },
    })
  }

  const getSnapPositions = (): { x: number[]; y: number[] } => {
    if (typeof snap === 'object' && 'positions' in snap) {
      // Manual positions - assume same for x/y if not specified
      return { x: snap.positions, y: snap.positions }
    }
    if (snap === 'auto' && contentRef.current) {
      // Auto: calculate from child heights (vertical) or widths (horizontal)
      const children = contentRef.current.list as Phaser.GameObjects.GameObject[]
      const yPositions: number[] = [0]
      let cumulativeY = 0
      for (const child of children) {
        if (child instanceof Phaser.GameObjects.Container) {
          cumulativeY += child.height
          yPositions.push(cumulativeY)
        }
      }
      // For horizontal, assume similar logic if needed
      return { x: [0], y: yPositions }
    }
    return { x: [], y: [] }
  }

  const findNearestSnap = (current: number, positions: number[], viewportSize: number): number => {
    let nearest = current
    let minDistance = Infinity
    for (const pos of positions) {
      let adjustedPos = pos
      if (snapAlignment === 'center') {
        adjustedPos = pos - viewportSize / 2
      } else if (snapAlignment === 'end') {
        adjustedPos = pos - viewportSize
      }
      adjustedPos = Math.max(0, Math.min(maxScrollX || maxScrollY || 0, adjustedPos))
      const distance = Math.abs(current - adjustedPos)
      if (distance < minDistance && distance <= snapThreshold) {
        minDistance = distance
        nearest = adjustedPos
      }
    }
    return nearest
  }

  const applySnap = () => {
    if (!contentRef.current?.scene || !snap) return

    const positions = getSnapPositions()
    const viewportHeight = viewportRef.current?.height ?? 0
    const viewportWidth = viewportRef.current?.width ?? 0

    const targetDx = findNearestSnap(scroll.dx, positions.x, viewportWidth)
    const targetDy = findNearestSnap(scroll.dy, positions.y, viewportHeight)

    if (targetDx !== scroll.dx || targetDy !== scroll.dy) {
      const scene = contentRef.current.scene
      tweenRef.current = scene.tweens.add({
        targets: { dx: scroll.dx, dy: scroll.dy },
        dx: targetDx,
        dy: targetDy,
        duration: 300,
        ease: 'Quad.easeOut',
        onUpdate: (tween) => {
          const target = tween.targets[0] as { dx: number; dy: number }
          setScroll({ dx: target.dx, dy: target.dy })
        },
        onComplete: () => {
          tweenRef.current = null
        },
      })
    }
  }

  const handleVerticalScroll = (scrollPos: number) => {
    const clampedScrollPos = Math.max(0, Math.min(maxScrollY, scrollPos))
    setScroll((prev) => ({ ...prev, dy: clampedScrollPos }))
  }

  const handleHorizontalScroll = (scrollPos: number) => {
    const clampedScrollPos = Math.max(0, Math.min(maxScrollX, scrollPos))
    setScroll((prev) => ({ ...prev, dx: clampedScrollPos }))
  }

  const handleTouchMove = (data: GestureEventData) => {
    // Process start and move events, ignore end
    if (data.state === 'end') {
      if (momentum && (Math.abs(velocity.vx) > 0.1 || Math.abs(velocity.vy) > 0.1)) {
        startMomentum()
      }
      return
    }
    data.stopPropagation()

    const deltaX = data.dx ?? 0
    const deltaY = data.dy ?? 0

    // Calculate velocity for momentum
    const now = Date.now()
    const deltaTime = now - lastTime
    if (deltaTime > 0) {
      const newVx = (deltaX / deltaTime) * 1000 // pixels per second
      const newVy = (deltaY / deltaTime) * 1000
      setVelocity({ vx: newVx, vy: newVy })
      setLastTime(now)
    }

    calc(deltaX, deltaY)
  }

  const handleWheel = (data: WheelEventData) => {
    data.stopPropagation()
    data.preventDefault()

    calc(data.deltaX, data.deltaY)
  }

  // Force redraw after mount to ensure dimensions are calculated
  // and show content after that to avoid visual glitches
  const redraw = useRedraw()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Force multiple redraws to ensure container dimensions are properly calculated
    // First redraw after initial mount
    const timer1 = setTimeout(() => redraw(), 0)
    // Second redraw to catch any layout adjustments and slider dimensions
    const timer2 = setTimeout(() => setVisible(true), 2)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [showVerticalSliderActual, showHorizontalSliderActual])

  return (
    <View visible={visible}>
      <View direction="row" width="100%" height="100%" gap={0} padding={0}>
        {/* ScrollView takes remaining space */}
        <View flex={1} height={'100%'} direction="column">
          <View
            ref={viewportRef}
            flex={1}
            width="100%"
            //backgroundColor={0x0000ff}
            //backgroundAlpha={0.3}
            onTouchMove={handleTouchMove}
            onWheel={handleWheel}
            overflow="hidden"
            direction="stack"
          >
            {/* main scroll view area, can be greater than parent */}
            <View ref={contentRef} x={-scroll.dx} y={-scroll.dy}>
              {children}
            </View>

            {/* Invisible blocker overlay - same size as content, scrolls with content
                Blocks touches to masked content outside visible viewport area */}
            <View
              width={effectiveContentWidth}
              height={effectiveContentHeight}
              x={-scroll.dx}
              y={-scroll.dy}
              enableGestures={true}
              backgroundAlpha={0}
              onTouch={(data) => {
                const viewport = viewportRef.current
                if (!viewport) return

                // Get viewport world position using transform matrix
                const worldMatrix = viewport.getWorldTransformMatrix()
                const vpWorldX = worldMatrix.tx
                const vpWorldY = worldMatrix.ty

                // Get viewport size from layout
                const vpSize = (
                  viewport as unknown as {
                    __getLayoutSize?: () => { width: number; height: number }
                  }
                ).__getLayoutSize?.() ?? {
                  width: viewportWidth,
                  height: viewportHeight,
                }

                // Get touch position in world coordinates
                const touchX = data.pointer?.worldX ?? 0
                const touchY = data.pointer?.worldY ?? 0

                // Check if touch is within viewport bounds
                // Use small epsilon for floating point comparison
                const epsilon = 0.1
                const inBounds =
                  touchX >= vpWorldX - epsilon &&
                  touchX <= vpWorldX + vpSize.width + epsilon &&
                  touchY >= vpWorldY - epsilon &&
                  touchY <= vpWorldY + vpSize.height + epsilon

                if (!inBounds) {
                  // Touch outside viewport - block it
                  data.stopPropagation()
                }
                // If in bounds, let it pass through to children below
              }}
            />
          </View>
          {/* Horizontal slider at the bottom */}
          <View visible={showHorizontalSliderActual ? true : 'none'}>
            <ScrollSlider
              direction="horizontal"
              size={props.sliderSize}
              scrollPosition={scroll.dx}
              viewportSize={viewportWidth}
              contentSize={contentWidth}
              onScroll={handleHorizontalScroll}
              momentum={momentum}
            />
          </View>
        </View>

        {/* Vertical slider on the right */}
        <View height={'100%'} direction="column" visible={showVerticalSliderActual ? true : 'none'}>
          <View flex={1}>
            <ScrollSlider
              direction="vertical"
              size={props.sliderSize}
              scrollPosition={scroll.dy}
              viewportSize={viewportHeight}
              contentSize={effectiveContentHeight}
              onScroll={handleVerticalScroll}
              momentum={momentum}
            />
          </View>
          {showHorizontalSliderActual && (
            // Placeholder corner for potential icon - matches slider dimensions
            <View
              width={sliderSize}
              height={sliderSize}
              //backgroundAlpha={0.3}
              //backgroundColor={0xff0000}
            />
          )}
        </View>
      </View>
    </View>
  )
}
