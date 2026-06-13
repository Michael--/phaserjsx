/** @jsxImportSource ../.. */
/**
 * ActivityIndicator component — indeterminate loading spinner.
 */
import { useEffect, useScene, useState, useTheme } from '../../hooks'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View, type ViewProps } from '../index'

export type ActivityIndicatorVariant = 'spinner' | 'dots' | 'pulse'
export type ActivityIndicatorSize = 'small' | 'medium' | 'large'

export interface ActivityIndicatorLabels {
  loading?: string
}

export interface ActivityIndicatorThemeSlot extends ViewTheme {
  variant?: ActivityIndicatorVariant
  size?: ActivityIndicatorSize
  color?: number
  trackColor?: number
  lineWidth?: number
  gap?: number
  dotCount?: number
  dotSize?: number
  pulseScale?: number
  animationSpeed?: number
  labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
  labels?: ActivityIndicatorLabels
}

export interface ActivityIndicatorProps extends Omit<ViewProps, 'children'> {
  /** Visual variant. */
  variant?: ActivityIndicatorVariant
  /** Size preset. */
  size?: ActivityIndicatorSize
  /** Foreground color of the spinner arc / dots / pulse. */
  color?: number
  /** Track (background) color for the spinner ring. */
  trackColor?: number
  /** Optional visible label below the indicator. */
  label?: string
  /** Localized labels. */
  labels?: ActivityIndicatorLabels
  /** Theme overrides. */
  theme?: PartialTheme
}

function getSizeConfig(size: ActivityIndicatorSize): {
  containerSize: number
  lineWidth: number
  dotSize: number
  dotCount: number
} {
  switch (size) {
    case 'small':
      return { containerSize: 20, lineWidth: 2, dotSize: 5, dotCount: 3 }
    case 'large':
      return { containerSize: 48, lineWidth: 4, dotSize: 10, dotCount: 3 }
    default:
      return { containerSize: 32, lineWidth: 3, dotSize: 7, dotCount: 3 }
  }
}

function drawSpinnerArc(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  radius: number,
  lineWidth: number,
  color: number,
  trackColor: number,
  angle: number
): void {
  g.clear()

  // Track ring (faint)
  g.lineStyle(lineWidth, trackColor, 0.3)
  g.beginPath()
  g.arc(cx, cy, radius, 0, Math.PI * 2)
  g.strokePath()

  // Spinning arc
  const sweep = Math.PI * 0.75
  const start = angle
  const end = start + sweep

  g.lineStyle(lineWidth, color, 1)
  g.beginPath()
  g.arc(cx, cy, radius, start, end)
  g.strokePath()
}

function drawDots(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  dotSize: number,
  color: number,
  count: number,
  activeIndex: number
): void {
  g.clear()
  const spacing = dotSize * 2.2
  const totalWidth = count * spacing - spacing
  const startX = cx - totalWidth / 2

  for (let i = 0; i < count; i++) {
    const alpha = i === activeIndex ? 1 : 0.3
    g.fillStyle(color, alpha)
    g.fillCircle(startX + i * spacing, cy, dotSize / 2)
  }
}

function drawPulse(
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  radius: number,
  color: number,
  progress: number
): void {
  g.clear()

  // Outer ring
  g.lineStyle(2, color, 0.2)
  g.beginPath()
  g.arc(cx, cy, radius, 0, Math.PI * 2)
  g.strokePath()

  // Pulsing inner circle
  const pulseRadius = radius * 0.5 * (0.5 + 0.5 * Math.sin(progress * Math.PI * 2))
  const alpha = 0.3 + 0.7 * Math.abs(Math.cos(progress * Math.PI))
  g.fillStyle(color, alpha)
  g.fillCircle(cx, cy, pulseRadius)
}

/**
 * ActivityIndicator — indeterminate loading indicator.
 */
export function ActivityIndicator(props: ActivityIndicatorProps): VNodeLike {
  const {
    variant,
    size,
    color: colorOverride,
    trackColor: trackColorOverride,
    label,
    labels: labelOverrides,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('ActivityIndicator', mergedLocalTheme, {})
  const themedControl = themed as unknown as ActivityIndicatorThemeSlot
  const scene = useScene()
  const [tick, setTick] = useState(0)

  const resolvedVariant = variant ?? themedControl.variant ?? 'spinner'
  const resolvedSize = size ?? themedControl.size ?? 'medium'
  const { containerSize, lineWidth, dotSize, dotCount } = getSizeConfig(resolvedSize)
  const resolvedColor = colorOverride ?? themedControl.color ?? 0x60a5fa
  const resolvedTrackColor = trackColorOverride ?? themedControl.trackColor ?? resolvedColor
  const speed = (themedControl.animationSpeed ?? 2.4) * (resolvedVariant === 'dots' ? 0.25 : 1) // Slow down dots variant for better visibility

  const labels = {
    ...(themedControl.labels ?? {}),
    ...(labelOverrides ?? {}),
  }
  const labelText = label ?? labels.loading
  const labelStyle = themedControl.labelStyle ?? { color: '#9fb3c8', fontSize: '13px' }

  // Animation tick
  useEffect(() => {
    const interval = 1000 / 60 // ~60fps
    const timer = scene.time.addEvent({
      delay: interval,
      loop: true,
      callback: () => setTick((t) => t + 1),
    })
    return () => timer.remove()
  }, [scene])

  const progress = (tick * speed * 0.01) % 1

  const renderIndicator = () => {
    const cx = containerSize / 2
    const cy = containerSize / 2
    const radius = (containerSize - lineWidth) / 2
    const angle = tick * 0.05
    const activeDot = Math.floor(((tick * speed) / 10) % dotCount)

    return (
      <Graphics
        width={containerSize}
        height={containerSize}
        onDraw={(g) => {
          switch (resolvedVariant) {
            case 'dots':
              drawDots(g, cx, cy, dotSize, resolvedColor, dotCount, activeDot)
              break
            case 'pulse':
              drawPulse(g, cx, cy, radius, resolvedColor, progress)
              break
            default:
              drawSpinnerArc(g, cx, cy, radius, lineWidth, resolvedColor, resolvedTrackColor, angle)
          }
        }}
        dependencies={[tick, resolvedVariant, resolvedColor]}
      />
    )
  }

  return (
    <View
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={themedControl.gap ?? 8}
      {...viewProps}
      theme={nestedTheme}
    >
      {renderIndicator()}
      {labelText ? <Text text={labelText} style={labelStyle} /> : null}
    </View>
  )
}
