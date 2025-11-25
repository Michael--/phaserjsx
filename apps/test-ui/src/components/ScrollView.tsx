import {
  useEffect,
  useRedraw,
  useRef,
  useState,
  View,
  type GestureEventData,
  type ViewProps,
} from '@phaserjsx/ui'
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
  } = props

  const [scroll, setScroll] = useState(initialScroll ?? { dx: 0, dy: 0 })

  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)

  // Get slider size, considering size variant and theme
  const { outer: sliderSize } = calculateSliderSize(props.sliderSize)

  // Calculate if scrolling is needed
  const viewportHeight = viewportRef.current?.height ?? 0
  const viewportWidth = viewportRef.current?.width ?? 0
  const contentHeight = Math.max(contentRef.current?.height ?? 0, viewportHeight)
  const contentWidth = Math.max(contentRef.current?.width ?? 0, viewportWidth)

  const needsVerticalScroll = contentHeight > viewportHeight
  const needsHorizontalScroll = contentWidth > viewportWidth

  const showVerticalSliderActual =
    showVerticalSlider === true || (needsVerticalScroll && showVerticalSlider === 'auto')
  const showHorizontalSliderActual =
    showHorizontalSlider === true || (needsHorizontalScroll && showHorizontalSlider === 'auto')

  const maxScrollY = Math.max(0, contentHeight - viewportHeight)
  const maxScrollX = Math.max(0, contentWidth - viewportWidth)

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
        contentWidth,
        contentHeight,
        maxScrollX,
        maxScrollY,
      })
    }
  }, [scroll, viewportWidth, viewportHeight, contentWidth, contentHeight, maxScrollX, maxScrollY])

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
    if (data.state === 'end') return

    const deltaX = data.dx ?? 0
    const deltaY = data.dy ?? 0

    calc(deltaX, deltaY)
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
  }, [])

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
            overflow="hidden"
            direction="stack"
          >
            {/* main scroll view area, can be greater than parent */}
            <View ref={contentRef} x={-scroll.dx} y={-scroll.dy}>
              {children}
            </View>
          </View>
          {/* Horizontal slider at the bottom */}
          {showHorizontalSliderActual && (
            <ScrollSlider
              direction="horizontal"
              size={props.sliderSize}
              scrollPosition={scroll.dx}
              viewportSize={viewportWidth}
              contentSize={contentWidth}
              onScroll={handleHorizontalScroll}
            />
          )}
        </View>

        {/* Vertical slider on the right */}
        {showVerticalSliderActual && (
          <View height={'100%'} direction="column">
            <View flex={1}>
              <ScrollSlider
                direction="vertical"
                size={props.sliderSize}
                scrollPosition={scroll.dy}
                viewportSize={viewportHeight}
                contentSize={contentHeight}
                onScroll={handleVerticalScroll}
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
        )}
      </View>
    </View>
  )
}
