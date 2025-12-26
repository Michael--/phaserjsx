/**
 * Hook and creators for Phaser camera effects
 */
import Phaser from 'phaser'
import { useCallback, useEffect, useRef, useScene } from '../hooks'
import type { RefObject } from '../types'

/**
 * Base camera FX config
 */
export interface CameraFXConfig {
  duration?: number
  force?: boolean
  onComplete?: () => void
}

export interface CameraShakeConfig extends CameraFXConfig {
  intensity?: number | { x: number; y: number }
}

export interface CameraFlashConfig extends CameraFXConfig {
  red?: number
  green?: number
  blue?: number
}

export interface CameraFadeConfig extends CameraFXConfig {
  red?: number
  green?: number
  blue?: number
  direction?: 'in' | 'out'
}

export interface CameraZoomConfig extends CameraFXConfig {
  zoom?: number
  ease?: string
}

/**
 * Camera FX creator function signature
 */
export type CameraFXFn<TConfig extends CameraFXConfig = CameraFXConfig> = (
  camera: Phaser.Cameras.Scene2D.Camera,
  config: TConfig
) => (() => void) | void

export const createCameraShakeFX: CameraFXFn<CameraShakeConfig> = (camera, config) => {
  const duration = config.duration ?? 250
  const intensity =
    typeof config.intensity === 'object'
      ? new Phaser.Math.Vector2(config.intensity.x, config.intensity.y)
      : (config.intensity ?? 0.01)
  camera.shake(duration, intensity, config.force ?? false, config.onComplete)
}

export const createCameraFlashFX: CameraFXFn<CameraFlashConfig> = (camera, config) => {
  const duration = config.duration ?? 200
  const red = config.red ?? 255
  const green = config.green ?? 255
  const blue = config.blue ?? 255
  camera.flash(duration, red, green, blue, config.force ?? false, config.onComplete)
}

export const createCameraFadeInFX: CameraFXFn<CameraFadeConfig> = (camera, config) => {
  const duration = config.duration ?? 300
  const red = config.red ?? 0
  const green = config.green ?? 0
  const blue = config.blue ?? 0
  camera.fadeIn(duration, red, green, blue, config.onComplete)
}

export const createCameraFadeOutFX: CameraFXFn<CameraFadeConfig> = (camera, config) => {
  const duration = config.duration ?? 300
  const red = config.red ?? 0
  const green = config.green ?? 0
  const blue = config.blue ?? 0
  camera.fadeOut(duration, red, green, blue, config.onComplete)
}

export const createCameraZoomFX: CameraFXFn<CameraZoomConfig> = (camera, config) => {
  const duration = config.duration ?? 250
  const targetZoom = config.zoom ?? camera.zoom * 1.1
  camera.zoomTo(targetZoom, duration, config.ease, config.force ?? false, config.onComplete)
}

export function useCameraFX(
  cameraRef?: RefObject<Phaser.Cameras.Scene2D.Camera | null>,
  options: { resetZoomOnClear?: boolean } = {}
): {
  applyCameraFX: <TConfig extends CameraFXConfig>(fx: CameraFXFn<TConfig>, config: TConfig) => void
  clearCameraFX: () => void
} {
  const scene = useScene()
  const activeFxRef = useRef<Set<() => void>>(new Set())
  const baseZoomRef = useRef<number | null>(null)

  const getCamera = useCallback(() => {
    return cameraRef?.current ?? scene.cameras.main
  }, [cameraRef, scene])

  const applyCameraFX = useCallback(
    <TConfig extends CameraFXConfig>(fx: CameraFXFn<TConfig>, config: TConfig) => {
      const camera = getCamera()
      if (!camera) {
        console.warn('[useCameraFX] No camera available')
        return
      }

      if (baseZoomRef.current === null) {
        baseZoomRef.current = camera.zoom
      }

      const cleanup = fx(camera, config)
      if (typeof cleanup === 'function') {
        activeFxRef.current.add(cleanup)
      }
    },
    [getCamera]
  )

  const clearCameraFX = useCallback(() => {
    const camera = getCamera()
    activeFxRef.current.forEach((cleanup) => cleanup())
    activeFxRef.current.clear()

    if (!camera) return
    const cameraWithStops = camera as unknown as {
      stopShake?: () => void
      stopFlash?: () => void
      stopFade?: () => void
    }
    if (typeof cameraWithStops.stopShake === 'function') cameraWithStops.stopShake()
    if (typeof cameraWithStops.stopFlash === 'function') cameraWithStops.stopFlash()
    if (typeof cameraWithStops.stopFade === 'function') cameraWithStops.stopFade()

    if (options.resetZoomOnClear !== false && baseZoomRef.current !== null) {
      camera.setZoom(baseZoomRef.current)
    }
  }, [getCamera, options.resetZoomOnClear])

  useEffect(() => {
    return () => clearCameraFX()
  }, [clearCameraFX])

  return { applyCameraFX, clearCameraFX }
}

export function useScreenShake(
  config: CameraShakeConfig = {},
  cameraRef?: RefObject<Phaser.Cameras.Scene2D.Camera | null>
): { clearCameraFX: () => void } {
  const { applyCameraFX, clearCameraFX } = useCameraFX(cameraRef)

  useEffect(() => {
    applyCameraFX(createCameraShakeFX, config)
    return () => clearCameraFX()
  }, [applyCameraFX, clearCameraFX, config])

  return { clearCameraFX }
}

export function useCameraFlash(
  config: CameraFlashConfig = {},
  cameraRef?: RefObject<Phaser.Cameras.Scene2D.Camera | null>
): { clearCameraFX: () => void } {
  const { applyCameraFX, clearCameraFX } = useCameraFX(cameraRef)

  useEffect(() => {
    applyCameraFX(createCameraFlashFX, config)
    return () => clearCameraFX()
  }, [applyCameraFX, clearCameraFX, config])

  return { clearCameraFX }
}

export function useCameraFade(
  config: CameraFadeConfig = {},
  cameraRef?: RefObject<Phaser.Cameras.Scene2D.Camera | null>
): { clearCameraFX: () => void } {
  const { applyCameraFX, clearCameraFX } = useCameraFX(cameraRef)

  useEffect(() => {
    const fx = config.direction === 'in' ? createCameraFadeInFX : createCameraFadeOutFX
    applyCameraFX(fx, config)
    return () => clearCameraFX()
  }, [applyCameraFX, clearCameraFX, config])

  return { clearCameraFX }
}

export function useCameraZoom(
  config: CameraZoomConfig = {},
  cameraRef?: RefObject<Phaser.Cameras.Scene2D.Camera | null>
): { clearCameraFX: () => void } {
  const { applyCameraFX, clearCameraFX } = useCameraFX(cameraRef)

  useEffect(() => {
    applyCameraFX(createCameraZoomFX, config)
    return () => clearCameraFX()
  }, [applyCameraFX, clearCameraFX, config])

  return { clearCameraFX }
}
