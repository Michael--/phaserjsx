/**
 * Example demonstrating origin-based transforms (rotation and scale)
 */
import { Text, useEffect, useRef, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { OriginView } from '../components/OriginView'

/**
 * Example showing rotation around different origin points
 * @returns JSX element
 */
export function OriginRotationExample() {
  const centerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const topLeftRef = useRef<Phaser.GameObjects.Container | null>(null)
  const bottomRightRef = useRef<Phaser.GameObjects.Container | null>(null)
  const tweensRef = useRef<Phaser.Tweens.Tween[]>([])

  useEffect(() => {
    // Start rotation animations
    if (centerRef.current?.scene) {
      tweensRef.current.push(
        centerRef.current.scene.tweens.add({
          targets: centerRef.current,
          rotation: Math.PI * 2,
          duration: 3000,
          repeat: -1,
          ease: 'Linear',
        })
      )
    }

    if (topLeftRef.current?.scene) {
      tweensRef.current.push(
        topLeftRef.current.scene.tweens.add({
          targets: topLeftRef.current,
          rotation: Math.PI * 2,
          duration: 3000,
          repeat: -1,
          ease: 'Linear',
        })
      )
    }

    if (bottomRightRef.current?.scene) {
      tweensRef.current.push(
        bottomRightRef.current.scene.tweens.add({
          targets: bottomRightRef.current,
          rotation: Math.PI * 2,
          duration: 3000,
          repeat: -1,
          ease: 'Linear',
        })
      )
    }

    return () => {
      tweensRef.current.forEach((tween) => tween.stop())
      tweensRef.current = []
    }
  }, [])

  return (
    <View direction="column" gap={30} padding={20}>
      <Text text="Origin-Based Rotation" style={{ fontSize: 20, color: 'yellow' }} />

      {/* Center origin (0.5, 0.5) - typical game object behavior */}
      <View direction="row" gap={50} alignItems="center">
        <OriginView
          ref={centerRef}
          width={100}
          height={100}
          backgroundColor={0xff4444}
          backgroundAlpha={0.5}
          originX={0.5}
          originY={0.5}
          cornerRadius={5}
        >
          <View width={10} height={10} backgroundColor={0xffff00} x={45} y={45} cornerRadius={5} />
        </OriginView>
        <View direction="column" gap={5}>
          <Text text="Center Origin" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={0.5}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={0.5}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>

      {/* Top-left origin (0, 0) - default UI behavior */}
      <View direction="row" gap={50} alignItems="center">
        <OriginView
          ref={topLeftRef}
          width={100}
          height={100}
          backgroundColor={0x44ff44}
          backgroundAlpha={0.5}
          originX={0}
          originY={0}
          cornerRadius={5}
        >
          <View width={10} height={10} backgroundColor={0xffff00} x={-5} y={-5} cornerRadius={5} />
        </OriginView>
        <View direction="column" gap={5}>
          <Text text="Top-Left Origin" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={0}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={0}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>

      {/* Bottom-right origin (1, 1) - custom pivot */}
      <View direction="row" gap={50} alignItems="center">
        <OriginView
          ref={bottomRightRef}
          width={100}
          height={100}
          backgroundColor={0x4444ff}
          backgroundAlpha={0.5}
          originX={1}
          originY={1}
          cornerRadius={5}
        >
          <View width={10} height={10} backgroundColor={0xffff00} x={95} y={95} cornerRadius={5} />
        </OriginView>
        <View direction="column" gap={5}>
          <Text text="Bottom-Right Origin" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={1}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={1}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>
    </View>
  )
}

/**
 * Example showing scale with different origin points
 * @returns JSX element
 */
export function OriginScaleExample() {
  const centerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const leftRef = useRef<Phaser.GameObjects.Container | null>(null)
  const bottomRef = useRef<Phaser.GameObjects.Container | null>(null)
  const tweensRef = useRef<Phaser.Tweens.Tween[]>([])

  useEffect(() => {
    // Pulsing scale animations
    if (centerRef.current?.scene) {
      tweensRef.current.push(
        centerRef.current.scene.tweens.add({
          targets: centerRef.current,
          scale: 1.3,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    if (leftRef.current?.scene) {
      tweensRef.current.push(
        leftRef.current.scene.tweens.add({
          targets: leftRef.current,
          scale: 1.3,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    if (bottomRef.current?.scene) {
      tweensRef.current.push(
        bottomRef.current.scene.tweens.add({
          targets: bottomRef.current,
          scale: 1.3,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    return () => {
      tweensRef.current.forEach((tween) => tween.stop())
      tweensRef.current = []
    }
  }, [])

  return (
    <View direction="column" gap={40} padding={20}>
      <Text text="Origin-Based Scaling" style={{ fontSize: 20, color: 'yellow' }} />

      {/* Center scale - grows from center (common for UI buttons) */}
      <View direction="row" gap={50} alignItems="center">
        <View width={120} height={120} backgroundColor={0x1a1a1a}>
          <OriginView
            ref={centerRef}
            width={80}
            height={80}
            backgroundColor={0xff8844}
            cornerRadius={10}
            originX={0.5}
            originY={0.5}
            alignItems="center"
          >
            <Text text="Scale" style={{ fontSize: 14, color: 'white', fontStyle: 'bold' }} />
          </OriginView>
        </View>
        <View direction="column" gap={5}>
          <Text text="Center Scale" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={0.5}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={0.5}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>

      {/* Left scale - grows from left edge */}
      <View direction="row" gap={50} alignItems="center">
        <View width={120} height={120} backgroundColor={0x1a1a1a}>
          <OriginView
            ref={leftRef}
            width={80}
            height={80}
            backgroundColor={0x88ff44}
            cornerRadius={10}
            originX={0}
            originY={0.5}
            alignItems="center"
          >
            <Text text="Scale" style={{ fontSize: 14, color: 'black', fontStyle: 'bold' }} />
          </OriginView>
        </View>
        <View direction="column" gap={5}>
          <Text text="Left Scale" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={0}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={0.5}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>

      {/* Bottom scale - grows upward from bottom */}
      <View direction="row" gap={50} alignItems="center">
        <View width={120} height={120} backgroundColor={0x1a1a1a}>
          <OriginView
            ref={bottomRef}
            width={80}
            height={80}
            backgroundColor={0x8844ff}
            cornerRadius={10}
            originX={0.5}
            originY={1}
            alignItems="center"
          >
            <Text text="Scale" style={{ fontSize: 14, color: 'white', fontStyle: 'bold' }} />
          </OriginView>
        </View>
        <View direction="column" gap={5}>
          <Text text="Bottom Scale" style={{ fontSize: 16, color: 'cyan' }} />
          <Text text="originX={0.5}" style={{ fontSize: 12, color: 'gray' }} />
          <Text text="originY={1}" style={{ fontSize: 12, color: 'gray' }} />
        </View>
      </View>
    </View>
  )
}

/**
 * Main origin example with both rotation and scale demos
 * @returns JSX element
 */
export function OriginExample() {
  return (
    <View direction="row" gap={50} padding={10}>
      <OriginRotationExample />
      <OriginScaleExample />
    </View>
  )
}
