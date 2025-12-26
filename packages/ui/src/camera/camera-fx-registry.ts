/**
 * Camera FX registry - string-based lookup with extension support
 */
import {
  createCameraFadeInFX,
  createCameraFadeOutFX,
  createCameraFlashFX,
  createCameraShakeFX,
  createCameraZoomFX,
  type CameraFXConfig,
  type CameraFXFn,
} from './use-camera-fx'

/**
 * Built-in camera FX names
 */
export type BuiltInCameraFXName = 'shake' | 'flash' | 'fadeIn' | 'fadeOut' | 'zoom'

/**
 * Extension point for custom camera FX names
 * Use declaration merging to add custom camera FX:
 * @example
 * ```typescript
 * declare module '@number10/phaserjsx' {
 *   interface CameraFXNameExtensions {
 *     myCameraFX: 'myCameraFX'
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CameraFXNameExtensions {}

/**
 * Available camera FX names (built-in + extensions)
 */
export type CameraFXName =
  | BuiltInCameraFXName
  | (keyof CameraFXNameExtensions extends never ? never : keyof CameraFXNameExtensions)

/**
 * Camera FX definition for props/theme usage
 */
export interface CameraFXDefinition {
  fx?: CameraFXName
  fxConfig?: CameraFXConfig
}

/**
 * Camera FX registry mapping names to FX creators
 */
export const CAMERA_FX_REGISTRY: Record<BuiltInCameraFXName, CameraFXFn> = {
  shake: createCameraShakeFX,
  flash: createCameraFlashFX,
  fadeIn: createCameraFadeInFX,
  fadeOut: createCameraFadeOutFX,
  zoom: createCameraZoomFX,
}

/**
 * Default camera FX definition
 */
export const DEFAULT_CAMERA_FX: Required<CameraFXDefinition> = {
  fx: 'shake',
  fxConfig: { duration: 200, force: false },
}

/**
 * Apply a camera FX by name
 */
export function applyCameraFXByName(
  applyCameraFX: (fx: CameraFXFn, config: CameraFXConfig) => void,
  fxName?: CameraFXName,
  fxConfig?: CameraFXConfig
): boolean {
  const name = fxName ?? DEFAULT_CAMERA_FX.fx
  const config = fxConfig ?? DEFAULT_CAMERA_FX.fxConfig
  const fx = CAMERA_FX_REGISTRY[name as BuiltInCameraFXName]

  if (fx) {
    applyCameraFX(fx, config)
    return true
  }

  return false
}

/**
 * Resolve camera FX definition with priority: props > default
 */
export function resolveCameraFX(props?: CameraFXDefinition): Required<CameraFXDefinition> {
  return {
    fx: props?.fx ?? DEFAULT_CAMERA_FX.fx,
    fxConfig: props?.fxConfig ?? DEFAULT_CAMERA_FX.fxConfig,
  }
}
