/**
 * Passing props to mounted components
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View, mountJSX } from '@number10/phaserjsx'
import Phaser from 'phaser'

interface PlayerUIProps {
  playerName: string
  level: number
  onPause: () => void
}

class PropsScene extends Phaser.Scene {
  create() {
    mountJSX(this, PlayerUI, {
      width: this.scale.width,
      height: this.scale.height,
      playerName: 'Hero',
      level: 5,
      onPause: () => this.scene.pause(),
    })
  }
}

function PlayerUI(props: PlayerUIProps) {
  return (
    <View>
      <Text text={`${props.playerName} - Level ${props.level}`} />
    </View>
  )
}

export { PropsScene }
