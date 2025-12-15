import {
  ScrollView,
  Text,
  useState,
  useThemeTokens,
  View,
  type ScrollInfo,
  type SizeValue,
} from '@number10/phaserjsx'
import { Button } from '../components'
import { ViewLevel2 } from './Helper/ViewLevel'

function ListButton(props: { index: number; width?: SizeValue }) {
  const tokens = useThemeTokens()
  const [count, setCount] = useState(0)
  return (
    <View
      width={props.width}
      key={props.index}
      justifyContent="center"
      alignItems="center"
      direction="row"
      padding={8}
      gap={8}
      backgroundColor={
        props.index % 2 === 0
          ? tokens?.colors.secondary.light.toNumber()
          : tokens?.colors.secondary.medium.toNumber()
      }
    >
      <Button
        size="small"
        variant="secondary"
        text={`Button ${props.index + 1}`}
        onClick={() => {
          setCount(count + 1)
        }}
      />
      <Text text={`${count}`} />
    </View>
  )
}
function Content(props: { count: number; width: SizeValue }) {
  const tokens = useThemeTokens()
  const entry = (index: number) => {
    if (index % 3 === 0) {
      // return a button like view
      return <ListButton index={index} width={props.width} />
    }
    return (
      <View
        key={index}
        width={props.width}
        height={50}
        backgroundColor={
          index % 2 === 0
            ? tokens?.colors.secondary.light.toNumber()
            : tokens?.colors.secondary.medium.toNumber()
        }
        justifyContent="center"
        alignItems="center"
      >
        <Text text={`Item ${index + 1}`} style={tokens?.textStyles.medium} />
      </View>
    )
  }
  return (
    <View padding={0} gap={0}>
      {Array.from({ length: props.count }).map((_, index) => entry(index))}
    </View>
  )
}

/**
 *  Example of ScrollView usage, depending on props either vertical, horizontal or both scrolling is available
 * @param props title, count, width
 */
function ScrollExampleLocal(props: { title: string; count: number; width: SizeValue }) {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
      {/** Border around ScrollView to visualize its bounds */}
      <ViewLevel2>
        <View
          width={200}
          height={400}
          padding={0}
          backgroundColor={tokens?.colors.background.medium.toNumber()}
        >
          <ScrollView>
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
      </ViewLevel2>
    </ViewLevel2>
  )
}

function ScrollExampleSliderLocal(props: { title: string; count: number; width: SizeValue }) {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
      {/** Border around ScrollView to visualize its bounds */}
      <ViewLevel2>
        <View width={200} height={400} padding={0}>
          <ScrollView showVerticalSlider={true} sliderSize="small">
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
      </ViewLevel2>
    </ViewLevel2>
  )
}

function ScrollExampleSnapAuto(props: { title: string; count: number; width: SizeValue }) {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
      <ViewLevel2>
        <View
          width={200}
          height={400}
          padding={0}
          backgroundColor={tokens?.colors.secondary.light.toNumber()}
        >
          <ScrollView snap="auto" snapAlignment="center" momentum={true}>
            <Content count={props.count} width={props.width} />
          </ScrollView>
        </View>
      </ViewLevel2>
    </ViewLevel2>
  )
}

function ScrollExampleSnapManual(props: { title: string }) {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
      <ViewLevel2>
        <View width={200} height={400} padding={0}>
          <ScrollView
            snap={{ positions: [0, 100, 200, 300], threshold: 30 }}
            snapAlignment="start"
            momentum={true}
          >
            <View direction="column" gap={10} padding={10}>
              <View height={100} backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()} />
              <View height={100} backgroundColor={tokens?.colors.secondary.DEFAULT.toNumber()} />
              <View height={100} backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()} />
              <View height={100} backgroundColor={tokens?.colors.primary.light.toNumber()} />
            </View>
          </ScrollView>
        </View>
      </ViewLevel2>
    </ViewLevel2>
  )
}

function ScrollExampleSliderFullLocal(props: { title: string; width: string }) {
  const tokens = useThemeTokens()

  const [scroll, setScroll] = useState({
    dx: 0,
    dy: 0,
  })
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo | null>(null)
  // define the view and content sizes for scroll calculations
  const viewSize = 200
  const contentSize = 300
  const rect = 50

  return (
    <ViewLevel2 alignItems="center">
      <Text text={props.title} style={tokens?.textStyles.large} />
      <View direction="column" gap={2} padding={0} margin={0}>
        <View direction="row" gap={2} padding={0} margin={0}>
          <View width={viewSize} height={viewSize} padding={0}>
            <ScrollView
              sliderSize="tiny"
              scroll={scroll}
              showVerticalSlider={true}
              showHorizontalSlider={true}
              onScrollInfoChange={setScrollInfo}
            >
              <View
                direction="stack"
                width={contentSize}
                height={contentSize}
                padding={0}
                backgroundColor={tokens?.colors.secondary.light.toNumber()}
              >
                <View
                  x={0}
                  y={0}
                  width={rect}
                  height={rect}
                  backgroundColor={tokens?.colors.secondary.dark.toNumber()}
                ></View>
                <View
                  x={(contentSize - rect) / 2}
                  y={(contentSize - rect) / 2}
                  width={rect}
                  height={rect}
                  backgroundColor={tokens?.colors.secondary.dark.toNumber()}
                ></View>
                <View
                  x={contentSize - rect}
                  y={contentSize - rect}
                  width={rect}
                  height={rect}
                  backgroundColor={tokens?.colors.secondary.dark.toNumber()}
                ></View>
              </View>
            </ScrollView>
          </View>
        </View>
        <ViewLevel2 alignItems="start" padding={{ top: 30 }}>
          <Button
            variant="primary"
            text="Scroll to left/top"
            onClick={() => setScroll({ dx: 0, dy: 0 })}
          />
          <Button
            variant="primary"
            text="Scroll to center"
            onClick={() => {
              if (scrollInfo) {
                setScroll({
                  dx: scrollInfo.maxScrollX / 2,
                  dy: scrollInfo.maxScrollY / 2,
                })
              }
            }}
          />
          <Button
            variant="primary"
            text="Scroll to bottom/right"
            onClick={() => {
              if (scrollInfo) {
                setScroll({
                  dx: scrollInfo.maxScrollX,
                  dy: scrollInfo.maxScrollY,
                })
              }
            }}
          />
        </ViewLevel2>
      </View>
    </ViewLevel2>
  )
}

export function ScrollExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          {/** disable padding for only the next */}
          <ViewLevel2 direction="row">
            <ScrollExampleLocal title="Scroll Y" count={20} width="100%" />
            <ScrollExampleLocal title="Scroll X" count={5} width="120%" />
            <ScrollExampleLocal title="Scroll X+Y" count={20} width="120%" />
          </ViewLevel2>
          {/** disable padding for only the next */}
          <ViewLevel2 direction="row">
            <ScrollExampleSliderLocal title="V-Slider" count={20} width="100%" />
            <ScrollExampleSliderFullLocal title="XY-Slider" width="100%" />
          </ViewLevel2>
          {/** Snap examples */}
          <ViewLevel2 direction="row">
            <ScrollExampleSnapAuto title="Snap Auto Center" count={10} width="100%" />
            <ScrollExampleSnapManual title="Snap Manual" />
          </ViewLevel2>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
