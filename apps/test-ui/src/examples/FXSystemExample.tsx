/**
 * Example: Phaser FX System Demo
 * Demonstrates GPU-accelerated PostFX/PreFX pipeline effects
 */
import {
  createBlurFX,
  createColorMatrixFX,
  createGlowFX,
  createPixelateFX,
  createShadowFX,
  createVignetteFX,
  Image,
  ScrollView,
  Text,
  useFX,
  useGlow,
  useRef,
  useShadow,
  useState,
  useThemeTokens,
  View,
  WrapText,
} from '@phaserjsx/ui'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

function GlowEffectDemo() {
  const tokens = useThemeTokens()
  const glowRef = useRef(null)
  useGlow(glowRef, {
    color: 0xff6600,
    outerStrength: 2,
    innerStrength: 0.25,
    distance: 30,
  })
  return (
    <View gap={30} alignItems="center">
      <Text text="useGlow" />
      <View
        ref={glowRef}
        width={150}
        height={150}
        backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
        cornerRadius={10}
      />
    </View>
  )
}

function ShadowEffectDemo() {
  const tokens = useThemeTokens()
  const shadowRef = useRef(null)
  useShadow(shadowRef, {
    x: 0.0,
    y: 1.0,
    decay: 0.05,
    color: 0x000000,
    samples: 6,
    intensity: 1,
    power: 0.75,
  })
  return (
    <View gap={30} alignItems="center">
      <Text text="useShadow" />
      <View
        ref={shadowRef}
        width={150}
        height={150}
        backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
        cornerRadius={10}
      />
    </View>
  )
}
/**
 * Main FX System Example component
 */
export function FXSystemExample() {
  const tokens = useThemeTokens()
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyFX, clearFX } = useFX(ref)
  const [appliedFX, setAppliedFX] = useState<string[]>([])

  // Track applied effects
  const trackAndApplyFX = (name: string, creator: typeof createShadowFX, config: object) => {
    applyFX(creator, config)
    setAppliedFX((prev) => [...prev, name])
  }

  const clearAllFX = () => {
    clearFX()
    setAppliedFX([])
  }

  return (
    <ScrollView width="100%" height="100%">
      <ViewLevel2>
        <Text text="Phaser FX System" />
        <Text text="GPU-accelerated PostFX/PreFX pipeline effects" />

        {/* Manual FX Control */}
        <ViewLevel3 gap={30} width={800}>
          <Text text="Manual FX Control & Stacking" />
          <WrapText text="Some combinations of FX may not work well together depending on their configurations. Feel free to experiment with different settings!" />

          <View direction="row" gap={30} alignItems="start">
            {/* FX Demo Area */}
            <View gap={15}>
              <View
                ref={ref}
                width={300}
                height={300}
                backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
                cornerRadius={10}
                alignItems="center"
                justifyContent="center"
                margin={50}
              >
                <Image texture="phaser-jsx-logo" width={200} height={200} />
                <Text text="Stack FX Effects" />
              </View>

              <View direction="row" gap={10} flexWrap="wrap" maxWidth={400}>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Shadow', createShadowFX, { y: 1, decay: 0.1, power: 1.5 })
                  }
                >
                  <Text text="+ Shadow" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Glow', createGlowFX, { color: 0xff6600, outerStrength: 8 })
                  }
                >
                  <Text text="+ Glow" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Blur', createBlurFX, {
                      quality: 1,
                      x: 3,
                      y: 3,
                      strength: 1.5,
                    })
                  }
                >
                  <Text text="+ Blur" />
                </Button>
                <Button
                  onClick={() => trackAndApplyFX('Pixelate', createPixelateFX, { amount: 6 })}
                >
                  <Text text="+ Pixelate" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Vignette', createVignetteFX, { strength: 0.6, radius: 0.4 })
                  }
                >
                  <Text text="+ Vignette" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Grayscale', createColorMatrixFX, {
                      effect: 'grayscale',
                      amount: 1,
                    })
                  }
                >
                  <Text text="+ Grayscale" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Sepia', createColorMatrixFX, { effect: 'sepia', amount: 1 })
                  }
                >
                  <Text text="+ Sepia" />
                </Button>
                <Button
                  onClick={() =>
                    trackAndApplyFX('Negative', createColorMatrixFX, {
                      effect: 'negative',
                      amount: 1,
                    })
                  }
                >
                  <Text text="+ Negative" />
                </Button>
                <Button onClick={clearAllFX}>
                  <Text text="Clear All FX" />
                </Button>
              </View>
            </View>

            {/* Applied FX List */}
            <View
              gap={10}
              padding={15}
              backgroundColor={0x1a1a1a}
              cornerRadius={8}
              minWidth={200}
              maxWidth={250}
              height={300}
              margin={50}
            >
              <Text text="Applied FX Stack:" />
              <View gap={5}>
                {appliedFX.length === 0 ? (
                  <Text text="(none)" alpha={0.5} />
                ) : (
                  appliedFX.map((fx, i) => (
                    <View key={Math.random()} direction="row" gap={5}>
                      <Text text={`${i + 1}.`} alpha={0.6} />
                      <Text text={fx} />
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ViewLevel3>

        {/* Convenience Hooks */}
        <ViewLevel3 gap={30}>
          <Text text="Convenience Hooks (Automatic FX)" />
          <View direction="row" gap={100} flexWrap="wrap" padding={30}>
            <ShadowEffectDemo />
            <GlowEffectDemo />
          </View>
        </ViewLevel3>
      </ViewLevel2>
    </ScrollView>
  )
}
