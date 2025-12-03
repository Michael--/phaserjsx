/** @jsxImportSource ../.. */
/**
 * AlertDialog component - simple confirm/alert dialog with predefined actions
 * Provides variants with automatic styling and button configuration
 * @module components/custom/AlertDialog
 */
import { useThemeTokens } from '../../design-tokens/use-theme-tokens'
import { useEffect, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Text, View } from '../index'
import { Button } from './Button'
import { Dialog } from './Dialog'

/**
 * AlertDialog component props
 */
export interface AlertDialogProps {
  /** Whether dialog is visible */
  isOpen: boolean
  /** Callback when dialog should close */
  onClose?: () => void

  /** Dialog title */
  title: string
  /** Optional description text */
  description?: string

  /** Optional custom prefix (overrides variant icon from theme) */
  prefix?: ChildrenType

  /** Visual variant - determines styling and default icons */
  variant?: 'info' | 'warning' | 'destructive' | 'success'

  /** Cancel button text (default: "Cancel") */
  cancelText?: string
  /** Confirm button text (default: "OK") */
  confirmText?: string
  /** Show cancel button (default: true) */
  showCancel?: boolean

  /** Callback when confirm button is clicked */
  onConfirm?: () => void | Promise<void>
  /** Close dialog after confirm (default: true) */
  closeOnConfirm?: boolean

  /** Override loading state (for async onConfirm) */
  loading?: boolean
}

/**
 * AlertDialog component
 * Simple confirm/alert dialogs with variants and predefined actions
 *
 * @param props - AlertDialog props
 * @returns AlertDialog component
 *
 * @example
 * ```tsx
 * // With theme icon (variant)
 * <AlertDialog
 *   isOpen={isOpen}
 *   variant="destructive"
 *   title="Delete Item?"
 *   description="This cannot be undone."
 *   onConfirm={handleDelete}
 *   onClose={onClose}
 * />
 *
 * // With custom icon
 * <AlertDialog
 *   isOpen={isOpen}
 *   prefix={<Icon type="warning" />}
 *   title="Warning"
 *   onConfirm={handleAction}
 *   onClose={onClose}
 * />
 * ```
 */
export function AlertDialog(props: AlertDialogProps) {
  const localTheme = useTheme()
  const { props: themed } = getThemedProps('AlertDialog', localTheme, {})

  const [isLoading, setIsLoading] = useState(false)
  const showCancel = props.showCancel ?? true
  const closeOnConfirm = props.closeOnConfirm ?? true
  const loading = props.loading ?? isLoading

  // Get variant-specific theme configuration
  const variantTheme = props.variant && themed.variants?.[props.variant]

  // Props override theme, theme overrides nothing
  const prefix = props.prefix ?? variantTheme?.prefix
  const buttonVariant = (variantTheme?.buttonVariant as 'primary' | 'danger') ?? 'primary'

  // Handle confirm with async support
  const handleConfirm = async () => {
    if (!props.onConfirm) return

    try {
      setIsLoading(true)
      const result = props.onConfirm()

      // Check if it's a promise
      if (result instanceof Promise) {
        await result
      }

      // Close dialog after successful confirm (if enabled)
      if (closeOnConfirm) {
        props.onClose?.()
      }
    } catch (error) {
      console.error('AlertDialog confirm error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cleanup loading state when dialog closes
  useEffect(() => {
    if (!props.isOpen) {
      setIsLoading(false)
    }
  }, [props.isOpen])

  // Get content width for text wrapping via __getLayoutSize
  type ContainerWithLayout = Phaser.GameObjects.Container & {
    __getLayoutSize?: () => { width: number; height: number }
  }
  const contentRef = useRef<ContainerWithLayout | null>(null)
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    // Wait for layout to complete (happens in microtask/next frame)
    const checkSize = () => {
      if (contentRef.current?.__getLayoutSize) {
        const size = contentRef.current.__getLayoutSize()
        if (size.width > 0 && size.width !== contentWidth) {
          setContentWidth(size.width)
        }
      }
    }

    // Also check after next frame to catch async layout
    const rafId = requestAnimationFrame(checkSize)
    return () => cancelAnimationFrame(rafId)
  }, [props.isOpen, contentRef.current /*, contentWidth*/])

  const tokens = useThemeTokens()

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      prefix={prefix}
      maxWidth={themed.maxWidth ?? 400}
      showClose={true}
      actions={
        <>
          {showCancel && (
            <Button variant="ghost" onClick={props.onClose} disabled={loading}>
              <Text text={props.cancelText ?? 'Cancel'} />
            </Button>
          )}
          {props.onConfirm && (
            <Button variant={buttonVariant} onClick={handleConfirm} disabled={loading}>
              <Text text={props.confirmText ?? 'OK'} />
            </Button>
          )}
        </>
      }
    >
      <View ref={contentRef} width={'fill'}>
        {props.description && (
          <Text
            text={props.description}
            style={
              contentWidth > 0
                ? {
                    ...tokens?.textStyles.DEFAULT,
                    wordWrap: { useAdvancedWrap: true, width: contentWidth },
                  }
                : undefined
            }
          />
        )}
      </View>
    </Dialog>
  )
}
