import { describe, expect, it } from 'vitest'
import {
  getToastContentWidth,
  getToastAutoDismissDuration,
  resolveNotificationStackAlignment,
  type ToastItem,
} from './Toast'

describe('Toast utilities', () => {
  it('resolves stack alignment from position', () => {
    expect(resolveNotificationStackAlignment('top-left')).toEqual({
      justifyContent: 'start',
      alignItems: 'start',
    })
    expect(resolveNotificationStackAlignment('top-right')).toEqual({
      justifyContent: 'start',
      alignItems: 'end',
    })
    expect(resolveNotificationStackAlignment('bottom')).toEqual({
      justifyContent: 'end',
      alignItems: 'center',
    })
  })

  it('resolves auto-dismiss duration per item', () => {
    const item: ToastItem = { id: 'saved', title: 'Saved' }

    expect(getToastAutoDismissDuration(item, 4000)).toBe(4000)
    expect(getToastAutoDismissDuration({ ...item, duration: 1200 }, 4000)).toBe(1200)
    expect(getToastAutoDismissDuration({ ...item, autoDismiss: false }, 4000)).toBe(0)
  })

  it('calculates a bounded content width for numeric toast widths', () => {
    expect(
      getToastContentWidth({
        width: 320,
        padding: { left: 10, right: 10 },
        gap: 10,
        accentWidth: 4,
        hasPrefix: true,
        prefixWidth: 24,
        hasClose: true,
        closeButtonSize: 22,
      })
    ).toBe(220)

    expect(
      getToastContentWidth({
        width: 'fill',
        padding: 10,
        gap: 10,
        accentWidth: 4,
        hasPrefix: true,
        prefixWidth: 24,
        hasClose: true,
        closeButtonSize: 22,
      })
    ).toBeUndefined()
  })
})
