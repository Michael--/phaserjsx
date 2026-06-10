/**
 * Particles component documentation content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  preloadPresetsParticles,
  preloadQuickStartParticles,
  preloadZonesParticles,
  PresetsParticlesExample,
  QuickStartParticlesExample,
  ZonesParticlesExample,
} from '@/examples/particles'
import PresetsParticlesExampleRaw from '@/examples/particles/PresetsExample.tsx?raw'
import QuickStartParticlesExampleRaw from '@/examples/particles/QuickStartExample.tsx?raw'
import ZonesParticlesExampleRaw from '@/examples/particles/ZonesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

export const particlesContent: ComponentDocs = {
  title: 'Particles',
  description:
    'Typed wrapper around Phaser particle emitters with built-in presets, emitter config overrides, emit zones, and death zones.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Use a built-in preset with a preloaded texture.',
    component: QuickStartParticlesExample,
    height: SCENE_SIZES.medium,
    code: QuickStartParticlesExampleRaw,
    preload: preloadQuickStartParticles,
  },

  examples: [
    {
      id: 'presets',
      title: 'Presets',
      description: 'Built-in presets for trail, snow, explosion, rain, and sparkle.',
      component: PresetsParticlesExample,
      height: SCENE_SIZES.medium,
      code: PresetsParticlesExampleRaw,
      preload: preloadPresetsParticles,
    },
    {
      id: 'zones',
      title: 'Emit & Death Zones',
      description:
        'Use emitZone for where particles are born and deathZones for where particles are removed.',
      component: ZonesParticlesExample,
      height: SCENE_SIZES.medium,
      code: ZonesParticlesExampleRaw,
      preload: preloadZonesParticles,
    },
  ],

  propsEssential: [
    { name: 'texture', type: 'string', description: 'Texture key for emitted particles.' },
    {
      name: 'preset',
      type: '"explosion" | "trail" | "rain" | "snow" | "sparkle"',
      description: 'Built-in particle preset name.',
    },
    {
      name: 'config',
      type: 'ParticleEmitterConfig',
      description: 'Phaser emitter config overrides applied after the preset.',
    },
    {
      name: 'emitZone',
      type: 'ParticleZoneConfig',
      description: 'Where particles are born: rect, circle, ellipse, or line.',
    },
    {
      name: 'deathZones',
      type: 'ParticleDeathZoneConfig | ParticleDeathZoneConfig[]',
      description:
        'Where particles are removed. Use mode "onEnter" for obstacles or "onLeave" for boundaries.',
    },
  ],

  propsComplete: [
    { name: 'texture', type: 'string', description: 'Texture key for emitted particles.' },
    { name: 'frame', type: 'string | number', description: 'Optional texture frame.' },
    { name: 'preset', type: 'ParticlePresetName', description: 'Built-in or app-extended preset.' },
    {
      name: 'config',
      type: 'ParticleEmitterConfig',
      description: 'Phaser emitter config overrides applied after the preset.',
    },
    {
      name: 'emitZone',
      type: 'ParticleZoneConfig',
      description: 'Where particles are born. width/height are used as fallback size.',
    },
    {
      name: 'deathZones',
      type: 'ParticleDeathZoneConfig | ParticleDeathZoneConfig[]',
      description:
        'Where particles are removed. mode "onEnter" removes particles inside a region; mode "onLeave" keeps particles inside a boundary.',
    },
    {
      name: 'width',
      type: 'number',
      description: 'Fallback width for layout-sized emitZone/deathZones; not a particle boundary.',
    },
    {
      name: 'height',
      type: 'number',
      description: 'Fallback height for layout-sized emitZone/deathZones; not a particle boundary.',
    },
    {
      name: 'zone',
      type: 'ParticleZoneConfig',
      description: 'Deprecated alias for emitZone.',
    },
    {
      name: 'excludeZones',
      type: 'ParticleDeathZoneConfig | ParticleDeathZoneConfig[]',
      description: 'Deprecated alias for deathZones.',
    },
  ],

  inherits: [
    {
      component: 'Core Props',
      link: '/api/core-props',
      description: 'Particles supports transform and Phaser display props.',
    },
  ],
}
