import { describe, expect, it } from 'vitest'
import {
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
})
