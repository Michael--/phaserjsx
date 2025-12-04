/**
 * Phaser Bridge - Creates Phaser Scenes from PhaserJSX components
 * This bridges the gap between React (docs UI) and PhaserJSX (examples)
 */
import type { BackgroundConfig } from '@/types/background'
import { DEFAULT_BACKGROUND } from '@/types/background'
import { mountJSX, type VNode } from '@phaserjsx/ui'
import Phaser from 'phaser'
// Import theme setup (initializes global theme)
import '../theme'

/**
 * Creates a Phaser Scene class that mounts a PhaserJSX component
 * @param component - PhaserJSX component function
 * @param props - Optional props to pass to component
 * @param background - Optional background configuration
 * @returns Phaser Scene class
 */
export function createPhaserScene(
  component: (props: Record<string, unknown>) => VNode,
  props?: Record<string, unknown>,
  background?: BackgroundConfig
) {
  const bgConfig = background || DEFAULT_BACKGROUND

  return class ExampleScene extends Phaser.Scene {
    private container?: Phaser.GameObjects.Container
    private background?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Container
    private backgroundTween?: Phaser.Tweens.Tween

    constructor() {
      super({ key: 'ExampleScene' })
    }

    create() {
      // Create background
      if (bgConfig.type !== 'none') {
        this.createBackground(bgConfig)
      }

      // Create a container to hold the mounted PhaserJSX components
      this.container = this.add.container(0, 0)

      // Mount PhaserJSX component into the container using mountJSX
      // This properly handles the component lifecycle and props
      mountJSX(this.container, component, {
        width: this.scale.width,
        height: this.scale.height,
        ...props,
      })
    }

    /**
     * Create scene background based on configuration
     */
    private createBackground(config: BackgroundConfig) {
      if (config.type === 'grid') {
        this.createGridBackground(config)
      } else if (config.type === 'logo') {
        this.createLogoBackground(config)
      } else if (config.type === 'gradient') {
        this.createGradientBackground(config)
      } else if (config.type === 'particles') {
        this.createParticlesBackground(config)
      }
    }

    /**
     * Create animated grid background
     */
    private createGridBackground(config: BackgroundConfig) {
      const graphics = this.add.graphics()
      const gridSize = 40
      const color = config.color || 0x4a9eff
      const opacity = config.opacity || 0.15

      const drawGrid = (offsetX: number, offsetY: number) => {
        graphics.clear()
        graphics.lineStyle(1, color, opacity)

        // Vertical lines
        for (let x = offsetX % gridSize; x < this.scale.width; x += gridSize) {
          graphics.lineBetween(x, 0, x, this.scale.height)
        }

        // Horizontal lines
        for (let y = offsetY % gridSize; y < this.scale.height; y += gridSize) {
          graphics.lineBetween(0, y, this.scale.width, y)
        }
      }

      drawGrid(0, 0)
      this.background = graphics

      // Apply animation
      if (config.animation === 'lemniscate') {
        this.animateLemniscate(graphics, drawGrid)
      } else if (config.animation === 'wave') {
        this.animateWave(graphics, drawGrid)
      }
    }

    /**
     * Create logo background
     */
    private createLogoBackground(config: BackgroundConfig) {
      const container = this.add.container(this.scale.width / 2, this.scale.height / 2)
      const opacity = config.opacity || 0.1

      // Create simple logo placeholder (circles forming "JSX")
      const graphics = this.add.graphics()
      graphics.fillStyle(config.color || 0x4a9eff, opacity)
      graphics.fillCircle(0, 0, 60)
      graphics.fillCircle(80, 0, 40)
      graphics.fillCircle(-80, 0, 40)

      container.add(graphics)
      this.background = container

      // Apply animation
      if (config.animation === 'pulse') {
        this.animatePulse(container)
      } else if (config.animation === 'rotate') {
        this.animateRotate(container)
      }
    }

    /**
     * Create gradient background
     */
    private createGradientBackground(config: BackgroundConfig) {
      const graphics = this.add.graphics()
      const color1 = config.color || 0x4a9eff
      const color2 = config.colorSecondary || 0x6b4aff
      const opacity = config.opacity || 0.2

      graphics.fillGradientStyle(color1, color1, color2, color2, opacity, opacity, opacity, opacity)
      graphics.fillRect(0, 0, this.scale.width, this.scale.height)

      this.background = graphics
    }

    /**
     * Create particles background
     */
    private createParticlesBackground(config: BackgroundConfig) {
      const container = this.add.container(0, 0)
      const particleCount = 20
      const color = config.color || 0x4a9eff
      const opacity = config.opacity || 0.1

      for (let i = 0; i < particleCount; i++) {
        const size = Phaser.Math.Between(2, 6)
        const x = Phaser.Math.Between(0, this.scale.width)
        const y = Phaser.Math.Between(0, this.scale.height)

        const particle = this.add.circle(x, y, size, color, opacity)
        container.add(particle)

        // Animate each particle
        this.tweens.add({
          targets: particle,
          y: particle.y + Phaser.Math.Between(-50, 50),
          x: particle.x + Phaser.Math.Between(-50, 50),
          alpha: opacity * 1.5,
          duration: Phaser.Math.Between(2000, 4000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      }

      this.background = container
    }

    /**
     * Animate grid in lemniscate (infinity) pattern
     */
    private animateLemniscate(
      _graphics: Phaser.GameObjects.Graphics,
      drawFn: (x: number, y: number) => void
    ) {
      const amplitude = 30
      const duration = 8000

      this.backgroundTween = this.tweens.addCounter({
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

    /**
     * Animate in wave pattern
     */
    private animateWave(
      _graphics: Phaser.GameObjects.Graphics,
      drawFn: (x: number, y: number) => void
    ) {
      this.backgroundTween = this.tweens.addCounter({
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

    /**
     * Animate pulse effect
     */
    private animatePulse(target: Phaser.GameObjects.Container) {
      this.backgroundTween = this.tweens.add({
        targets: target,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }

    /**
     * Animate rotation
     */
    private animateRotate(target: Phaser.GameObjects.Container) {
      this.backgroundTween = this.tweens.add({
        targets: target,
        angle: 360,
        duration: 20000,
        repeat: -1,
        ease: 'Linear',
      })
    }

    /**
     * Cleanup when scene is destroyed
     */
    destroy() {
      if (this.backgroundTween) {
        this.backgroundTween.stop()
      }
    }
  }
}
