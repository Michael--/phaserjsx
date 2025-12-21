/** @jsxImportSource ../.. */
/**
 * Joystick component - Interactive directional input control
 * Provides touch/mouse-based joystick functionality with customizable themes
 */
import type { GestureEventData, SizeValue } from '@number10/phaserjsx/core-props'
import { RefOriginView } from '.'
import { getLayoutSize, useEffect, useMemo, useRef, useState } from '../../hooks'
import type { VNodeLike } from '../../vdom'
import { Graphics, View } from '../index'

/**
 * Theme configuration for Joystick component
 */
export interface JoystickTheme {
  /** Visual theme variant */
  theme: 'default' | 'neon' | 'target' | 'glass' | 'military'
  /** Optional tint color (0xRRGGBB) */
  tint?: number
}

/**
 * Creates theme-specific graphics for joystick base and thumb
 * @param joystickTheme - Theme configuration
 * @param radius - Radius of the joystick
 * @returns Object containing base, thumb graphics and rotation flag
 */
function joystickThemeFactory(
  joystickTheme: JoystickTheme | undefined,
  radius: number
): { base: VNodeLike; thumb: VNodeLike; rotateThumb: boolean } {
  // Custom Joystick Themes
  /**
   * Creates neon-themed base graphics
   * @param radius - Base radius
   * @param color - Neon color
   * @returns Neon base graphics
   */
  function createNeonBase(radius: number, color: number = 0x00ff00): VNodeLike {
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Outer glow
          g.fillStyle(color, 0.1)
          g.fillCircle(0, 0, radius + 10)
          // Main circle with gradient effect
          g.fillStyle(0x000000, 0.4)
          g.fillCircle(0, 0, radius)
          // Neon ring
          g.lineStyle(3, color, 1)
          g.strokeCircle(0, 0, radius)
          g.lineStyle(1, color, 0.5)
          g.strokeCircle(0, 0, radius - 5)
          // Directional indicators
          for (let i = 0; i < 4; i++) {
            const angle = (i * 90 * Math.PI) / 180
            const x1 = Math.cos(angle) * (radius - 15)
            const y1 = Math.sin(angle) * (radius - 15)
            const x2 = Math.cos(angle) * (radius - 5)
            const y2 = Math.sin(angle) * (radius - 5)
            g.lineStyle(2, color, 0.7)
            g.lineBetween(x1, y1, x2, y2)
          }
        }}
      />
    )
  }

  function createNeonThumb(radius: number, color: number = 0x00ff00): VNodeLike {
    const r = radius * 0.4
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Glow effect
          g.fillStyle(color, 0.2)
          g.fillCircle(0, 0, r + 5)
          // Center
          g.fillStyle(color, 0.8)
          g.fillCircle(0, 0, r)
          // Bright outline
          g.lineStyle(2, color, 1)
          g.strokeCircle(0, 0, r)
          // Crosshair
          g.lineStyle(2, 0x000000, 0.8)
          g.moveTo(0, -r * 0.6)
          g.lineTo(0, r * 0.6)
          g.moveTo(-r * 0.6, 0)
          g.lineTo(r * 0.6, 0)
          g.strokePath()
        }}
      />
    )
  }

  function createTargetBase(radius: number, tint: number = 0xff0000): VNodeLike {
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Background
          g.fillStyle(0x000000, 0.3)
          g.fillCircle(0, 0, radius)
          // Target rings
          for (let i = 0; i < 3; i++) {
            const r = radius - i * 20
            g.lineStyle(2, tint, 0.6 - i * 0.15)
            g.strokeCircle(0, 0, r)
          }
          // Crosshair lines
          g.lineStyle(1, tint, 0.5)
          g.moveTo(-radius, 0)
          g.lineTo(radius, 0)
          g.moveTo(0, -radius)
          g.lineTo(0, radius)
          g.strokePath()
          // Center dot
          g.fillStyle(tint, 0.8)
          g.fillCircle(0, 0, 5)
        }}
      />
    )
  }

  function createTargetThumb(radius: number, tint: number = 0xff0000): VNodeLike {
    const r = radius * 0.35
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Outer circle
          g.fillStyle(tint, 0.7)
          g.fillCircle(0, 0, r)
          // Inner circle
          g.fillStyle(0xffffff, 0.9)
          g.fillCircle(0, 0, r * 0.5)
          // Center dot
          g.fillStyle(tint, 1)
          g.fillCircle(0, 0, r * 0.2)
          // Direction indicator
          g.lineStyle(3, tint, 1)
          g.beginPath()
          g.moveTo(0, -r)
          g.lineTo(r * 0.3, -r * 0.6)
          g.lineTo(-r * 0.3, -r * 0.6)
          g.closePath()
          g.fillPath()
        }}
      />
    )
  }

  function createGlassBase(radius: number, tint: number = 0xffffff): VNodeLike {
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Glass effect with gradient - use tint for subtle coloring
          g.fillStyle(tint, 0.15)
          g.fillCircle(0, 0, radius)
          // Glossy highlight
          g.fillStyle(tint, 0.3)
          g.fillCircle(-radius * 0.3, -radius * 0.3, radius * 0.4)
          // Border
          g.lineStyle(2, tint, 0.5)
          g.strokeCircle(0, 0, radius)
          g.lineStyle(1, tint, 0.3)
          g.strokeCircle(0, 0, radius - 3)
        }}
      />
    )
  }

  function createGlassThumb(radius: number, tint: number = 0xffffff): VNodeLike {
    const r = radius * 0.4
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Shadow
          g.fillStyle(0x000000, 0.2)
          g.fillCircle(r * 0.1, r * 0.1, r)
          // Main glass sphere - subtle tinting
          g.fillStyle(tint, 0.4)
          g.fillCircle(0, 0, r)
          // Highlight
          g.fillStyle(tint, 0.6)
          g.fillCircle(-r * 0.3, -r * 0.3, r * 0.4)
          // Border
          g.lineStyle(2, tint, 0.7)
          g.strokeCircle(0, 0, r)
        }}
      />
    )
  }

  function createMilitaryBase(radius: number, tint: number = 0x00ff00): VNodeLike {
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Dark background
          g.fillStyle(0x1a1a1a, 0.8)
          g.fillCircle(0, 0, radius)
          // Grid lines
          g.lineStyle(1, tint, 0.3)
          const step = 20
          for (let i = -radius; i <= radius; i += step) {
            g.moveTo(-radius, i)
            g.lineTo(radius, i)
            g.moveTo(i, -radius)
            g.lineTo(i, radius)
          }
          g.strokePath()
          // Radar sweep effect
          g.lineStyle(2, tint, 0.6)
          g.strokeCircle(0, 0, radius)
          g.strokeCircle(0, 0, radius * 0.66)
          g.strokeCircle(0, 0, radius * 0.33)
          // Corner markers
          const corners = [
            { x: -radius * 0.7, y: -radius * 0.7 },
            { x: radius * 0.7, y: -radius * 0.7 },
            { x: -radius * 0.7, y: radius * 0.7 },
            { x: radius * 0.7, y: radius * 0.7 },
          ]
          g.lineStyle(3, tint, 0.8)
          corners.forEach(({ x, y }) => {
            g.moveTo(x - 10, y)
            g.lineTo(x + 10, y)
            g.moveTo(x, y - 10)
            g.lineTo(x, y + 10)
          })
          g.strokePath()
        }}
      />
    )
  }

  function createMilitaryThumb(radius: number, tint: number = 0x00ff00): VNodeLike {
    const r = radius * 0.3
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          // Base
          g.fillStyle(tint, 0.9)
          g.fillCircle(0, 0, r)
          // Directional arrow
          g.fillStyle(0x000000, 1)
          g.beginPath()
          g.moveTo(0, -r)
          g.lineTo(r * 0.5, r * 0.3)
          g.lineTo(-r * 0.5, r * 0.3)
          g.closePath()
          g.fillPath()
          // Border
          g.lineStyle(2, 0x000000, 0.8)
          g.strokeCircle(0, 0, r)
        }}
      />
    )
  }

  function createDefaultBase(radius: number, tint: number = 0x00ff00): VNodeLike {
    const size = { width: radius * 2, height: radius * 2 }
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          g.fillStyle(0x0, 0.25)
          g.lineStyle(1, tint)
          g.fillCircle(0, 0, size.width / 2)
          g.strokeCircle(0, 0, size.width / 2)
        }}
      />
    )
  }
  function createDefaultThumb(radius: number, tint: number = 0x00ff00): VNodeLike {
    const size = { width: radius * 2, height: radius * 2 }
    return (
      <Graphics
        onDraw={(g: Phaser.GameObjects.Graphics) => {
          const r = size.width * 0.2
          g.lineStyle(2, 0x000000, 1)
          g.moveTo(0, -r)
          g.lineTo(0, r)
          g.moveTo(-r, 0)
          g.lineTo(r, 0)
          g.strokePath()
          g.lineStyle(2, tint, 0.75)
          g.strokeCircle(0, 0, r * 1.1)
        }}
      />
    )
  }

  const theme = joystickTheme != null ? joystickTheme.theme : 'default'
  const tint = (joystickTheme != null ? joystickTheme.tint : 0x00ff00) ?? 0x00ff00

  switch (theme) {
    case 'neon':
      return {
        base: createNeonBase(radius, tint),
        thumb: createNeonThumb(radius, tint),
        rotateThumb: false,
      }
    case 'target':
      return {
        base: createTargetBase(radius, tint),
        thumb: createTargetThumb(radius, tint),
        rotateThumb: true,
      }
    case 'glass':
      return {
        base: createGlassBase(radius, tint),
        thumb: createGlassThumb(radius, tint),
        rotateThumb: false,
      }
    case 'military':
      return {
        base: createMilitaryBase(radius, tint),
        thumb: createMilitaryThumb(radius, tint),
        rotateThumb: true,
      }
    case 'default':
    default:
      return {
        base: createDefaultBase(radius, tint),
        thumb: createDefaultThumb(radius, tint),
        rotateThumb: false,
      }
  }
}

// Joystick component
/**
 * Props for Joystick component
 */
export type JoystickProps = {
  /** Width of the joystick area */
  width: SizeValue
  /** Height of the joystick area */
  height: SizeValue
  /** Default theme, used if base and thumb are not provided */
  joystickTheme?: JoystickTheme
  /** Custom base graphic */
  base?: VNodeLike
  /** Custom thumb graphic */
  thumb?: VNodeLike
  /** Minimum force to trigger movement (0.0 to 1.0) */
  minForce?: number
  /** Enable thumb rotation based on angle */
  rotateThumb?: boolean
  /** Callback when joystick is moved, providing angle and force */
  onMove?: (active: boolean, angle: number, force: number) => void
  /** Callback when joystick is tapped */
  onTap?: () => void
}

/**
 * Joystick component for touch/mouse input
 * Provides directional input with customizable themes and graphics
 * @param props - Joystick properties
 * @returns Joystick JSX element
 */
export function Joystick(props: JoystickProps): VNodeLike {
  const outerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const thumbRef = useRef<Phaser.GameObjects.Container | null>(null)
  const forceExceededMinimumRef = useRef(false)
  const activeTweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  // Determine size and center
  useEffect(() => {
    setTimeout(() => {
      const size = getLayoutSize(outerRef.current)
      console.log(`Joystick size: ${JSON.stringify(size)}`)
      if (size != null) {
        setCenter({ x: size.width / 2, y: size.height / 2 })
        setSize({ width: size.width, height: size.height })
      }
    }, 0)
  }, [outerRef])

  const elements = useMemo(() => {
    if (props.base != null && props.thumb)
      return {
        base: props.base,
        thumb: props.thumb,
        rotateThumb: props.rotateThumb ?? false,
      }
    if (size.width === 0 || size.height === 0)
      return {
        base: null,
        thumb: null,
        rotateThumb: false,
      }
    const radius = Math.min(size.width, size.height) / 2
    return joystickThemeFactory(props.joystickTheme, radius)
  }, [props.base, props.thumb, size])

  const touchMove = (data: GestureEventData) => {
    data.stopPropagation()
    if (thumbRef.current == null) return

    if (data.state === 'start') {
      forceExceededMinimumRef.current = false
    }

    if (data.state === 'end') {
      // Stop any existing tween
      if (activeTweenRef.current) {
        activeTweenRef.current.stop()
        activeTweenRef.current = null
      }

      // Tween back to center with smooth animation
      if (thumbRef.current.scene) {
        activeTweenRef.current = thumbRef.current.scene.tweens.add({
          targets: thumbRef.current,
          x: center.x,
          y: center.y,
          angle: 0,
          duration: 150,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            activeTweenRef.current = null
          },
        })
      }

      // Call onMove with active = false
      props.onMove?.(false, 0, 0)
      return
    }

    // calculate offset from center
    let offsetX = data.localX - data.width / 2 + center.x
    let offsetY = data.localY - data.height / 2 + center.y

    // clamp to radius
    const radius = size.width / 2
    const dx = offsetX - center.x
    const dy = offsetY - center.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Calculate angle and force
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) // Convert to degrees
    const rawForce = Math.min(dist / radius, 1.0) // Normalize to 0.0 - 1.0

    // Apply minForce (deadzone)
    const minForce = props.minForce ?? 0.2
    const force = rawForce < minForce ? 0 : (rawForce - minForce) / (1 - minForce)

    // Track if force exceeded minimum during this touch
    if (force > 0) {
      forceExceededMinimumRef.current = true
    }

    // Clamp thumb position to radius
    if (dist > radius) {
      const angleRad = Math.atan2(dy, dx)
      offsetX = center.x + Math.cos(angleRad) * radius
      offsetY = center.y + Math.sin(angleRad) * radius
    }

    // Stop any active tween when user moves thumb
    if (activeTweenRef.current) {
      activeTweenRef.current.stop()
      activeTweenRef.current = null
    }

    thumbRef.current.setPosition(offsetX, offsetY)

    // Rotate thumb based on angle if enabled
    if (props.rotateThumb || elements.rotateThumb) {
      thumbRef.current.setAngle(angle + 90) // +90 because default points up
    }

    // Call onMove with active = true only if force is above threshold
    if (force > 0) {
      props.onMove?.(true, angle, force)
    } else {
      props.onMove?.(true, 0, 0)
    }
  }

  const handleTouch = () => {
    // Tap only if force never exceeded minForce
    if (!forceExceededMinimumRef.current) {
      props.onTap?.()
    }
  }

  return (
    <View ref={outerRef} width={props.width} height={props.height}>
      <RefOriginView
        width={props.width}
        height={props.height}
        originX={0.5}
        originY={0.5}
        onTouchMove={touchMove}
        onTouch={handleTouch}
        direction="stack"
      >
        <View x={center.x} y={center.y}>
          {elements.base}
        </View>
        <View ref={thumbRef} x={center.x} y={center.y}>
          {elements.thumb}
        </View>
      </RefOriginView>
    </View>
  )
}
