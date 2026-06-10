/**
 * Particles Zones Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { resolveAssetPath } from '@/utils/assetPath'
import { Particles, Text, View } from '@number10/phaserjsx'

export function ZonesParticlesExample() {
  return (
    <View width="fill" height="fill" padding={20} gap={20}>
      <Text
        text="Emit zone controls spawn. Death zone removes particles on enter."
        x={20}
        y={20}
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
        />
        <Text
          text="deathZones: onEnter"
          x={105}
          y={82}
          style={{ color: '#ffc857', fontSize: '13px' }}
          depth={2}
        />
        <Particles
          texture="particle-zones"
          frame="green"
          preset="rain"
          x={0}
          y={0}
          width={360}
          height={180}
          emitZone={{ shape: 'rect', type: 'random' }}
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
