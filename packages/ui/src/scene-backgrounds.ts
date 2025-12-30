import * as Phaser from 'phaser'

export type SceneBackgroundType = 'grid' | 'logo' | 'gradient' | 'particles' | 'none'

export type BackgroundAnimation = 'lemniscate' | 'wave' | 'pulse' | 'rotate' | 'static'

export interface BackgroundConfig {
  type: SceneBackgroundType
  animation?: BackgroundAnimation
  opacity?: number
  color?: number
  colorSecondary?: number
  logoKey?: string
}

export interface SceneBackgroundHandle {
  background: Phaser.GameObjects.Graphics | Phaser.GameObjects.Container
  destroy: () => void
  resize: (width: number, height: number) => void
}

const DEFAULT_LOGO_KEY = 'phaser-jsx-logo'

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'grid',
  animation: 'lemniscate',
  opacity: 0.15,
  color: 0x4a9eff,
}

type BackgroundTarget = Phaser.GameObjects.Graphics | Phaser.GameObjects.Container
type RedrawableTarget = BackgroundTarget & { __redrawFn?: (x: number, y: number) => void }

export function addSceneBackground(
  scene: Phaser.Scene,
  config: BackgroundConfig = DEFAULT_BACKGROUND
): SceneBackgroundHandle | null {
  const bgConfig = config ?? DEFAULT_BACKGROUND
  if (bgConfig.type === 'none') return null

  let background: BackgroundTarget | undefined
  let backgroundTween: Phaser.Tweens.Tween | undefined
  const particleTweens: Phaser.Tweens.Tween[] = []
  let resizeFn: ((width: number, height: number) => void) | undefined
  let destroyed = false

  const createGridBackground = () => {
    const graphics = scene.add.graphics()
    const gridSize = 40
    const color = bgConfig.color ?? 0x4a9eff
    const opacity = bgConfig.opacity ?? 0.15

    const drawGrid = (offsetX: number, offsetY: number) => {
      graphics.clear()
      graphics.lineStyle(1, color, opacity)

      const width = scene.scale.width
      const height = scene.scale.height

      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        graphics.lineBetween(x, 0, x, height)
      }

      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        graphics.lineBetween(0, y, width, y)
      }
    }

    drawGrid(0, 0)
    ;(graphics as RedrawableTarget).__redrawFn = drawGrid
    background = graphics
    resizeFn = () => drawGrid(0, 0)
  }

  const createLogoBackground = () => {
    const container = scene.add.container(scene.scale.width / 2, scene.scale.height / 2)
    const opacity = bgConfig.opacity ?? 0.1
    const logoKey = bgConfig.logoKey ?? DEFAULT_LOGO_KEY

    const logo = scene.add.image(0, 0, logoKey)
    logo.setAlpha(opacity)
    logo.setScale(0.5)

    container.add(logo)
    background = container
    resizeFn = (width, height) => {
      container.setPosition(width / 2, height / 2)
    }
  }

  const createGradientBackground = () => {
    const graphics = scene.add.graphics()
    const color1 = bgConfig.color ?? 0x4a9eff
    const color2 = bgConfig.colorSecondary ?? 0x6b4aff
    const opacity = bgConfig.opacity ?? 0.2

    const drawGradient = () => {
      graphics.clear()
      graphics.fillGradientStyle(color1, color1, color2, color2, opacity, opacity, opacity, opacity)
      graphics.fillRect(0, 0, scene.scale.width, scene.scale.height)
    }

    drawGradient()
    background = graphics
    resizeFn = drawGradient
  }

  const createParticlesBackground = () => {
    const container = scene.add.container(0, 0)
    const particleCount = 20
    const color = bgConfig.color ?? 0x4a9eff
    const opacity = bgConfig.opacity ?? 0.1
    const particles: Phaser.GameObjects.Arc[] = []

    for (let i = 0; i < particleCount; i += 1) {
      const size = Phaser.Math.Between(2, 6)
      const x = Phaser.Math.Between(0, scene.scale.width)
      const y = Phaser.Math.Between(0, scene.scale.height)

      const particle = scene.add.circle(x, y, size, color, opacity)
      container.add(particle)
      particles.push(particle)

      particleTweens.push(
        scene.tweens.add({
          targets: particle,
          y: particle.y + Phaser.Math.Between(-50, 50),
          x: particle.x + Phaser.Math.Between(-50, 50),
          alpha: opacity * 1.5,
          duration: Phaser.Math.Between(2000, 4000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      )
    }

    background = container
    resizeFn = (width, height) => {
      for (const particle of particles) {
        particle.setPosition(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height))
      }
    }
  }

  switch (bgConfig.type) {
    case 'grid':
      createGridBackground()
      break
    case 'logo':
      createLogoBackground()
      break
    case 'gradient':
      createGradientBackground()
      break
    case 'particles':
      createParticlesBackground()
      break
  }

  if (!background) return null

  if (bgConfig.animation && bgConfig.animation !== 'static') {
    backgroundTween = applyAnimation(scene, background, bgConfig.animation)
  }

  const onResize = () => {
    if (resizeFn) resizeFn(scene.scale.width, scene.scale.height)
  }

  const cleanup = () => {
    if (destroyed) return
    destroyed = true

    backgroundTween?.stop()
    for (const tween of particleTweens) {
      tween.stop()
    }

    background?.destroy()
    background = undefined

    scene.scale.off(Phaser.Scale.Events.RESIZE, onResize)
    scene.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup)
    scene.events.off(Phaser.Scenes.Events.DESTROY, cleanup)
  }

  scene.scale.on(Phaser.Scale.Events.RESIZE, onResize)
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup)
  scene.events.once(Phaser.Scenes.Events.DESTROY, cleanup)

  return {
    background,
    destroy: cleanup,
    resize: (width, height) => {
      if (resizeFn) resizeFn(width, height)
    },
  }
}

function applyAnimation(
  scene: Phaser.Scene,
  target: BackgroundTarget,
  animation: BackgroundAnimation
): Phaser.Tweens.Tween | undefined {
  const redrawFn = (target as RedrawableTarget).__redrawFn

  switch (animation) {
    case 'lemniscate':
      return redrawFn ? animateLemniscate(scene, redrawFn) : animatePulse(scene, target)
    case 'wave':
      return redrawFn ? animateWave(scene, redrawFn) : animatePulse(scene, target)
    case 'pulse':
      return animatePulse(scene, target)
    case 'rotate':
      return animateRotate(scene, target)
    case 'static':
    default:
      return undefined
  }
}

function animateLemniscate(
  scene: Phaser.Scene,
  drawFn: (x: number, y: number) => void
): Phaser.Tweens.Tween {
  const amplitude = 30
  const duration = 8000

  return scene.tweens.addCounter({
    from: 0,
    to: Math.PI * 2,
    duration,
    repeat: -1,
    onUpdate: (tween) => {
      const t = tween.getValue()
      if (t !== null) {
        const offsetX = amplitude * Math.cos(t)
        const offsetY = (amplitude * Math.sin(2 * t)) / 2
        drawFn(offsetX, offsetY)
      }
    },
  })
}

function animateWave(
  scene: Phaser.Scene,
  drawFn: (x: number, y: number) => void
): Phaser.Tweens.Tween {
  return scene.tweens.addCounter({
    from: 0,
    to: 40,
    duration: 3000,
    yoyo: true,
    repeat: -1,
    onUpdate: (tween) => {
      const offset = tween.getValue()
      if (offset !== null) {
        drawFn(offset, 0)
      }
    },
  })
}

function animatePulse(scene: Phaser.Scene, target: BackgroundTarget): Phaser.Tweens.Tween {
  return scene.tweens.add({
    targets: target,
    scaleX: 1.1,
    scaleY: 1.1,
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}

function animateRotate(scene: Phaser.Scene, target: BackgroundTarget): Phaser.Tweens.Tween {
  return scene.tweens.add({
    targets: target,
    angle: 360,
    duration: 20000,
    repeat: -1,
    ease: 'Linear',
  })
}
