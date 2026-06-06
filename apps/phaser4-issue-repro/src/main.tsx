/** @jsxImportSource @number10/phaserjsx */
import {
  applyEffectByName,
  Divider,
  mountComponent,
  numberToHex,
  RadioGroup,
  setColorPreset,
  Slider,
  Text,
  Toggle,
  unmountJSX,
  useEffect,
  useGameObjectEffect,
  useRef,
  useScene,
  useState,
  useThemeTokens,
  View,
  WrapText,
  type MountProps,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'
import './style.css'

setColorPreset('oceanBlue', 'dark')

type ClipMode = 'none' | 'phaser' | 'phaserjsx'

const CLIP_EVERY = 3
const CLIP_SIZE_FACTOR = 0.5

type TestPatternOptions = {
  cols: number
  rows: number
  cellSize?: number
  seed?: number
  clipEvery?: number
  clipSizeFactor?: number
  textureMode?: boolean
  clip?: ClipMode

  clipPhaserOptions?: {
    /**
     * Phaser 4 hint:
     * For Containers, external masks can be cheaper because Containers
     * tend to render in external/fullscreen filter context anyway.
     */
    clipUseExternal?: boolean

    /**
     * Important optimization:
     * Static mask GameObjects are otherwise assumed to change every frame.
     */
    clipAutoUpdate?: boolean

    /**
     * Reduces mask resolution.
     * Useful for testing performance/quality tradeoffs.
     */
    clipScaleFactor?: number
  }
}

type SampleProps = {
  on: boolean
  size: number
  cellSize: number
  mode: ClipMode
  textureMode: boolean
  clipUseExternal: boolean
  clipAutoUpdate: boolean
  clipScaleFactor: number
}

type ReproOverlayProps = MountProps & {
  title: string
  onCreateSample?: (props: SampleProps) => void
}

function FpsMeter() {
  const ref = useRef(null)
  const { applyEffect } = useGameObjectEffect(ref)
  const [fps, setFps] = useState(0)
  const [color, setColor] = useState(0xffffff)
  const scene = useScene()

  useEffect(() => {
    const updateFps = () => {
      const currentFps = Math.round(scene.game.loop.actualFps)
      setFps(currentFps)
      if (currentFps < 30) {
        applyEffectByName(applyEffect, 'pulse', {
          intensity: 1.2,
          time: 250,
        })
      }
      setColor(currentFps >= 50 ? 0x10b981 : currentFps >= 30 ? 0xf59e0b : 0xef4444)
    }
    const interval = setInterval(updateFps, 500)
    return () => clearInterval(interval)
  }, [scene])
  const tokens = useThemeTokens()

  return (
    <View ref={ref}>
      <Text
        text={`FPS: ${fps}`}
        style={{ ...tokens?.textStyles.large, color: numberToHex(color) }}
      />
    </View>
  )
}

function ReproOverlay(props: ReproOverlayProps) {
  const tokens = useThemeTokens()
  const { onCreateSample, title } = props
  const [sampleOn, setSampleOn] = useState(true)
  const [clipMode, setClipMode] = useState<ClipMode>('phaserjsx')
  const [textureMode, setTextureMode] = useState(true)
  const [clipUseExternal, setClipUseExternal] = useState(false)
  const [clipAutoUpdate, setClipAutoUpdate] = useState(false)
  const [clipScaleFactor, setClipScaleFactor] = useState(1)
  const [size, setSize] = useState(14)
  const [cellSize, setCellSize] = useState(48)

  const totalCells = size * size
  const clippedCells = Math.ceil(totalCells / CLIP_EVERY)

  useEffect(() => {
    onCreateSample?.({
      on: sampleOn,
      size,
      cellSize,
      mode: clipMode,
      textureMode,
      clipUseExternal: clipUseExternal,
      clipAutoUpdate: clipAutoUpdate,
      clipScaleFactor: clipScaleFactor,
    })
  }, [
    onCreateSample,
    sampleOn,
    clipMode,
    textureMode,
    clipUseExternal,
    clipAutoUpdate,
    clipScaleFactor,
    size,
    cellSize,
  ])

  return (
    <View width="fill" height="fill" padding={20}>
      <View
        gap={10}
        padding={14}
        width={425}
        overflow="hidden"
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
        backgroundAlpha={0.9}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        borderWidth={1}
        cornerRadius={6}
      >
        <Text text={title} style={tokens?.textStyles.large} />
        <Text
          text={'Every 3rd item is clipped to a centered 50% rect/bitmap.'}
          style={tokens?.textStyles.small}
        />
        <Text
          text={`Load: ${totalCells} containers, ${clippedCells} clipped`}
          style={tokens?.textStyles.small}
        />
        <Divider />
        <Toggle
          checked={sampleOn}
          onChange={setSampleOn}
          label="Toggle Sample:"
          labelPosition="left"
        />
        <View direction="row" gap={10} alignItems="center">
          <Text text={'Grid Size:'} />
          <Slider value={size} onChange={setSize} min={5} max={25} step={1} />
          <Text text={`${size}x${size}`} />
        </View>
        <View direction="row" gap={10} alignItems="center">
          <Text text={'Cell Size:'} />
          <Slider value={cellSize} onChange={setCellSize} min={16} max={128} step={1} />
          <Text text={`${cellSize}px`} />
        </View>
        <Divider />

        <View direction="row" gap={10} alignItems="center">
          <Text text={'Clipping:'} />
          <RadioGroup
            direction="column"
            value={clipMode}
            onChange={(v) => setClipMode(v as ClipMode)}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Phaser Filter Mask (phaser4)', value: 'phaser' },
              { label: 'Rect/Bitmap Clip (prototype)', value: 'phaserjsx' },
            ]}
          />
        </View>
        <Toggle
          checked={textureMode}
          onChange={setTextureMode}
          label="Use Bitmap Source:"
          suffix={
            <Text text={'(forces texture-based clipping)'} style={tokens?.textStyles.small} />
          }
          labelPosition="left"
        />
        <Divider />
        <Text text={'Phaser Filter Mask Options:'} />
        <WrapText
          text={
            'Only applies to "Phaser Filter Mask". Auto-update off is the static-mask best case.'
          }
          style={tokens?.textStyles.small}
        />
        <Toggle
          checked={clipUseExternal}
          onChange={setClipUseExternal}
          label="Use External Filter"
          labelPosition="left"
        />
        <Toggle
          checked={clipAutoUpdate}
          onChange={setClipAutoUpdate}
          label="Mask Auto-Update"
          labelPosition="left"
        />
        <View direction="row" gap={10} alignItems="center">
          <Text text={'Shape Mask Scale:'} />
          <Slider
            value={clipScaleFactor}
            onChange={setClipScaleFactor}
            min={0.1}
            max={1}
            step={0.1}
          />
          <Text text={`${clipScaleFactor.toFixed(1)}x`} />
        </View>
        <Divider />
        <FpsMeter />
      </View>
    </View>
  )
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5

    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomColorNumber(random: () => number): number {
  return Math.floor(random() * 0xffffff)
}

function createTextureRect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  color: number
): Phaser.GameObjects.Container {
  const item = scene.add.container(x, y)

  const rect = scene.add.image(0, 0, '__white_pixel').setDisplaySize(size, size).setTint(color)

  item.add(rect)

  return item
}

function ensureWhitePixelTexture(scene: Phaser.Scene): void {
  const key = '__white_pixel'

  if (scene.textures.exists(key)) {
    return
  }

  const texture = scene.textures.createCanvas(key, 1, 1)
  const ctx = texture?.getContext()

  if (!texture || !ctx) {
    throw new Error('Could not create texture')
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1, 1)

  texture.refresh()
}

function getClipMaskTextureKey(cellSize: number, clipSize: number): string {
  return `__clip_mask_${Math.round(cellSize)}_${Math.round(clipSize)}`
}

function ensureClipMaskTexture(scene: Phaser.Scene, cellSize: number, clipSize: number): string {
  const textureKey = getClipMaskTextureKey(cellSize, clipSize)

  if (scene.textures.exists(textureKey)) {
    return textureKey
  }

  const textureSize = Math.max(1, Math.round(cellSize))
  const clipPixels = Math.max(1, Math.round(clipSize))
  const texture = scene.textures.createCanvas(textureKey, textureSize, textureSize)
  const ctx = texture?.getContext()

  if (!texture || !ctx) {
    throw new Error('Could not create clip mask texture')
  }

  const offset = Math.round((textureSize - clipPixels) / 2)

  ctx.clearRect(0, 0, textureSize, textureSize)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(offset, offset, clipPixels, clipPixels)

  texture.refresh()
  return textureKey
}

function createClipMaskImage(
  scene: Phaser.Scene,
  textureKey: string,
  x: number,
  y: number,
  cellSize: number
): Phaser.GameObjects.Image {
  return scene.add.image(x, y, textureKey).setDisplaySize(cellSize, cellSize)
}

class ReproScene extends Phaser.Scene {
  private phaserExample: Phaser.GameObjects.Container | null = null
  private jsxContainer: Phaser.GameObjects.Container | null = null

  create(): void {
    this.jsxContainer = this.add.container(0, 0).setDepth(1000)
    mountComponent(this.jsxContainer, ReproOverlay, {
      title: 'Phaser 4 Filter Mask Clipping Cost',
      width: this.scale.width,
      height: this.scale.height,
      onCreateSample: (props: SampleProps) => {
        if (!props.on) {
          this.phaserExample?.destroy()
          this.phaserExample = null
        } else {
          const x = this.scale.width * 0.5
          const y = this.scale.height * 0.5
          this.phaserExample?.destroy()
          this.releaseClipMaskTextures()
          this.phaserExample = this.createContainerTestPattern(x, y, {
            cols: props.size,
            rows: props.size,
            cellSize: props.cellSize,
            seed: 42,
            clipEvery: CLIP_EVERY,
            clipSizeFactor: CLIP_SIZE_FACTOR,
            textureMode: props.textureMode,
            clip: props.mode,
            clipPhaserOptions: {
              clipUseExternal: props.clipUseExternal,
              clipAutoUpdate: props.clipAutoUpdate,
              clipScaleFactor: props.clipScaleFactor,
            },
          })
        }
      },
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.phaserExample?.destroy()
      this.releaseClipMaskTextures()
      this.textures.remove('__white_pixel')
      if (this.jsxContainer) unmountJSX(this.jsxContainer)
    })
  }

  /** Removes all dynamically created clip mask textures from the texture manager. */
  private releaseClipMaskTextures(): void {
    const prefix = '__clip_mask_'
    Object.keys(this.textures.list)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.textures.remove(key))
  }

  createContainerTestPattern(
    this: Phaser.Scene,
    x: number,
    y: number,
    options: TestPatternOptions
  ): Phaser.GameObjects.Container {
    const {
      cols,
      rows,
      cellSize = 64,
      seed = 1,
      clipEvery = 0,
      clipSizeFactor = 0.65,
      textureMode = false,
      clip = 'none',
      clipPhaserOptions: { clipUseExternal = false, clipAutoUpdate = true, clipScaleFactor } = {},
    } = options

    const random = createSeededRandom(seed)
    const root = this.add.container(x, y)

    const offsetX = -(cols * cellSize) / 2 + cellSize / 2 + this.scale.width * 0.15
    const offsetY = -(rows * cellSize) / 2 + cellSize / 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const cx = offsetX + col * cellSize
        const cy = offsetY + row * cellSize

        const item = this.add.container(cx, cy)
        if (textureMode) {
          ensureWhitePixelTexture(this)
          const rect = createTextureRect(this, 0, 0, cellSize, randomColorNumber(random))
          item.add(rect)
        } else {
          const rect = this.add.rectangle(0, 0, cellSize, cellSize, randomColorNumber(random), 1)
          item.add(rect)
        }

        if (clipEvery > 0 && index % clipEvery === 0) {
          const clipSize = cellSize * clipSizeFactor
          const clipMaskTexture = textureMode
            ? ensureClipMaskTexture(this, cellSize, clipSize)
            : undefined

          if (clip === 'phaser') {
            item.enableFilters()
            const scale = clipScaleFactor ?? 1 // compensate for reduced mask resolution
            const clipSource =
              textureMode && clipMaskTexture
                ? createClipMaskImage(this, clipMaskTexture, x + cx, y + cy, cellSize)
                : this.add.rectangle(
                    (x + cx) * scale,
                    (y + cy) * scale,
                    clipSize,
                    clipSize,
                    0xffffff,
                    1
                  )

            if (
              clipSource instanceof Phaser.GameObjects.Rectangle ||
              clipSource instanceof Phaser.GameObjects.Image
            ) {
              this.cameras.main.ignore(clipSource)
            }

            const maskController = clipUseExternal
              ? item.filters?.external.addMask(clipSource)
              : item.filters?.internal.addMask(clipSource)

            if (maskController) {
              maskController.autoUpdate = clipAutoUpdate

              if (
                !textureMode &&
                clipScaleFactor !== undefined &&
                clipSource instanceof Phaser.GameObjects.Rectangle
              ) {
                // scaleFactor reduces mask texture resolution; mask GO must be scaled to match.
                maskController.scaleFactor = clipScaleFactor
                clipSource.setScale(clipScaleFactor)
              }
            }
          } else if (clip === 'phaserjsx') {
            // Candidate lightweight clipping path: no per-item filter render target.
            if (textureMode && clipMaskTexture) {
              item.setStencilClip({
                kind: 'bitmap',
                texture: clipMaskTexture,
                width: cellSize,
                height: cellSize,
                offsetX: -cellSize / 2,
                offsetY: -cellSize / 2,
              })
            } else {
              item.setStencilClip({
                kind: 'rect',
                width: clipSize,
                height: clipSize,
                offsetX: -clipSize / 2,
                offsetY: -clipSize / 2,
              })
            }
          }
        }

        root.add(item)
      }
    }

    return root
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: '100%',
  height: '100%',
  backgroundColor: '#111827',
  disableContextMenu: true,
  input: {
    mouse: true,
    touch: true,
    activePointers: 2,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [ReproScene],
}

new Phaser.Game(config)
