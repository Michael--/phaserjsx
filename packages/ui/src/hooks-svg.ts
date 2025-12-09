/**
 * SVG Texture Hooks - Per-scene texture management for SVG-based images
 * Each Phaser Scene maintains its own texture registry for isolation
 */
import Phaser from 'phaser'
import { getCurrent, useEffect, useMemo, useState } from './hooks'
import type { ParentType } from './types'
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
 * Manually release a global SVG texture from memory
 * Only call this if you're sure no component needs the texture anymore
 *
 * @param key - The texture key to release
 * @example
 * ```ts
 * // In a Phaser scene
 * import { releaseSVGTexture } from '@number10/phaserjsx'
 *
 * // When changing levels or cleaning up
 * releaseSVGTexture('icon-bell')
 * ```
 */
export function releaseSVGTexture(scene: Phaser.Scene, key: string): void {
  textureRegistry.releaseTexture(scene, key)
}

/**
 * Manually release multiple global SVG textures from memory
 * Only call this if you're sure no component needs these textures anymore
 *
 * @param keys - Array of texture keys to release
 * @example
 * ```ts
 * // In a Phaser scene
 * import { releaseSVGTextures } from '@number10/phaserjsx'
 *
 * // Clean up all icon textures when changing scenes
 * releaseSVGTextures(['icon-bell', 'icon-settings', 'icon-user'])
 * ```
 */
export function releaseSVGTextures(scene: Phaser.Scene, keys: string[]): void {
  for (const key of keys) {
    textureRegistry.releaseTexture(scene, key)
  }
}

/**
 * Manually release ALL global SVG textures from memory
 * Use with caution - this clears all textures managed by the texture registry
 *
 * @example
 * ```ts
 * // In a Phaser scene shutdown or cleanup
 * import { releaseAllSVGTextures } from '@number10/phaserjsx'
 *
 * // When changing to a different scene or restarting
 * releaseAllSVGTextures()
 * ```
 */
export function releaseAllSVGTextures(): void {
  textureRegistry.releaseAll()
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

  // Get scene from render context (isolated per mount point)
  const ctx = (getCurrent() as unknown as { parent: ParentType }) || {}
  const scene =
    ctx.parent instanceof Phaser.Scene
      ? ctx.parent
      : (ctx.parent as Phaser.GameObjects.GameObject | undefined)?.scene

  useEffect(() => {
    if (!scene) return

    let cancelled = false
    setReady(false)

    // Request texture (with reference counting per scene)
    textureRegistry
      .requestTexture(scene, { key, svg, width, height })
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
      // textureRegistry.releaseTexture(scene, key)
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

  // Get scene from render context (isolated per mount point)
  const ctx = (getCurrent() as unknown as { parent: ParentType }) || {}
  const scene =
    ctx.parent instanceof Phaser.Scene
      ? ctx.parent
      : (ctx.parent as Phaser.GameObjects.GameObject | undefined)?.scene

  // Create stable key from configs to detect changes
  const configKey = useMemo(
    () => configs.map((c) => `${c.key}:${c.width ?? 32}:${c.height ?? 32}`).join('|'),
    [configs]
  )

  useEffect(() => {
    if (!scene || configs.length === 0) return

    let cancelled = false
    setReady(false)

    // Request all textures (with reference counting per scene)
    const loadSequentially = async () => {
      for (const config of configs) {
        if (cancelled) break
        await textureRegistry.requestTexture(scene, {
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
