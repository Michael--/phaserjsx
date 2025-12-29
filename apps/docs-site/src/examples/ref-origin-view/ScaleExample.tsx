/**
 * RefOriginView Scale Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { RefOriginView, Text, useEffect, useRef, View } from '@number10/phaserjsx'
import type * as Phaser from 'phaser'

/**
 * Demonstrates scaling around different origin points
 */
export function ScaleRefOriginViewExample() {
  const centerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const leftRef = useRef<Phaser.GameObjects.Container | null>(null)
  const bottomRef = useRef<Phaser.GameObjects.Container | null>(null)

  useEffect(() => {
    const tweens: Phaser.Tweens.Tween[] = []

    if (centerRef.current?.scene) {
      tweens.push(
        centerRef.current.scene.tweens.add({
          targets: centerRef.current,
          scale: 1.4,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    if (leftRef.current?.scene) {
      tweens.push(
        leftRef.current.scene.tweens.add({
          targets: leftRef.current,
          scale: 1.4,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    if (bottomRef.current?.scene) {
      tweens.push(
        bottomRef.current.scene.tweens.add({
          targets: bottomRef.current,
          scale: 1.4,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    return () => {
      tweens.forEach((tween) => tween.stop())
    }
  }, [])

  return (
    <View
      width={'fill'}
      height={'fill'}
      direction="row"
      gap={15}
      alignItems="center"
      justifyContent="center"
    >
      <View direction="column" gap={30} alignItems="center">
        <View direction="row" gap={40}>
          <View width={100} height={100} backgroundColor={0x222222} padding={15}>
            <RefOriginView
              ref={centerRef}
              width={70}
              height={70}
              backgroundColor={0xff8844}
              cornerRadius={8}
              originX={0.5}
              originY={0.5}
            >
              <Text text="Center" style={{ fontSize: 14 }} x={12} y={28} />
            </RefOriginView>
          </View>

          <View width={100} height={100} backgroundColor={0x222222} padding={15}>
            <RefOriginView
              ref={leftRef}
              width={70}
              height={70}
              backgroundColor={0x88ff44}
              cornerRadius={8}
              originX={0}
              originY={0.5}
            >
              <Text text="Left" style={{ fontSize: 14 }} x={20} y={28} />
            </RefOriginView>
          </View>

          <View width={100} height={100} backgroundColor={0x222222} padding={15}>
            <RefOriginView
              ref={bottomRef}
              width={70}
              height={70}
              backgroundColor={0x8844ff}
              cornerRadius={8}
              originX={0.5}
              originY={1}
            >
              <Text text="Bottom" style={{ fontSize: 14 }} x={10} y={28} />
            </RefOriginView>
          </View>
        </View>

        <Text text="Pulsing scale with different pivot points" style={{ fontSize: 14 }} />
      </View>
    </View>
  )
}
