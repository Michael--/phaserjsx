/**
 * Convenience hook for automatic glow FX
 * Applies glow on mount and updates on config changes
 */
import { useEffect } from '../../hooks'
import { createGlowFX, type GlowFXConfig } from '../fx-creators/glow'
import { useFX } from '../use-fx'

/**
 * Hook for automatic glow FX
 * @param ref - GameObject ref
 * @param config - Glow config (updates reactively)
 * @returns FX controls
 *
 * @example
 * ```tsx
 * const ref = useRef(null)
 * useGlow(ref, { color: 0xff6600, outerStrength: 6, innerStrength: 2 })
 *
 * return <View ref={ref}>Content</View>
 * ```
 */
export function useGlow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: { current: any },
  config: GlowFXConfig = {}
): { clearFX: () => void } {
  const { applyFX, clearFX } = useFX(ref)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous FX
    clearFX()

    // Apply new glow
    applyFX(createGlowFX, config)

    return () => clearFX()
  }, [ref, config, applyFX, clearFX])

  return { clearFX }
}
