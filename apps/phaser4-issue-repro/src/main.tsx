/** @jsxImportSource @number10/phaserjsx */

import {
  Button,
  createPhaserJSXPlugin,
  setColorPreset,
  Text,
  useState,
  useThemeTokens,
  View,
  type MountProps,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

const root = document.getElementById('app')
if (!root) {
  throw new Error('Missing #app root element')
}

Object.assign(document.documentElement.style, {
  margin: '0',
  width: '100%',
  height: '100%',
})
Object.assign(document.body.style, {
  margin: '0',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: '#111827',
})
Object.assign(root.style, {
  width: '100%',
  height: '100%',
})

setColorPreset('oceanBlue', 'dark')

class ReproScene extends Phaser.Scene {
  private nativeGroup?: Phaser.GameObjects.Container
  private nativeFrame?: Phaser.GameObjects.Rectangle
  private nativeLabel?: Phaser.GameObjects.Text

  create(): void {
    this.cameras.main.setBackgroundColor(0x111827)
    this.createNativePhaserFixture()

    this.scale.on('resize', this.layoutNativePhaserFixture, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.layoutNativePhaserFixture, this)
    })
  }

  override update(time: number): void {
    if (!this.nativeGroup) return
    this.nativeGroup.rotation = Math.sin(time / 800) * 0.05
  }

  private createNativePhaserFixture(): void {
    const frame = this.add
      .rectangle(0, 0, 360, 220, 0x1f2937, 0.92)
      .setStrokeStyle(2, 0x38bdf8, 0.9)
    const label = this.add.text(-158, -92, 'Native Phaser 4 fixture', {
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '16px',
    })
    const marker = this.add.circle(0, 24, 54, 0xf97316, 0.88).setStrokeStyle(4, 0xfef3c7, 0.8)
    const axisX = this.add.rectangle(0, 24, 240, 2, 0x93c5fd, 0.72)
    const axisY = this.add.rectangle(0, 24, 2, 132, 0x93c5fd, 0.72)

    this.nativeFrame = frame
    this.nativeLabel = label
    this.nativeGroup = this.add.container(0, 0, [frame, axisX, axisY, marker, label])
    this.nativeGroup.setDepth(10)

    this.tweens.add({
      targets: marker,
      scale: { from: 0.86, to: 1.12 },
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    this.layoutNativePhaserFixture()
  }

  private layoutNativePhaserFixture(): void {
    const width = this.scale.width
    const height = this.scale.height
    const fixtureWidth = Math.min(420, Math.max(280, width * 0.44))
    const fixtureHeight = Math.min(260, Math.max(190, height * 0.32))

    this.nativeFrame?.setSize(fixtureWidth, fixtureHeight)
    this.nativeLabel?.setPosition(-fixtureWidth / 2 + 18, -fixtureHeight / 2 + 16)
    this.nativeGroup?.setPosition(width * 0.5, height * 0.56)
  }
}

type ReproOverlayProps = MountProps & {
  title: string
}

function ReproOverlay({ title }: ReproOverlayProps) {
  const tokens = useThemeTokens()
  const [count, setCount] = useState(0)

  return (
    <View width="fill" height="fill" padding={20}>
      <View
        width={360}
        maxWidth="100%"
        gap={10}
        padding={14}
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        borderWidth={1}
        cornerRadius={6}
      >
        <Text text={title} style={tokens?.textStyles.title} />
        <Text
          text="Use this file as the shared repro surface. Add Phaser 4 native code in ReproScene and PhaserJSX UI in ReproOverlay."
          style={tokens?.textStyles.small}
        />
        <View direction="row" alignItems="center" gap={10}>
          <Button variant="primary" size="medium" onClick={() => setCount(count + 1)}>
            <Text text="Increment" />
          </Button>
          <Text text={`PhaserJSX state: ${count}`} style={tokens?.textStyles.small} />
        </View>
      </View>
    </View>
  )
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
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: ReproOverlay,
        props: {
          title: 'Phaser 4 Issue Repro',
        },
        autoResize: true,
      }),
    ],
  },
}

const game = new Phaser.Game(config)

;(window as Window & { phaser4IssueRepro?: Phaser.Game }).phaser4IssueRepro = game
