import { useCallback, useEffect, useRef, useState } from '../../hooks'

export type OverlayPresencePhase = 'entering' | 'entered' | 'exiting' | 'exited'

export interface OverlayPresenceState {
  isPresent: boolean
  phase: OverlayPresencePhase
  finishEnter: () => void
  finishExit: () => void
}

export function useOverlayPresence(show: boolean): OverlayPresenceState {
  const [isPresent, setIsPresent] = useState(show)
  const [phase, setPhase] = useState<OverlayPresencePhase>(show ? 'entered' : 'exited')
  const previousShow = useRef(show)

  useEffect(() => {
    if (show) {
      setIsPresent(true)
      if (!previousShow.current) {
        setPhase('entering')
      }
    } else if (previousShow.current) {
      setPhase('exiting')
    }

    previousShow.current = show
  }, [show])

  const finishEnter = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'entered' : current))
  }, [])

  const finishExit = useCallback(() => {
    setIsPresent(false)
    setPhase('exited')
  }, [])

  return { isPresent, phase, finishEnter, finishExit }
}
