/** @jsx createElement */
import './styles.css'

import { Button, Text, createElement, createPhaserJSXPlugin } from '@number10/phaserjsx'
import * as Phaser from 'phaser'
//;(globalThis as any).Phaser = Phaser

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')
  }

  create() {
    this.add.image(400, 300, 'logo')
    this.add.text(20, 20, 'Phaser OK', { fontSize: '24px', color: '#fff' })
  }
}

function Test42() {
  return (
    <Button>
      <Text text="Hello" />
    </Button>
  )
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: Test42,
        props: { title: '🚀 PhaserJSX Dev Playground' },
        autoResize: true,
      }),
    ],
  },
})
