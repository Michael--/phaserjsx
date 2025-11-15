/**
 * Example demonstrating ref usage to access and manipulate Phaser objects directly
 */
import type { RefObject } from '@phaserjsx/ui'
import { Text, useRef, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

/**
 * Example showing how to use refs with Text components
 * @returns JSX element
 */
export function RefTextExample() {
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)

  // Simulate an effect that manipulates the text after mount
  setInterval(() => {
    if (textRef.current) {
      // Direct access to Phaser Text object, use some random manipulation
      textRef.current.setStyle({ fontSize: Math.random() * 20 + 10, color: '#ff0000' })
      textRef.current.setText('Modified via ref!')
    }
  }, 1000)

  return (
    <View backgroundColor={0x412121} width={200} height={100}>
      <Text text="Original text" x={100} y={100} ref={textRef} />
    </View>
  )
}

/**
 * Example showing how to use refs with View (Container) components
 * @returns JSX element
 */
export function RefContainerExample() {
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)

  setInterval(() => {
    if (containerRef.current) {
      // Direct access to Phaser Container
      containerRef.current.setAlpha(0.5)
      containerRef.current.setAngle(Math.random() * 45)
    }
  }, 1000)

  return (
    <View backgroundColor={0x412121} x={200} y={200} ref={containerRef}>
      <Text text="Rotated container" />
    </View>
  )
}

/**
 * Advanced example: Using ref callbacks for animations
 * @returns JSX element
 */
export function RefAnimationExample() {
  const handleTextRef = (text: Phaser.GameObjects.Text | null) => {
    if (!text) return

    // Animate the text when it's mounted
    const scene = text.scene
    scene.tweens.add({
      targets: text,
      alpha: { from: 0, to: 1 },
      y: { from: text.y - 50, to: text.y },
      duration: 2000,
      ease: 'Power2',
    })
  }

  return <Text text="Animated text" x={300} y={300} ref={handleTextRef} />
}

/**
 * Example showing type-safe ref usage
 * @returns JSX element
 */
export function TypeSafeRefExample() {
  // Type-safe refs ensure you can only call valid Phaser methods
  const textRef: RefObject<Phaser.GameObjects.Text> = { current: null }

  const handleClick = () => {
    if (textRef.current) {
      // TypeScript knows these are valid Text methods
      textRef.current.setText('Clicked!')
      textRef.current.setColor('#00ff00')

      // These would cause TypeScript errors:
      // textRef.current.invalidMethod() // Error: Property doesn't exist
      // textRef.current.list // Error: Property doesn't exist on Text
    }
  }

  return (
    <View onPointerDown={handleClick}>
      <Text text="Click me!" ref={textRef} />
    </View>
  )
}

export function RefExample() {
  return (
    <View gap={10}>
      <RefTextExample />
      <RefContainerExample />
      <RefAnimationExample />
      <TypeSafeRefExample />
    </View>
  )
}
