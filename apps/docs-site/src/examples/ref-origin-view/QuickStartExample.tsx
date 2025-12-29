/**
 * RefOriginView Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { RefOriginView, Text, useEffect, useRef, View } from '@number10/phaserjsx'
import type * as Phaser from 'phaser'

/**
 * Basic RefOriginView with Phaser tween rotation
 */
export function QuickStartRefOriginViewExample() {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)

  useEffect(() => {
    if (ref.current?.scene) {
      ref.current.scene.tweens.add({
        targets: ref.current,
        rotation: Math.PI * 2,
        duration: 5000,
        repeat: -1,
        ease: 'Linear',
      })
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
      <RefOriginView
        ref={ref}
        width={120}
        height={120}
        backgroundColor={0x4488ff}
        cornerRadius={10}
        originX={0.5}
        originY={0.5}
      >
        <View width={10} height={10} backgroundColor={0xffff00} cornerRadius={5} x={55} y={55} />
        <Text text="Rotating" style={{ fontSize: 18 }} x={20} y={30} />
      </RefOriginView>
    </View>
  )
}
