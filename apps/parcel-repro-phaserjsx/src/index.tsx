/** @jsx createElement */
import './styles.css'

import {
  addSceneBackground,
  Button,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElement,
  createPhaserJSXPlugin,
  Image,
  MountProps,
  setColorPreset,
  Text,
  useState,
  useThemeTokens,
  View,
  type SceneBackgroundHandle,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

const DEFAULT_LOGO_KEY = 'phaser-logo'

class MainScene extends Phaser.Scene {
  private backgroundHandle?: SceneBackgroundHandle | null
  preload() {
    this.load.image(DEFAULT_LOGO_KEY, 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')
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
  /** Additional props can be defined here if needed */
  title: string
}

function RootUI(props: RootUIProps) {
  const tokens = useThemeTokens()
  const [value, setValue] = useState(0)
  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View
        width={'fill'}
        height={'fill'}
        alignItems="center"
        justifyContent="start"
        gap={30}
        padding={20}
        borderColor={tokens?.colors.border.lightest.toNumber()}
        borderAlpha={1}
        borderWidth={3}
        cornerRadius={12}
      >
        <Text text={props.title} style={tokens?.textStyles.title} />
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
            <Text text={'➖'} />
          </Button>
          <Text text={`${value}`} style={tokens?.textStyles.title} />
          <Button variant="primary" size="large" onClick={() => setValue(value + 1)}>
            <Text text={'➕'} />
          </Button>
        </View>
      </View>
    </View>
  )
}

new Phaser.Game({
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
  scene: [MainScene],
  plugins: {
    global: [
      createPhaserJSXPlugin({
        component: RootUI,
        props: { title: '🚀 PhaserJSX Parcel Bundler Demo' },
        autoResize: true,
      }),
    ],
  },
})
