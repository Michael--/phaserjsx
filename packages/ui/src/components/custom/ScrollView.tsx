/** @jsxImportSource ../.. */
/**
 * ScrollView component providing a scrollable area with optional sliders
 */
import Phaser from 'phaser'
import type { ViewProps } from '..'
import type { GestureEventData, WheelEventData } from '../../core-props'
import { useEffect, useRedraw, useRef, useState } from '../../hooks'
import { getRenderContext } from '../../render-context'
import type { VNodeLike } from '../../vdom'
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
export type SnapMode = { positions: number[]; threshold?: number }
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
  /** Initial scroll position; with snap enabled you can optionally set snapIndex instead of dx/dy */
  scroll?: { dx?: number | undefined; dy?: number | undefined; snapIndex?: number | undefined }
  /** Callback when scroll information changes */
  onScrollInfoChange?: (info: ScrollInfo) => void
  /** Snap behavior: false (disabled), 'auto' (to items), or manual positions */
  snap?: SnapMode | undefined
  /** Alignment for snapping */
  snapAlignment?: SnapAlignment
  /** Threshold for snap (pixels) */
  snapThreshold?: number
  /** Enable momentum scrolling */
  momentum?: boolean
  /** Callback fired when snapping lands on a target (index is from snap.positions) */
  onSnap?: (index: number) => void
}

/**
 * ScrollView component providing a scrollable area with an optional vertical slider
 * @param props - ScrollView properties
 * @returns JSX element
 */
export function ScrollView(props: ScrollViewProps): VNodeLike {
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
    onSnap,
  } = props

  const [scroll, setScroll] = useState({
    dx: initialScroll?.dx ?? 0,
    dy: initialScroll?.dy ?? 0,
  })
  const scrollRef = useRef(scroll)
  const hasMountedRef = useRef(false)
  const lastAppliedSnapIndexRef = useRef<number | undefined>(initialScroll?.snapIndex)

  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)

  const [contentHeight, setContentHeight] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  // State for momentum scrolling
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 })
  const [lastTime, setLastTime] = useState(0)
  const tweenRef = useRef<Phaser.Tweens.Tween | null>(null)
  const wheelSnapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const WHEEL_SNAP_DELAY = 200

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

  const updateScroll = (
    value:
      | { dx: number; dy: number }
      | ((prev: { dx: number; dy: number }) => { dx: number; dy: number })
  ) => {
    setScroll((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      scrollRef.current = next
      return next
    })
  }

  const stopActiveTween = () => {
    if (tweenRef.current) {
      tweenRef.current.stop()
      tweenRef.current = null
    }
  }

  const resolvedSnapThreshold =
    typeof snap === 'object' && 'positions' in snap
      ? (snap.threshold ?? snapThreshold)
      : snapThreshold
  const effectiveSnapThreshold =
    resolvedSnapThreshold === undefined || resolvedSnapThreshold < 0
      ? Infinity
      : resolvedSnapThreshold

  // Update scroll when props.scroll changes or when layout info is available
  useEffect(() => {
    if (!initialScroll) return
    // console.log('ScrollView: applying initial scroll', initialScroll)
    const allowAnimate = hasMountedRef.current

    // If snapIndex is provided and manual snap positions are used, align to that index
    if (snap && typeof snap === 'object' && 'positions' in snap) {
      const { x: xTargets, y: yTargets } = getSnapTargets()
      const hasTargets = xTargets.length > 0 || yTargets.length > 0

      if (initialScroll.snapIndex !== undefined && hasTargets) {
        const maxIdx = Math.max(xTargets.length, yTargets.length) - 1
        const clampedIdx = Math.max(0, Math.min(initialScroll.snapIndex, maxIdx))

        const targetX = xTargets[clampedIdx]
        const targetY = yTargets[clampedIdx]

        const nextDx =
          targetX !== undefined
            ? alignTargetPosition(targetX, viewportWidth, maxScrollX)
            : (initialScroll.dx ?? scrollRef.current.dx)
        const nextDy =
          targetY !== undefined
            ? alignTargetPosition(targetY, viewportHeight, maxScrollY)
            : (initialScroll.dy ?? scrollRef.current.dy)

        const shouldAnimate =
          allowAnimate &&
          (clampedIdx !== lastAppliedSnapIndexRef.current ||
            Math.abs(scrollRef.current.dx - nextDx) > 0.5 ||
            Math.abs(scrollRef.current.dy - nextDy) > 0.5)

        lastAppliedSnapIndexRef.current = clampedIdx

        if (shouldAnimate && contentRef.current?.scene) {
          stopActiveTween()
          const scene = contentRef.current.scene
          tweenRef.current = scene.tweens.add({
            targets: { dx: scrollRef.current.dx, dy: scrollRef.current.dy },
            dx: nextDx,
            dy: nextDy,
            duration: 220,
            ease: 'Quad.easeOut',
            onUpdate: (tween) => {
              const target = tween.targets[0] as { dx: number; dy: number }
              updateScroll({ dx: target.dx, dy: target.dy })
            },
            onComplete: () => {
              tweenRef.current = null
              if (onSnap) {
                onSnap(clampedIdx)
              }
            },
          })
        } else {
          updateScroll({ dx: nextDx, dy: nextDy })
          if (onSnap) {
            onSnap(clampedIdx)
          }
        }
        hasMountedRef.current = true
        return
      }
    }

    // Fallback to provided dx/dy: TODO: what if when only one of dx/dy is provided? Animation ?
    if (initialScroll.dx !== undefined && initialScroll.dy !== undefined) {
      const nextDx = initialScroll.dx
      const nextDy = initialScroll.dy
      const shouldAnimate =
        allowAnimate &&
        (Math.abs(scrollRef.current.dx - nextDx) > 0.5 ||
          Math.abs(scrollRef.current.dy - nextDy) > 0.5)

      if (shouldAnimate && contentRef.current?.scene) {
        stopActiveTween()
        const scene = contentRef.current.scene
        tweenRef.current = scene.tweens.add({
          targets: { dx: scrollRef.current.dx, dy: scrollRef.current.dy },
          dx: nextDx,
          dy: nextDy,
          duration: 220,
          ease: 'Quad.easeOut',
          onUpdate: (tween) => {
            const target = tween.targets[0] as { dx: number; dy: number }
            updateScroll({ dx: target.dx, dy: target.dy })
          },
          onComplete: () => {
            tweenRef.current = null
          },
        })
      } else {
        updateScroll({ dx: nextDx, dy: nextDy })
      }
    }

    hasMountedRef.current = true
  }, [initialScroll, snap, viewportWidth, viewportHeight, maxScrollX, maxScrollY])

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

    updateScroll({ dx: newScrollX, dy: newScrollY })
  }

  const startMomentum = () => {
    if (!contentRef.current?.scene) return

    const scene = contentRef.current.scene
    const duration = Math.min(1000, Math.max(200, Math.abs(velocity.vx) + Math.abs(velocity.vy))) // 200-1000ms
    const currentScroll = scrollRef.current
    const baseTargetDx = Math.max(
      0,
      Math.min(maxScrollX, currentScroll.dx - velocity.vx * (duration / 1000))
    )
    const baseTargetDy = Math.max(
      0,
      Math.min(maxScrollY, currentScroll.dy - velocity.vy * (duration / 1000))
    )
    const snappedTarget = snap ? calculateSnapDestination(baseTargetDx, baseTargetDy) : null

    stopActiveTween()

    tweenRef.current = scene.tweens.add({
      targets: { dx: currentScroll.dx, dy: currentScroll.dy },
      dx: snappedTarget?.dx ?? baseTargetDx,
      dy: snappedTarget?.dy ?? baseTargetDy,
      duration,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => {
        const target = tween.targets[0] as { dx: number; dy: number }
        updateScroll({ dx: target.dx, dy: target.dy })
      },
      onComplete: () => {
        tweenRef.current = null
        if (snappedTarget && snappedTarget.index >= 0 && onSnap) {
          onSnap(snappedTarget.index)
        }
      },
    })
  }

  type SnapTarget = { position: number; size: number }

  const getSnapTargets = (): { x: SnapTarget[]; y: SnapTarget[] } => {
    const viewportHeightCurrent = viewportRef.current?.height ?? viewportHeight
    const viewportWidthCurrent = viewportRef.current?.width ?? viewportWidth

    if (typeof snap === 'object' && 'positions' in snap) {
      const sorted = [...snap.positions].sort((a, b) => a - b)
      const inferredSizeY =
        sorted.length > 1
          ? Math.max(0, (sorted[1] ?? 0) - (sorted[0] ?? 0))
          : viewportHeightCurrent || 0
      const inferredSizeX =
        sorted.length > 1
          ? Math.max(0, (sorted[1] ?? 0) - (sorted[0] ?? 0))
          : viewportWidthCurrent || 0
      const targetsX = sorted.map((position, index) => {
        const next = sorted[index + 1]
        const size =
          next !== undefined
            ? Math.max(0, next - position)
            : inferredSizeX > 0
              ? inferredSizeX
              : viewportWidthCurrent || 0
        return { position, size }
      })
      const targetsY = sorted.map((position, index) => {
        const next = sorted[index + 1]
        const size =
          next !== undefined
            ? Math.max(0, next - position)
            : inferredSizeY > 0
              ? inferredSizeY
              : viewportHeightCurrent || 0
        return { position, size }
      })
      return { x: targetsX, y: targetsY }
    }

    return { x: [], y: [] }
  }

  const findNearestSnap = (
    current: number,
    targets: SnapTarget[],
    viewportSize: number,
    maxScroll: number
  ): { position: number; index: number } => {
    if (targets.length === 0) return { position: current, index: -1 }

    let nearest = current
    let minDistance = Infinity
    let nearestIndex = -1

    for (let index = 0; index < targets.length; index++) {
      const { position, size } = targets[index] ?? { position: 0, size: 0 }
      let adjustedPos = position

      if (snapAlignment === 'center') {
        adjustedPos = position + size / 2 - viewportSize / 2
      } else if (snapAlignment === 'end') {
        adjustedPos = position + size - viewportSize
      }

      adjustedPos = Math.max(0, Math.min(maxScroll, adjustedPos))
      const distance = Math.abs(current - adjustedPos)

      if (distance < minDistance && distance <= effectiveSnapThreshold) {
        minDistance = distance
        nearest = adjustedPos
        nearestIndex = index
      } else if (distance < minDistance && effectiveSnapThreshold === Infinity) {
        minDistance = distance
        nearest = adjustedPos
        nearestIndex = index
      }
    }

    return { position: nearest, index: nearestIndex }
  }

  const calculateSnapDestination = (baseDx: number, baseDy: number) => {
    const { x: xTargets, y: yTargets } = getSnapTargets()
    const viewportHeightLocal = viewportRef.current?.height ?? 0
    const viewportWidthLocal = viewportRef.current?.width ?? 0

    const snapX = findNearestSnap(baseDx, xTargets, viewportWidthLocal, maxScrollX)
    const snapY = findNearestSnap(baseDy, yTargets, viewportHeightLocal, maxScrollY)

    // Prefer Y index if available, otherwise X
    const snapIndex = snapY.index >= 0 ? snapY.index : snapX.index

    return { dx: snapX.position, dy: snapY.position, index: snapIndex }
  }

  const alignTargetPosition = (target: SnapTarget, viewportSize: number, maxScroll: number) => {
    let adjustedPos = target.position
    if (snapAlignment === 'center') {
      adjustedPos = target.position + target.size / 2 - viewportSize / 2
    } else if (snapAlignment === 'end') {
      adjustedPos = target.position + target.size - viewportSize
    }
    return Math.max(0, Math.min(maxScroll, adjustedPos))
  }

  const applySnap = () => {
    if (!contentRef.current?.scene || !snap) return

    const currentScroll = scrollRef.current
    const {
      dx: targetDx,
      dy: targetDy,
      index: snapIndex,
    } = calculateSnapDestination(currentScroll.dx, currentScroll.dy)

    if (targetDx === currentScroll.dx && targetDy === currentScroll.dy) {
      if (snapIndex >= 0 && onSnap) {
        onSnap(snapIndex)
      }
      return
    }

    const scene = contentRef.current.scene
    stopActiveTween()

    tweenRef.current = scene.tweens.add({
      targets: { dx: currentScroll.dx, dy: currentScroll.dy },
      dx: targetDx,
      dy: targetDy,
      duration: 250,
      ease: 'Quad.easeOut',
      onUpdate: (tween) => {
        const target = tween.targets[0] as { dx: number; dy: number }
        updateScroll({ dx: target.dx, dy: target.dy })
      },
      onComplete: () => {
        tweenRef.current = null
        if (snapIndex >= 0 && onSnap) {
          onSnap(snapIndex)
        }
      },
    })
  }

  const handleVerticalScroll = (scrollPos: number) => {
    const clampedScrollPos = Math.max(0, Math.min(maxScrollY, scrollPos))
    updateScroll((prev) => ({ ...prev, dy: clampedScrollPos }))
  }

  const handleHorizontalScroll = (scrollPos: number) => {
    const clampedScrollPos = Math.max(0, Math.min(maxScrollX, scrollPos))
    updateScroll((prev) => ({ ...prev, dx: clampedScrollPos }))
  }

  const handleSliderMomentumEnd = () => {
    if (snap) {
      applySnap()
    }
  }

  const handleTouchMove = (data: GestureEventData) => {
    // Process start and move events, ignore end
    if (data.state === 'end') {
      if (momentum && (Math.abs(velocity.vx) > 0.1 || Math.abs(velocity.vy) > 0.1)) {
        startMomentum()
      } else if (snap) {
        applySnap()
      }
      return
    }
    if (data.state === 'start') {
      stopActiveTween()
      setVelocity({ vx: 0, vy: 0 })
      setLastTime(Date.now())
      data.stopPropagation()
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

    stopActiveTween()
    calc(-data.deltaX, -data.deltaY)

    if (snap) {
      if (wheelSnapTimeoutRef.current) {
        clearTimeout(wheelSnapTimeoutRef.current)
      }
      wheelSnapTimeoutRef.current = setTimeout(() => applySnap(), WHEEL_SNAP_DELAY)
    }
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
      if (wheelSnapTimeoutRef.current) {
        clearTimeout(wheelSnapTimeoutRef.current)
      }
      stopActiveTween()
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
              onMomentumEnd={handleSliderMomentumEnd}
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
              onMomentumEnd={handleSliderMomentumEnd}
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
