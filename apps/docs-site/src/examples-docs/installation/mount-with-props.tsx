/**
 * Passing props to mounted components
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View, mountJSX } from '@phaserjsx/ui'
import Phaser from 'phaser'

interface PlayerUIProps {
  playerName: string
  level: number
  onPause: () => void
}

class PropsScene extends Phaser.Scene {
  create() {
    mountJSX(this, PlayerUI, {
      playerName: 'Hero',
      level: 5,
      onPause: () => this.scene.pause(),
    })
  }
}

function PlayerUI(props: PlayerUIProps) {
  return (
    <View>
      <Text>
        {props.playerName} - Level {props.level}
      </Text>
    </View>
  )
}

export { PropsScene }
