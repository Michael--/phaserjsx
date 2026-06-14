import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPresetWithMode } from './colors/color-presets'
import { getContrastRatio, hexToNumber } from './colors/color-utils'
import { setColorPreset } from './colors/preset-manager'
import { createDefaultTheme } from './theme-defaults'
import { createTheme, getThemedProps, themeRegistry } from './theme'

describe('theme resolution', () => {
  afterEach(() => {
    themeRegistry.resetGlobalTheme()
    themeRegistry.setColorTokens(undefined)
    themeRegistry.setCurrentPresetName(undefined, true)
  })

  it('applies component-local theme props from JSX theme context', () => {
    const localTheme = createTheme({
      Toggle: {
        width: 40,
        height: 22,
        thumbSize: 18,
        trackColorOn: 0x2196f3,
        duration: 500,
      },
    })

    const { props } = getThemedProps('Toggle', localTheme, {})

    expect(props.width).toBe(40)
    expect(props.height).toBe(22)
    expect(props.thumbSize).toBe(18)
    expect(props.trackColorOn).toBe(0x2196f3)
    expect(props.duration).toBe(500)
  })

  it('extracts nested themes from all default component theme names', () => {
    const localTheme = createTheme({
      View: {
        Toggle: { width: 60 },
        Dialog: { maxWidth: 480 },
        AlertDialog: { maxWidth: 420 },
        WrapText: { minWidth: 160 },
        Tooltip: { offset: 12 },
      },
    })

    const { nestedTheme } = getThemedProps('View', localTheme, {})

    expect(nestedTheme.Toggle?.width).toBe(60)
    expect(nestedTheme.Dialog?.maxWidth).toBe(480)
    expect(nestedTheme.AlertDialog?.maxWidth).toBe(420)
    expect(nestedTheme.WrapText?.minWidth).toBe(160)
    expect(nestedTheme.Tooltip?.offset).toBe(12)
  })

  it('notifies subscribers when the global theme is updated', () => {
    const listener = vi.fn()
    const unsubscribe = themeRegistry.subscribe(listener)

    themeRegistry.updateGlobalTheme({ Toggle: { width: 64 } })
    unsubscribe()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('updates the global component theme when switching color presets', () => {
    const forest = getPresetWithMode('forestGreen', themeRegistry.getColorMode())

    setColorPreset('forestGreen')

    const { props: buttonProps } = getThemedProps('Button', undefined, {})
    const { props: toggleProps } = getThemedProps('Toggle', undefined, {})

    expect(buttonProps.backgroundColor).toBe(forest.colors.primary.dark.toNumber())
    expect(toggleProps.trackColorOn).toBe(forest.colors.primary.DEFAULT.toNumber())
  })

  it('keeps default button variant text contrast at WCAG AA in light and dark modes', () => {
    for (const mode of ['light', 'dark'] as const) {
      const theme = createDefaultTheme('oceanBlue', mode)
      const colors = getPresetWithMode('oceanBlue', mode).colors
      const button = theme.Button

      const checks = [
        { name: 'primary', background: button.primary?.backgroundColor },
        { name: 'secondary', background: button.secondary?.backgroundColor },
        { name: 'danger', background: button.danger?.backgroundColor },
        {
          name: 'disabled',
          foreground: button.disabledTextColor,
          background: button.disabledColor,
        },
        { name: 'ghost', background: colors.surface.light.toNumber() },
        { name: 'outline', background: colors.surface.dark.toNumber() },
      ] as const

      for (const check of checks) {
        const variant = check.name === 'disabled' ? undefined : button[check.name]
        const foreground = hexToNumber(
          ('foreground' in check ? check.foreground : variant?.textStyle?.color) ?? '#000000'
        )
        const background = check.background ?? 0xffffff

        expect(
          getContrastRatio(foreground, background),
          `${mode} ${check.name} button text contrast`
        ).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})
