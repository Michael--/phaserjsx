import { describe, expect, it } from 'vitest'
import { calculateOverlayPosition } from './Popover'

describe('Popover positioning', () => {
  const anchor = { x: 100, y: 80, width: 60, height: 30 }
  const content = { width: 120, height: 80 }

  it('positions below and centered by default', () => {
    expect(calculateOverlayPosition({ anchor, content, placement: 'bottom', offset: 8 })).toEqual({
      x: 70,
      y: 118,
      placement: 'bottom',
    })
  })

  it('supports edge-aligned placements', () => {
    expect(
      calculateOverlayPosition({ anchor, content, placement: 'bottom-start', offset: 4 })
    ).toEqual({
      x: 100,
      y: 114,
      placement: 'bottom-start',
    })
    expect(calculateOverlayPosition({ anchor, content, placement: 'top-end', offset: 4 })).toEqual({
      x: 40,
      y: -4,
      placement: 'top-end',
    })
  })

  it('supports side placements', () => {
    expect(calculateOverlayPosition({ anchor, content, placement: 'right', offset: 10 })).toEqual({
      x: 170,
      y: 55,
      placement: 'right',
    })
  })

  it('clamps to viewport padding', () => {
    expect(
      calculateOverlayPosition({
        anchor: { x: 10, y: 10, width: 20, height: 20 },
        content,
        placement: 'top-start',
        offset: 8,
        viewport: { width: 200, height: 160 },
        viewportPadding: 12,
      })
    ).toEqual({ x: 12, y: 12, placement: 'top-start' })
  })
})
