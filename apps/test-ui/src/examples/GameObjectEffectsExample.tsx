/**
 * Example: Using game object effects (shake, pulse, fade)
 * Demonstrates the reusable effect system
 */
import { Text, View, useRef } from '@phaserjsx/ui'
import { Button } from '../components'
import {
  createFadeEffect,
  createPulseEffect,
  createShakeEffect,
  useGameObjectEffect,
} from '../hooks'

/**
 * Interactive demo showing all available effects
 */
export function GameObjectEffectsExample() {
  const viewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(viewRef)

  const triggerShake = () => {
    applyEffect(createShakeEffect, { magnitude: 8, time: 300 })
  }

  const triggerPulse = () => {
    applyEffect(createPulseEffect, { intensity: 1.3, time: 200 })
  }

  const triggerFade = () => {
    applyEffect(createFadeEffect, { time: 500 })
  }

  const triggerCombined = () => {
    // applyEffect(createFadeEffect, { intensity: 1.2, time: 200 })
    applyEffect(createPulseEffect, { intensity: 1.3, time: 200 })
    applyEffect(createShakeEffect, { magnitude: 5, time: 200 })
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
        text="Game Object Effects"
        style={{ fontSize: 20, color: 'yellow', fontStyle: 'bold' }}
      />

      <View direction="row">
        <View direction="column" gap={10} alignItems="stretch" justifyContent="center">
          <Button text="Shake" onClick={triggerShake} />
          <Button text="Pulse" onClick={triggerPulse} />
          <Button text="Fade" onClick={triggerFade} />
          <Button text="Combined" onClick={triggerCombined} />
        </View>
        <View
          ref={viewRef}
          margin={25}
          width={150}
          height={150}
          backgroundColor={0x995522}
          justifyContent="center"
          alignItems="center"
          cornerRadius={12}
        >
          <Text text="Bother me" />
        </View>
      </View>
    </View>
  )
}
