/**
 * Example demonstrating ref usage to access and manipulate Phaser objects directly
 */
import type { RefObject } from '@number10/phaserjsx'
import {
  RefOriginView,
  ScrollView,
  Text,
  useEffect,
  useRef,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import Phaser from 'phaser'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Example showing how to use refs with Text components
 * @returns JSX element
 */
export function RefTextExample() {
  const tokens = useThemeTokens()
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
    <ViewLevel3 width={250} height={120} alignItems="center" justifyContent="center">
      <Text text="Bouncing text" ref={handleTextRef} style={tokens?.textStyles.large} />
    </ViewLevel3>
  )
}

/**
 * Example showing how to use refs with View (Container) components
 * @returns JSX element
 */
export function RefContainerExample() {
  const tokens = useThemeTokens()
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
    <RefOriginView
      cornerRadius={42}
      backgroundColor={tokens?.colors.surface.dark.toNumber()}
      borderColor={tokens?.colors.warning.DEFAULT.toNumber()}
      borderWidth={2}
      width={200}
      height={100}
      alignItems="center"
      justifyContent="center"
      originX={0.5}
      originY={0.5}
      ref={handleContainerRef}
      enableGestures
      onTouch={() => setValue(value + 1)}
    >
      <Text text={`Smooth rotation ${value}`} style={tokens?.textStyles.large} />
    </RefOriginView>
  )
}

/**
 * Advanced example: Using ref callbacks for animations
 * @returns JSX element
 */
export function RefAnimationExample() {
  const tokens = useThemeTokens()
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
    <ViewLevel3
      width={200}
      height={60}
      justifyContent="center"
      alignItems="center"
      enableGestures={true}
      onTouch={handleClick}
    >
      <Text text="Bouncing text" ref={handleTextRef} style={tokens?.textStyles.large} />
    </ViewLevel3>
  )
}

/**
 * Example showing type-safe ref usage
 * @returns JSX element
 */
export function TypeSafeRefExample() {
  const tokens = useThemeTokens()
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
    <ViewLevel3
      width={180}
      height={80}
      alignItems="center"
      justifyContent="center"
      enableGestures={true}
      onTouch={handleClick}
    >
      <Text text="Click me!" ref={textRef} style={tokens?.textStyles.large} />
    </ViewLevel3>
  )
}

export function RefExample() {
  const tokens = useThemeTokens()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <Text text="Ref Examples" style={tokens?.textStyles.title} />
          <RefTextExample />
          <RefContainerExample />
          <RefAnimationExample />
          <TypeSafeRefExample />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
