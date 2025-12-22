/**
 * Dev playground for PhaserJSX - focused development environment
 * Using PhaserJSX Plugin for automatic mounting
 */
import { createPhaserJSXPlugin } from '@number10/phaserjsx'
import Phaser from 'phaser'
import { App } from './App'

/**
 * Main Phaser scene for dev playground
 */
class PlaygroundScene extends Phaser.Scene {
  private graphics: Phaser.GameObjects.Graphics | null = null
  /**
   * Preload assets
   */
  preload() {
    // Add asset loading here as needed
  }

  /**
   * Create scene - only background, JSX mounting handled by plugin
   */
  create() {
    console.log('PlaygroundScene.create() dimensions:', this.scale.width, 'x', this.scale.height)

    // JSX mounting is handled automatically by PhaserJSXPlugin
    console.log('[PlaygroundScene] JSX will be mounted by plugin')

    // re-create background on resize
    this.scale.on('resize', () => this.createBackground(), this)
  }

  createBackground() {
    if (this.graphics) this.graphics.clear()
    else this.graphics = this.add.graphics()

    this.graphics.lineStyle(1, 0xffffff, 0.5)
    const gridSize = 50

    for (let x = 0; x < this.scale.width; x += gridSize) {
      this.graphics.moveTo(x, 0)
      this.graphics.lineTo(x, this.scale.height)
    }
    for (let y = 0; y < this.scale.height; y += gridSize) {
      this.graphics.moveTo(0, y)
      this.graphics.lineTo(this.scale.width, y)
    }
    this.graphics.strokePath()
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
