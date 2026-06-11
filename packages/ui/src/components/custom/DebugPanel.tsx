/** @jsxImportSource ../.. */
/**
 * DebugPanel component - lightweight runtime diagnostics for Phaser + PhaserJSX
 * Renders selected metrics as text rows or a compact single-line summary.
 */
import * as Phaser from 'phaser'
import type { ViewProps } from '..'
import { useThemeTokens } from '../../design-tokens/use-theme-tokens'
import { DevConfig } from '../../dev-config'
import { useEffect, useMemo, useScene, useState } from '../../hooks'
import { getMountStats, type VNodeLike } from '../../vdom'
import { Text, View } from '../index'

export type DebugPanelPreset = 'fps' | 'perf' | 'vdom' | 'textures' | 'full'

export type DebugMetricKey =
  | 'fps'
  | 'frameMs'
  | 'phaserVersion'
  | 'renderer'
  | 'viewport'
  | 'textureCount'
  | 'mountsTotal'
  | 'mountsByType'
  | 'mountsByParent'
  | 'mountsByKey'
  | 'debugFlags'

type DebugValue = string | number

type DebugSnapshot = Record<DebugMetricKey, DebugValue>

export interface DebugPanelProps extends Omit<ViewProps, 'children'> {
  /** Optional ready-made metric set. Ignored when `metrics` is set. */
  preset?: DebugPanelPreset
  /** Explicit metric selection (takes precedence over `preset`). */
  metrics?: DebugMetricKey[]
  /** Refresh interval in milliseconds. */
  intervalMs?: number
  /** Render all metrics in one line (instead of key/value rows). */
  compact?: boolean
  /** Maximum rows to render in non-compact mode. */
  maxRows?: number
  /** Optional metric label overrides. */
  labels?: Partial<Record<DebugMetricKey, string>>
  /** Optional formatter overrides per metric. */
  formatters?: Partial<Record<DebugMetricKey, (value: DebugValue) => string>>
  /** Optional props forwarded to each inner row View (column mode only). */
  innerProps?: Omit<ViewProps, 'children'>
}

const PRESET_METRICS: Record<DebugPanelPreset, DebugMetricKey[]> = {
  fps: ['fps', 'frameMs'],
  perf: ['fps', 'frameMs', 'renderer', 'viewport'],
  vdom: ['mountsTotal', 'mountsByType', 'mountsByParent', 'mountsByKey'],
  textures: ['textureCount'],
  full: [
    'fps',
    'frameMs',
    'phaserVersion',
    'renderer',
    'viewport',
    'textureCount',
    'mountsTotal',
    'mountsByType',
    'mountsByParent',
    'mountsByKey',
    'debugFlags',
  ],
}

const DEFAULT_LABELS: Record<DebugMetricKey, string> = {
  fps: 'FPS',
  frameMs: 'Frame ms',
  phaserVersion: 'Phaser',
  renderer: 'Renderer',
  viewport: 'Viewport',
  textureCount: 'Textures',
  mountsTotal: 'Mounts',
  mountsByType: 'Mounts/type',
  mountsByParent: 'Mounts/parent',
  mountsByKey: 'Mounts/key',
  debugFlags: 'Debug flags',
}

function resolveRendererName(scene: Phaser.Scene): string {
  const renderer = scene.renderer as unknown as {
    type?: number
    constructor?: { name?: string }
  }
  const canvasType = (Phaser as unknown as { CANVAS?: number }).CANVAS

  if (renderer.type === Phaser.WEBGL) return 'WebGL'
  if (canvasType !== undefined && renderer.type === canvasType) return 'Canvas'
  if (renderer.constructor?.name) return renderer.constructor.name
  if (typeof renderer.type === 'number') return `Type ${renderer.type}`
  return 'Unknown'
}

function resolveTextureCount(scene: Phaser.Scene): number {
  const manager = scene.textures as unknown as {
    getTextureKeys?: () => string[]
    list?: Record<string, unknown>
  }

  const keys =
    typeof manager.getTextureKeys === 'function'
      ? manager.getTextureKeys()
      : Object.keys(manager.list ?? {})

  const internalKeys = new Set(['__DEFAULT', '__MISSING', '__NORMAL', '__WHITE'])
  return keys.filter((key) => !internalKeys.has(key.toUpperCase())).length
}

function resolveFrameStats(scene: Phaser.Scene): { fps: number; frameMs: number } {
  const loop = (
    scene.game as unknown as {
      loop?: {
        actualFps?: number
        fps?: number
        delta?: number
        frameDelta?: number
      }
    }
  ).loop

  const rawFps = loop?.actualFps ?? loop?.fps ?? 0
  const rawFrameMs = loop?.delta ?? loop?.frameDelta ?? 0

  const fps = Number.isFinite(rawFps) ? Number(rawFps.toFixed(1)) : 0
  const frameMs = Number.isFinite(rawFrameMs) ? Number(rawFrameMs.toFixed(2)) : 0

  return { fps, frameMs }
}

function summarizeMap(map: Map<unknown, number>, maxEntries = 3): string {
  const summary = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxEntries)
    .map(([key, value]) => `${String(key)}:${value}`)
    .join(' | ')

  return summary || '-'
}

function resolveDebugFlags(): string {
  const debugConfig = DevConfig.debug
  if (!debugConfig.enabled) return 'off'

  const enabledFlags = Object.entries(debugConfig)
    .filter(([key, value]) => key !== 'enabled' && value)
    .map(([key]) => key)

  return enabledFlags.length ? enabledFlags.join(',') : 'enabled'
}

function collectSnapshot(scene: Phaser.Scene): DebugSnapshot {
  const { fps, frameMs } = resolveFrameStats(scene)
  const mountStats = getMountStats()

  return {
    fps,
    frameMs,
    phaserVersion: Phaser.VERSION,
    renderer: resolveRendererName(scene),
    viewport: `${scene.scale.width.toFixed(0)}x${scene.scale.height.toFixed(0)}`,
    textureCount: resolveTextureCount(scene),
    mountsTotal: mountStats.totalMounts,
    mountsByType: summarizeMap(mountStats.byType),
    mountsByParent: summarizeMap(mountStats.byParent),
    mountsByKey: summarizeMap(mountStats.byKey),
    debugFlags: resolveDebugFlags(),
  }
}

function formatDefault(value: DebugValue): string {
  return typeof value === 'number' ? String(value) : value
}

/**
 * DebugPanel component
 * Shows selected diagnostics from Phaser + PhaserJSX as overlay-ready content.
 */
export function DebugPanel(props: DebugPanelProps): VNodeLike {
  const scene = useScene()

  const {
    preset = 'fps',
    metrics,
    intervalMs = 250,
    compact = false,
    maxRows,
    labels,
    formatters,
    innerProps,
    ...viewProps
  } = props

  const selectedMetrics = useMemo(() => {
    const source = metrics && metrics.length > 0 ? metrics : PRESET_METRICS[preset]
    return Array.from(new Set(source))
  }, [metrics, preset])

  const [snapshot, setSnapshot] = useState<DebugSnapshot>(collectSnapshot(scene))

  useEffect(() => {
    const delay = Math.max(50, intervalMs)
    setSnapshot(collectSnapshot(scene))

    const timer = window.setInterval(() => {
      setSnapshot(collectSnapshot(scene))
    }, delay)

    return () => {
      window.clearInterval(timer)
    }
  }, [scene, intervalMs, selectedMetrics])

  const tokens = useThemeTokens()

  const rowStyle = tokens?.textStyles.small
  const valueStyle = tokens?.textStyles.small

  const rows = selectedMetrics.map((metric) => {
    const rawValue = snapshot[metric]
    const label = labels?.[metric] ?? DEFAULT_LABELS[metric]
    const formatter = formatters?.[metric]
    const value = formatter ? formatter(rawValue) : formatDefault(rawValue)
    return { metric, label, value }
  })

  const limitedRows = typeof maxRows === 'number' ? rows.slice(0, Math.max(1, maxRows)) : rows

  if (compact) {
    const compactText = limitedRows.map((row) => `${row.label} ${row.value}`).join(' | ')
    return (
      <View {...viewProps}>
        <Text text={compactText} style={valueStyle} />
      </View>
    )
  }

  return (
    <View direction="column" gap={4} {...viewProps}>
      {limitedRows.map((row) => (
        <View key={`debug-${row.metric}`} direction="row" gap={8} {...innerProps}>
          <Text text={`${row.label}:`} style={rowStyle} />
          <Text text={row.value} style={valueStyle} />
        </View>
      ))}
    </View>
  )
}
