/**
 * Example: Using game object effects (shake, pulse, fade, etc.)
 * Demonstrates the complete effect system with all available animations
 */
import { Text, View, useRef, useState } from '@phaserjsx/ui'
import { Button } from '../components'
import {
  createBounceEffect,
  createBreatheEffect,
  createFadeEffect,
  createFlashEffect,
  createFlipInEffect,
  createFlipOutEffect,
  createFloatEffect,
  createJelloEffect,
  createPressEffect,
  createPulseEffect,
  createShakeEffect,
  createSlideInEffect,
  createSlideOutEffect,
  createSpinEffect,
  createSwingEffect,
  createTadaEffect,
  createWiggleEffect,
  createWobbleEffect,
  createZoomInEffect,
  createZoomOutEffect,
  useGameObjectEffect,
} from '../hooks'

/**
 * Interactive demo showing all available effects
 */
export function GameObjectEffectsExample() {
  const viewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect, stopEffects } = useGameObjectEffect(viewRef)
  const [isVisible, setVisible] = useState(true)
  const [activeContinuous, setActiveContinuous] = useState<Set<string>>(new Set())

  const setIsVisible = (visible: boolean) => {
    // immediate hide, delayed show to avoid flicker
    if (!visible) viewRef.current?.setAlpha(0)
    else {
      setTimeout(() => {
        viewRef.current?.setAlpha(1)
      }, 50)
    }
    setVisible(visible)
  }

  return (
    <View
      backgroundColor={0x1a1a2e}
      backgroundAlpha={1.0}
      padding={20}
      direction="column"
      gap={15}
      alignItems="center"
      justifyContent="center"
    >
      <Text
        text="Game Object Effects Portfolio"
        style={{ fontSize: 24, color: 'yellow', fontStyle: 'bold' }}
      />

      <View direction="row" gap={30}>
        {/* Button Feedback Effects */}
        <View direction="column" gap={8} alignItems="stretch">
          <Text text="Button Feedback" style={{ fontSize: 14, color: 'cyan', fontStyle: 'bold' }} />
          <Button
            text="Shake"
            onClick={() => applyEffect(createShakeEffect, { magnitude: 8, time: 300 })}
          />
          <Button
            text="Pulse"
            onClick={() => applyEffect(createPulseEffect, { intensity: 1.3, time: 300 })}
          />
          <Button
            text="Bounce"
            onClick={() => applyEffect(createBounceEffect, { intensity: 1.3, time: 600 })}
          />
          <Button
            text="Press"
            onClick={() => applyEffect(createPressEffect, { intensity: 0.85, time: 200 })}
          />
          <Button text="Flash" onClick={() => applyEffect(createFlashEffect, { time: 150 })} />
          <Button text="Fade" onClick={() => applyEffect(createFadeEffect, { time: 400 })} />
          <Button
            text="Wobble"
            onClick={() => applyEffect(createWobbleEffect, { magnitude: 0.15, time: 400 })}
          />
          <Button
            text="Jello"
            onClick={() => applyEffect(createJelloEffect, { intensity: 0.15, time: 600 })}
          />
        </View>

        {/* Target View */}
        <View justifyContent="center" direction="column" alignItems="center">
          <View height={100} />
          <View
            ref={viewRef}
            width={180}
            height={180}
            backgroundColor={0x995522}
            justifyContent="center"
            alignItems="center"
            cornerRadius={16}
          >
            <Text text="Target" style={{ fontSize: 18, color: 'white', fontStyle: 'bold' }} />
          </View>
        </View>

        {/* Attention Effects */}
        <View direction="column" gap={8} alignItems="stretch">
          <Text text="Attention" style={{ fontSize: 14, color: 'cyan', fontStyle: 'bold' }} />
          <Button
            text="Tada"
            onClick={() => applyEffect(createTadaEffect, { intensity: 1.15, time: 600 })}
          />
          <Button
            text="Swing"
            onClick={() => applyEffect(createSwingEffect, { magnitude: 0.15, time: 800 })}
          />
          <Button
            text="Wiggle"
            onClick={() => applyEffect(createWiggleEffect, { magnitude: 5, time: 400 })}
          />
          <View margin={{ top: 12 }}>
            <Text text="Entrance/Exit" style={{ fontSize: 14, color: 'cyan', fontStyle: 'bold' }} />
          </View>
          <Button
            text={isVisible ? 'Slide Out →' : 'Slide In ← '}
            onClick={() => {
              if (isVisible) {
                applyEffect(createSlideOutEffect, {
                  direction: 'right',
                  time: 400,
                  onComplete: () => setIsVisible(false),
                })
              } else {
                setIsVisible(true)
                setTimeout(() => {
                  applyEffect(createSlideInEffect, { direction: 'left', time: 400 })
                }, 50)
              }
            }}
          />
          <Button
            text={isVisible ? 'Zoom Out' : 'Zoom In'}
            onClick={() => {
              if (isVisible) {
                applyEffect(createZoomOutEffect, {
                  time: 400,
                  onComplete: () => setIsVisible(false),
                })
              } else {
                setIsVisible(true)
                setTimeout(() => {
                  applyEffect(createZoomInEffect, { time: 400 })
                }, 50)
              }
            }}
          />
          <Button
            text={isVisible ? 'Flip Out' : 'Flip In'}
            onClick={() => {
              if (isVisible) {
                applyEffect(createFlipOutEffect, {
                  time: 500,
                  onComplete: () => setIsVisible(false),
                })
              } else {
                setIsVisible(true)
                setTimeout(() => {
                  applyEffect(createFlipInEffect, { time: 500 })
                }, 50)
              }
            }}
          />
        </View>

        {/* Continuous Effects */}
        <View direction="column" gap={8} alignItems="stretch">
          <Text
            text="Continuous (∞)"
            style={{ fontSize: 14, color: 'orange', fontStyle: 'bold' }}
          />
          <Button
            disabled={activeContinuous.has('float')}
            text="Float"
            onClick={() => {
              applyEffect(createFloatEffect, { magnitude: 15, time: 2000 })
              setActiveContinuous((prev) => new Set(prev).add('float'))
            }}
          />
          <Button
            disabled={activeContinuous.has('breathe')}
            text="Breathe"
            onClick={() => {
              applyEffect(createBreatheEffect, { intensity: 1.08, time: 2000 })
              setActiveContinuous((prev) => new Set(prev).add('breathe'))
            }}
          />
          <Button
            disabled={activeContinuous.has('spin')}
            text="Spin"
            onClick={() => {
              applyEffect(createSpinEffect, { time: 2000 })
              setActiveContinuous((prev) => new Set(prev).add('spin'))
            }}
          />
          <View margin={{ top: 8 }}>
            <Button
              disabled={activeContinuous.size === 0}
              text="Stop All"
              onClick={() => {
                stopEffects()
                setActiveContinuous(new Set())
              }}
            />
          </View>
          <View margin={{ top: 12 }}>
            <Text text="Combined" style={{ fontSize: 14, color: 'lime', fontStyle: 'bold' }} />
          </View>
          <Button
            text="Pulse + Shake"
            onClick={() => {
              applyEffect(createPulseEffect, { intensity: 1.3, time: 300 })
              applyEffect(createShakeEffect, { magnitude: 5, time: 300 })
            }}
          />
          <Button
            text="Flash + Wobble"
            onClick={() => {
              applyEffect(createFlashEffect, { time: 150 })
              applyEffect(createWobbleEffect, { magnitude: 0.1, time: 400 })
            }}
          />
          <Button
            text="Tada + Flash"
            onClick={() => {
              applyEffect(createTadaEffect, { intensity: 1.2, time: 600 })
              applyEffect(createFlashEffect, { time: 150 })
            }}
          />
        </View>
      </View>

      <View direction="column" gap={5} alignItems="center">
        <Text
          text="Note: Entrance/Exit effects show/hide the target box with onComplete callbacks"
          style={{ fontSize: 11, color: 'gray', fontStyle: 'italic' }}
        />
        <Text
          text="Continuous effects can be combined. Each can only be activated once. Use 'Stop All' to reset."
          style={{ fontSize: 11, color: 'gray', fontStyle: 'italic' }}
        />
      </View>
    </View>
  )
}
