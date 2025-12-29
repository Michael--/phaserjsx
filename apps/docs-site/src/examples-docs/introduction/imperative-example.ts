/**
 * Imperative Phaser example - manual GameObject management
 * This demonstrates the traditional imperative approach
 */
import * as Phaser from 'phaser'

class ImperativeGameScene extends Phaser.Scene {
  private counter: number = 0
  private counterText?: Phaser.GameObjects.Text
  private button?: Phaser.GameObjects.Rectangle

  create() {
    // Manually create button
    this.button = this.add.rectangle(400, 300, 200, 60, 0x4a9eff)
    this.button.setInteractive()
    this.button.on('pointerdown', () => {
      this.counter++
      // Manually update text
      this.counterText?.setText(`Count: ${this.counter}`)
    })

    // Manually create text
    const buttonText = this.add.text(400, 300, 'Click me', {
      fontSize: '20px',
      color: '#ffffff',
    })
    buttonText.setOrigin(0.5)

    // Manually create counter display
    this.counterText = this.add.text(400, 400, `Count: ${this.counter}`, {
      fontSize: '24px',
      color: '#ffffff',
    })
    this.counterText.setOrigin(0.5)
  }

  // Need to manually clean up
  shutdown() {
    this.button?.destroy()
    this.counterText?.destroy()
  }
}

export { ImperativeGameScene }
