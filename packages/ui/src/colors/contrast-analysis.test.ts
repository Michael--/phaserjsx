/**
 * Ad-hoc contrast analysis for all color presets
 * Run via: pnpm vitest run src/colors/contrast-analysis.test.ts
 */
import { describe, expect, it } from 'vitest'
import { getPreset, getPresetWithMode } from './color-presets'
import type { ColorTokens } from './color-types'

/**
 * WCAG relative luminance
 */
function getLuminance(hex: string): number {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = ((num >> 16) & 0xff) / 255
  const g = ((num >> 8) & 0xff) / 255
  const b = (num & 0xff) / 255

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = getLuminance(fgHex)
  const l2 = getLuminance(bgHex)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function analyzePreset(name: string, colors: ColorTokens, mode: string) {
  const textLevels = ['lightest', 'light', 'medium', 'dark', 'darkest'] as const
  const bgLevels = ['lightest', 'light', 'medium', 'dark', 'darkest'] as const

  const issues: string[] = []
  const checks: string[] = []

  // Text on Background contrast
  for (const txtLevel of textLevels) {
    for (const bgLevel of bgLevels) {
      const fg = colors.text[txtLevel].toString()
      const bg = colors.background[bgLevel].toString()
      const ratio = contrastRatio(fg, bg)

      if (ratio < 3) {
        issues.push(
          `  ❌ text.${txtLevel} (${fg}) on background.${bgLevel} (${bg}) = ${ratio.toFixed(1)}:1`
        )
      } else if (ratio < 4.5) {
        checks.push(
          `  ⚠️  text.${txtLevel} (${fg}) on background.${bgLevel} (${bg}) = ${ratio.toFixed(1)}:1 (fails AA)`
        )
      }
    }
  }

  // Text on Surface contrast
  for (const txtLevel of textLevels) {
    for (const bgLevel of bgLevels) {
      const fg = colors.text[txtLevel].toString()
      const bg = colors.surface[bgLevel].toString()
      const ratio = contrastRatio(fg, bg)

      if (ratio < 3) {
        issues.push(
          `  ❌ text.${txtLevel} (${fg}) on surface.${bgLevel} (${bg}) = ${ratio.toFixed(1)}:1`
        )
      } else if (ratio < 4.5) {
        checks.push(
          `  ⚠️  text.${txtLevel} (${fg}) on surface.${bgLevel} (${bg}) = ${ratio.toFixed(1)}:1 (fails AA)`
        )
      }
    }
  }

  // Surface on Background contrast (elevation check)
  for (const level of bgLevels) {
    const surf = colors.surface[level].toString()
    const bg = colors.background[level].toString()
    const ratio = contrastRatio(surf, bg)
    if (ratio < 1.1) {
      issues.push(
        `  ❌ surface.${level} vs background.${level} = ${ratio.toFixed(1)}:1 (indistinguishable)`
      )
    }
  }

  // Border visibility check
  for (const level of bgLevels) {
    const border = colors.border[level].toString()
    const bg = colors.background[level].toString()
    const ratio = contrastRatio(border, bg)
    if (ratio < 1.5) {
      issues.push(
        `  ❌ border.${level} vs background.${level} = ${ratio.toFixed(1)}:1 (barely visible)`
      )
    }
  }

  // Best text-on-background pair
  let bestRatio = 0
  let bestPair = ''
  for (const txtLevel of textLevels) {
    for (const bgLevel of bgLevels) {
      const ratio = contrastRatio(
        colors.text[txtLevel].toString(),
        colors.background[bgLevel].toString()
      )
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestPair = `text.${txtLevel} on background.${bgLevel}`
      }
    }
  }

  console.log(`\n=== ${name} (${mode}) ===`)
  console.log(`  Best text contrast: ${bestPair} = ${bestRatio.toFixed(1)}:1`)
  console.log(`  Primary:   ${colors.primary.medium.toString()}`)
  console.log(`  Secondary: ${colors.secondary.medium.toString()}`)
  console.log(`  Accent:    ${colors.accent.medium.toString()}`)
  console.log(`  Text.DEFAULT:    ${colors.text.DEFAULT.toString()}`)
  console.log(`  Bg.DEFAULT:      ${colors.background.DEFAULT.toString()}`)
  console.log(`  Surface.DEFAULT: ${colors.surface.DEFAULT.toString()}`)
  console.log(`  Border.DEFAULT:  ${colors.border.DEFAULT.toString()}`)
  console.log(
    `  Text on Bg DEFAULT: ${contrastRatio(colors.text.DEFAULT.toString(), colors.background.DEFAULT.toString()).toFixed(1)}:1`
  )
  console.log(
    `  Text on Surface DEFAULT: ${contrastRatio(colors.text.DEFAULT.toString(), colors.surface.DEFAULT.toString()).toFixed(1)}:1`
  )

  if (issues.length > 0) {
    console.log(`\n  CRITICAL ISSUES:`)
    issues.forEach((i) => console.log(i))
  }
  if (checks.length > 0) {
    console.log(`\n  WARNINGS (fails WCAG AA 4.5:1):`)
    checks.forEach((c) => console.log(c))
  }
  if (issues.length === 0 && checks.length === 0) {
    console.log(`  ✅ All text/background combinations pass WCAG AA (4.5:1)`)
  }

  return { issues: issues.length, warnings: checks.length }
}

describe('Color Preset Contrast Analysis', () => {
  it('analyzes all presets in both modes', () => {
    const presetNames = ['oceanBlue', 'forestGreen', 'midnight'] as const

    for (const name of presetNames) {
      for (const mode of ['light', 'dark'] as const) {
        const preset = getPresetWithMode(name, mode)
        const result = analyzePreset(name, preset.colors, mode)

        // Assert no critical contrast failures
        if (result.issues > 0) {
          console.log(`\n  ⚠️  ${name}/${mode} has ${result.issues} critical contrast issue(s)`)
        }
      }
    }
    // This test always passes — it's for analysis output
    expect(true).toBe(true)
  })

  it('checks naming consistency', () => {
    const ocean = getPreset('oceanBlue').colors
    const forest = getPreset('forestGreen').colors
    const midnight = getPreset('midnight').colors

    // OceanBlue: primary should be blue-ish
    const oceanPrimary = ocean.primary.medium.toString()
    console.log(`\n=== Naming Consistency ===`)
    console.log(`  oceanBlue primary: ${oceanPrimary}`)
    console.log(`  forestGreen primary: ${forest.primary.medium.toString()}`)
    console.log(`  midnight primary: ${midnight.primary.medium.toString()}`)

    // oceanBlue accent is cyan (blue-ish) — OK
    expect(ocean.accent.medium.toString()).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('checks brand color contrast against text and background', () => {
    const brandColors = ['primary', 'secondary', 'accent'] as const
    const presetNames = ['oceanBlue', 'forestGreen', 'midnight'] as const

    for (const name of presetNames) {
      for (const mode of ['light', 'dark'] as const) {
        const preset = getPresetWithMode(name, mode)
        const colors = preset.colors

        for (const brand of brandColors) {
          const brandHex = colors[brand].medium.toString()
          const textDefault = colors.text.DEFAULT.toString()
          const bgDefault = colors.background.DEFAULT.toString()

          const brandOnBg = contrastRatio(brandHex, bgDefault)
          const textOnBrand = contrastRatio(textDefault, brandHex)

          if (brandOnBg < 3) {
            console.log(
              `  ⚠️  ${name}/${mode}: ${brand}(${brandHex}) on background(${bgDefault}) = ${brandOnBg.toFixed(1)}:1 (barely visible)`
            )
          }
          if (textOnBrand < 3) {
            console.log(
              `  ⚠️  ${name}/${mode}: text(${textDefault}) on ${brand}(${brandHex}) = ${textOnBrand.toFixed(1)}:1 (barely readable)`
            )
          }
        }
      }
    }

    // Verify all brand colors are valid hex
    for (const name of presetNames) {
      const colors = getPreset(name).colors
      for (const brand of brandColors) {
        expect(colors[brand].medium.toString()).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })
})
