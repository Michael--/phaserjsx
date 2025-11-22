/**
 * Graphics Component Examples
 * Demonstrates various uses of the Graphics component
 */
import { Graphics, Text, View, useState, useThemeTokens } from '@phaserjsx/ui'
import { ScrollPage } from '../components/ScrollPage'
import { SectionHeader } from './Helper'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Simple circle with headless mode (default)
 */
function HeadlessCircle() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <ViewLevel2>
      <Text text="Headless Circle (no layout impact)" style={tokens?.textStyles.large} />

      <ViewLevel3
        width={200}
        height={200}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
      >
        <Graphics
          x={100}
          y={100}
          onDraw={(g) => {
            g.fillStyle(colors?.error.medium.toNumber() ?? 0, 1)
            g.fillCircle(0, 0, 50)
          }}
        />
        <Graphics
          x={125}
          y={125}
          onDraw={(g) => {
            g.fillStyle(colors?.warning.medium.toNumber() ?? 0, 1)
            g.fillCircle(0, 0, 25)
          }}
        />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Rectangle with layout integration
 */
function LayoutAwareRectangle() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Layout-Aware Rectangle" style={tokens?.textStyles.large} />
      <View direction="row" gap={10}>
        <Graphics
          headless={false}
          width={100}
          height={60}
          onDraw={(g) => {
            g.fillStyle(colors?.success.medium.toNumber() ?? 0, 1)
            g.fillRect(0, 0, 100, 60)
          }}
        />
        <Graphics
          headless={false}
          width={100}
          height={60}
          onDraw={(g) => {
            g.fillStyle(colors?.info.medium.toNumber() ?? 0, 1)
            g.fillRect(0, 0, 100, 60)
          }}
        />
      </View>
    </View>
  )
}

/**
 * Dependency-based redraw demo
 */
function DependencyRedraw() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  const [color, setColor] = useState(0xff0000)
  const [radius, setRadius] = useState(40)

  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Dependency-Based Redraw" style={tokens?.textStyles.large} />
      <View direction="row" gap={10}>
        <View
          width={100}
          height={100}
          backgroundColor={colors?.background.darkest.toNumber()}
          direction="stack"
          enableGestures={true}
          onTouch={() => {
            // Cycle colors
            setColor((c) => (c === 0xff0000 ? 0x00ff00 : c === 0x00ff00 ? 0x0000ff : 0xff0000))
          }}
        >
          <Graphics
            x={50}
            y={50}
            dependencies={[color]}
            onDraw={(g) => {
              g.fillStyle(color, 1)
              g.fillCircle(0, 0, radius)
            }}
          />
        </View>
        <View
          width={100}
          height={100}
          backgroundColor={colors?.background.darkest.toNumber()}
          direction="stack"
          enableGestures={true}
          onTouch={() => {
            // Change radius
            setRadius((r) => (r === 40 ? 30 : r === 30 ? 20 : 40))
          }}
        >
          <Graphics
            x={50}
            y={50}
            dependencies={[radius]}
            onDraw={(g) => {
              g.fillStyle(0xffff00, 1)
              g.fillCircle(0, 0, radius)
            }}
          />
        </View>
      </View>
      <Text text="Click squares to change color/radius" style={tokens?.textStyles.small} />
    </View>
  )
}

/**
 * Complex shape demo
 */
function ComplexShape() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Complex Custom Shape" style={tokens?.textStyles.large} />
      <View
        width={200}
        height={200}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
      >
        <Graphics
          x={100}
          y={100}
          onDraw={(g) => {
            // Draw star
            g.fillStyle(colors?.warning.medium.toNumber() ?? 0, 1)
            g.beginPath()
            for (let i = 0; i < 5; i++) {
              const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
              const x = Math.cos(angle) * 50
              const y = Math.sin(angle) * 50
              if (i === 0) {
                g.moveTo(x, y)
              } else {
                g.lineTo(x, y)
              }
            }
            g.closePath()
            g.fillPath()

            // Add outline
            g.lineStyle(3, colors?.warning.dark.toNumber() ?? 0, 1)
            g.strokePath()
          }}
        />
      </View>
    </View>
  )
}

/**
 * No autoClear demo (additive drawing)
 */
function AdditiveDrawing() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  const [count, setCount] = useState(1)

  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Additive Drawing (autoClear=false)" style={tokens?.textStyles.large} />
      <View
        width={200}
        height={200}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
        enableGestures={true}
        onTouch={() => setCount((c) => (c < 5 ? c + 1 : 1))}
      >
        <Graphics
          x={100}
          y={100}
          autoClear={false}
          dependencies={[count]}
          onDraw={(g) => {
            // Add a new circle each time
            const angle = ((count - 1) * Math.PI * 2) / 5
            const x = Math.cos(angle) * 60
            const y = Math.sin(angle) * 60
            g.fillStyle(colors?.error.medium.toNumber() ?? 0, 0.5)
            g.fillCircle(x, y, 20)
          }}
        />
      </View>
      <Text text={`Click to add circles (${count}/5)`} style={tokens?.textStyles.small} />
    </View>
  )
}

/**
 * Main Graphics example component
 */
export function GraphicsExample() {
  return (
    <ScrollPage showVerticalSlider={true}>
      <ViewLevel2>
        <SectionHeader title="Graphics Component Examples" />
        <HeadlessCircle />
        <LayoutAwareRectangle />
        <DependencyRedraw />
        <ComplexShape />
        <AdditiveDrawing />
      </ViewLevel2>
    </ScrollPage>
  )
}
