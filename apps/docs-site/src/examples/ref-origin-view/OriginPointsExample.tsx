/**
 * RefOriginView Origin Points Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { RefOriginView, Text, useEffect, useRef, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

/**
 * Demonstrates different origin points (center, top-left, bottom-right)
 */
export function OriginPointsRefOriginViewExample() {
  const centerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const topLeftRef = useRef<Phaser.GameObjects.Container | null>(null)
  const bottomRightRef = useRef<Phaser.GameObjects.Container | null>(null)

  useEffect(() => {
    const tweens: Phaser.Tweens.Tween[] = []

    if (centerRef.current?.scene) {
      tweens.push(
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
      tweens.push(
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
      tweens.push(
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
      <View direction="column" gap={20} alignItems="center">
        <View direction="row" gap={80}>
          <View gap={30}>
            <Text text="Center (0.5, 0.5)" style={{ fontSize: 14 }} />
            <View padding={10} borderColor={0x555555}>
              <RefOriginView
                ref={centerRef}
                width={80}
                height={80}
                backgroundColor={0xff4444}
                backgroundAlpha={0.7}
                originX={0.5}
                originY={0.5}
                cornerRadius={5}
              >
                <View
                  width={8}
                  height={8}
                  backgroundColor={0xffff00}
                  cornerRadius={4}
                  x={36}
                  y={36}
                />
              </RefOriginView>
            </View>
          </View>

          <View gap={30}>
            <Text text="Top-Left (0, 0)" style={{ fontSize: 14 }} />
            <View padding={10} borderColor={0x555555}>
              <RefOriginView
                ref={topLeftRef}
                width={80}
                height={80}
                backgroundColor={0x44ff44}
                backgroundAlpha={0.7}
                originX={0}
                originY={0}
                cornerRadius={5}
              >
                <View
                  width={8}
                  height={8}
                  backgroundColor={0xffff00}
                  cornerRadius={4}
                  x={-4}
                  y={-4}
                />
              </RefOriginView>
            </View>
          </View>

          <View gap={30}>
            <Text text="Bottom-Right (1, 1)" style={{ fontSize: 14 }} />
            <View padding={10} borderColor={0x555555}>
              <RefOriginView
                ref={bottomRightRef}
                width={80}
                height={80}
                backgroundColor={0x4444ff}
                backgroundAlpha={0.7}
                originX={1}
                originY={1}
                cornerRadius={5}
              >
                <View
                  width={8}
                  height={8}
                  backgroundColor={0xffff00}
                  cornerRadius={4}
                  x={76}
                  y={76}
                />
              </RefOriginView>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
