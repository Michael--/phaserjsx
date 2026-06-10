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
            <ViewLevel3 width={420} height={300} padding={20} direction="stack">
              <Text text="Sparkle preset" x={20} y={20} />
              <Particles texture="flares" frame="yellow" preset="sparkle" x={210} y={150} />
            </ViewLevel3>

            <ViewLevel3 width={420} height={300} padding={20} direction="stack" overflow="hidden">
              <Text text="Sparkle preset with rect emit zone" x={20} y={20} />
              <Particles
                texture="flares"
                frame="blue"
                preset="sparkle"
                x={20}
                y={20}
                width={380}
                height={260}
                emitZone={{ shape: 'rect', type: 'random' }}
                config={{ frequency: 100, lifespan: 1000 }}
              />
            </ViewLevel3>

            <ViewLevel3 width={420} height={300} padding={20} direction="stack" overflow="hidden">
              <Text text="Snow with exclusion zone" x={20} y={20} />
              <Particles
                texture="flares"
                frame="red"
                preset="snow"
                x={20}
                y={60}
                width={380}
                height={20}
                emitZone={{ shape: 'rect', type: 'random' }}
                config={{ frequency: 5, lifespan: 2500, scale: { start: 0.45, end: 0 } }}
                deathZones={{ shape: 'circle', radius: 48, x: 200, y: 100, mode: 'onEnter' }}
              />
            </ViewLevel3>
          </View>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
