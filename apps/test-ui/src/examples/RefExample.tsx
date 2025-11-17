/**
 * Example demonstrating ref usage to access and manipulate Phaser objects directly
 */
import type { RefObject } from '@phaserjsx/ui'
import { Text, useEffect, useRef, useState, View } from '@phaserjsx/ui'
import Phaser from 'phaser'
import { OriginView } from '../components/OriginView'

/**
 * Example showing how to use refs with Text components
 * @returns JSX element
 */
export function RefTextExample() {
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)
  const tweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  const handleTextRef = (text: Phaser.GameObjects.Text | null) => {
    if (!text || !text.scene) return
    textRef.current = text

    // Create a smooth color cycling animation
    tweenRef.current = text.scene.tweens.addCounter({
      from: 0,
      to: 360,
      duration: 3000,
      repeat: -1,
      onUpdate: (tween) => {
        if (!text.scene) return
        const hue = tween.getValue()
        if (hue !== null) {
          const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color
          text.setTint(color)
          text.setText(`Hue: ${Math.round(hue)}°`)
        }
      },
    })
  }

  useEffect(() => {
    return () => {
      if (tweenRef.current) {
        tweenRef.current.stop()
        tweenRef.current = null
      }
    }
  }, [])

  return (
    <View
      backgroundColor={0x1a1a2e}
      width={250}
      height={120}
      padding={{ top: 20, left: 20, right: 20, bottom: 20 }}
      alignItems="center"
      justifyContent="center"
    >
      <Text text="Color cycling text" ref={handleTextRef} style={{ fontSize: 18 }} />
    </View>
  )
}

/**
 * Example showing how to use refs with View (Container) components
 * @returns JSX element
 */
export function RefContainerExample() {
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const tweenRef = useRef<Phaser.Tweens.Tween | null>(null)
  const [value, setValue] = useState(0)

  const handleContainerRef = (container: Phaser.GameObjects.Container | null) => {
    if (!container || !container.scene) return
    containerRef.current = container

    // Create a smooth rotation animation
    if (!tweenRef.current)
      tweenRef.current = container.scene.tweens.add({
        targets: container,
        angle: 360,
        duration: 4000,
        repeat: -1,
        ease: 'Linear',
      })
  }

  useEffect(() => {
    return () => {
      if (tweenRef.current) {
        tweenRef.current.stop()
        tweenRef.current = null
      }
    }
  }, [])

  // Use OriginView for clean rotation around center point
  return (
    <OriginView
      cornerRadius={42}
      backgroundColor={0x16213e}
      borderColor={0xaaaa00}
      borderWidth={2}
      width={200}
      height={100}
      alignItems="center"
      justifyContent="center"
      originX={0.5}
      originY={0.5}
      ref={handleContainerRef}
      onPointerDown={() => setValue(value + 1)}
    >
      <Text text={`Smooth rotation ${value}`} style={{ fontSize: 16, color: '#ffffff' }} />
    </OriginView>
  )
}

/**
 * Advanced example: Using ref callbacks for animations
 * @returns JSX element
 */
export function RefAnimationExample() {
  const tweenRef = useRef<Phaser.Tweens.Tween | null>(null)
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)

  const handleTextRef = (text: Phaser.GameObjects.Text | null) => {
    if (!text) return
    textRef.current = text
  }

  const handleClick = () => {
    if (tweenRef.current && !tweenRef.current.isDestroyed()) {
      tweenRef.current.restart()
    } else if (textRef.current?.scene) {
      tweenRef.current = textRef.current.scene.tweens.add({
        targets: textRef.current,
        alpha: { from: 0, to: 1 },
        y: { from: textRef.current.y - 50, to: textRef.current.y },
        duration: 2000,
        ease: 'Bounce.easeOut',
      })
    }
  }

  useEffect(() => {
    handleClick()
    return () => {
      if (tweenRef.current) {
        tweenRef.current.stop()
        tweenRef.current = null
      }
    }
  }, [])

  return (
    <View
      backgroundColor={0x0f3460}
      width={200}
      height={60}
      justifyContent="center"
      alignItems="center"
      onPointerDown={handleClick}
    >
      <Text text="Bouncing text" ref={handleTextRef} style={{ fontSize: 16, color: '#e94560' }} />
    </View>
  )
}

/**
 * Example showing type-safe ref usage
 * @returns JSX element
 */
export function TypeSafeRefExample() {
  // Type-safe refs ensure you can only call valid Phaser methods
  const textRef: RefObject<Phaser.GameObjects.Text> = { current: null }
  const clickTweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  const handleClick = () => {
    if (textRef.current) {
      // TypeScript knows these are valid Text methods
      textRef.current.setText('Clicked!')
      textRef.current.setColor('#00ff00')

      // Start a bounce animation
      if (clickTweenRef.current && !clickTweenRef.current.isDestroyed()) {
        clickTweenRef.current.restart()
      } else if (textRef.current.scene) {
        clickTweenRef.current = textRef.current.scene.tweens.add({
          targets: textRef.current,
          scaleX: { from: 1, to: 1.2 },
          scaleY: { from: 1, to: 1.2 },
          duration: 200,
          yoyo: true,
          ease: 'Power2',
          onComplete: () => {
            textRef.current?.setText('Click me!')
            textRef.current?.setColor('#ffffff')
          },
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      if (clickTweenRef.current) {
        clickTweenRef.current.stop()
        clickTweenRef.current = null
      }
    }
  }, [])

  return (
    <View
      backgroundColor={0x533483}
      width={180}
      height={80}
      alignItems="center"
      justifyContent="center"
      onPointerDown={handleClick}
    >
      <Text text="Click me!" ref={textRef} style={{ fontSize: 16, color: '#ffffff' }} />
    </View>
  )
}

export function RefExample() {
  return (
    <View gap={20} backgroundColor={0x0d0d0d}>
      <Text text="Ref Examples" style={{ fontSize: 24, color: '#ffffff' }} />
      <RefTextExample />
      <RefContainerExample />
      <RefAnimationExample />
      <TypeSafeRefExample />
    </View>
  )
}
