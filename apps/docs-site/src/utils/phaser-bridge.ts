/**
 * Phaser Bridge - Creates Phaser Scenes from PhaserJSX components
 * This bridges the gap between React (docs UI) and PhaserJSX (examples)
 */
import type { BackgroundAnimation, BackgroundConfig } from '@/types/background'
import { DEFAULT_BACKGROUND } from '@/types/background'
import { mountJSX, type VNode } from '@number10/phaserjsx'
import Phaser from 'phaser'

/**
 * Creates a Phaser Scene class that mounts a PhaserJSX component
 * @param component - PhaserJSX component function
 * @param background - Optional background configuration
 * @returns Phaser Scene class
 */
export function createPhaserScene(component: () => VNode, background?: BackgroundConfig) {
  const bgConfig = background || DEFAULT_BACKGROUND

  return class ExampleScene extends Phaser.Scene {
    private container?: Phaser.GameObjects.Container
    private background?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Container
    private backgroundTween?: Phaser.Tweens.Tween

    constructor() {
      super({ key: 'ExampleScene' })
    }

    preload() {
      // Preload PhaserJSX logo for background
      this.load.image('phaser-jsx-logo', '/src/assets/phaser-jsx-logo.png')
    }

    create() {
      // Create background
      if (bgConfig.type !== 'none') {
        this.createBackground(bgConfig)
      }

      // Create a container to hold the mounted PhaserJSX components
      this.container = this.add.container(0, 0)

      // Mount PhaserJSX component with automatic SceneWrapper for percentage-based sizing
      // The new mountJSX API requires width/height and automatically wraps components
      mountJSX(this.container, component, { width: this.scale.width, height: this.scale.height })
    }

    /**
     * Create scene background based on configuration
     */
    private createBackground(config: BackgroundConfig) {
      // Create visual background
      if (config.type === 'grid') {
        this.createGridBackground(config)
      } else if (config.type === 'logo') {
        this.createLogoBackground(config)
      } else if (config.type === 'gradient') {
        this.createGradientBackground(config)
      } else if (config.type === 'particles') {
        this.createParticlesBackground(config)
      }

      // Apply animation if background was created
      if (this.background && config.animation && config.animation !== 'static') {
        this.applyAnimation(this.background, config.animation)
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
      // Store redraw function for position-based animations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this.background as any).__redrawFn = drawGrid
    }

    /**
     * Create logo background
     */
    private createLogoBackground(config: BackgroundConfig) {
      const container = this.add.container(this.scale.width / 2, this.scale.height / 2)
      const opacity = config.opacity || 0.1

      // Load and display the PhaserJSX logo
      const logo = this.add.image(0, 0, 'phaser-jsx-logo')
      logo.setAlpha(opacity)
      logo.setScale(0.5) // Adjust size as needed

      container.add(logo)
      this.background = container
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
     * Apply animation to any background object
     */
    private applyAnimation(
      target: Phaser.GameObjects.Graphics | Phaser.GameObjects.Container,
      animation: BackgroundAnimation
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const redrawFn = (target as any).__redrawFn

      switch (animation) {
        case 'lemniscate':
          if (redrawFn) {
            this.animateLemniscate(redrawFn)
          } else {
            this.animatePulse(target)
          }
          break
        case 'wave':
          if (redrawFn) {
            this.animateWave(redrawFn)
          } else {
            this.animatePulse(target)
          }
          break
        case 'pulse':
          this.animatePulse(target)
          break
        case 'rotate':
          this.animateRotate(target)
          break
      }
    }

    /**
     * Animate position in lemniscate (infinity) pattern
     */
    private animateLemniscate(drawFn: (x: number, y: number) => void) {
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
    private animateWave(drawFn: (x: number, y: number) => void) {
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
    private animatePulse(target: Phaser.GameObjects.Container | Phaser.GameObjects.Graphics) {
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
    private animateRotate(target: Phaser.GameObjects.Container | Phaser.GameObjects.Graphics) {
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
      if (this.background) {
        this.background.destroy()
      }
      this.background = undefined
    }
  }
}
