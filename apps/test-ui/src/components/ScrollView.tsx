/**
 * ScrollView component for scrollable content areas
 */
import type { ChildrenType } from '@phaserjsx/ui'
import { useRef, useState, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

/**
 * Props for ScrollView component
 */
export interface ScrollViewProps {
  /** Width of the scroll viewport */
  width?: number | string
  /** Height of the scroll viewport */
  height?: number | string
  /** Gap between children in the content area */
  gap?: number
  /** Children to render inside scrollable content */
  children?: ChildrenType
  /** Called when scroll position changes */
  onScroll?: (scrollY: number) => void
}

/**
 * ScrollView component providing drag-to-scroll functionality
 * @param props - ScrollView properties
 * @returns JSX element
 */
export function ScrollView(props: ScrollViewProps) {
  const { width, height, gap = 0, children, onScroll } = props
  const [scrollY, setScrollY] = useState(0)
  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)
  const lastPointerYRef = useRef(0)
  const startButtonRef = useRef<number>(0)

  const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    isDraggingRef.current = true
    lastPointerYRef.current = pointer.y
    startButtonRef.current = pointer.button
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  const handlePointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!isDraggingRef.current) return

    // Check if pointer is actually down - stops dragging if button was released outside
    if (!pointer.isDown) {
      isDraggingRef.current = false
      return
    }

    // Check button consistency - if different button, stop dragging
    if (pointer.button !== startButtonRef.current) {
      isDraggingRef.current = false
      return
    }

    if (!contentRef.current || !viewportRef.current) return

    const deltaY = pointer.y - lastPointerYRef.current
    lastPointerYRef.current = pointer.y

    // Get viewport and content heights
    const viewportHeight = viewportRef.current.height
    const contentHeight = contentRef.current.height

    // Calculate new scroll position
    const maxScroll = Math.max(0, contentHeight - viewportHeight)
    const newScrollY = Math.max(0, Math.min(maxScroll, scrollY - deltaY))

    setScrollY(newScrollY)
    onScroll?.(newScrollY)
  }

  const handleContentRef = (container: Phaser.GameObjects.Container | null) => {
    contentRef.current = container
  }

  const handleViewportRef = (container: Phaser.GameObjects.Container | null) => {
    viewportRef.current = container
  }

  return (
    <View
      ref={handleViewportRef}
      direction="stack"
      width={width}
      height={height}
      backgroundColor={0x555555}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      overflow="hidden"
    >
      {/** B: next view is the dynamic sized content which could be scrolled in parent, when size is bigger then parent */}
      <View
        ref={handleContentRef}
        x={0}
        y={-scrollY}
        width={'100%'}
        backgroundColor={0x888888}
        gap={gap}
      >
        {children}
      </View>
    </View>
  )
}
