import {
  darken,
  Graphics,
  lighten,
  numberToHex,
  numberToRgb,
  RadioGroup,
  rgbToHsl,
  Slider,
  Text,
  useEffect,
  useForceRedraw,
  useSpring,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'
import type { AppProps } from './types'

type ColorSliderProps = AppProps & {
  isColorMixerOpen: boolean
  onColorMixerChange: (isOpen: boolean) => void
}

/**
 * ColorSlider component - provides HSL sliders to adjust color and updates tint$
 */
export function ColorSlider(props: ColorSliderProps) {
  const tokens = useThemeTokens()
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(75)
  const [lightness, setLightness] = useState(55)
  const [mixMode, setMixMode] = useState<'vivid' | 'muted'>('vivid')
  const [panelAlpha, setPanelAlpha] = useSpring(props.isColorMixerOpen ? 1 : 0, 'gentle')

  const updateFromColor = (color: number) => {
    const rgbColor = numberToRgb(color)
    const hsl = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b)
    const nextHue = Math.round(hsl.h * 360)
    const nextSaturation = Math.round(hsl.s * 100)
    const nextLightness = Math.round(hsl.l * 100)
    setHue((prev) => (prev === nextHue ? prev : nextHue))
    setSaturation((prev) => (prev === nextSaturation ? prev : nextSaturation))
    setLightness((prev) => (prev === nextLightness ? prev : nextLightness))
  }

  const hueNormalized = hue / 360
  const satNormalized = saturation / 100
  const lightNormalized = lightness / 100
  const mixedSaturation = mixMode === 'vivid' ? satNormalized : satNormalized * 0.6
  const currentColor = Phaser.Display.Color.HSLToColor(
    hueNormalized,
    mixedSaturation,
    lightNormalized
  ).color
  const hexLabel = numberToHex(currentColor).toUpperCase()
  const rgb = numberToRgb(currentColor)

  useEffect(() => {
    props.tint$.next(currentColor)
  }, [currentColor, props.tint$])

  useEffect(() => {
    const subscription = props.tint$.subscribe((color) => {
      updateFromColor(color)
    })

    return () => subscription.unsubscribe()
  }, [props.tint$])

  const trackLength = 280
  const trackHeight = 14
  const steps = 32
  const borderColor = tokens?.colors.border.light.toNumber() ?? 0x333333
  const surfaceColor = tokens?.colors.surface.medium.toNumber() ?? 0x202020
  const overlayColor = tokens?.colors.surface.light.toNumber() ?? 0x2a2a2a
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#ffffff'
  const labelStyle = tokens?.textStyles.small ?? { fontSize: '12px', color: textColor }
  const titleStyle =
    tokens?.textStyles.medium ??
    ({ fontSize: '16px', fontStyle: 'bold', color: textColor } as const)
  const swatches = [
    darken(currentColor, 0.35),
    darken(currentColor, 0.15),
    currentColor,
    lighten(currentColor, 0.2),
    lighten(currentColor, 0.4),
  ]

  const sliderTheme = {
    Slider: {
      trackHeight,
      trackBorderRadius: trackHeight / 2,
      thumbSize: 18,
      thumbBorderWidth: 2,
      thumbBorderColor: tokens?.colors.surface.lightest.toNumber() ?? 0xffffff,
    },
  }

  const renderGradientTrack = (getColor: (t: number) => number) => () => (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()
        const stepWidth = trackLength / steps
        for (let i = 0; i < steps; i += 1) {
          const t = i / (steps - 1)
          g.fillStyle(getColor(t), 1)
          g.fillRect(i * stepWidth, 0, stepWidth + 1, trackHeight)
        }
      }}
    />
  )

  const renderThumb = (color: number) => (_value: number, isDragging: boolean) => (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()
        g.fillStyle(0x000000, 0.35)
        g.fillCircle(0, 5, 10)
        g.fillStyle(color, 1)
        g.fillCircle(0, 3, 10)
        g.lineStyle(2, tokens?.colors.surface.lightest.toNumber() ?? 0xffffff, 1)
        g.strokeCircle(0, 3, 10)
        if (isDragging) {
          g.lineStyle(2, color, 0.7)
          g.strokeCircle(0, 3, 14)
        }
      }}
      scale={isDragging ? 1.25 : 1}
    />
  )

  useForceRedraw(20, panelAlpha)

  useEffect(() => {
    setPanelAlpha(props.isColorMixerOpen ? 1 : 0)
  }, [props.isColorMixerOpen, setPanelAlpha])

  const closePanel = () => {
    props.onColorMixerChange(false)
  }

  return (
    <View direction="column" gap={8} alignItems="start">
      <View
        direction="row"
        gap={20}
        padding={14}
        backgroundColor={surfaceColor}
        borderColor={borderColor}
        borderWidth={1}
        cornerRadius={12}
        alignItems="center"
        alpha={panelAlpha.value}
      >
        <View gap={10} width={140}>
          <View
            width={120}
            height={120}
            backgroundColor={currentColor}
            borderColor={borderColor}
            borderWidth={2}
            cornerRadius={16}
            alignItems="center"
            justifyContent="center"
          >
            <Text text={hexLabel} style={{ ...labelStyle, fontStyle: 'bold' }} />
          </View>
          <Text text={`rgb ${rgb.r}, ${rgb.g}, ${rgb.b}`} style={labelStyle} />
          <View direction="row" gap={6}>
            {swatches.map((swatch, index) => (
              <View
                key={`swatch-${index}`}
                width={18}
                height={18}
                backgroundColor={swatch}
                borderColor={borderColor}
                borderWidth={1}
                cornerRadius={4}
                onTouch={() => {
                  updateFromColor(swatch)
                }}
              />
            ))}
          </View>
        </View>

        <View gap={12} theme={sliderTheme}>
          <View
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width={trackLength}
          >
            <Text text="Color Mixer" style={titleStyle} />
            <View
              width={22}
              height={22}
              alignItems="center"
              justifyContent="center"
              backgroundColor={overlayColor}
              backgroundAlpha={0.5}
              borderColor={borderColor}
              borderWidth={1}
              cornerRadius={6}
              onTouch={closePanel}
            >
              <Text text="X" style={labelStyle} />
            </View>
          </View>

          <View direction="row" gap={12} alignItems="center">
            <Text text="Tone" style={labelStyle} />
            <RadioGroup
              direction="row"
              options={[
                { value: 'vivid', label: 'Vivid' },
                { value: 'muted', label: 'Muted' },
              ]}
              value={mixMode}
              onChange={(value) => setMixMode(value as 'vivid' | 'muted')}
            />
          </View>

          <View gap={6}>
            <View direction="row" width={trackLength} justifyContent="space-between">
              <Text text="Hue" style={labelStyle} />
              <Text text={`${Math.round(hue)}deg`} style={labelStyle} />
            </View>
            <Slider
              value={hue}
              onChange={setHue}
              min={0}
              max={360}
              step={1}
              trackLength={trackLength}
              renderTrack={renderGradientTrack(
                (t) => Phaser.Display.Color.HSLToColor(t, 1, 0.5).color
              )}
              renderThumb={renderThumb(
                Phaser.Display.Color.HSLToColor(hueNormalized, 1, 0.5).color
              )}
            />
          </View>

          <View gap={6}>
            <View direction="row" width={trackLength} justifyContent="space-between">
              <Text text="Saturation" style={labelStyle} />
              <Text text={`${Math.round(saturation)}%`} style={labelStyle} />
            </View>
            <Slider
              value={saturation}
              onChange={setSaturation}
              min={0}
              max={100}
              step={1}
              trackLength={trackLength}
              renderTrack={renderGradientTrack(
                (t) => Phaser.Display.Color.HSLToColor(hueNormalized, t, lightNormalized).color
              )}
              renderThumb={renderThumb(currentColor)}
            />
          </View>

          <View gap={6}>
            <View direction="row" width={trackLength} justifyContent="space-between">
              <Text text="Lightness" style={labelStyle} />
              <Text text={`${Math.round(lightness)}%`} style={labelStyle} />
            </View>
            <Slider
              value={lightness}
              onChange={setLightness}
              min={10}
              max={100}
              step={1}
              trackLength={trackLength}
              renderTrack={renderGradientTrack(
                (t) => Phaser.Display.Color.HSLToColor(hueNormalized, mixedSaturation, t).color
              )}
              renderThumb={renderThumb(currentColor)}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
