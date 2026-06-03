/** @jsxImportSource @number10/phaserjsx */
import {
  Button,
  mountComponent,
  setColorPreset,
  Text,
  unmountJSX,
  useThemeTokens,
  View,
  type MountProps,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'
import './style.css'

setColorPreset('oceanBlue', 'dark')

type ReproOverlayProps = MountProps & {
  title: string
  onSample1Click?: () => void
}

function ReproOverlay(props: ReproOverlayProps) {
  const tokens = useThemeTokens()

  return (
    <View width="fill" height="fill" padding={20}>
      <View
        gap={10}
        padding={14}
        backgroundColor={tokens?.colors.background.DEFAULT.toNumber()}
        borderColor={tokens?.colors.border.DEFAULT.toNumber()}
        borderWidth={1}
        cornerRadius={6}
      >
        <Text text={props.title} style={tokens?.textStyles.title} />
        <Text
          text="Use this file as the shared repro surface. Add Phaser 4 native code in ReproScene and PhaserJSX UI in ReproOverlay."
          style={tokens?.textStyles.small}
        />
        <View direction="row" alignItems="center" gap={10}>
          <Button variant="primary" size="medium" onClick={() => props.onSample1Click?.()}>
            <Text text="Sample 1" />
          </Button>
        </View>
      </View>
    </View>
  )
}

class ReproScene extends Phaser.Scene {
  private phaserExample: Phaser.GameObjects.Container | null = null

  create(): void {
    mountComponent(this, ReproOverlay, {
      title: 'Phaser 4 Issue Repro',
      width: this.scale.width,
      height: this.scale.height,
      onSample1Click: () => {
        if (this.phaserExample) {
          this.phaserExample.destroy()
          this.phaserExample = null
        } else {
          this.phaserExample = this.createNativePhaserFixture()
        }
      },
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.phaserExample?.destroy()
      unmountJSX(this)
    })
  }

  private createNativePhaserFixture(): Phaser.GameObjects.Container {
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

    const width = this.scale.width
    const height = this.scale.height
    const container = this.add
      .container(width * 0.5, height * 0.5, [frame, axisX, axisY, marker, label])
      .setDepth(10)

    return container
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
