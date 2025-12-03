/** @jsxImportSource ../.. */
/**
 * Modal component for overlay dialogs
 * Renders content in a Portal with backdrop and animations
 * @module components/custom/Modal
 */
import {
  createFadeInEffect,
  createFadeOutEffect,
  createZoomInEffect,
  createZoomOutEffect,
  useGameObjectEffect,
} from '../../effects/use-effect'
import type { GestureEventData } from '../../gestures/gesture-types'
import { useEffect, useRef, useScene, useState, useTheme } from '../../hooks'
import { portalRegistry } from '../../portal'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { View } from '../index'
import { Portal } from './Portal'

/**
 * Modal component props
 */
export interface ModalProps {
  /** Unique key for VDOM identification */
  key?: string
  /** Whether modal is visible */
  isOpen: boolean
  /** Callback when modal should close */
  onClose?: (() => void) | undefined
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean | undefined
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean | undefined
  /** Portal depth (default: 1000) */
  depth?: number | undefined
  /** Modal content */
  children?: ChildrenType
}

/**
 * Modal component with backdrop and animations
 * Uses Portal for rendering above main UI
 * @param props - Modal props
 * @returns Modal component
 */
export function Modal(props: ModalProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Modal', localTheme, {})
  const scene = useScene()

  const closeOnBackdrop = props.closeOnBackdrop ?? true
  const closeOnEscape = props.closeOnEscape ?? true

  // Get viewport size from portal registry
  const viewport = scene ? portalRegistry.getViewportSize(scene) : { width: 800, height: 600 }

  // Animation state (0 = hidden, 1 = visible)
  const [visible, setVisible] = useState(props.isOpen ? 0.5 : 0)
  const backdropRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(viewRef)
  const { applyEffect: a2 } = useGameObjectEffect(backdropRef)

  // Handle open/close animation
  useEffect(() => {
    if (props.isOpen) {
      viewRef.current?.setScale(0)
      backdropRef.current?.setAlpha(0)
      setVisible(0.5)
      setTimeout(() => {
        viewRef.current?.setVisible(true)
        backdropRef.current?.setVisible(true)
        applyEffect(createZoomInEffect, { time: 500 })
        a2(createFadeInEffect, { time: 500 })
        setTimeout(() => {
          setVisible(1)
        }, 500)
      }, 0)
    } else {
      setVisible(0.6)
      setTimeout(() => {
        applyEffect(createZoomOutEffect, { time: 500 })
        a2(createFadeOutEffect, { time: 500 })
        setTimeout(() => {
          setVisible(0)
        }, 500)
      }, 0)
    }
  }, [props.isOpen])

  // Handle Escape key
  useEffect(() => {
    if (!props.isOpen || !closeOnEscape || !props.onClose) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [props.isOpen, closeOnEscape, props.onClose])

  // Don't render if not open and animation complete
  if (!props.isOpen && visible === 0) {
    return null
  }

  const handleBackdropClick = (e: GestureEventData) => {
    // Stop propagation to prevent click-through
    e.stopPropagation()
    if (closeOnBackdrop && props.onClose) {
      props.onClose()
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
        visible={visible > 0.5}
      />

      {/* Content Container (centered) */}
      <View
        ref={viewRef}
        width={viewport.width}
        height={viewport.height}
        direction="row"
        justifyContent="center"
        alignItems="center"
        visible={visible > 0.5}
      >
        {/* Content Wrapper (prevents backdrop click) */}
        <View onTouch={(e: GestureEventData) => e.stopPropagation()} theme={nestedTheme}>
          {props.children}
        </View>
      </View>
    </Portal>
  )
}
