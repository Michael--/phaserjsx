/**
 * ScrollView component for scrollable content areas
 */
import type { GestureEventData, VNode } from '@phaserjsx/ui'
import { useEffect, useRef, useState, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

/**
 * Props for ScrollView component
 */
export interface ScrollViewProps {
  /** Children to render inside scrollable content, allow only one child */
  children?: VNode
  /** Initial scroll position */
  scroll?: { dx: number; dy: number }
  /** Called when scroll position changes
   * @param scrollXPercent - Horizontal scroll position in percent (0 = left, 100 = right)
   * @param scrollYPercent - Vertical scroll position in percent (0 = top, 100 = bottom)
   * @param viewportWidth - Width of the viewport in pixels
   * @param viewportHeight - Height of the viewport in pixels
   * @param contentWidth - Width of the content in pixels
   * @param contentHeight - Height of the content in pixels
   */
  onScroll?: (
    scrollXPercent: number,
    scrollYPercent: number,
    viewportWidth: number,
    viewportHeight: number,
    contentWidth: number,
    contentHeight: number
  ) => void
}

/**
 * ScrollView component providing drag-to-scroll functionality
 * Scrolling is done by dragging the content area with automatic calculation of scroll positions
 * Both horizontal and vertical scrolling are supported (auto-detected on its size).
 * @param props - ScrollView properties
 * @returns JSX element
 */
export function ScrollView(props: ScrollViewProps) {
  const { children, onScroll, scroll: initialScroll } = props
  const [scroll, setScroll] = useState(initialScroll || { dx: 0, dy: 0 })
  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)

  useEffect(() => {
    if (initialScroll) {
      setScroll(initialScroll)
    }
  }, [initialScroll])

  useEffect(() => {
    setTimeout(() => {
      calc(0, 0)
    }, 0)
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
    const newScrollYPercent = maxScrollY != 0 ? (newScrollY / maxScrollY) * 100 : 0
    const newScrollXPercent = maxScrollX != 0 ? (newScrollX / maxScrollX) * 100 : 0

    setScroll({ dx: newScrollX, dy: newScrollY })
    onScroll?.(
      newScrollXPercent,
      newScrollYPercent,
      viewportWidth,
      viewportHeight,
      contentWidth,
      contentHeight
    )
  }

  const handleTouchMove = (data: GestureEventData) => {
    // Process start and move events, ignore end
    if (data.state === 'end') return

    const deltaX = data.dx ?? 0
    const deltaY = data.dy ?? 0

    calc(deltaX, deltaY)
  }

  return (
    <View
      ref={viewportRef}
      padding={0}
      direction="stack"
      width="fill"
      height="fill"
      backgroundAlpha={0.0}
      enableGestures={true}
      onTouchMove={handleTouchMove}
      overflow="hidden"
    >
      {/** B: next view is the dynamic sized content which could be scrolled in parent, when size is bigger then parent */}
      <View ref={contentRef} x={-scroll.dx} y={-scroll.dy} backgroundColor={0x888888} padding={0}>
        {children}
      </View>
    </View>
  )
}
