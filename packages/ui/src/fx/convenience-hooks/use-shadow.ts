/**
 * Convenience hook for automatic shadow FX
 * Applies shadow on mount and updates on config changes
 */
import { useEffect } from '../../hooks'
import { createShadowFX, type ShadowFXConfig } from '../fx-creators/shadow'
import { useFX } from '../use-fx'

/**
 * Hook for automatic shadow FX
 * @param ref - GameObject ref
 * @param config - Shadow config (updates reactively)
 * @returns FX controls
 *
 * @example
 * ```tsx
 * const ref = useRef(null)
 * useShadow(ref, { x: 4, y: 4, decay: 0.1 })
 *
 * return <View ref={ref}>Content</View>
 * ```
 */
export function useShadow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: { current: any },
  config: ShadowFXConfig = {}
): { clearFX: () => void } {
  const { applyFX, clearFX } = useFX(ref)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous FX
    clearFX()

    // Apply new shadow
    applyFX(createShadowFX, config)

    return () => clearFX()
  }, [ref, config, applyFX, clearFX])

  return { clearFX }
}
