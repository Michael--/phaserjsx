/**
 * ParticlesExample - Demonstrates PhaserJSX Particles presets and zones.
 */
import { Particles, ScrollView, Text, View } from '@number10/phaserjsx'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

export function ParticlesExample() {
  return (
    <View width="100%" height="100%">
      <ScrollView>
        <ViewLevel2 gap={30} width={1400}>
          <SectionHeader title="Particles Component" />

          <View direction="row" gap={30}>
            <ViewLevel3 width={420} height={300} padding={16} direction="stack">
              <Text text="Sparkle preset" x={16} y={16} />
              <Particles texture="flares" frame="yellow" preset="sparkle" x={210} y={150} />
            </ViewLevel3>

            <ViewLevel3 width={420} height={300} padding={16} direction="stack">
              <Text text="Rain preset with rect emit zone" x={16} y={16} />
              <Particles
                texture="flares"
                frame="blue"
                preset="rain"
                x={40}
                y={50}
                width={340}
                height={220}
                emitZone={{ shape: 'rect', type: 'random' }}
              />
            </ViewLevel3>

            <ViewLevel3 width={420} height={300} padding={16} direction="stack">
              <Text text="Explosion with exclusion zone" x={16} y={16} />
              <Particles
                texture="flares"
                frame="red"
                preset="explosion"
                x={210}
                y={150}
                config={{ frequency: 900, lifespan: 900, scale: { start: 0.45, end: 0 } }}
                deathZones={{ shape: 'circle', radius: 48, x: 0, y: 0, mode: 'onEnter' }}
              />
            </ViewLevel3>
          </View>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
