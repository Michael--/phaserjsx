/**
 * Particles Zones Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { resolveAssetPath } from '@/utils/assetPath'
import { Particles, Text, View } from '@number10/phaserjsx'

export function ZonesParticlesExample() {
  return (
    <View
      width="fill"
      height="fill"
      padding={40}
      gap={40}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        text="Emit zone controls spawn. Death zone removes particles on enter."
        style={{ color: '#ffffff', fontSize: '15px' }}
      />
      <View width={360} height={180} backgroundColor={0x20283a} cornerRadius={8} direction="stack">
        <Text
          text="emitZone"
          x={12}
          y={10}
          style={{ color: '#9fb1d1', fontSize: '13px' }}
          depth={2}
        />
        <View
          x={180 - 40}
          y={90 - 40}
          width={80}
          height={80}
          borderColor={0xffc857}
          borderWidth={2}
          cornerRadius={40}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="deathZones" style={{ color: '#ffc857', fontSize: '13px' }} />
        </View>
        <Particles
          texture="particle-zones"
          frame="green"
          preset="snow"
          x={0}
          y={0}
          width={360}
          height={0}
          emitZone={{ shape: 'rect', type: 'random' }}
          config={{ frequency: 5, lifespan: 1900, scale: { start: 0.45, end: 0 } }}
          deathZones={{ shape: 'circle', x: 180, y: 90, radius: 40, mode: 'onEnter' }}
        />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadZonesParticles(scene: Phaser.Scene) {
  scene.load.atlas(
    'particle-zones',
    resolveAssetPath('assets/ui/flares.png'),
    resolveAssetPath('assets/ui/flares.json')
  )
}
