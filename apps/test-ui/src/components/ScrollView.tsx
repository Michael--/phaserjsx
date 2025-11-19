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
  /** Called when scroll position changes, values are in percent 0..100
   * @param scrollX - Horizontal scroll position in percent (0 = left, 100 = right)
   * @param scrollWidth - Total scrollable width size, 100 means the slider fills the viewport
   * @param scrollHeight - Total scrollable height, 100 means the slider fills the viewport
   */
  onScroll?: (scrollX: number, scrollY: number, scrollWidth: number, scrollHeight: number) => void
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

    // Calculate scrollbar size percentages
    const scrollWidthPercent = contentWidth > 0 ? (viewportWidth / contentWidth) * 100 : 100
    const scrollHeightPercent = contentHeight > 0 ? (viewportHeight / contentHeight) * 100 : 100

    setScroll({ dx: newScrollX, dy: newScrollY })
    onScroll?.(newScrollXPercent, newScrollYPercent, scrollWidthPercent, scrollHeightPercent)
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
      backgroundColor={0x555555}
      backgroundAlpha={1.0}
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
