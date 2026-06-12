/** @jsxImportSource ../.. */
/**
 * ColorPicker component
 * HSL color selection with themed preview, gradient sliders, and optional tone controls.
 */
import * as Phaser from 'phaser'
import type { ViewProps } from '..'
import { darken, hslToNumber, lighten, numberToHex, numberToHsl, numberToRgb } from '../../colors'
import { useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { VNodeLike } from '../../vdom'
import { Graphics, RadioGroup, Text, View } from '../index'
import { Slider } from './Slider'

export type ColorPickerTone = 'vivid' | 'muted'

export interface ColorPickerState {
  /** Hue in degrees, 0 to 360 */
  hue: number
  /** Saturation percentage, 0 to 100 */
  saturation: number
  /** Lightness percentage, 0 to 100 */
  lightness: number
  /** Last selected tone preset */
  tone: ColorPickerTone
}

export interface ColorPickerLabels {
  title?: string
  tone?: string
  vivid?: string
  muted?: string
  hue?: string
  saturation?: string
  lightness?: string
  close?: string
  formatHue?: (value: number) => string
  formatSaturation?: (value: number) => string
  formatLightness?: (value: number) => string
  formatRgb?: (rgb: { r: number; g: number; b: number }) => string
}

export interface ColorPickerProps extends Omit<ViewProps, 'children'> {
  /** Current color as Phaser color number (controlled mode). */
  value?: number
  /** Initial color as Phaser color number (uncontrolled mode). */
  defaultValue?: number
  /** Callback fired when the selected color changes. */
  onChange?: (color: number, state: ColorPickerState) => void
  /** Current tone preset (controlled mode). */
  tone?: ColorPickerTone
  /** Initial tone preset. */
  defaultTone?: ColorPickerTone
  /** Callback fired when the tone preset changes. */
  onToneChange?: (tone: ColorPickerTone) => void
  /** Callback for the optional close button. */
  onClose?: () => void
  /** Show close button. Defaults to true when onClose is provided. */
  showCloseButton?: boolean
  /** Show vivid/muted tone controls. */
  showTone?: boolean
  /** Show generated shade swatches. */
  showSwatches?: boolean
  /** Show RGB text below the preview. */
  showRgbLabel?: boolean
  /** Localized labels and value formatters. */
  labels?: ColorPickerLabels
  /** Slider track length in pixels. */
  trackLength?: number
  /** Preview swatch size in pixels. */
  previewSize?: number
  /** Number of color steps used for gradient tracks. */
  gradientSteps?: number
  /** Theme overrides. */
  theme?: PartialTheme
}

const DEFAULT_LABELS: Required<
  Omit<ColorPickerLabels, 'formatHue' | 'formatSaturation' | 'formatLightness' | 'formatRgb'>
> = {
  title: 'Color Picker',
  tone: 'Tone',
  vivid: 'Vivid',
  muted: 'Muted',
  hue: 'Hue',
  saturation: 'Saturation',
  lightness: 'Lightness',
  close: 'X',
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function colorPickerHslToNumber(hue: number, saturation: number, lightness: number): number {
  return hslToNumber(
    clamp(hue, 0, 360) / 360,
    clamp(saturation, 0, 100) / 100,
    clamp(lightness, 0, 100) / 100
  )
}

function numberToHslValues(color: number): Omit<ColorPickerState, 'tone'> {
  const hsl = numberToHsl(color)

  return {
    hue: Math.round(hsl.h * 360),
    saturation: Math.round(hsl.s * 100),
    lightness: Math.round(hsl.l * 100),
  }
}

/**
 * ColorPicker component
 * Provides an HSL color picker using the existing Slider and RadioGroup controls.
 */
export function ColorPicker(props: ColorPickerProps): VNodeLike {
  const {
    value,
    defaultValue = 0x2f80ed,
    onChange,
    tone,
    defaultTone = 'vivid',
    onToneChange,
    onClose,
    showCloseButton,
    showTone = true,
    showSwatches = true,
    showRgbLabel = true,
    labels: labelOverrides,
    trackLength: trackLengthProp,
    previewSize: previewSizeProp,
    gradientSteps: gradientStepsProp,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('ColorPicker', mergedLocalTheme, {})

  const initialHsl = numberToHslValues(value ?? defaultValue)
  const [hue, setHue] = useState(initialHsl.hue)
  const [saturation, setSaturation] = useState(initialHsl.saturation)
  const [lightness, setLightness] = useState(initialHsl.lightness)
  const [internalTone, setInternalTone] = useState<ColorPickerTone>(tone ?? defaultTone)
  const lastEmittedColor = useRef<number | undefined>(undefined)

  const resolvedTone = tone ?? internalTone
  const currentColor = colorPickerHslToNumber(hue, saturation, lightness)
  const rgb = numberToRgb(currentColor)
  const hexLabel = numberToHex(currentColor).toUpperCase()

  const labels = {
    ...DEFAULT_LABELS,
    ...(themed.labels ?? {}),
    ...(labelOverrides ?? {}),
  }

  const labelStyle = themed.labelStyle ?? { color: '#ffffff', fontSize: '12px' }
  const valueStyle = themed.valueStyle ?? labelStyle
  const titleStyle = themed.titleStyle ?? { color: '#ffffff', fontSize: '16px', fontStyle: 'bold' }
  const trackLength = trackLengthProp ?? themed.trackLength ?? 280
  const trackHeight = themed.trackHeight ?? 14
  const previewSize = previewSizeProp ?? themed.previewSize ?? 116
  const gradientSteps = gradientStepsProp ?? themed.gradientSteps ?? 32
  const borderColor = themed.borderColor ?? 0x354052
  const surfaceColor = themed.backgroundColor ?? 0x17202e
  const overlayColor = themed.controlBackgroundColor ?? 0x223047
  const thumbBorderColor = themed.thumbBorderColor ?? 0xffffff
  const swatchSize = themed.swatchSize ?? 18
  const shouldShowCloseButton = showCloseButton ?? onClose !== undefined

  useEffect(() => {
    if (value === undefined || value === lastEmittedColor.current) return

    const next = numberToHslValues(value)
    setHue(next.hue)
    setSaturation(next.saturation)
    setLightness(next.lightness)
  }, [value])

  useEffect(() => {
    if (tone !== undefined && tone !== internalTone) {
      setInternalTone(tone)
    }
  }, [tone, internalTone])

  const emitChange = (
    nextHue: number,
    nextSaturation: number,
    nextLightness: number,
    nextTone = resolvedTone
  ) => {
    const nextColor = colorPickerHslToNumber(nextHue, nextSaturation, nextLightness)
    lastEmittedColor.current = nextColor
    onChange?.(nextColor, {
      hue: nextHue,
      saturation: nextSaturation,
      lightness: nextLightness,
      tone: nextTone,
    })
  }

  const updateColor = (
    nextHue: number,
    nextSaturation: number,
    nextLightness: number,
    nextTone = resolvedTone
  ) => {
    const roundedHue = Math.round(clamp(nextHue, 0, 360))
    const roundedSaturation = Math.round(clamp(nextSaturation, 0, 100))
    const roundedLightness = Math.round(clamp(nextLightness, 0, 100))

    setHue(roundedHue)
    setSaturation(roundedSaturation)
    setLightness(roundedLightness)
    emitChange(roundedHue, roundedSaturation, roundedLightness, nextTone)
  }

  const updateFromColor = (color: number) => {
    const next = numberToHslValues(color)
    updateColor(next.hue, next.saturation, next.lightness)
  }

  const updateTone = (nextTone: ColorPickerTone) => {
    const nextSaturation =
      nextTone === 'muted'
        ? Math.round(saturation * 0.6)
        : Math.round(clamp(saturation / 0.6, Math.max(saturation, 70), 100))

    if (tone === undefined) {
      setInternalTone(nextTone)
    }

    onToneChange?.(nextTone)
    updateColor(hue, nextSaturation, lightness, nextTone)
  }

  const swatches = [
    darken(currentColor, 0.35),
    darken(currentColor, 0.15),
    currentColor,
    lighten(currentColor, 0.2),
    lighten(currentColor, 0.4),
  ]
  const thumbSize = themed.thumbSize ?? 18
  const thumbRadius = thumbSize / 2
  const thumbShadowOffset = Math.max(1, Math.round(thumbRadius * 0.22))

  const sliderTheme: PartialTheme = mergeThemes(nestedTheme, {
    Slider: {
      trackHeight,
      trackBorderRadius: trackHeight / 2,
      thumbSize,
      thumbBorderWidth: 2,
      thumbBorderColor,
    },
  })

  const renderGradientTrack = (getColor: (progress: number) => number) => () => (
    <View width={trackLength} height={trackHeight}>
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          g.clear()
          const stepWidth = trackLength / gradientSteps

          for (let i = 0; i < gradientSteps; i += 1) {
            const progress = gradientSteps === 1 ? 1 : i / (gradientSteps - 1)
            g.fillStyle(getColor(progress), 1)
            g.fillRect(i * stepWidth, 0, stepWidth + 1, trackHeight)
          }
        }}
      />
    </View>
  )

  const renderThumb = (color: number) => (_value: number, isDragging: boolean) => (
    <Graphics
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()
        g.fillStyle(0x000000, 0.32)
        g.fillCircle(0, thumbShadowOffset, thumbRadius)
        g.fillStyle(color, 1)
        g.fillCircle(0, 0, thumbRadius)
        g.lineStyle(2, thumbBorderColor, 1)
        g.strokeCircle(0, 0, thumbRadius)

        if (isDragging) {
          g.lineStyle(2, color, 0.7)
          g.strokeCircle(0, 0, thumbRadius + 4)
        }
      }}
      scale={isDragging ? 1.2 : 1}
    />
  )

  const renderValueRow = (label: string, valueText: string) => (
    <View direction="row" width={trackLength} justifyContent="space-between">
      <Text text={label} style={labelStyle} />
      <Text text={valueText} style={valueStyle} />
    </View>
  )

  return (
    <View
      {...viewProps}
      direction="row"
      gap={themed.gap ?? 18}
      padding={themed.padding ?? 14}
      backgroundColor={surfaceColor}
      borderColor={borderColor}
      borderWidth={themed.borderWidth ?? 1}
      cornerRadius={themed.cornerRadius ?? 8}
      alignItems="center"
      theme={nestedTheme}
    >
      <View gap={themed.previewGap ?? 10} width={Math.max(previewSize, 132)}>
        <View
          width={previewSize}
          height={previewSize}
          backgroundColor={currentColor}
          borderColor={borderColor}
          borderWidth={themed.previewBorderWidth ?? 2}
          cornerRadius={themed.previewCornerRadius ?? 8}
          alignItems="center"
          justifyContent="center"
          theme={nestedTheme}
        >
          <Text text={hexLabel} style={themed.hexStyle ?? { ...valueStyle, fontStyle: 'bold' }} />
        </View>

        {showRgbLabel ? (
          <Text
            text={labels.formatRgb ? labels.formatRgb(rgb) : `rgb ${rgb.r}, ${rgb.g}, ${rgb.b}`}
            style={labelStyle}
          />
        ) : null}

        {showSwatches ? (
          <View direction="row" gap={themed.swatchGap ?? 6}>
            {swatches.map((swatch, index) => (
              <View
                key={`swatch-${index}`}
                width={swatchSize}
                height={swatchSize}
                backgroundColor={swatch}
                borderColor={borderColor}
                borderWidth={1}
                cornerRadius={themed.swatchCornerRadius ?? 4}
                onTouch={() => updateFromColor(swatch)}
                theme={nestedTheme}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View gap={themed.controlGap ?? 12} theme={sliderTheme}>
        <View
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width={trackLength}
        >
          <Text text={labels.title} style={titleStyle} />

          {shouldShowCloseButton ? (
            <View
              width={themed.closeButtonSize ?? 24}
              height={themed.closeButtonSize ?? 24}
              alignItems="center"
              justifyContent="center"
              backgroundColor={overlayColor}
              backgroundAlpha={themed.controlBackgroundAlpha ?? 0.65}
              borderColor={borderColor}
              borderWidth={1}
              cornerRadius={themed.closeButtonCornerRadius ?? 5}
              onTouch={() => onClose?.()}
              theme={nestedTheme}
            >
              <Text text={labels.close} style={labelStyle} />
            </View>
          ) : null}
        </View>

        {showTone ? (
          <View direction="row" gap={12} alignItems="center">
            <Text text={labels.tone} style={labelStyle} />
            <RadioGroup
              direction="row"
              options={[
                { value: 'vivid', label: labels.vivid },
                { value: 'muted', label: labels.muted },
              ]}
              value={resolvedTone}
              onChange={(nextTone) => updateTone(nextTone as ColorPickerTone)}
            />
          </View>
        ) : null}

        <View gap={6}>
          {renderValueRow(labels.hue, labels.formatHue?.(hue) ?? `${Math.round(hue)}deg`)}
          <Slider
            value={hue}
            onChange={(nextHue: number) => updateColor(nextHue, saturation, lightness)}
            min={0}
            max={360}
            step={1}
            trackLength={trackLength}
            renderTrack={renderGradientTrack((progress) =>
              colorPickerHslToNumber(progress * 360, 100, 50)
            )}
            renderThumb={renderThumb(colorPickerHslToNumber(hue, 100, 50))}
          />
        </View>

        <View gap={6}>
          {renderValueRow(
            labels.saturation,
            labels.formatSaturation?.(saturation) ?? `${Math.round(saturation)}%`
          )}
          <Slider
            value={saturation}
            onChange={(nextSaturation: number) => updateColor(hue, nextSaturation, lightness)}
            min={0}
            max={100}
            step={1}
            trackLength={trackLength}
            renderTrack={renderGradientTrack((progress) =>
              colorPickerHslToNumber(hue, progress * 100, lightness)
            )}
            renderThumb={renderThumb(currentColor)}
          />
        </View>

        <View gap={6}>
          {renderValueRow(
            labels.lightness,
            labels.formatLightness?.(lightness) ?? `${Math.round(lightness)}%`
          )}
          <Slider
            value={lightness}
            onChange={(nextLightness: number) => updateColor(hue, saturation, nextLightness)}
            min={0}
            max={100}
            step={1}
            trackLength={trackLength}
            renderTrack={renderGradientTrack((progress) =>
              colorPickerHslToNumber(hue, saturation, progress * 100)
            )}
            renderThumb={renderThumb(currentColor)}
          />
        </View>
      </View>
    </View>
  )
}
