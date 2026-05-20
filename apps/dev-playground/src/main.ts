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
    /*const tx = */ setInterval(() => {
      // console.log(`fps: ${scene.game.loop.actualFps}`)

      const game = (window as { game?: Phaser.Game }).game
      if (!game) return
      const l = game.loop
      console.log(
        `actualFps=${l.actualFps.toFixed(2)} framesThisSecond=${l.framesThisSecond} rawDeltaMs=${l.rawDelta.toFixed(2)} deltaMs=${l.delta.toFixed(2)} hidden=${document.hidden} focus=${document.hasFocus()} running=${l.running}`
      )
    }, 1000)
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
