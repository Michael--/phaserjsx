/** @jsxImportSource ../.. */
/**
 * Modal component for overlay dialogs
 * Renders content in a Portal with backdrop and animations
 * @module components/custom/Modal
 */
import type { GestureEventData } from '../../gestures/gesture-types'
import { useEffect, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { View } from '../index'
import { Portal } from './Portal'

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether modal is visible */
  isOpen: boolean
  /** Callback when modal should close */
  onClose?: () => void
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean
  /** Portal depth (default: 1000) */
  depth?: number
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

  const closeOnBackdrop = props.closeOnBackdrop ?? true
  const closeOnEscape = props.closeOnEscape ?? true

  // Animation state (0 = hidden, 1 = visible)
  const [animationProgress, setAnimationProgress] = useState(props.isOpen ? 1 : 0)

  // Handle open/close animation
  useEffect(() => {
    if (props.isOpen) {
      setAnimationProgress(1)
    } else {
      setAnimationProgress(0)
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
  if (!props.isOpen && animationProgress === 0) {
    return null
  }

  const handleBackdropClick = () => {
    if (closeOnBackdrop && props.onClose) {
      props.onClose()
    }
  }

  return (
    <Portal depth={props.depth ?? 1000}>
      {/* Backdrop */}
      <View
        width="100%"
        height="100%"
        backgroundColor={themed.backdropColor ?? 0x000000}
        alpha={(themed.backdropOpacity ?? 0.5) * animationProgress}
        onTouch={handleBackdropClick}
      />

      {/* Content Container (centered) */}
      <View width="100%" height="100%" direction="row" justifyContent="center" alignItems="center">
        {/* Content Wrapper (prevents backdrop click) */}
        <View
          alpha={animationProgress}
          scale={0.9 + 0.1 * animationProgress}
          onTouch={(e: GestureEventData) => e.stopPropagation()}
          theme={nestedTheme}
        >
          {props.children}
        </View>
      </View>
    </Portal>
  )
}
