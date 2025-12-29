/**
 * Graphics Component Examples
 * Demonstrates various uses of the Graphics component
 */
import { Graphics, ScrollView, Text, View, useState, useThemeTokens } from '@number10/phaserjsx'
import type * as Phaser from 'phaser'
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
      <Text text="Headless Circle" style={tokens?.textStyles.large} />

      <ViewLevel3
        width={200}
        height={200}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
      >
        <Graphics
          x={100}
          y={100}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(colors?.error.medium.toNumber() ?? 0, 1)
            g.fillCircle(0, 0, 50)
          }}
        />
        <Graphics
          x={125}
          y={125}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
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
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            g.fillStyle(colors?.success.medium.toNumber() ?? 0, 1)
            g.fillRect(0, 0, 100, 60)
          }}
        />
        <Graphics
          headless={false}
          width={100}
          height={60}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
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
            onDraw={(g: Phaser.GameObjects.Graphics) => {
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
            onDraw={(g: Phaser.GameObjects.Graphics) => {
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
          onDraw={(g: Phaser.GameObjects.Graphics) => {
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
      <Text text="Additive Drawing" style={tokens?.textStyles.large} />
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
          onDraw={(g: Phaser.GameObjects.Graphics) => {
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
 * Advanced graphics demo with complex shapes and transformations
 */
function AdvancedGraphicsDemo() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors

  return (
    <View direction="column" gap={10} padding={20}>
      <Text text="Advanced Graphics Demo" style={tokens?.textStyles.large} />
      <View
        width={300}
        height={250}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
      >
        <Graphics
          x={150}
          y={125}
          onDraw={(g: Phaser.GameObjects.Graphics) => {
            // Draw a house
            // Base
            g.fillStyle(colors?.surface.medium.toNumber() ?? 0, 1)
            g.fillRect(-50, 20, 100, 60)

            // Roof
            g.fillStyle(colors?.warning.medium.toNumber() ?? 0, 1)
            g.beginPath()
            g.moveTo(-60, 20)
            g.lineTo(0, -30)
            g.lineTo(60, 20)
            g.closePath()
            g.fillPath()

            // Door
            g.fillStyle(colors?.info.dark.toNumber() ?? 0, 1)
            g.fillRect(-10, 50, 20, 30)

            // Windows
            g.fillStyle(colors?.success.light.toNumber() ?? 0, 1)
            g.fillRect(-40, 30, 15, 15)
            g.fillRect(25, 30, 15, 15)

            // Chimney
            g.fillStyle(colors?.surface.dark.toNumber() ?? 0, 1)
            g.fillRect(30, -40, 10, 25)

            // Sun
            g.fillStyle(colors?.warning.light.toNumber() ?? 0, 1)
            g.fillCircle(-100, -80, 20)
            // Rays
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4
              const rayX = -100 + Math.cos(angle) * 35
              const rayY = -80 + Math.sin(angle) * 35
              g.fillRect(rayX - 7.5, rayY - 2, 15, 4)
            }

            // Tree
            // Trunk
            g.fillStyle(colors?.surface.dark.toNumber() ?? 0, 1)
            g.fillRect(75, 40, 10, 40)
            // Leaves
            g.fillStyle(colors?.success.medium.toNumber() ?? 0, 1)
            g.fillCircle(80, 30, 20)

            // Ground
            g.fillStyle(colors?.surface.light.toNumber() ?? 0, 1)
            g.fillRect(-150, 80, 300, 20)
          }}
        />
      </View>
    </View>
  )
}

/**
 * Main Graphics example component
 */
export function GraphicsExample() {
  return (
    <ScrollView>
      <ViewLevel2>
        <SectionHeader title="Graphics Component Examples" />
        <View direction="row">
          <HeadlessCircle />
          <ComplexShape />
          <AdditiveDrawing />
        </View>
        <View direction="row">
          <LayoutAwareRectangle />
          <DependencyRedraw />
        </View>
        <AdvancedGraphicsDemo />
      </ViewLevel2>
    </ScrollView>
  )
}
