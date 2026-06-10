/**
 * Particle emit/death zone helper tests
 */
import { describe, expect, it } from 'vitest'
import { buildDeathZonesFromLayout, buildEmitZoneFromLayout } from './emit-zone'

describe('particle zone helpers', () => {
  it('builds an emit zone using layout size as fallback', () => {
    const emitZone = buildEmitZoneFromLayout({ shape: 'rect', type: 'random' }, 320, 180)

    expect(emitZone?.type).toBe('random')
    expect((emitZone?.source as { width: number } | undefined)?.width).toBe(320)
    expect((emitZone?.source as { height: number } | undefined)?.height).toBe(180)
  })

  it('builds death zones with onEnter and onLeave modes', () => {
    const deathZones = buildDeathZonesFromLayout(
      [
        { shape: 'circle', x: 100, y: 80, radius: 24, mode: 'onEnter' },
        { shape: 'rect', width: 320, height: 180, mode: 'onLeave' },
      ],
      320,
      180
    )

    expect(deathZones).toHaveLength(2)
    expect(deathZones?.[0]?.type).toBe('onEnter')
    expect(deathZones?.[1]?.type).toBe('onLeave')
    expect((deathZones?.[1]?.source as { width: number } | undefined)?.width).toBe(320)
    expect((deathZones?.[1]?.source as { height: number } | undefined)?.height).toBe(180)
  })
})
