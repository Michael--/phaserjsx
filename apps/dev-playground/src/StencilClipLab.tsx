import {
  Button,
  RadioGroup,
  Text,
  useEffect,
  useScene,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { applyStencilClip, type StencilClipHandle } from '@number10/phaserjsx/clip'
import * as Phaser from 'phaser'

type ClipLabScenario = 'default' | 'scroll' | 'zoom' | 'viewport' | 'postfx' | 'nested'

type FilterableObject = Phaser.GameObjects.GameObject & {
  enableFilters?: () => void
  filters?: {
    internal?: {
      addGlow?: (
        color?: number,
        outerStrength?: number,
        innerStrength?: number,
        scale?: number,
        knockout?: boolean,
        quality?: number,
        distance?: number
      ) => unknown
    }
  }
}

const SCENARIO_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'viewport', label: 'Viewport' },
  { value: 'postfx', label: 'PostFX' },
  { value: 'nested', label: 'Nested' },
]

function addLabel(
  scene: Phaser.Scene,
  parent: Phaser.GameObjects.Container,
  x: number,
  y: number,
  text: string
): void {
  parent.add(
    scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#e5e7eb',
    })
  )
}

function addClipCase(
  scene: Phaser.Scene,
  parent: Phaser.GameObjects.Container,
  handles: StencilClipHandle[],
  x: number,
  y: number,
  label: string,
  options: { rounded?: boolean; postfx?: boolean; nested?: boolean } = {}
): Phaser.GameObjects.Container {
  const clipW = 190
  const clipH = 122
  const container = scene.add.container(x, y)

  const bg = scene.add.rectangle(0, 0, clipW, clipH, 0x0f172a, 0.35).setOrigin(0)
  const border = scene.add
    .rectangle(0, 0, clipW, clipH)
    .setOrigin(0)
    .setStrokeStyle(2, 0xf8fafc, 0.45)
  const stripA = scene.add.rectangle(-42, 12, 270, 36, 0x22c55e, 0.85).setOrigin(0)
  const stripB = scene.add.rectangle(22, 54, 260, 34, 0x38bdf8, 0.82).setOrigin(0)
  const stripC = scene.add.rectangle(-64, 92, 310, 34, 0xf59e0b, 0.78).setOrigin(0)
  const overflowText = scene.add.text(112, 34, 'OVERFLOW', {
    fontFamily: 'monospace',
    fontSize: '26px',
    color: '#f43f5e',
  })

  container.add([bg, stripA, stripB, stripC, overflowText, border])

  if (options.postfx) {
    const fxRect = scene.add.rectangle(28, 24, 122, 58, 0xffffff, 0.9).setOrigin(0)
    const filterable = fxRect as FilterableObject
    filterable.enableFilters?.()
    filterable.filters?.internal?.addGlow?.(0xfacc15, 4, 1, 1, false, 8, 8)
    container.add(fxRect)
  }

  handles.push(
    applyStencilClip(container, {
      width: clipW,
      height: clipH,
      cornerRadius: options.rounded ? 18 : 0,
    })
  )

  if (options.nested) {
    const inner = scene.add.container(42, 34)
    inner.add([
      scene.add.rectangle(-34, -10, 186, 38, 0xa855f7, 0.85).setOrigin(0),
      scene.add.rectangle(16, 30, 188, 34, 0xec4899, 0.8).setOrigin(0),
      scene.add.text(44, 18, 'INNER', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
      }),
    ])
    container.add(inner)
    handles.push(
      applyStencilClip(inner, {
        width: 112,
        height: 58,
        cornerRadius: 10,
      })
    )
  }

  parent.add(container)
  addLabel(scene, parent, x, y + clipH + 10, label)

  return container
}

function addSceneContent(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  scenario: ClipLabScenario,
  handles: StencilClipHandle[]
): void {
  root.add(scene.add.rectangle(0, 0, 1140, 680, 0x111827, 1).setOrigin(0))

  for (let x = 0; x <= 1140; x += 40) {
    const line = scene.add
      .rectangle(x, 0, 1, 680, 0x334155, x % 160 === 0 ? 0.5 : 0.22)
      .setOrigin(0)
    root.add(line)
  }
  for (let y = 0; y <= 680; y += 40) {
    const line = scene.add
      .rectangle(0, y, 1140, 1, 0x334155, y % 160 === 0 ? 0.5 : 0.22)
      .setOrigin(0)
    root.add(line)
  }

  addLabel(scene, root, 30, 24, `Stencil Clip Lab / ${scenario}`)
  addLabel(
    scene,
    root,
    30,
    48,
    'White frames are expected clip bounds. Colored content should not leak.'
  )

  addClipCase(scene, root, handles, 70, 112, 'rect')
  addClipCase(scene, root, handles, 328, 112, 'rounded', { rounded: true })
  addClipCase(scene, root, handles, 586, 112, 'nested', { rounded: true, nested: true })

  if (scenario === 'postfx') {
    addClipCase(scene, root, handles, 70, 322, 'postfx child', { rounded: true, postfx: true })
    addClipCase(scene, root, handles, 328, 322, 'postfx nested', {
      rounded: true,
      postfx: true,
      nested: true,
    })
  } else {
    addClipCase(scene, root, handles, 70, 322, 'comparison')
    addClipCase(scene, root, handles, 328, 322, 'comparison rounded', { rounded: true })
  }
}

function configureLabCamera(
  camera: Phaser.Cameras.Scene2D.Camera,
  scene: Phaser.Scene,
  scenario: ClipLabScenario
): void {
  const vw =
    scenario === 'viewport'
      ? Math.min(720, Math.max(360, scene.scale.width - 160))
      : Math.min(980, Math.max(420, scene.scale.width - 120))
  const vh =
    scenario === 'viewport'
      ? Math.min(340, Math.max(260, scene.scale.height - 330))
      : Math.min(460, Math.max(300, scene.scale.height - 290))
  const vx = Math.max(32, Math.floor((scene.scale.width - vw) / 2))
  const vy = Math.min(310, Math.max(220, scene.scale.height - vh - 36))

  camera.setViewport(vx, vy, vw, vh)
  camera.setBackgroundColor(0x020617)

  if (scenario === 'scroll') {
    camera.setScroll(150, 76)
    camera.setZoom(1)
  } else if (scenario === 'zoom') {
    camera.setScroll(64, 42)
    camera.setZoom(1.35)
  } else if (scenario === 'viewport') {
    camera.setScroll(110, 74)
    camera.setZoom(1.15)
  } else {
    camera.setScroll(0, 0)
    camera.setZoom(1)
  }
}

export function StencilClipLab() {
  const scene = useScene()
  const tokens = useThemeTokens()
  const [scenario, setScenario] = useState<ClipLabScenario>('default')
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const onResize = () => setRevision((value) => value + 1)
    scene.scale.on('resize', onResize)
    return () => {
      scene.scale.off('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const root = scene.add.container(0, 0)
    const handles: StencilClipHandle[] = []
    addSceneContent(scene, root, scenario, handles)

    const camera = scene.cameras.add(0, 0, 800, 400)
    configureLabCamera(camera, scene, scenario)
    scene.cameras.main.ignore(root)

    const ignoredByLab = scene.children.list.filter((child) => child !== root)
    camera.ignore(ignoredByLab)

    let t = 0
    const update = () => {
      t += 0.018
      root.list.forEach((child) => {
        if (child instanceof Phaser.GameObjects.Container && child.list.length > 0) {
          child.rotation = Math.sin(t + child.x * 0.004) * 0.015
        }
      })
    }

    scene.events.on(Phaser.Scenes.Events.UPDATE, update)

    return () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, update)
      handles.forEach((handle) => handle.destroy())
      root.destroy(true)
      camera.destroy()
    }
  }, [scenario, revision])

  return (
    <View gap={14} width={'fill'} alignItems="center">
      <View
        width={960}
        gap={10}
        padding={12}
        cornerRadius={8}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        borderWidth={1}
        backgroundColor={tokens?.colors.background.lightest.toNumber()}
      >
        <Text text="Stencil Clip Lab" style={tokens?.textStyles.large} />
        <View direction="row" gap={10} alignItems="center">
          <Text text="Scenario:" style={tokens?.textStyles.small} />
          <RadioGroup
            direction="row"
            options={SCENARIO_OPTIONS}
            value={scenario}
            onChange={(value) => setScenario(value as ClipLabScenario)}
          />
        </View>
        <View direction="row" gap={10} alignItems="center">
          <Button variant="secondary" onClick={() => setRevision((value) => value + 1)}>
            <Text text="Rebuild" />
          </Button>
          <Text
            text="Use the camera window below to compare clip bounds against overflow content."
            style={tokens?.textStyles.small}
            alpha={0.82}
          />
        </View>
      </View>

      <View
        width={960}
        height={500}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        borderWidth={1}
        cornerRadius={8}
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
      />
    </View>
  )
}
