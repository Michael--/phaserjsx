/**
 * VU Meter Example — building a custom component from primitives
 * Demonstrates: static component → animation wrapper → reuse without code duplication
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Text,
  useEffect,
  useForceRedraw,
  useSpring,
  useState,
  View,
  WrapText,
} from '@number10/phaserjsx'

// ── VU Meter component ──────────────────────────────────────────

const TRACK_H = 180
const TRACK_W = 52
const TICK_INTERVAL = 10 // every 10%

const GREEN = 0x22c55e
const YELLOW = 0xeab308
const RED = 0xef4444

/** Lerp between two RGB24 colors */
function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}

/** Smooth color gradient: green → yellow → red */
function getFillColor(level: number): number {
  const t = Math.max(0, Math.min(1, level / 100))
  if (t <= 0.5) return lerpColor(GREEN, YELLOW, t * 2)
  return lerpColor(YELLOW, RED, (t - 0.5) * 2)
}

interface VUMeterProps {
  /** Level 0–100 */
  level: number
}

/**
 * A simple VU meter built entirely from View + Text primitives.
 * No custom rendering, no Phaser Graphics — just composition.
 *
 * Design decisions:
 * - Track + fill overlay via direction="stack"
 * - Fill positioned from bottom using computed y offset
 * - Color gradient: green → yellow → red (smooth lerp, no hard thresholds)
 * - Tick marks at 10% intervals
 */
function VUMeter({ level }: VUMeterProps) {
  const clampedLevel = Math.max(0, Math.min(100, level))
  const fillH = Math.round((clampedLevel / 100) * TRACK_H)
  const fillY = TRACK_H - fillH
  const fillColor = getFillColor(clampedLevel)

  const ticks = Array.from(
    { length: Math.floor(100 / TICK_INTERVAL) - 1 },
    (_, i) => (i + 1) * TICK_INTERVAL
  )

  return (
    <View direction="column" alignItems="center" gap={8}>
      <Text text="VU" style={{ fontSize: 10, color: '#8892b0' }} />

      {/* Meter body */}
      <View
        width={TRACK_W}
        height={TRACK_H}
        direction="stack"
        cornerRadius={4}
        overflow="hidden"
        backgroundColor={0x0d1117}
        borderColor={0x30363d}
        borderWidth={1}
      >
        {/* Fill bar — anchored to bottom */}
        <View width="fill" height={fillH} y={fillY} backgroundColor={fillColor} />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const yPos = TRACK_H - Math.round((tick / 100) * TRACK_H)
          return (
            <View
              key={tick}
              width="fill"
              height={1}
              y={yPos}
              backgroundColor={0xffffff}
              backgroundAlpha={0.12}
            />
          )
        })}
      </View>

      {/* Level readout */}
      <View
        width={TRACK_W}
        height={22}
        backgroundColor={0x161b22}
        cornerRadius={3}
        alignItems="center"
        justifyContent="center"
      >
        <Text text={`${clampedLevel}%`} style={{ fontSize: 9, color: '#c9d1d9' }} />
      </View>
    </View>
  )
}

// ── Animated wrapper ────────────────────────────────────────────

interface AnimatedVUMeterProps {
  targetLevel: number
  label: string
}

/**
 * Thin animation wrapper around the static VUMeter.
 * Adds spring smoothing via useSpring — zero changes to VUMeter itself.
 * This is the core pattern: separate concerns, compose at the call site.
 */
function AnimatedVUMeter({ targetLevel, label }: AnimatedVUMeterProps) {
  const [level, setLevel] = useSpring(targetLevel, 'gentle')
  useForceRedraw(20, level)

  useEffect(() => {
    setLevel(targetLevel)
  }, [targetLevel, setLevel])

  return (
    <View direction="column" alignItems="center" gap={6}>
      <Text text={label} style={{ fontSize: 10, color: '#58a6ff' }} />
      <VUMeter level={Math.round(level.value)} />
    </View>
  )
}

// ── Demo ─────────────────────────────────────────────────────────

const PRESETS = [
  { label: '−40 dB', level: 12 },
  { label: '−20 dB', level: 35 },
  { label: '0 dB', level: 68 },
  { label: '+3 dB', level: 88 },
]
const CYCLE_MS = 2200

/**
 * Side-by-side demo: static VUMeter vs. spring-animated VUMeter.
 * Both receive the same target level — the static one jumps, the animated one catches up smoothly.
 * Presets auto-cycle; manual tap also supported.
 */
export function VUMeterExample() {
  const [presetIdx, setPresetIdx] = useState(0)
  const targetLevel = PRESETS[presetIdx].level

  // Auto-cycle through presets
  useEffect(() => {
    const id = setInterval(() => {
      setPresetIdx((prev) => (prev + 1) % PRESETS.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={14}
    >
      <View
        width={440}
        direction="column"
        gap={16}
        padding={18}
        backgroundColor={0x0d1117}
        cornerRadius={10}
      >
        {/* Header */}
        <View direction="row" justifyContent="space-between" alignItems="center">
          <View direction="column" gap={4}>
            <Text text="Solution" style={{ fontSize: 11, color: '#8b949e' }} />
            <WrapText
              text="Compose, don't copy — the animated wrapper reuses the static component"
              style={{ fontSize: 14, color: '#ffffff' }}
            />
          </View>
        </View>

        {/* Narrative */}
        <View direction="column" gap={8}>
          <WrapText
            text="The static VUMeter is a pure function of its level prop. To animate it, we write a wrapper — AnimatedVUMeter — that holds a useSpring, feeds the smoothed value into the same VUMeter component, and adds nothing else. The original component is imported, not copied."
            style={{ fontSize: 12, color: '#c9d1d9' }}
          />
          <WrapText
            text="Below, both meters receive the identical target. The left one jumps on every preset change. The right one catches up with spring physics. Same component, different presentation — no duplication."
            style={{ fontSize: 12, color: '#8b949e' }}
          />
        </View>

        {/* Side-by-side meters */}
        <View direction="row" width={'fill'} gap={32} alignItems="start" justifyContent="center">
          {/* Static */}
          <View direction="column" alignItems="center" gap={6}>
            <Text text="Static" style={{ fontSize: 10, color: '#8b949e' }} />
            <VUMeter level={targetLevel} />
          </View>

          {/* Divider */}
          <View width={3} height={TRACK_H + 30} backgroundColor={0x21262d} />

          {/* Animated */}
          <AnimatedVUMeter targetLevel={targetLevel} label="Animated" />
        </View>

        {/* Preset controls */}
        <View direction="row" gap={8} alignItems="center" justifyContent="center">
          <Text text="Target" style={{ fontSize: 10, color: '#8b949e' }} />
          {PRESETS.map((p, i) => {
            const active = i === presetIdx
            return (
              <View
                key={p.label}
                width={70}
                height={32}
                backgroundColor={active ? 0x1f6feb : 0x21262d}
                borderColor={active ? 0x58a6ff : 0x30363d}
                borderWidth={active ? 1 : 0}
                cornerRadius={5}
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={4}
                enableGestures
                onTouch={() => setPresetIdx(i)}
              >
                {active && (
                  <View width={6} height={6} backgroundColor={0xffffff} cornerRadius={3} />
                )}
                <Text
                  text={p.label}
                  style={{
                    fontSize: 10,
                    color: active ? '#ffffff' : '#8b949e',
                  }}
                />
              </View>
            )
          })}
          <Text text="auto-cycles" style={{ fontSize: 9, color: '#484f58' }} />
        </View>

        {/* Source hint */}
        <View width="fill" height={1} backgroundColor={0x21262d} />
        <WrapText
          text="VUMeter: 30 lines of View + Text. AnimatedVUMeter: 10 lines of useSpring + VUMeter. Total: 40 lines, zero duplication."
          style={{ fontSize: 10, color: '#484f58' }}
        />
      </View>
    </View>
  )
}
