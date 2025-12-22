/**
 * Dev playground for PhaserJSX - focused development environment
 * Using PhaserJSX Plugin for automatic mounting
 */
import { PhaserJSXPlugin } from '@number10/phaserjsx'
import Phaser from 'phaser'
import { App } from './App'

/**
 * Main Phaser scene for dev playground
 */
class PlaygroundScene extends Phaser.Scene {
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

    // Simple grid background
    const graphics = this.add.graphics()
    graphics.lineStyle(1, 0xffffff, 0.1)
    const gridSize = 50

    for (let x = 0; x < this.scale.width; x += gridSize) {
      graphics.moveTo(x, 0)
      graphics.lineTo(x, this.scale.height)
    }
    for (let y = 0; y < this.scale.height; y += gridSize) {
      graphics.moveTo(0, y)
      graphics.lineTo(this.scale.width, y)
    }
    graphics.strokePath()

    // JSX mounting is handled automatically by PhaserJSXPlugin
    console.log('[PlaygroundScene] JSX will be mounted by plugin')
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
      {
        key: 'PhaserJSX',
        plugin: PhaserJSXPlugin,
        start: true,
        data: {
          component: App,
          props: { title: '🚀 PhaserJSX Dev Playground' },
        },
      },
    ],
  },
}

const game = new Phaser.Game(config)

// Expose for debugging
;(window as { game?: Phaser.Game }).game = game
