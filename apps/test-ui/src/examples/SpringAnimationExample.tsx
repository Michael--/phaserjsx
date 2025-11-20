/**
 * Spring Animation Example - demonstrates physics-based animations with useSpring
 *
 * ⚠️ IMPORTANT: AnimatedSignals work best on LEAF NODES (no children or simple children).
 * Animating width/height on containers with percentage-sized children will cause issues!
 */
import { SPRING_PRESETS, Text, useSpring, useSprings, useState, View } from '@phaserjsx/ui'
import { Button } from '../components'

/**
 * Example demonstrating various spring animation features
 * Note: NineSliceButton example removed - animating containers with complex children is not supported
 */
export function SpringAnimationExample() {
  // Single value animation with wobbly preset - for LEAF NODE only
  const [width, setWidth] = useSpring(50, 'wobbly')
  const [_, setForceRedraw] = useState<unknown>(0)

  width.subscribe((v) => {
    setForceRedraw(v)
  })

  // Multiple values with different presets
  const [pos, setPos] = useSprings({ x: 25, y: 25 }, 'stiff')
  // console.log('Position springs:', pos)

  // Rotation with gentle preset
  const [rotation, setRotation] = useSpring(0, 'gentle')

  // Scale with default preset - start small so it's visible
  const [scale, setScale] = useSpring(0.5, SPRING_PRESETS.default)
  const [force, setForce] = useState<number>(50)
  // console.log('Force value:', JSON.stringify(force))

  return (
    <View direction="column" gap={20} padding={20} alignItems="center">
      <Text text="Spring Animation Examples" style={{ fontSize: 24, color: '#ffff00' }} />
      <Button
        width={force}
        text={`Redraw`}
        onClick={() => {
          setForce((f) => f + 1)
        }}
      />
      <Button
        text="Animate All"
        onClick={() => {
          setWidth(width.value === 50 ? 100 : 50)
          const newX = pos.x.value === 25 ? 325 : 25
          const newY = pos.y.value === 25 ? 25 : 25
          setPos({ x: newX, y: newY })
          setRotation(rotation.value + Math.PI / 2)
          setScale(scale.value === 0.5 ? 1 : 0.5)
        }}
      />

      {/* Example 1: Animated Width - LEAF NODE (no children) */}
      <View direction="column" gap={10} alignItems="center">
        <Text text="1. Animated Width (Wobbly) - Leaf Node Only!" style={{ fontSize: 18 }} />
        <View
          width={width.value}
          height={50}
          backgroundColor={0x00aa00}
          cornerRadius={8}
          enableGestures
          onTouch={() => setWidth(width.value === 50 ? 100 : 50)}
        />
      </View>

      {/* Example 2: Animated Position */}
      <View direction="column" gap={10} alignItems="center">
        <Text text="2. Animated Position (Stiff)" style={{ fontSize: 18 }} />
        <View
          width={400}
          height={100}
          backgroundColor={0x333333}
          cornerRadius={8}
          direction="stack"
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
        <Text text="3. Animated Rotation (Gentle)" style={{ fontSize: 18 }} />
        <View
          width={80}
          height={80}
          backgroundColor={0xff00ff}
          cornerRadius={12}
          rotation={rotation.value}
          enableGestures
          onTouch={() => setRotation(rotation.value + Math.PI / 2)}
        />
      </View>

      {/* Example 4: Animated Scale */}
      <View direction="column" gap={10} alignItems="center">
        <Text text="4. Animated Scale (Default)" style={{ fontSize: 18 }} />
        <View
          width={60}
          height={60}
          backgroundColor={0x00ffff}
          cornerRadius={30}
          scale={scale.value}
          enableGestures
          onTouch={() => setScale(scale.value === 0.5 ? 1 : 0.5)}
        />
      </View>

      {/* Preset Comparison */}
      <View direction="column" gap={10} alignItems="center">
        <Text text="5. Preset Comparison" style={{ fontSize: 18 }} />
        <View direction="row" gap={10}>
          <PresetDemo preset="gentle" label="Gentle" />
          <PresetDemo preset="wobbly" label="Wobbly" />
          <PresetDemo preset="stiff" label="Stiff" />
        </View>
      </View>
    </View>
  )
}

/**
 * Component demonstrating a specific spring preset
 */
function PresetDemo({ preset, label }: { preset: keyof typeof SPRING_PRESETS; label: string }) {
  const [size, setSize] = useSpring(40, preset)

  return (
    <View direction="column" gap={5} alignItems="center">
      <Text text={label} style={{ fontSize: 14 }} />
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
