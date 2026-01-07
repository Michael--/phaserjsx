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
import type { AppProps } from './types'

const props: AppProps = {
  title: '🚀 PhaserJSX Dev Playground',
}

/**
 * Main Phaser scene for dev playground
 */
class PlaygroundScene extends Phaser.Scene {
  private backgroundHandle?: SceneBackgroundHandle | null

  create() {
    this.scale.on('resize', () => {
      this.createBackground()
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
        props: props,
        autoResize: true,
      }),
    ],
  },
}

const game = new Phaser.Game(config)

// Expose for debugging
;(window as { game?: Phaser.Game }).game = game
