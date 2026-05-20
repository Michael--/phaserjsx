import * as Phaser from 'phaser'

const BACKGROUND_COLOR = 0x10141f
const GRID_COLOR = 0x2a3144
const PANEL_COLOR = 0x3a86ff

const mountNode = document.getElementById('app')
if (!mountNode) {
  throw new Error('Missing #app root element')
}

Object.assign(document.body.style, {
  margin: '0',
  overflow: 'hidden',
  background: '#0d111a',
})

Object.assign(mountNode.style, {
  width: '100vw',
  height: '100vh',
})

class IssueReproScene extends Phaser.Scene {
  private grid?: Phaser.GameObjects.Graphics
  private frame?: Phaser.GameObjects.Rectangle
  private panel?: Phaser.GameObjects.Rectangle
  private info?: Phaser.GameObjects.Text
  private cursorDot?: Phaser.GameObjects.Arc

  create(): void {
    this.grid = this.add.graphics()

    this.frame = this.add.rectangle(0, 0, 0, 0).setOrigin(0).setStrokeStyle(2, 0x8ecae6, 0.8)

    this.panel = this.add.rectangle(0, 0, 180, 180, PANEL_COLOR, 1).setStrokeStyle(3, 0xffffff, 0.9)

    this.info = this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#e2e8f0',
      backgroundColor: '#111827cc',
      padding: { x: 8, y: 6 },
    })

    this.cursorDot = this.add.circle(0, 0, 5, 0xffbe0b)

    this.panel.setInteractive({ useHandCursor: true })
    this.panel.on('pointerdown', () => {
      const nextColor = this.panel?.fillColor === PANEL_COLOR ? 0xfb5607 : PANEL_COLOR
      this.panel?.setFillStyle(nextColor, 1)
    })

    this.input.on('pointermove', this.handlePointerMove, this)
    this.scale.on('resize', this.handleResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)

    this.handleResize()
    this.handlePointerMove(this.input.activePointer)
  }

  override update(time: number): void {
    if (!this.panel) {
      return
    }

    this.panel.rotation = time * 0.001
  }

  private handleResize(): void {
    const width = this.scale.width
    const height = this.scale.height

    this.cameras.main.setBackgroundColor(BACKGROUND_COLOR)

    this.grid?.clear()
    this.grid?.lineStyle(1, GRID_COLOR, 1)
    for (let x = 0; x <= width; x += 40) {
      this.grid?.moveTo(x, 0)
      this.grid?.lineTo(x, height)
    }
    for (let y = 0; y <= height; y += 40) {
      this.grid?.moveTo(0, y)
      this.grid?.lineTo(width, y)
    }
    this.grid?.strokePath()

    this.frame?.setSize(width, height)
    this.panel?.setPosition(width * 0.5, height * 0.5)
    this.info?.setPosition(12, 12)

    this.updateInfoText(this.input.activePointer)
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    this.cursorDot?.setPosition(pointer.worldX, pointer.worldY)
    this.updateInfoText(pointer)
  }

  private updateInfoText(pointer: Phaser.Input.Pointer): void {
    this.info?.setText([
      'Phaser 4 Native Issue Repro',
      `viewport: ${Math.round(this.scale.width)} x ${Math.round(this.scale.height)}`,
      `pointer: ${Math.round(pointer.worldX)}, ${Math.round(pointer.worldY)}`,
      `fps: ${Math.round(this.game.loop.actualFps)}`,
      'click square to switch fill color',
    ])
  }

  private cleanup(): void {
    this.input.off('pointermove', this.handlePointerMove, this)
    this.scale.off('resize', this.handleResize, this)
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: mountNode,
  width: '100%',
  height: '100%',
  backgroundColor: '#10141f',
  scene: [IssueReproScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
})

;(window as Window & { phaser4IssueRepro?: Phaser.Game }).phaser4IssueRepro = game
