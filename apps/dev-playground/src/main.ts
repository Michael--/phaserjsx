/**
 * Dev playground for PhaserJSX - focused development environment
 * Using PhaserJSX Plugin for automatic mounting
 */
import {
  addSceneBackground,
  createPhaserJSXPlugin,
  type SceneBackgroundHandle,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'
import { App } from './App'

/**
 * Main Phaser scene for dev playground
 */
class PlaygroundScene extends Phaser.Scene {
  private backgroundHandle?: SceneBackgroundHandle | null
  private emitter?: Phaser.GameObjects.Particles.ParticleEmitter

  private getCenterPosition() {
    const cam = this.cameras.main
    return {
      x: cam.scrollX + cam.width / 2,
      y: cam.scrollY + cam.height / 2,
    }
  }

  private updateEmitterPosition() {
    if (!this.emitter) return
    const pos = this.getCenterPosition()
    this.emitter.setPosition(pos.x, pos.y)
  }

  preload() {
    this.load.image('star', 'assets/star.png')
  }

  create() {
    this.emitter = this.add.particles(0, 0, 'star', {
      frequency: 50,
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 4000,
      tint: 0xffffff,
      blendMode: 'ADD',
      gravityY: 200,
    })
    this.updateEmitterPosition()

    this.scale.on('resize', () => {
      this.createBackground()
      this.updateEmitterPosition()
    })
    this.createBackground()
  }

  createBackground() {
    this.backgroundHandle?.destroy()
    this.backgroundHandle = addSceneBackground(this, {
      type: 'grid',
      animation: 'lemniscate',
    })
  }

  destroy() {
    this.emitter?.destroy()
    this.backgroundHandle?.destroy()
    this.backgroundHandle = null
  }
}

/**
 * Phaser game configuration with PhaserJSX Plugin
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  input: {
    mouse: true,
    touch: true,
    activePointers: 2,
  },
  disableContextMenu: true,
  backgroundColor: '#2a2a2a',
  parent: 'app',
  scene: [PlaygroundScene],
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: App,
        props: { title: '🚀 PhaserJSX Dev Playground' },
        autoResize: true,
      }),
    ],
  },
}

const game = new Phaser.Game(config)

// Expose for debugging
;(window as { game?: Phaser.Game }).game = game
