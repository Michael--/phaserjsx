/**
 * Particles Presets Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Particles, Text, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function PresetsParticlesExample() {
  return (
    <View width="fill" height="fill" padding={20} direction="stack">
      <Text text="trail" x={70} y={24} style={{ color: '#ffffff', fontSize: '14px' }} />
      <Particles texture="particle-presets" frame="blue" preset="trail" x={90} y={150} />

      <Text text="snow" x={230} y={24} style={{ color: '#ffffff', fontSize: '14px' }} />
      <Particles texture="particle-presets" frame="white" preset="snow" x={250} y={60} />

      <Text text="explosion" x={380} y={24} style={{ color: '#ffffff', fontSize: '14px' }} />
      <Particles
        texture="particle-presets"
        frame="red"
        preset="explosion"
        x={420}
        y={150}
        config={{ frequency: 1200, scale: { start: 0.6, end: 0 } }}
      />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadPresetsParticles(scene: Phaser.Scene) {
  scene.load.atlas(
    'particle-presets',
    resolveAssetPath('assets/ui/flares.png'),
    resolveAssetPath('assets/ui/flares.json')
  )
}
