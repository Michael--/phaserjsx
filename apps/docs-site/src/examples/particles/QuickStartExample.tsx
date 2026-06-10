/**
 * Particles Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Particles, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function QuickStartParticlesExample() {
  return (
    <View width="fill" height="fill" padding={20} direction="stack">
      <Text text="Sparkle preset" x={20} y={20} style={{ color: '#ffffff', fontSize: '16px' }} />
      <Particles texture="particle-flares" frame="yellow" preset="sparkle" x={260} y={150} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadQuickStartParticles(scene: Phaser.Scene) {
  scene.load.atlas(
    'particle-flares',
    resolveAssetPath('assets/ui/flares.png'),
    resolveAssetPath('assets/ui/flares.json')
  )
}
