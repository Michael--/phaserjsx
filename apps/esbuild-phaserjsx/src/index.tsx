/** @jsxImportSource @number10/phaserjsx */

import {
  addSceneBackground,
  Button,
  createPhaserJSXPlugin,
  Image,
  type MountProps,
  setColorPreset,
  Text,
  useState,
  useThemeTokens,
  View,
  type SceneBackgroundHandle,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

const DEFAULT_LOGO_KEY = 'phaser-logo'
const DEFAULT_LOGO_URL = 'https://labs.phaser.io/assets/sprites/phaser3-logo.png'

class MainScene extends Phaser.Scene {
  private backgroundHandle?: SceneBackgroundHandle | null

  preload() {
    this.load.image(DEFAULT_LOGO_KEY, DEFAULT_LOGO_URL)
  }

  create() {
    this.backgroundHandle = addSceneBackground(this, { type: 'grid', animation: 'lemniscate' })
  }

  destroy() {
    this.backgroundHandle?.destroy()
    this.backgroundHandle = null
  }
}

setColorPreset('oceanBlue', 'dark')

export interface RootUIProps extends MountProps {
  title: string
  subtitle: string
}

function RootUI({ title, subtitle }: RootUIProps) {
  const tokens = useThemeTokens()
  const [value, setValue] = useState(0)

  return (
    <View width="fill" height="fill" padding={20}>
      <View
        width="fill"
        height="fill"
        alignItems="center"
        justifyContent="start"
        gap={30}
        padding={20}
        borderColor={tokens?.colors.border.lightest.toNumber()}
        borderAlpha={1}
        borderWidth={3}
        cornerRadius={12}
      >
        <View gap={6} alignItems="center">
          <Text text={title} style={tokens?.textStyles.heading} />
          <Text text={subtitle} style={tokens?.textStyles.small} />
        </View>
        <Image texture={DEFAULT_LOGO_KEY} />
        <View
          direction="row"
          cornerRadius={12}
          gap={20}
          padding={10}
          alignItems="center"
          backgroundColor={tokens?.colors.background.lightest.toNumber()}
        >
          <Button variant="primary" size="large" onClick={() => setValue(value - 1)}>
            <Text text="-" />
          </Button>
          <Text text={`${value}`} style={tokens?.textStyles.title} />
          <Button variant="primary" size="large" onClick={() => setValue(value + 1)}>
            <Text text="+" />
          </Button>
        </View>
      </View>
    </View>
  )
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  input: {
    mouse: true,
    touch: true,
    activePointers: 2,
  },
  disableContextMenu: true,
  backgroundColor: '#2a2a2a',
  parent: 'app',
  scene: [MainScene],
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: RootUI,
        props: {
          title: 'PhaserJSX esbuild Demo',
          subtitle: 'esbuild bundler example',
        },
        autoResize: true,
      }),
    ],
  },
}

new Phaser.Game(config)
