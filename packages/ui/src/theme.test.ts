import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPresetWithMode, type PresetName, presets } from './colors/color-presets'
import type { ColorTokens, ShadeLevel } from './colors/color-types'
import { getContrastRatio, hexToNumber } from './colors/color-utils'
import { setColorPreset } from './colors/preset-manager'
import { createTheme, getThemedProps, themeRegistry } from './theme'
import { createDefaultTheme } from './theme-defaults'

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

  it('keeps default button variant text contrast at WCAG AA across all presets', () => {
    const presetNames = Object.keys(presets) as PresetName[]

    for (const presetName of presetNames) {
      for (const mode of ['light', 'dark'] as const) {
        const theme = createDefaultTheme(presetName, mode)
        const colors = getPresetWithMode(presetName, mode).colors
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
            `${presetName}.${mode} ${check.name} button text contrast`
          ).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })
})

// ---------------------------------------------------------------------------
// WCAG Contrast Audit — exhaustive text-on-background checks across all
// presets × modes. Catches regressions when colors are changed.
// ---------------------------------------------------------------------------

/** WCAG AA minimum for normal text (≤18px) */
const WCAG_AA_NORMAL = 4.5
/** WCAG AA minimum for large text (≥18px or ≥14px bold) */
const WCAG_AA_LARGE = 3.0

/** All shade levels used in the color system */
const SHADES: ShadeLevel[] = ['lightest', 'light', 'medium', 'dark', 'darkest']

/**
 * Semantic color keys that can serve as backgrounds for text
 */
const SEMANTIC_BG_KEYS = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'error',
  'info',
] as const

interface ContrastFailure {
  preset: string
  mode: string
  foreground: string
  background: string
  ratio: number
}

/**
 * Format contrast failures into a readable report string.
 */
function formatFailures(failures: ContrastFailure[]): string {
  if (failures.length === 0) return ''

  const lines: string[] = [
    `\n${failures.length} contrast failure(s) found:\n`,
    '┌─────────────────────────────────────────────────────────────────┬─────────┐',
    '│ Preset.Mode        Foreground             Background           │  Ratio  │',
    '├─────────────────────────────────────────────────────────────────┼─────────┤',
  ]

  for (const f of failures) {
    const label = `${f.preset}.${f.mode}`.padEnd(20)
    const fg = f.foreground.padEnd(22)
    const bg = f.background.padEnd(21)
    lines.push(`│ ${label}${fg}${bg}│ ${String(f.ratio).padStart(5)}   │`)
  }

  lines.push('└─────────────────────────────────────────────────────────────────┴─────────┘')
  return lines.join('\n')
}

/**
 * Canonical text-on-neutral pairs that MUST meet WCAG AA (4.5:1).
 * Pairs are mode-aware: light mode uses darkest text on lightest bg,
 * dark mode uses lightest text on darkest bg.
 */
function auditCanonicalNeutralPairs(
  presetName: string,
  mode: 'light' | 'dark',
  colors: ColorTokens
): ContrastFailure[] {
  const failures: ContrastFailure[] = []

  // Body text on main backgrounds (both modes)
  const universalPairs: [ShadeLevel, 'background' | 'surface', ShadeLevel][] = [
    ['DEFAULT', 'background', 'DEFAULT'], // body text on bg
    ['DEFAULT', 'surface', 'DEFAULT'], // body text on card/panel
  ]

  // Mode-specific strong-contrast pairs
  const modePairs: [ShadeLevel, 'background' | 'surface', ShadeLevel][] =
    mode === 'light'
      ? [
          ['darkest', 'background', 'lightest'], // dark text on light bg
          ['darkest', 'surface', 'lightest'], // dark text on light surface
          ['dark', 'background', 'DEFAULT'], // slightly muted text
        ]
      : [
          ['lightest', 'background', 'darkest'], // light text on dark bg
          ['lightest', 'surface', 'darkest'], // light text on dark surface
          ['light', 'background', 'DEFAULT'], // slightly muted text
        ]

  const allPairs = [...universalPairs, ...modePairs]

  for (const [textShade, bgType, bgShade] of allPairs) {
    const fg = colors.text[textShade].toNumber()
    const bg = colors[bgType][bgShade].toNumber()
    const ratio = getContrastRatio(fg, bg)
    if (ratio < WCAG_AA_NORMAL) {
      failures.push({
        preset: presetName,
        mode,
        foreground: `text.${textShade}`,
        background: `${bgType}.${bgShade}`,
        ratio: Math.round(ratio * 100) / 100,
      })
    }
  }

  return failures
}

/**
 * Check that every background shade (neutral + semantic) can support readable
 * text. Tests whether pure black (0x000000) or pure white (0xffffff) achieves
 * WCAG AA (≥4.5) on each background. If neither works, the background color
 * sits in the "danger zone" mid-luminance range — no text color will work well.
 */
function auditBackgroundUsability(
  presetName: string,
  mode: 'light' | 'dark',
  colors: ColorTokens
): ContrastFailure[] {
  const failures: ContrastFailure[] = []
  const BLACK = 0x000000
  const WHITE = 0xffffff

  const bgCategories: [string, ColorTokens[keyof Pick<ColorTokens, 'background' | 'surface'>]][] = [
    ['background', colors.background],
    ['surface', colors.surface],
    ...SEMANTIC_BG_KEYS.map((k) => [k, colors[k]] as const),
  ]

  for (const [category, shadeObj] of bgCategories) {
    for (const shade of SHADES) {
      const bg = shadeObj[shade].toNumber()
      const blackRatio = getContrastRatio(BLACK, bg)
      const whiteRatio = getContrastRatio(WHITE, bg)

      if (blackRatio < WCAG_AA_NORMAL && whiteRatio < WCAG_AA_NORMAL) {
        failures.push({
          preset: presetName,
          mode,
          foreground: '(neither #000 nor #fff)',
          background: `${category}.${shade}`,
          ratio: Math.max(blackRatio, whiteRatio),
        })
      }
    }
  }

  return failures
}

/**
 * Coverage check: ensure every neutral background shade has at least one
 * text shade that meets WCAG AA (4.5:1). This guarantees every surface
 * can display readable text.
 */
function auditNeutralCoverage(
  presetName: string,
  mode: 'light' | 'dark',
  colors: ColorTokens
): ContrastFailure[] {
  const failures: ContrastFailure[] = []
  const bgTypes = ['background', 'surface'] as const

  for (const bgType of bgTypes) {
    for (const bgShade of SHADES) {
      const bg = colors[bgType][bgShade].toNumber()
      const hasReadable = SHADES.some(
        (ts) => getContrastRatio(colors.text[ts].toNumber(), bg) >= WCAG_AA_NORMAL
      )
      if (!hasReadable) {
        failures.push({
          preset: presetName,
          mode,
          foreground: '(none)',
          background: `${bgType}.${bgShade}`,
          ratio: 0,
        })
      }
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// Exhaustive audit (skipped by default — run manually for full analysis)
// ---------------------------------------------------------------------------

describe('WCAG contrast audit (exhaustive)', () => {
  const presetNames = Object.keys(presets) as PresetName[]
  const modes = ['light', 'dark'] as const

  it.skip('all text-on-neutral-surface pairs across presets×modes', () => {
    const allFailures: ContrastFailure[] = []

    for (const name of presetNames) {
      for (const mode of modes) {
        const preset = getPresetWithMode(name, mode)
        const colors = preset.colors

        for (const textShade of SHADES) {
          const fg = colors.text[textShade].toNumber()
          for (const bgShade of SHADES) {
            for (const bgType of ['background', 'surface'] as const) {
              const bg = colors[bgType][bgShade].toNumber()
              const ratio = getContrastRatio(fg, bg)
              if (ratio < WCAG_AA_NORMAL) {
                allFailures.push({
                  preset: name,
                  mode,
                  foreground: `text.${textShade}`,
                  background: `${bgType}.${bgShade}`,
                  ratio: Math.round(ratio * 100) / 100,
                })
              }
            }
          }
        }
      }
    }

    expect(allFailures, formatFailures(allFailures)).toHaveLength(0)
  })

  it.skip('all text-on-semantic-color pairs across presets×modes', () => {
    const allFailures: ContrastFailure[] = []

    for (const name of presetNames) {
      for (const mode of modes) {
        const preset = getPresetWithMode(name, mode)
        const colors = preset.colors

        for (const textShade of SHADES) {
          const fg = colors.text[textShade].toNumber()
          for (const key of SEMANTIC_BG_KEYS) {
            for (const bgShade of SHADES) {
              const bg = colors[key][bgShade].toNumber()
              const ratio = getContrastRatio(fg, bg)
              if (ratio < WCAG_AA_LARGE) {
                allFailures.push({
                  preset: name,
                  mode,
                  foreground: `text.${textShade}`,
                  background: `${key}.${bgShade}`,
                  ratio: Math.round(ratio * 100) / 100,
                })
              }
            }
          }
        }
      }
    }

    expect(allFailures, formatFailures(allFailures)).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Enforced contrast tests — these MUST pass.
// ---------------------------------------------------------------------------

describe('WCAG contrast enforcement', () => {
  const presetNames = Object.keys(presets) as PresetName[]
  const modes = ['light', 'dark'] as const

  it('canonical text-on-neutral pairs meet WCAG AA (≥4.5)', () => {
    const allFailures: ContrastFailure[] = []

    for (const name of presetNames) {
      for (const mode of modes) {
        const preset = getPresetWithMode(name, mode)
        const failures = auditCanonicalNeutralPairs(name, mode, preset.colors)
        allFailures.push(...failures)
      }
    }

    expect(allFailures, formatFailures(allFailures)).toHaveLength(0)
  })

  it('every background shade supports black or white text at WCAG AA (≥4.5)', () => {
    const allFailures: ContrastFailure[] = []

    for (const name of presetNames) {
      for (const mode of modes) {
        const preset = getPresetWithMode(name, mode)
        const failures = auditBackgroundUsability(name, mode, preset.colors)
        allFailures.push(...failures)
      }
    }

    expect(allFailures, formatFailures(allFailures)).toHaveLength(0)
  })

  it('every neutral background shade has at least one readable text color (≥4.5)', () => {
    const allFailures: ContrastFailure[] = []

    for (const name of presetNames) {
      for (const mode of modes) {
        const preset = getPresetWithMode(name, mode)
        const failures = auditNeutralCoverage(name, mode, preset.colors)
        allFailures.push(...failures)
      }
    }

    expect(allFailures, formatFailures(allFailures)).toHaveLength(0)
  })
})
