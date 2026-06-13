/**
 * Component size presets for consistent cross-component sizing
 * All interactive controls draw from these shared token sets
 *
 * Design philosophy:
 * - Height steps: 32 → 40 → 48 (8px increments, aligns with 4px grid)
 * - Padding H steps: 12 → 16 → 20 (4px increments)
 * - Radius steps: 6 → 8 → 10 (2px increments for visual distinction at each size)
 * - All values divisible by 2 for pixel-perfect rendering
 */
import type { ViewTheme } from '../theme-base'

/**
 * Shared size preset for standard interactive controls
 * (Button, SegmentedControl segments, Toolbar items, NumberInput buttons, etc.)
 */
export interface ControlSizePreset {
  height: number
  paddingH: number
  paddingV: number
  radius: number
  gap: number
  iconSize: number
}

export const controlSizePresets: Record<'sm' | 'md' | 'lg', ControlSizePreset> = {
  sm: { height: 32, paddingH: 12, paddingV: 6, radius: 6, gap: 6, iconSize: 15 },
  md: { height: 40, paddingH: 16, paddingV: 8, radius: 8, gap: 8, iconSize: 18 },
  lg: { height: 48, paddingH: 20, paddingV: 10, radius: 10, gap: 10, iconSize: 22 },
}

/**
 * Compact size preset for smaller interactive controls
 * (SegmentedControl segments, NumberInput buttons, ContextMenu items)
 * Scale: 28 → 34 → 40 (6px increments, aligns with 2px grid for tight layouts)
 */
export const compactControlSizePresets: Record<'sm' | 'md' | 'lg', ControlSizePreset> = {
  sm: { height: 28, paddingH: 8, paddingV: 4, radius: 5, gap: 4, iconSize: 14 },
  md: { height: 34, paddingH: 10, paddingV: 6, radius: 6, gap: 5, iconSize: 16 },
  lg: { height: 40, paddingH: 14, paddingV: 8, radius: 7, gap: 6, iconSize: 20 },
}

/**
 * Toolbar item size presets (density-based, not sm/md/lg)
 * Toolbar uses density: 'compact' | 'normal' instead of size scale
 */
export interface ToolbarItemSizePreset {
  width: number
  height: number
  compactWidth: number
  compactHeight: number
  iconSize: number
  compactIconSize: number
}

export const toolbarSizePresets: ToolbarItemSizePreset = {
  width: 42,
  height: 36,
  compactWidth: 34,
  compactHeight: 34,
  iconSize: compactControlSizePresets.md.iconSize,
  compactIconSize: compactControlSizePresets.sm.iconSize,
}

/**
 * Size preset for compact indicators
 * (Badge, Tag, small labels)
 */
export interface IndicatorSizePreset {
  height: number
  paddingH: number
  radius: number
  fontSize: string
}

export const indicatorSizePresets: Record<'sm' | 'md' | 'lg', IndicatorSizePreset> = {
  sm: { height: 16, paddingH: 6, radius: 4, fontSize: '10px' },
  md: { height: 20, paddingH: 8, radius: 6, fontSize: '12px' },
  lg: { height: 24, paddingH: 10, radius: 8, fontSize: '14px' },
}

/**
 * Min-width scale aligned with control heights
 * sm ≈ 2.25× height, md ≈ 2.3× height, lg ≈ 2.4× height
 */
export const controlMinWidthPresets: Record<'sm' | 'md' | 'lg', number> = {
  sm: 72,
  md: 92,
  lg: 116,
}

/** Build ViewTheme padding from horizontal + vertical preset values */
export function controlPadding(preset: ControlSizePreset): ViewTheme['padding'] {
  return {
    top: preset.paddingV,
    bottom: preset.paddingV,
    left: preset.paddingH,
    right: preset.paddingH,
  }
}
