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

  it('evaluates death zones in owner-local coordinates', () => {
    const owner = {
      getWorldTransformMatrix: () => ({
        applyInverse: (x: number, y: number, output = { x: 0, y: 0 }) => {
          output.x = x - 40
          output.y = y - 80
          return output
        },
      }),
    }

    const deathZones = buildDeathZonesFromLayout(
      { shape: 'circle', x: 180, y: 90, radius: 40, mode: 'onEnter' },
      360,
      180,
      owner
    )

    expect(deathZones?.[0]?.source.contains(220, 170)).toBe(true)
    expect(deathZones?.[0]?.source.contains(180, 90)).toBe(false)
  })
})
