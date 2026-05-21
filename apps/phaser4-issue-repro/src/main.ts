import * as Phaser from 'phaser'

const COLS = 4
const ROWS = 4
const MASKS_PER_CELL = 1
const HUD_TOP = 12
const HUD_CLEARANCE = 170

const root = document.getElementById('app')
if (!root) throw new Error('Missing #app root element')

Object.assign(document.body.style, { margin: '0', overflow: 'hidden', background: '#0d111a' })
Object.assign(root.style, { width: '100vw', height: '100vh' })

type Cell = {
  container: Phaser.GameObjects.Container
  extras: Phaser.GameObjects.GameObject[]
}

class ReproScene extends Phaser.Scene {
  private info?: Phaser.GameObjects.Text
  private startBtn?: Phaser.GameObjects.Text
  private stopBtn?: Phaser.GameObjects.Text
  private cells: Cell[] = []
  private running = false

  create(): void {
    this.info = this.add.text(12, HUD_TOP, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#e2e8f0',
      backgroundColor: '#111827cc',
      padding: { x: 8, y: 6 },
    })
    this.info.setDepth(1000)

    this.startBtn = this.makeButton('START', '#14532d', () => this.start())
    this.stopBtn = this.makeButton('STOP', '#7f1d1d', () => this.stop())

    this.scale.on('resize', this.onResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.stop()
      this.scale.off('resize', this.onResize, this)
    })

    this.onResize()
    this.start()
  }

  override update(): void {
    this.info?.setText([
      'Phaser 4 Mask Repro',
      `renderer: ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`,
      `running: ${this.running ? 'yes' : 'no'}`,
      `containers: ${this.cells.length}`,
      `masks via addMask(): ${this.cells.length * MASKS_PER_CELL}`,
      `fps: ${Math.round(this.game.loop.actualFps)}`,
    ])
  }

  private makeButton(label: string, bg: string, onClick: () => void): Phaser.GameObjects.Text {
    const btn = this.add
      .text(0, 0, label, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#f8fafc',
        backgroundColor: bg,
        padding: { x: 9, y: 6 },
      })
      .setInteractive({ useHandCursor: true })
    btn.setDepth(1000)
    btn.on('pointerdown', onClick)
    return btn
  }

  private start(): void {
    if (this.running) return

    const w = this.scale.width
    const h = this.scale.height
    const padX = Math.max(20, w * 0.04)
    const top = HUD_CLEARANCE
    const bottom = 20
    const gap = 14

    const cellW = (w - padX * 2 - gap * (COLS - 1)) / COLS
    const cellH = (h - top - bottom - gap * (ROWS - 1)) / ROWS

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const cx = padX + c * (cellW + gap) + cellW * 0.5
        const cy = top + r * (cellH + gap) + cellH * 0.5

        const box = this.add
          .rectangle(0, 0, cellW * 0.86, cellH * 0.86, 0x3a86ff, 0.9)
          .setStrokeStyle(2, 0xffffff, 0.7)
        const label = this.add.text(-cellW * 0.4, -cellH * 0.39, `C${r}${c}`, {
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ffff00',
        })

        const container = this.add.container(cx, cy, [box, label])
        const maskBar = this.add
          .rectangle(cx - 50, cy, cellW * 0.75, cellH, 0xffffff, 0.1)
          .setRotation(0.1)

        const extras: Phaser.GameObjects.GameObject[] = [maskBar]

        if ((r + c) % 2 === 0) {
          // Clone maskBar geometry but with alpha=1 so the filter only clips
          // (alpha multiply = 1.0) without dimming the content.
          // camera.ignore() hides it from normal rendering while the Mask
          // filter's DynamicTexture capture still sees it.
          const maskShape = this.add
            .rectangle(maskBar.x, maskBar.y, maskBar.width, maskBar.height, maskBar.fillColor, 1)
            .setRotation(maskBar.rotation)
          this.cameras.main.ignore(maskShape)
          extras.push(maskShape)

          container.enableFilters()
          container.filters?.external.addMask(maskShape)
        }

        this.cells.push({ container, extras })
      }
    }

    this.running = true
    this.syncButtons()
  }

  private stop(): void {
    if (!this.running && this.cells.length === 0) return

    for (const cell of this.cells) {
      cell.container.destroy(true)
      for (const obj of cell.extras) obj.destroy()
    }

    this.cells.length = 0
    this.running = false
    this.syncButtons()
  }

  private onResize(): void {
    const w = this.scale.width
    this.cameras.main.setBackgroundColor(0x10141f)
    this.startBtn?.setPosition(w - 170, 14)
    this.stopBtn?.setPosition(w - 86, 14)

    const wasRunning = this.running
    this.stop()
    if (wasRunning) this.start()
  }

  private syncButtons(): void {
    this.startBtn?.setAlpha(this.running ? 0.45 : 1)
    this.stopBtn?.setAlpha(this.running ? 1 : 0.45)
  }
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: root,
  width: '100%',
  height: '100%',
  scene: [ReproScene],
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
})

;(window as Window & { phaser4IssueRepro?: Phaser.Game }).phaser4IssueRepro = game
