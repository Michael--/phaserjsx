import { useState, View, type ViewProps } from '@phaserjsx/ui'
import { ViewLevel1 } from '../examples/Helper/ViewLevel'
import { ScrollSlider } from './ScrollSlider'
import { ScrollView, type ScrollViewProps } from './ScrollView'

/**
 * Props for ScrollPage component
 * @extends Omit<ViewProps, 'children'> - All View props except children
 * @extends ScrollViewProps - Scroll-specific props
 */
export interface ScrollPageProps extends Omit<ViewProps, 'children'>, ScrollViewProps {
  /** Whether to show the vertical scroll slider (default: false) */
  showVerticalSlider?: boolean
  /** Whether to show the vertical scroll slider (default: false)
   * @deprecated Not yet correctly implemented
   */
  showHorizontalSlider?: boolean
}

/**
 * ScrollPage component providing a scrollable area with an optional vertical slider
 * @param props - ScrollPage properties
 * @returns JSX element
 */
export function ScrollPage(props: ScrollPageProps) {
  const {
    children,
    scroll: initialScroll,
    width: viewWidth = '100vw',
    height: viewHeight = '100vh',
    showVerticalSlider = false,
    showHorizontalSlider = false,
    // exclude some props not relevant for ScrollPage
    onScroll: _onScroll,
    x: _x,
    y: _y,
    direction: _direction,
    // the rest
    ...viewProps
  } = props

  const initialState = initialScroll
    ? { ...initialScroll, scrollX: 0, scrollY: 0, width: 0, height: 0 }
    : { dx: 0, dy: 0, scrollX: 0, scrollY: 0, width: 0, height: 0 }

  const [scroll, setScroll] = useState(initialState)

  // Store dimensions for slider calculations
  const [dimensions, setDimensions] = useState({ vw: 0, vh: 0, cw: 0, ch: 0 })

  const handleScroll = (x: number, y: number, vw: number, vh: number, cw: number, ch: number) => {
    // Store dimensions
    setDimensions({ vw, vh, cw, ch })

    // Calculate absolute scroll positions from percentages
    const maxScrollY = Math.max(0, ch - vh)
    const dy = (y / 100) * maxScrollY

    const maxScrollX = Math.max(0, cw - vw)
    const dx = (x / 100) * maxScrollX

    setScroll({
      dx,
      dy,
      scrollX: x,
      scrollY: y,
      width: (vw / cw) * 100,
      height: (vh / ch) * 100,
    })
  }

  const handleVScroll = (percent: number) => {
    const { vh, ch } = dimensions
    if (vh === 0 || ch === 0) return

    const maxScrollY = Math.max(0, ch - vh)
    const dy = (percent / 100) * maxScrollY

    setScroll({ ...scroll, dy, scrollY: percent })
  }

  const handleHScroll = (percent: number) => {
    const { vw, cw } = dimensions
    if (vw === 0 || cw === 0) return

    const maxScrollX = Math.max(0, cw - vw)
    const dx = (percent / 100) * maxScrollX

    setScroll({ ...scroll, dx, scrollX: percent })
  }

  return (
    <View direction="stack" width={viewWidth} height={viewHeight} {...viewProps}>
      <ViewLevel1 width="100%" direction="row" gap={0}>
        <ScrollView scroll={scroll} onScroll={handleScroll} {...(children ? { children } : {})} />
      </ViewLevel1>
      {showVerticalSlider && (
        <View
          width="100%"
          direction="row"
          gap={0}
          justifyContent="end"
          padding={{ right: 1 }}
          height={viewHeight}
        >
          <ScrollSlider
            direction="vertical"
            trackSize={viewHeight}
            scrollInfo={scroll}
            onScroll={handleVScroll}
          />
        </View>
      )}
      {showHorizontalSlider && (
        <View
          height="100%"
          direction="column"
          gap={0}
          justifyContent="end"
          padding={{ bottom: -1 }}
          width={'100%'}
        >
          <ScrollSlider
            direction="horizontal"
            trackSize={viewWidth}
            scrollInfo={scroll}
            onScroll={handleHScroll}
          />
        </View>
      )}
    </View>
  )
}
