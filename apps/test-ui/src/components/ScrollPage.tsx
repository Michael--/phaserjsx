import {
  getThemedProps,
  useEffect,
  useRef,
  useState,
  View,
  type GestureEventData,
  type ViewProps,
  type VNode,
} from '@phaserjsx/ui'
import { ScrollSlider } from './ScrollSlider'

/**
 * Props for ScrollPage component
 * @extends Omit<ViewProps, 'children'> - All View props except children
 */
export interface ScrollPageProps extends Omit<ViewProps, 'children'> {
  /** Whether to show the vertical scroll slider (default: auto) */
  showVerticalSlider?: boolean | 'auto' | undefined
  /** Whether to show the vertical scroll slider (default: auto) */
  showHorizontalSlider?: boolean | 'auto' | undefined
  /** Initial scroll position */
  scroll?: { dx: number; dy: number }
  /** Children to render inside scrollable content, allow only one child */
  children?: VNode
}

/**
 * ScrollPage component providing a scrollable area with an optional vertical slider
 * @param props - ScrollPage properties
 * @returns JSX element
 */
export function ScrollPage(props: ScrollPageProps) {
  const {
    children,
    showVerticalSlider = 'auto',
    showHorizontalSlider = 'auto',
    scroll: initialScroll,
  } = props

  const [scroll, setScroll] = useState(initialScroll ?? { dx: 0, dy: 0 })

  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)

  // Get slider size from theme
  const { props: sliderTheme } = getThemedProps('ScrollSlider', undefined, {})
  const sliderSize = sliderTheme.size ?? 30

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
  const [_, setRedraw] = useState(0)

  useEffect(() => {
    // Force multiple redraws to ensure container dimensions are properly calculated
    // First redraw after initial mount
    const timer1 = setTimeout(() => setRedraw((r) => r + 1), 0)
    // Second redraw to catch any layout adjustments and slider dimensions
    const timer2 = setTimeout(() => setRedraw((r) => r + 1), 2)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <View>
      <View direction="row" width="100%" height="100%" gap={0} padding={0}>
        {/* ScrollView takes remaining space */}
        <View flex={1} height={'100%'}>
          <View
            ref={viewportRef}
            flex={0}
            flexBasis={'100%'}
            width="100%"
            backgroundColor={0x0000ff}
            backgroundAlpha={0.3}
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
            <View maxHeight={viewportHeight}>
              <ScrollSlider
                direction="horizontal"
                scrollPosition={scroll.dx}
                viewportSize={viewportWidth}
                contentSize={contentWidth}
                onScroll={handleHorizontalScroll}
              />
            </View>
          )}
        </View>

        {/* Vertical slider on the right */}
        {showVerticalSliderActual && (
          <View maxHeight={'100%'}>
            <View flex={1} flexBasis={'100%'} height={'100%'} maxHeight={viewportHeight}>
              <ScrollSlider
                direction="vertical"
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
