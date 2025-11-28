/**
 * SVG Texture Hooks - Global texture management for SVG-based images
 * Uses global textureRegistry since Phaser's TextureManager is global per game
 */
import type Phaser from 'phaser'
import { useEffect, useMemo, useState } from './hooks'
import { textureRegistry } from './utils/texture-registry'

/**
 * SVG texture configuration for loading
 */
export interface SVGTextureConfig {
  key: string
  svg: string
  width?: number
  height?: number
}

/**
 * Hook to load a single SVG as a Phaser texture
 *
 * Automatically handles:
 * - Scene detection from component context
 * - Texture loading and registration
 * - Cleanup on unmount (removes texture from Phaser)
 *
 * @param key - Unique texture key
 * @param svg - SVG string or URL
 * @param width - Texture width in pixels (default: 32)
 * @param height - Texture height in pixels (default: 32)
 * @returns true when texture is loaded and ready to use
 * @example
 * ```tsx
 * function MyIcon() {
 *   const ready = useSVGTexture('icon-bell', bellIconSvg, 32, 32)
 *   return ready ? <Image texture="icon-bell" /> : null
 * }
 * ```
 */
export function useSVGTexture(
  key: string,
  svg: string,
  width: number = 32,
  height: number = 32
): boolean {
  const [ready, setReady] = useState(false)

  // Get scene from window global (set by mountJSX)
  const scene = (window as { __phaserScene?: Phaser.Scene }).__phaserScene

  useEffect(() => {
    if (!scene) return

    textureRegistry.setScene(scene)

    let cancelled = false
    setReady(false)

    // Request texture (with reference counting)
    textureRegistry
      .requestTexture({ key, svg, width, height })
      .then(() => {
        if (!cancelled) {
          setReady(true)
        }
      })
      .catch((err) => {
        if (!cancelled) console.error(`Failed to load SVG texture '${key}':`, err)
      })

    // Cleanup: release texture reference
    return () => {
      cancelled = true
      // textureRegistry.releaseTexture(key)
    }
  }, [scene, key, svg, width, height])

  return ready
}

/**
 * Hook to load multiple SVG textures
 *
 * Automatically handles:
 * - Scene detection from component context
 * - Parallel texture loading
 * - Cleanup on unmount (removes all textures from Phaser)
 *
 * @param configs - Array of SVG texture configurations
 * @returns true when all textures are loaded and ready to use
 * @example
 * ```tsx
 * function MyIcons() {
 *   const ready = useSVGTextures([
 *     { key: 'icon-bell', svg: bellSvg, width: 32, height: 32 },
 *     { key: 'icon-settings', svg: settingsSvg, width: 24 },
 *   ])
 *   return ready ? (
 *     <>
 *       <Image texture="icon-bell" />
 *       <Image texture="icon-settings" />
 *     </>
 *   ) : null
 * }
 * ```
 */
export function useSVGTextures(configs: SVGTextureConfig[]): boolean {
  const [ready, setReady] = useState(false)

  // Get scene from window global (set by mountJSX)
  const scene = (window as { __phaserScene?: Phaser.Scene }).__phaserScene

  // Create stable key from configs to detect changes
  const configKey = useMemo(
    () => configs.map((c) => `${c.key}:${c.width ?? 32}:${c.height ?? 32}`).join('|'),
    [configs]
  )

  useEffect(() => {
    if (!scene || configs.length === 0) return

    textureRegistry.setScene(scene)

    let cancelled = false
    setReady(false)

    // Request all textures (with reference counting)
    const loadSequentially = async () => {
      for (const config of configs) {
        if (cancelled) break
        await textureRegistry.requestTexture({
          key: config.key,
          svg: config.svg,
          width: config.width ?? 32,
          height: config.height ?? 32,
        })
      }
    }

    loadSequentially()
      .then(() => {
        if (!cancelled) {
          setReady(true)
        }
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load SVG textures:', err)
      })

    // Cleanup: release all texture references
    return () => {
      cancelled = true
      // Textures are global and shared across mounts - don't release them
      // for (const config of configs) {
      //   textureRegistry.releaseTexture(config.key)
      // }
    }
  }, [scene, configKey])

  return ready
}
