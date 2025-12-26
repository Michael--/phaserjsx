/**
 * Camera effects utilities
 */
export {
  createCameraFadeInFX,
  createCameraFadeOutFX,
  createCameraFlashFX,
  createCameraShakeFX,
  createCameraZoomFX,
  useCameraFade,
  useCameraFX,
  useCameraFlash,
  useCameraZoom,
  useScreenShake,
  type CameraFadeConfig,
  type CameraFXConfig,
  type CameraFXFn,
  type CameraFlashConfig,
  type CameraShakeConfig,
  type CameraZoomConfig,
} from './use-camera-fx'
export {
  applyCameraFXByName,
  resolveCameraFX,
  CAMERA_FX_REGISTRY,
  DEFAULT_CAMERA_FX,
  type BuiltInCameraFXName,
  type CameraFXDefinition,
  type CameraFXName,
  type CameraFXNameExtensions,
} from './camera-fx-registry'
