import * as Phaser from 'phaser'
import { applyScissorClip, applyShaderClip } from './scissor'

const COLS = 4
const ROWS = 4
const HUD_TOP = 12
const HUD_CLEARANCE = 170

const root = document.getElementById('app')
if (!root) throw new Error('Missing #app root element')

Object.assign(document.body.style, { margin: '0', overflow: 'hidden', background: '#0d111a' })
Object.assign(root.style, { width: '100vw', height: '100vh' })

type Cell = {
  container: Phaser.GameObjects.Container
  extras: Phaser.GameObjects.GameObject[]
  clipHandle?: { destroy: () => void }
}

type ClipMode = 'none' | 'filter' | 'scissor' | 'shader'
const DEFAULT_CLIP_MODE: ClipMode = 'none'
const CLIP_MODES: ClipMode[] = ['none', 'filter', 'scissor', 'shader']

class ReproScene extends Phaser.Scene {
  private info?: Phaser.GameObjects.Text
  private startBtn?: Phaser.GameObjects.Text
  private stopBtn?: Phaser.GameObjects.Text
  private modeBtn?: Phaser.GameObjects.Text
  private cells: Cell[] = []
  private running = false
  private clipMode: ClipMode = DEFAULT_CLIP_MODE

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
    this.modeBtn = this.makeButton('MODE', '#374151', () => this.toggleMode())

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
      `Phaser 4 Clip Repro — mode: ${this.clipMode}`,
      `renderer: ${this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas'}`,
      `running: ${this.running ? 'yes' : 'no'}`,
      `containers: ${this.cells.length}  clipped: ${this.clipMode === 'none' ? 0 : Math.round(this.cells.length * 0.6)}`,
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
    const gap = 50

    const cellW = ((w - padX * 2 - gap * (COLS - 1)) / COLS) * 0.8
    const cellH = ((h - top - bottom - gap * (ROWS - 1)) / ROWS) * 0.8

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const masked = (r + c) % 3 !== 0
        const cx = padX + c * (cellW + gap) + cellW * 0.5
        const cy = top + r * (cellH + gap) + cellH * 0.5

        const box = this.add
          .rectangle(0, 0, cellW * 1, cellH * 1, 0x3a86ff, 0.9)
          .setStrokeStyle(2, 0xffffff, 0.7)
        const label = this.add.text(
          -cellW * 0.4,
          -cellH * 0.39,
          `C${r}${c} ${masked ? 'masked' : ''}`,
          {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffff00',
          }
        )
        const labelOverflow = this.add.text(cellH * 0.5, 0, 'overflow', {
          fontFamily: 'monospace',
          fontSize: '48px',
          color: '#ff006e',
        })

        // Children that intentionally overflow the container bounds (cellW × cellH).
        // Clipped cells will have these cut off; unclipped cells show them in full.
        const overflowBar = this.add.rectangle(
          0,
          cellH * 0.4,
          cellW * 1.1,
          cellH * 0.35,
          0xffff00,
          0.5
        )

        const container = this.add.container(cx, cy, [box, label, labelOverflow, overflowBar])

        const extras: Phaser.GameObjects.GameObject[] = []

        let clipHandle: { destroy: () => void } | undefined

        if (masked && this.clipMode !== 'none') {
          switch (this.clipMode) {
            case 'scissor':
              // Clip = container's own bounds, centered on its origin.
              clipHandle = applyScissorClip(container, cellW, cellH)
              break

            case 'shader':
              // Shader filter clip using the same logical bounds as scissor.
              clipHandle = applyShaderClip(container, cellW, cellH)
              break

            case 'filter':
            default: {
              // Mask filter: opaque rect matching container bounds exactly.
              // camera.ignore() hides the mask shape from the visible camera while
              // the Mask filter's DynamicTexture still renders it.
              const maskShape = this.add.rectangle(cx, cy, cellW, cellH, 0xffffff, 1)
              this.cameras.main.ignore(maskShape)
              extras.push(maskShape)

              container.enableFilters()
              container.filters?.external.addMask(maskShape)
            }
          }
        }

        const cell: Cell = { container, extras }
        if (clipHandle) {
          cell.clipHandle = clipHandle
        }

        this.cells.push(cell)
      }
    }

    this.running = true
    this.syncButtons()
  }

  private stop(): void {
    if (!this.running && this.cells.length === 0) return

    for (const cell of this.cells) {
      cell.clipHandle?.destroy()
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
    this.modeBtn?.setPosition(w - 300, 14)
    this.startBtn?.setPosition(w - 170, 14)
    this.stopBtn?.setPosition(w - 86, 14)

    const wasRunning = this.running
    this.stop()
    if (wasRunning) this.start()
  }

  private syncButtons(): void {
    this.startBtn?.setAlpha(this.running ? 0.45 : 1)
    this.stopBtn?.setAlpha(this.running ? 1 : 0.45)
    if (!this.modeBtn) return

    this.modeBtn.setText(`MODE: ${this.clipMode.toUpperCase()}`)
    const modeColor =
      this.clipMode === 'scissor'
        ? '#065f46'
        : this.clipMode === 'shader'
          ? '#7c3aed'
          : this.clipMode === 'none'
            ? '#1f2937'
            : '#374151'
    this.modeBtn.setBackgroundColor(modeColor)
  }

  private toggleMode(): void {
    const wasRunning = this.running
    this.stop()
    const modeIndex = CLIP_MODES.indexOf(this.clipMode)
    this.clipMode = CLIP_MODES[(modeIndex + 1) % CLIP_MODES.length] ?? DEFAULT_CLIP_MODE
    if (wasRunning) this.start()
    this.syncButtons()
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
