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
    'Typed wrapper around Phaser particle emitters with built-in presets, emitter config overrides, emit zones, and exclusion zones.',

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
      title: 'Emit & Exclusion Zones',
      description: 'Use layout-sized emit zones and exclusion death zones.',
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
      name: 'zone',
      type: 'ParticleZoneConfig',
      description: 'Optional emit zone: rect, circle, ellipse, or line.',
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
    { name: 'zone', type: 'ParticleZoneConfig', description: 'Optional emit zone.' },
    {
      name: 'excludeZones',
      type: 'ParticleExclusionZoneConfig | ParticleExclusionZoneConfig[]',
      description: 'Optional death zones to exclude particles from regions.',
    },
    {
      name: 'width',
      type: 'number',
      description: 'Fallback width for layout-sized emit/death zones.',
    },
    {
      name: 'height',
      type: 'number',
      description: 'Fallback height for layout-sized emit/death zones.',
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
