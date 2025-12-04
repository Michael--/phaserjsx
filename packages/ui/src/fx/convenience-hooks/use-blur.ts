/**
 * Convenience hook for automatic blur FX
 * Applies blur on mount and updates on config changes
 */
import { useEffect } from '../../hooks'
import { createBlurFX, type BlurFXConfig } from '../fx-creators/blur'
import { useFX } from '../use-fx'

/**
 * Hook for automatic blur FX
 * @param ref - GameObject ref
 * @param config - Blur config (updates reactively)
 * @returns FX controls
 *
 * @example
 * ```tsx
 * const ref = useRef(null)
 * useBlur(ref, { strength: 8, steps: 4 })
 *
 * return <View ref={ref}>Content</View>
 * ```
 */
export function useBlur(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: { current: any },
  config: BlurFXConfig = {}
): { clearFX: () => void } {
  const { applyFX, clearFX } = useFX(ref)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous FX
    clearFX()

    // Apply new blur
    applyFX(createBlurFX, config)

    return () => clearFX()
  }, [ref, config, applyFX, clearFX])

  return { clearFX }
}
