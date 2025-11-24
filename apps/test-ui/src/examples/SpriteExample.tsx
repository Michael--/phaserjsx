/**
 * Example: Sprite component with animations and transforms
 * Demonstrates static sprites, rotation, scaling, tinting, and Phaser animations
 */
import { Sprite, Text, useEffect, useRef, useState, useThemeTokens, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { Button, ScrollView } from '../components'
import { ViewLevel2 } from './Helper/ViewLevel'

/**
 * Basic sprite example - static image as sprite
 */
function BasicSpriteExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Basic Sprite (Static)" style={tokens?.textStyles.large} />

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        {/* Sprites are always headless - positioned absolutely */}
        <Sprite texture="phaser-planet" x={100} y={100} />
        <Sprite texture="eye" x={250} y={100} />
      </View>

      <Text
        text="Sprites are always headless (don't affect layout)"
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </ViewLevel2>
  )
}

/**
 * Sprite with transforms (rotation, scale)
 */
function TransformSpriteExample() {
  const tokens = useThemeTokens()
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Sprite Transforms" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        <Button text="Rotate" onClick={() => setRotation((r) => r + Math.PI / 4)} />
        <Button text="Scale" onClick={() => setScale((s) => (s >= 2 ? 0.5 : s + 0.25))} />
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite texture="phaser-jsx-logo" x={200} y={100} rotation={rotation} scale={scale} />
      </View>

      <Text
        text={`Rotation: ${(rotation % (Math.PI * 2)).toFixed(2)} | Scale: ${scale.toFixed(2)}`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </ViewLevel2>
  )
}

/**
 * Sprite with tint colors
 */
function TintSpriteExample() {
  const tokens = useThemeTokens()
  const [tint, setTint] = useState<number | undefined>(undefined)

  const tints = [
    { name: 'None', value: undefined },
    { name: 'Red', value: 0xff0000 },
    { name: 'Green', value: 0x00ff00 },
    { name: 'Blue', value: 0x0000ff },
    { name: 'Purple', value: 0xff00ff },
  ]

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Sprite Tinting" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        {tints.map((t) => (
          <Button text={t.name} onClick={() => setTint(t.value)} />
        ))}
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        {tint !== undefined ? (
          <Sprite texture="phaser-planet" x={200} y={100} tint={tint} scale={1.5} />
        ) : (
          <Sprite texture="phaser-planet" x={200} y={100} scale={1.5} />
        )}
      </View>
    </ViewLevel2>
  )
}

/**
 * Sprite with displayWidth/displayHeight and fit modes
 */
function SizingSpriteExample() {
  const tokens = useThemeTokens()
  const [fit, setFit] = useState<'fill' | 'contain' | 'cover'>('contain')

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Sprite Sizing & Fit Modes" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        <Button text="Fill" onClick={() => setFit('fill')} />
        <Button text="Contain" onClick={() => setFit('contain')} />
        <Button text="Cover" onClick={() => setFit('cover')} />
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        {/* Target size: 120x80 (wider aspect) */}
        <View
          x={70}
          y={60}
          width={120}
          height={80}
          backgroundColor={0x444444}
          alpha={0.3}
          borderColor={0xffff00}
          borderWidth={2}
        />
        <Sprite
          texture="phaser-planet"
          x={130}
          y={100}
          displayWidth={120}
          displayHeight={80}
          fit={fit}
        />

        {/* Target size: 80x120 (taller aspect) */}
        <View
          x={250}
          y={40}
          width={80}
          height={120}
          backgroundColor={0x444444}
          alpha={0.3}
          borderColor={0xffff00}
          borderWidth={2}
        />
        <Sprite
          texture="phaser-planet"
          x={290}
          y={100}
          displayWidth={80}
          displayHeight={120}
          fit={fit}
        />
      </View>

      <Text
        text="Yellow boxes show target size | Fit mode affects scaling"
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </ViewLevel2>
  )
}

/**
 * Sprite with ref access
 */
function RefSpriteExample() {
  const tokens = useThemeTokens()
  const spriteRef = useRef<Phaser.GameObjects.Sprite | null>(null)
  const [info, setInfo] = useState(' ')

  const updateInfo = () => {
    if (spriteRef.current) {
      const s = spriteRef.current
      setInfo(
        `Pos: (${s.x.toFixed(0)}, ${s.y.toFixed(0)}) | ` +
          `Scale: ${s.scaleX.toFixed(2)} | ` +
          `Rotation: ${s.rotation.toFixed(2)} | ` +
          `Size: ${s.displayWidth.toFixed(0)}x${s.displayHeight.toFixed(0)}`
      )
    }
  }

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Sprite Ref Access" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        <Button text="Get Info" onClick={updateInfo} />
        <Button
          text="Random Position"
          onClick={() => {
            if (spriteRef.current) {
              spriteRef.current.setPosition(100 + Math.random() * 200, 50 + Math.random() * 100)
            }
          }}
        />
        <Button
          text="Spin"
          onClick={() => {
            if (spriteRef.current?.scene) {
              spriteRef.current.scene.tweens.add({
                targets: spriteRef.current,
                rotation: spriteRef.current.rotation + Math.PI * 2,
                duration: 1000,
                ease: 'Cubic.easeInOut',
              })
            }
          }}
        />
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite ref={spriteRef} texture="eye" x={200} y={100} />
      </View>

      {info && <Text text={info} style={tokens?.textStyles.small} alpha={0.7} />}
    </ViewLevel2>
  )
}

/**
 * Simple frame-based animation (manual frame switching)
 */
function ManualAnimationExample() {
  const tokens = useThemeTokens()
  const [frame, setFrame] = useState(0)
  const frames = ['button-blue', 'button-green', 'button-red', 'button-yellow']

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Manual Frame Animation" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        <Button
          text="Previous"
          onClick={() => setFrame((f) => (f - 1 + frames.length) % frames.length)}
        />
        <Button text="Next" onClick={() => setFrame((f) => (f + 1) % frames.length)} />
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite texture="ui" frame={frames[frame]!} x={200} y={100} scale={2} />
      </View>

      <Text
        text={`Current frame: ${frames[frame]} (${frame + 1}/${frames.length})`}
        style={tokens?.textStyles.small}
        alpha={0.7}
      />
    </ViewLevel2>
  )
}

/**
 * Phaser animation system example
 */
function PhaserAnimationExample() {
  const tokens = useThemeTokens()
  const spriteRef = useRef<Phaser.GameObjects.Sprite | null>(null)
  const [animStatus, setAnimStatus] = useState('stopped')
  const [currentFrame, setCurrentFrame] = useState(0)

  // Create animation in Phaser
  useEffect(() => {
    if (!spriteRef.current?.scene) return

    const scene = spriteRef.current.scene
    const animKey = 'button-cycle'

    // Create animation if not exists
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        frames: [
          { key: 'ui', frame: 'button-blue' },
          { key: 'ui', frame: 'button-green' },
          { key: 'ui', frame: 'button-red' },
          { key: 'ui', frame: 'button-yellow' },
        ],
        frameRate: 4,
        repeat: -1, // Infinite loop
      })
    }
  }, [])

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Phaser Animation System" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        <Button
          text="Play"
          onClick={() => {
            if (spriteRef.current) {
              spriteRef.current.anims.play('button-cycle')
            }
          }}
        />
        <Button
          text="Pause"
          onClick={() => {
            if (spriteRef.current) {
              spriteRef.current.anims.pause()
            }
          }}
        />
        <Button
          text="Resume"
          onClick={() => {
            if (spriteRef.current) {
              spriteRef.current.anims.resume()
            }
          }}
        />
        <Button
          text="Stop"
          onClick={() => {
            if (spriteRef.current) {
              spriteRef.current.anims.stop()
            }
          }}
        />
      </View>

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite
          ref={spriteRef}
          texture="ui"
          frame="button-blue"
          x={200}
          y={100}
          scale={2}
          onAnimationStart={(key: string) => setAnimStatus(`Playing: ${key}`)}
          onAnimationComplete={(key: string) => setAnimStatus(`Completed: ${key}`)}
          onAnimationUpdate={(_key: string, frame: Phaser.Animations.AnimationFrame) =>
            setCurrentFrame(frame.index)
          }
        />
      </View>

      <View direction="column" gap={5} alignItems="center">
        <Text text={`Status: ${animStatus}`} style={tokens?.textStyles.small} alpha={0.7} />
        <Text text={`Frame: ${currentFrame}`} style={tokens?.textStyles.small} alpha={0.7} />
      </View>
    </ViewLevel2>
  )
}

/**
 * Animation with callbacks
 */
function AnimationCallbacksExample() {
  const tokens = useThemeTokens()
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Animation with Callbacks" style={tokens?.textStyles.large} />

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite
          texture="ui"
          frame="button-blue"
          x={200}
          y={100}
          scale={2}
          animationKey="button-cycle"
          loop={false}
          onAnimationStart={(key: string) => addLog(`Started: ${key}`)}
          onAnimationComplete={(key: string) => addLog(`Completed: ${key}`)}
          onAnimationRepeat={(key: string) => addLog(`Repeat: ${key}`)}
        />
      </View>

      <View
        direction="column"
        gap={5}
        width={380}
        padding={10}
        backgroundColor={0x111111}
        cornerRadius={4}
      >
        <Text text="Event Log:" style={tokens?.textStyles.small} />
        {log.length === 0 ? (
          <Text text="No events yet..." style={tokens?.textStyles.small} alpha={0.5} />
        ) : (
          log.map((entry, i) => <Text key={i} text={entry} style={{ fontSize: 10 }} alpha={0.8} />)
        )}
      </View>
    </ViewLevel2>
  )
}

/**
 * Multiple sprites with different animation speeds
 */
function MultipleAnimationsExample() {
  const tokens = useThemeTokens()
  const sprite1Ref = useRef<Phaser.GameObjects.Sprite | null>(null)
  const sprite2Ref = useRef<Phaser.GameObjects.Sprite | null>(null)
  const sprite3Ref = useRef<Phaser.GameObjects.Sprite | null>(null)

  useEffect(() => {
    if (!sprite1Ref.current?.scene) return
    const scene = sprite1Ref.current.scene

    // Create animations with different speeds
    if (!scene.anims.exists('button-fast')) {
      scene.anims.create({
        key: 'button-fast',
        frames: [
          { key: 'ui', frame: 'button-blue' },
          { key: 'ui', frame: 'button-green' },
          { key: 'ui', frame: 'button-red' },
          { key: 'ui', frame: 'button-yellow' },
        ],
        frameRate: 8,
        repeat: -1,
      })
    }

    if (!scene.anims.exists('button-medium')) {
      scene.anims.create({
        key: 'button-medium',
        frames: [
          { key: 'ui', frame: 'button-blue' },
          { key: 'ui', frame: 'button-green' },
          { key: 'ui', frame: 'button-red' },
          { key: 'ui', frame: 'button-yellow' },
        ],
        frameRate: 4,
        repeat: -1,
      })
    }

    if (!scene.anims.exists('button-slow')) {
      scene.anims.create({
        key: 'button-slow',
        frames: [
          { key: 'ui', frame: 'button-blue' },
          { key: 'ui', frame: 'button-green' },
          { key: 'ui', frame: 'button-red' },
          { key: 'ui', frame: 'button-yellow' },
        ],
        frameRate: 2,
        repeat: -1,
      })
    }
  }, [])

  return (
    <ViewLevel2 direction="column" gap={20} alignItems="center">
      <Text text="Multiple Animation Speeds" style={tokens?.textStyles.large} />

      <View width={400} height={200} backgroundColor={0x222222} cornerRadius={8} direction="stack">
        <Sprite
          ref={sprite1Ref}
          texture="ui"
          frame="button-blue"
          x={100}
          y={100}
          scale={1.5}
          animationKey="button-fast"
        />
        <Sprite
          ref={sprite2Ref}
          texture="ui"
          frame="button-green"
          x={200}
          y={100}
          scale={1.5}
          animationKey="button-medium"
        />
        <Sprite
          ref={sprite3Ref}
          texture="ui"
          frame="button-red"
          x={300}
          y={100}
          scale={1.5}
          animationKey="button-slow"
        />
      </View>

      <View direction="row" gap={20}>
        <Text text="Fast (8 fps)" style={tokens?.textStyles.small} />
        <Text text="Medium (4 fps)" style={tokens?.textStyles.small} />
        <Text text="Slow (2 fps)" style={tokens?.textStyles.small} />
      </View>
    </ViewLevel2>
  )
}

/**
 * Main Sprite example component
 */
export function SpriteExample() {
  const tokens = useThemeTokens()

  return (
    <ScrollView showVerticalSlider>
      <View gap={100}>
        <Text text="Sprite Examples" style={tokens?.textStyles.title} />

        <Text text="Basic Features" style={tokens?.textStyles.large} />
        <View direction="row" gap={100}>
          <BasicSpriteExample />
          <TintSpriteExample />
        </View>
        <View direction="row" gap={100}>
          <SizingSpriteExample />
          <RefSpriteExample />
        </View>
        <TransformSpriteExample />

        <Text text="Animation System" style={tokens?.textStyles.large} />
        <View direction="row" gap={100}>
          <ManualAnimationExample />
          <PhaserAnimationExample />
        </View>
        <View direction="row" gap={100}>
          <AnimationCallbacksExample />
          <MultipleAnimationsExample />
        </View>
      </View>
    </ScrollView>
  )
}
