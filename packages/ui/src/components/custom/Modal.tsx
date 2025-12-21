/** @jsxImportSource ../.. */
/**
 * Modal component for overlay dialogs
 * Renders content in a Portal with backdrop and animations
 * @module components/custom/Modal
 */
import {
  createFadeInEffect,
  createFadeOutEffect,
  useGameObjectEffect,
  type EffectFn,
} from '../../effects/use-effect'
import type { GestureEventData } from '../../gestures/gesture-types'
import { useCallback, useEffect, useRef, useScene, useState, useTheme } from '../../hooks'
import { portalRegistry } from '../../portal'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { View } from '../index'
import { Portal } from './Portal'

/**
 * ModalPortal component props
 */
export interface ModalProps {
  /** Unique key for VDOM identification */
  key?: string
  /** request if modal should change its open/close state */
  show: boolean
  /** Callback when modal should start closing (backdrop/Escape) */
  onRequestClose?: (() => void) | undefined
  /** Callback when modal has been opened (at start of animation) */
  onOpen?: (() => void) | undefined
  /** Callback when modal has been closed (at end of animation) */
  onClosed?: (() => void) | undefined
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean | undefined
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean | undefined
  /** Portal depth (default: 1000) */
  depth?: number | undefined
  /** Custom effect for showing modal content (default: fade in) */
  viewOpenEffect?: EffectFn | undefined
  /** Custom effect for hiding modal content (default: fade out) */
  viewCloseEffect?: EffectFn | undefined
  /** Modal content */
  children?: ChildrenType
}

/**
 * Modal component with backdrop and animations
 * Uses Portal for rendering above main UI
 * @param props - Modal props
 * @returns Modal component
 */
export function Modal(props: ModalProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Modal', localTheme, {})
  const scene = useScene()

  const closeOnBackdrop = props.closeOnBackdrop ?? true
  const closeOnEscape = props.closeOnEscape ?? true

  const viewOpenEffect = props.viewOpenEffect ?? createFadeInEffect
  const viewCloseEffect = props.viewCloseEffect ?? createFadeOutEffect

  const openDurationMs = (themed as { openDuration?: number }).openDuration ?? 320
  const closeDurationMs = (themed as { closeDuration?: number }).closeDuration ?? 260

  // Get viewport size from portal registry
  const viewport = scene ? portalRegistry.getViewportSize(scene) : { width: 800, height: 600 }

  const backdropRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect: viewAnimation, stopEffects: stopViewEffects } = useGameObjectEffect(viewRef)
  const { applyEffect: backdropAnimation, stopEffects: stopBackdropEffects } =
    useGameObjectEffect(backdropRef)

  const [isVisible, setIsVisible] = useState(false)
  const hasMountedRef = useRef(false)
  const closeRequestedRef = useRef(false)
  const animationPhaseRef = useRef<'opening' | 'closing' | null>(null)

  const requestClose = useCallback(() => {
    closeRequestedRef.current = true
    if (props.onRequestClose) {
      props.onRequestClose()
    } else {
      props.onClosed?.()
    }
  }, [props.onClosed, props.onRequestClose])

  useEffect(() => {
    if (!viewRef.current || !backdropRef.current) {
      return
    }
    viewRef.current.setVisible(false)
    backdropRef.current.setVisible(false)
    hasMountedRef.current = true
  }, [])

  useEffect(() => {
    const view = viewRef.current
    const backdrop = backdropRef.current

    if (!view || !backdrop || !hasMountedRef.current) {
      return
    }

    stopViewEffects()
    stopBackdropEffects()

    if (props.show) {
      animationPhaseRef.current = 'opening'
      closeRequestedRef.current = false

      view.setVisible(true)
      backdrop.setVisible(true)
      setIsVisible(true)

      props.onOpen?.()

      viewAnimation(viewOpenEffect, {
        time: openDurationMs,
        onComplete: () => {
          animationPhaseRef.current = null
        },
      })

      backdropAnimation(createFadeInEffect, {
        time: openDurationMs,
      })
    } else if (isVisible || animationPhaseRef.current === 'opening') {
      animationPhaseRef.current = 'closing'

      viewAnimation(viewCloseEffect, {
        time: closeDurationMs,
        onComplete: () => {
          view.setVisible(false)
          setIsVisible(false)
          animationPhaseRef.current = null

          const shouldNotifyCloseComplete =
            props.onRequestClose !== undefined || !closeRequestedRef.current

          if (shouldNotifyCloseComplete) {
            props.onClosed?.()
          }

          closeRequestedRef.current = false
        },
      })

      backdropAnimation(createFadeOutEffect, {
        time: closeDurationMs,
        onComplete: () => {
          backdrop.setVisible(false)
        },
      })
    } else {
      view.setVisible(false)
      backdrop.setVisible(false)
    }
  }, [props.show])

  // Handle Escape key
  useEffect(() => {
    if (!closeOnEscape || !props.show) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeOnEscape, props.show, requestClose])

  const handleBackdropClick = (e: GestureEventData) => {
    // Stop propagation to prevent click-through
    e.stopPropagation()
    if (closeOnBackdrop) {
      requestClose()
    }
  }

  const handleBackdropMove = (e: GestureEventData) => {
    // Stop propagation to prevent scrolling through modal
    e.stopPropagation()
  }

  return (
    <Portal {...(props.key && { key: props.key })} depth={props.depth ?? 1000} blockEvents={false}>
      {/* Backdrop - blocks all events below */}
      <View
        ref={backdropRef}
        width={viewport.width}
        height={viewport.height}
        backgroundColor={themed.backdropColor ?? 0x000000}
        alpha={themed.backdropOpacity ?? 0.5}
        onTouch={handleBackdropClick}
        onTouchMove={handleBackdropMove}
        visible={isVisible}
      />

      {/* Content Container (centered) */}
      <View
        ref={viewRef}
        width={viewport.width}
        height={viewport.height}
        direction="row"
        justifyContent="center"
        alignItems="center"
        visible={isVisible}
      >
        {/* Content Wrapper (prevents backdrop click) */}
        <View onTouch={(e: GestureEventData) => e.stopPropagation()} theme={nestedTheme}>
          {props.children}
        </View>
      </View>
    </Portal>
  )
}
