/** @jsx createElement */
import './styles.css'

import {
  Button,
  MountProps,
  Text,
  View,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElement,
  createPhaserJSXPlugin,
} from '@number10/phaserjsx'
import * as Phaser from 'phaser'

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png')
  }

  create() {
    this.add.image(400, 300, 'logo')
  }
}

export interface AppProps extends MountProps {
  /** Additional props can be defined here if needed */
  title: string
}

function Test42(props: AppProps) {
  return (
    <View
      width={'fill'}
      height={'fill'}
      alignItems="center"
      justifyContent="center"
      gap={10}
      backgroundColor={0x775522}
    >
      <Button variant="primary" size="large" onClick={() => alert('Hello from PhaserJSX!')}>
        <Text text={props.title} />
      </Button>
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
        component: Test42,
        props: { title: '🚀 PhaserJSX Dev Playground' },
        autoResize: true,
      }),
    ],
  },
})
