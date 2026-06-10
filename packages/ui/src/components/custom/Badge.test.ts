import { describe, expect, it } from 'vitest'
import { formatBadgeCount, getBadgeText, resolveBadgeTextStyle } from './Badge'

describe('Badge utilities', () => {
  it('formats counts within the configured max', () => {
    expect(formatBadgeCount({ count: 0 })).toBe('0')
    expect(formatBadgeCount({ count: 7 })).toBe('7')
    expect(formatBadgeCount({ count: 99 })).toBe('99')
  })

  it('formats overflowing counts compactly', () => {
    expect(formatBadgeCount({ count: 100 })).toBe('99+')
    expect(formatBadgeCount({ count: 42, maxCount: 9 })).toBe('9+')
  })

  it('normalizes invalid or negative counts', () => {
    expect(formatBadgeCount({ count: Number.NaN })).toBe('0')
    expect(formatBadgeCount({ count: -5 })).toBe('0')
  })

  it('prefers count text over label text', () => {
    expect(getBadgeText({ label: 'New' })).toBe('New')
    expect(getBadgeText({ label: 'New', count: 3 })).toBe('3')
  })

  it('uses the selected size for default text font size', () => {
    expect(resolveBadgeTextStyle({ size: 'small', textColor: '#fff' }).fontSize).toBe('11px')
    expect(resolveBadgeTextStyle({ size: 'medium', textColor: '#fff' }).fontSize).toBe('13px')
    expect(resolveBadgeTextStyle({ size: 'large', textColor: '#fff' }).fontSize).toBe('18px')
  })

  it('allows explicit text style to override size font size', () => {
    expect(
      resolveBadgeTextStyle({
        size: 'large',
        textColor: '#fff',
        explicitTextStyle: { fontSize: '20px' },
      }).fontSize
    ).toBe('20px')
  })
})
