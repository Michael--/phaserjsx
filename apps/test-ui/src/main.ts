/**
 * Minimal Phaser bootstrap that mounts the JSX tree into a Scene.
 */
import { mount } from '@phaserjsx/ui'
import Phaser from 'phaser'
import { App } from './App'

/**
 * Main Phaser scene
 */
class MainScene extends Phaser.Scene {
  preload() {
    this.load.setBaseURL('https://cdn.phaserfiles.com/v385')
    // https://cdn.phaserfiles.com/v385/assets/skies/pixelsky.png
    this.load.image('bg', 'assets/skies/pixelsky.png')
    // https://cdn.phaserfiles.com/v385/assets/ui/nine-slice.json
    this.load.atlas('ui', 'assets/ui/nine-slice.png', 'assets/ui/nine-slice.json')
  }

  nineSliceTest1() {
    this.add.image(400, 300, 'bg')

    this.add.nineslice(400, 200, 'ui', 'RedButtonSml', 640, 98, 64, 64, 48, 48)

    const score = this.add
      .text(400, 200, 'Score: 0', { font: '64px Courier', color: '#ffffff' })
      .setOrigin(0.5, 0.5)

    const button = this.add.nineslice(400, 500, 'ui', 'GreenButtonSml', 300, 98, 64, 64, 48, 48)

    this.add
      .text(400, 500, 'Add 500 to Score', { font: '24px Arial', color: '#00ffff' })
      .setOrigin(0.5, 0.5)

    button.setInteractive()

    let currentScore = 0
    let newScore = 500

    let updateTween = this.tweens.addCounter({
      from: currentScore,
      to: newScore,
      duration: 2000,
      ease: 'linear',
      onUpdate: (tween) => {
        const value = Math.round(tween.getValue())
        score.setText(`Score: ${value}`)
      },
    })

    button.on('pointerdown', () => {
      currentScore = newScore
      newScore += 500

      if (updateTween.isPlaying()) {
        //  The tween is already running, so we'll update the end value with resetting it
        updateTween.updateTo('value', newScore)
      } else {
        //  The tween has finished, so create a new one
        updateTween = this.tweens.addCounter({
          from: currentScore,
          to: newScore,
          duration: 2000,
          ease: 'linear',
          onUpdate: (tween) => {
            const value = Math.round(tween.getValue())
            score.setText(`Score: ${value}`)
          },
        })
      }
    })
  }

  nineSliceTest2() {
    const bar1 = this.add.nineslice(400, 200, 'ui', 'ButtonOrange')
    const fill1 = this.add.nineslice(286, 198, 'ui', 'ButtonOrangeFill1', 13, 39, 6, 6)

    fill1.setOrigin(0, 0.5)

    const bar2 = this.add.nineslice(400, 400, 'ui', 'ButtonOrange')
    const fill2 = this.add.nineslice(286, 398, 'ui', 'ButtonOrangeFill2', 13, 39, 6, 6)

    fill2.setOrigin(0, 0.5)

    this.tweens.add({
      targets: fill1,
      width: 228,
      duration: 3000,
      ease: 'sine.inout',
      yoyo: true,
      repeat: -1,
    })

    this.tweens.add({
      targets: fill2,
      width: 228,
      duration: 2000,
      ease: 'bounce.out',
      yoyo: true,
      repeat: -1,
      hold: 1000,
    })
  }

  /**
   * Creates the scene and mounts the JSX app
   */
  create() {
    // this.nineSliceTest1()
    // this.nineSliceTest2()
    // return

    console.log('MainScene.create() called')
    console.log('Scene dimensions:', this.scale.width, 'x', this.scale.height)

    console.log('Mounting App...')
    const tree = {
      type: App,
      props: {
        width: this.scale.width,
        height: this.scale.height,
        scene: this,
      },
      children: [],
    }
    const result = mount(this, tree)
    console.log('Mount result:', result)
    console.log('Scene children count:', this.children.length)
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 1200,
  backgroundColor: '#1d1d1d',
  parent: 'app',
  scene: [MainScene],
})
