/**
 * Phaser input configuration
 */
import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  // ... other config
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
  },
}

export { config }
