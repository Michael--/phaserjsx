/**
 * Path Morph Example - spring-driven SVG-like shape morphing
 * Ported from react-spring + flubber morphing demo
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Graphics,
  Text,
  useEffect,
  useForceRedraw,
  useRef,
  useSpring,
  View,
  WrapText,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

// ── Shape generation ──────────────────────────────────────────────

const NUM_POINTS = 64

interface Point {
  x: number
  y: number
}

/** Resample a polygon to targetCount evenly-spaced points along its perimeter */
function resample(polygon: Point[], targetCount: number): Point[] {
  const n = polygon.length
  const distances: number[] = [0]
  for (let i = 1; i < n; i++) {
    const dx = polygon[i].x - polygon[i - 1].x
    const dy = polygon[i].y - polygon[i - 1].y
    distances.push(distances[i - 1] + Math.sqrt(dx * dx + dy * dy))
  }
  const dx = polygon[0].x - polygon[n - 1].x
  const dy = polygon[0].y - polygon[n - 1].y
  const total = distances[n - 1] + Math.sqrt(dx * dx + dy * dy)

  const result: Point[] = []
  for (let i = 0; i < targetCount; i++) {
    const target = (i / targetCount) * total
    let seg = 0
    for (let j = 1; j < n; j++) {
      if (distances[j] >= target) {
        seg = j - 1
        break
      }
    }
    if (target >= distances[n - 1]) seg = n - 1
    const segStart = distances[seg]
    const segEnd = seg < n - 1 ? distances[seg + 1] : total
    const t = segEnd > segStart ? (target - segStart) / (segEnd - segStart) : 0
    const p0 = polygon[seg]
    const p1 = polygon[(seg + 1) % n]
    result.push({
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
    })
  }
  return result
}

function getCircle(): Point[] {
  return Array.from({ length: NUM_POINTS }, (_, i) => {
    const a = (i / NUM_POINTS) * Math.PI * 2 - Math.PI / 2
    return { x: Math.cos(a) * 70, y: Math.sin(a) * 70 }
  })
}

function getStar(): Point[] {
  const outerR = 72
  const innerR = 28
  const points = 5
  const keyVerts: Point[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    keyVerts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
  }
  return resample(keyVerts, NUM_POINTS)
}

function getDiamond(): Point[] {
  const s = 72
  const keyVerts: Point[] = [
    { x: 0, y: -s },
    { x: s, y: 0 },
    { x: 0, y: s },
    { x: -s, y: 0 },
  ]
  return resample(keyVerts, NUM_POINTS)
}

function getHeart(): Point[] {
  // Parametric heart curve, scaled to fit ~140x140 area
  const pts: Point[] = []
  for (let i = 0; i < NUM_POINTS; i++) {
    const t = (i / NUM_POINTS) * Math.PI * 2
    const sx = Math.sin(t)
    const x = 16 * sx * sx * sx
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    pts.push({ x: x * 4.2, y: -y * 4.2 + 5 })
  }
  return pts
}

function getBlob(): Point[] {
  return Array.from({ length: NUM_POINTS }, (_, i) => {
    const a = (i / NUM_POINTS) * Math.PI * 2 - Math.PI / 2
    const r = 58 + Math.sin(a * 3) * 14 + Math.cos(a * 5 + 1) * 9 + Math.sin(a * 7) * 5
    return { x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
}

const SHAPE_NAMES = ['Circle', 'Star', 'Diamond', 'Heart', 'Blob']

/** Pre-computed shapes (24 points each) — static, never changes */
const SHAPES: Point[][] = [getCircle(), getStar(), getDiamond(), getHeart(), getBlob()]

/** Interpolate between two point arrays */
function lerpPoints(a: Point[], b: Point[], t: number): Point[] {
  return a.map((p, i) => ({
    x: p.x + (b[i].x - p.x) * t,
    y: p.y + (b[i].y - p.y) * t,
  }))
}

// ── Component ────────────────────────────────────────────────────

/**
 * Morphs between geometric shapes using spring-physics interpolation.
 * Demonstrates how spring animations can drive custom Graphics drawing
 * for smooth, organic shape transitions.
 */
export function PathMorphExample() {
  const targetRef = useRef(1)
  const setterRef = useRef<((target: number) => void) | null>(null)

  const onMorphComplete = () => {
    targetRef.current += 1
    setterRef.current?.(targetRef.current)
  }

  const [t, setT] = useSpring(0, { tension: 50, friction: 16 }, onMorphComplete)
  useForceRedraw(30, t)

  // Store setter in ref after render
  useEffect(() => {
    setterRef.current = setT
  })

  // Kick off first morph
  useEffect(() => {
    const id = setTimeout(() => setT(1), 300)
    return () => clearTimeout(id)
  }, [setT])

  const tv = t.value
  const fromIdx = Math.floor(tv) % SHAPES.length
  const toIdx = (fromIdx + 1) % SHAPES.length
  const morphFactor = tv - Math.floor(tv)

  const currentShape = SHAPES[fromIdx]
  const nextShape = SHAPES[toIdx]
  const morphed = lerpPoints(currentShape, nextShape, morphFactor)

  const currentLabel = SHAPE_NAMES[fromIdx]
  const nextLabel = SHAPE_NAMES[toIdx]
  const progress = Math.round(morphFactor * 100)

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
        backgroundColor={0x1a1a2e}
        cornerRadius={10}
      >
        <View direction="row" justifyContent="space-between" alignItems="center">
          <View direction="column" gap={4}>
            <Text text="Problem" style={{ fontSize: 11, color: '#8e8ea0' }} />
            <Text text="Morph between shapes smoothly" style={{ fontSize: 15, color: '#ffffff' }} />
          </View>
          <Text
            text={`${currentLabel} → ${nextLabel}`}
            style={{ fontSize: 11, color: '#c4b5fd' }}
          />
        </View>

        <WrapText
          text="A single spring drives polygon vertex interpolation. The same approach works for icons, avatars, or any vector data — no layout shift, just smooth morphing."
          style={{ fontSize: 10, color: '#a0a0b8' }}
        />

        {/* Morph area */}
        <View
          width="fill"
          height={196}
          backgroundColor={0x0f0f1a}
          cornerRadius={10}
          alignItems="center"
          justifyContent="center"
          direction="stack"
        >
          {/* Glow behind the shape */}
          <Graphics
            width={180}
            height={180}
            onDraw={(g) => {
              g.clear()
              g.fillStyle(0x7c3aed, 0.08)
              g.fillPoints(
                morphed.map((p) => new Phaser.Math.Vector2(90 + p.x * 1.12, 90 + p.y * 1.12)),
                true
              )
            }}
            dependencies={[morphed]}
          />

          <Graphics
            width={180}
            height={180}
            onDraw={(g) => {
              g.clear()

              // Outer glow
              g.fillStyle(0x8b5cf6, 0.15)
              g.fillPoints(
                morphed.map((p) => new Phaser.Math.Vector2(90 + p.x * 1.08, 90 + p.y * 1.08)),
                true
              )

              // Main shape fill
              g.fillStyle(0xa78bfa, 0.9)
              const pts = morphed.map((p) => new Phaser.Math.Vector2(90 + p.x, 90 + p.y))
              g.fillPoints(pts, true)

              // Main shape stroke
              g.lineStyle(2, 0xc4b5fd, 0.6)
              g.strokePoints(pts, true)

              // Inner highlight
              g.fillStyle(0xddd6fe, 0.22)
              g.fillPoints(
                morphed.map((p) => new Phaser.Math.Vector2(90 + p.x * 0.6, 90 + p.y * 0.6)),
                true
              )
            }}
            dependencies={[morphed]}
          />
        </View>

        {/* Progress indicator */}
        <View direction="row" gap={8} alignItems="center" justifyContent="center">
          <View width={48} height={4} backgroundColor={0x2d2d44} cornerRadius={2}>
            <View width={`${progress}%`} height={4} backgroundColor={0xa78bfa} cornerRadius={2} />
          </View>
          <Text text={`${progress}%`} style={{ fontSize: 10, color: '#8e8ea0' }} />
        </View>

        {/* Shape labels */}
        <View direction="row" gap={8} justifyContent="center">
          {SHAPE_NAMES.map((name, i) => (
            <View
              key={name}
              width={56}
              height={26}
              backgroundColor={i === fromIdx ? 0x7c3aed : i === toIdx ? 0x2d1f5e : 0x1e1e32}
              cornerRadius={6}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                text={name}
                style={{
                  fontSize: 9,
                  color: i === fromIdx ? '#ffffff' : i === toIdx ? '#c4b5fd' : '#6b6b80',
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
