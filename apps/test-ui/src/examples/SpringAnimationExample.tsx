/**
 * Spring Animation Example - demonstrates physics-based animations with useSpring
 */
import {
  SPRING_PRESETS,
  Text,
  useForceRedraw,
  useSpring,
  useSprings,
  useThemeTokens,
  View,
} from '@phaserjsx/ui'
import { Button, TransformOriginView } from '../components'
import { ViewLevel1, ViewLevel2 } from './Helper/ViewLevel'

/**
 * Example demonstrating various spring animation features
 * Note: NineSliceButton example removed - animating containers with complex children is not supported
 */
export function SpringAnimationExample() {
  const tokens = useThemeTokens()
  // Single value animation with wobbly preset - for LEAF NODE only
  const [width, setWidth] = useSpring(50, 'wobbly')

  // Multiple values with different presets
  const [pos, setPos] = useSprings({ x: 25, y: 25 }, 'stiff')
  // console.log('Position springs:', pos)

  // Rotation with gentle preset
  const [rotation, setRotation] = useSpring(0, 'gentle')

  // Scale with default preset - start small so it's visible
  const [scale, setScale] = useSpring(1.0, SPRING_PRESETS.default)

  // Force redraw when signals change (throttled to 20ms ~50fps)
  useForceRedraw(20, width, pos.x, pos.y, rotation, scale)

  return (
    <ViewLevel1>
      <ViewLevel2 alignItems="center">
        <Text text="Spring Animation Examples" style={tokens?.textStyles.title} />
        <Button
          text="Animate All"
          onClick={() => {
            setWidth(width.value === 50 ? 100 : 50)
            const newX = pos.x.value === 25 ? 325 : 25
            const newY = pos.y.value === 25 ? 25 : 25
            setPos({ x: newX, y: newY })
            setRotation((prev) => prev + Math.PI / 2)
            setScale(scale.value === 0.5 ? 1 : 0.5)
          }}
        />

        {/* Example 1: Animated Width - LEAF NODE (no children) */}
        <View direction="column" gap={10} alignItems="center">
          <Text
            text="1. Animated Width (Wobbly) - Leaf Node Only!"
            style={tokens?.textStyles.large}
          />
          <View
            width={width.value}
            height={50}
            backgroundColor={0x00aa00}
            cornerRadius={8}
            enableGestures
            onTouch={() => setWidth(width.value === 50 ? 200 : 50)}
          />
        </View>

        {/* Example 2: Animated Position */}
        <View direction="column" gap={10} alignItems="center">
          <Text text="2. Animated Position (Stiff)" style={tokens?.textStyles.large} />
          <View
            width={400}
            height={100}
            backgroundColor={0x555555}
            cornerRadius={8}
            direction="stack"
            padding={0}
          >
            <View
              x={pos.x.value}
              y={pos.y.value}
              width={50}
              height={50}
              backgroundColor={0x00ff00}
              cornerRadius={8}
              enableGestures
              onTouch={() => {
                const newX = pos.x.value === 25 ? 325 : 25
                const newY = pos.y.value === 25 ? 25 : 25
                setPos({ x: newX, y: newY })
              }}
            />
          </View>
        </View>

        {/* Example 3: Animated Rotation */}
        <View direction="column" gap={10} alignItems="center">
          <Text text="3. Animated Rotation (Gentle)" style={tokens?.textStyles.large} />
          <TransformOriginView width={80} height={80} rotation={rotation.value}>
            <View
              width={80}
              height={80}
              backgroundColor={0xff00ff}
              cornerRadius={12}
              enableGestures
              onTouch={() => setRotation((prev) => prev + Math.PI / 2)}
            />
          </TransformOriginView>
        </View>

        {/* Example 4: Animated Scale */}
        <View direction="column" gap={10} alignItems="center">
          <Text text="4. Animated Scale (Default)" style={tokens?.textStyles.large} />
          <TransformOriginView width={60} height={60} scale={scale.value}>
            <View
              width={60}
              height={60}
              backgroundColor={0x00ffff}
              cornerRadius={30}
              enableGestures
              onTouch={() => setScale(scale.value !== 1 ? 1 : 0.5)}
            />
          </TransformOriginView>
        </View>

        {/* Preset Comparison */}
        <View direction="column" gap={10} alignItems="center">
          <Text text="5. Preset Comparison" style={tokens?.textStyles.large} />
          <View direction="row" gap={10}>
            <PresetDemo preset="gentle" label="Gentle" />
            <PresetDemo preset="wobbly" label="Wobbly" />
            <PresetDemo preset="stiff" label="Stiff" />
          </View>
        </View>
      </ViewLevel2>
    </ViewLevel1>
  )
}

/**
 * Component demonstrating a specific spring preset
 */
function PresetDemo({ preset, label }: { preset: keyof typeof SPRING_PRESETS; label: string }) {
  const tokens = useThemeTokens()
  const [size, setSize] = useSpring(40, preset)
  useForceRedraw(20, size)

  return (
    <View direction="column" gap={5} alignItems="center" width={80} height={80}>
      <Text text={label} style={tokens?.textStyles.medium} />
      <View
        width={size.value}
        height={size.value}
        backgroundColor={0xff5500}
        cornerRadius={8}
        enableGestures
        onTouch={() => setSize(size.value === 40 ? 60 : 40)}
      />
    </View>
  )
}
