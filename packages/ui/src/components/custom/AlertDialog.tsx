/** @jsxImportSource ../.. */
/**
 * AlertDialog component - simple confirm/alert dialog with predefined actions
 * Provides variants with automatic styling and button configuration
 * @module components/custom/AlertDialog
 */
import { useCallback, useEffect, useMemo, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text } from '../index'
import { Button, type ButtonVariant } from './Button'
import { Dialog } from './Dialog'
import { WrapText } from './WrapText'

/**
 * AlertDialog component props
 */
export interface AlertDialogProps {
  /** Unique key for VDOM identification */
  key?: string

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
export function AlertDialog(props: AlertDialogProps): VNodeLike {
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
  const buttonVariant: ButtonVariant | undefined = variantTheme?.buttonVariant

  // Handle confirm with async support (memoized to prevent re-creating on every render)
  const handleConfirm = useCallback(async () => {
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
  }, [props.onConfirm, closeOnConfirm, props.onClose])

  // Cleanup loading state when dialog closes
  useEffect(() => {
    if (!props.isOpen) {
      setIsLoading(false)
    }
  }, [props.isOpen])

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(
    () => (
      <>
        {showCancel && (
          <Button
            // TODO: find out why immediate close bother the button click animation
            onClick={() => setTimeout(() => props.onClose?.(), 200)}
            disabled={loading}
          >
            <Text text={props.cancelText ?? 'Cancel'} />
          </Button>
        )}
        {props.onConfirm && (
          <Button
            variant={buttonVariant}
            onClick={() => setTimeout(() => handleConfirm(), 200)}
            disabled={loading}
          >
            <Text text={props.confirmText ?? 'OK'} />
          </Button>
        )}
      </>
    ),
    [
      showCancel,
      props.onClose,
      props.cancelText,
      loading,
      props.onConfirm,
      buttonVariant,
      handleConfirm,
      props.confirmText,
    ]
  )

  // Memoize content to prevent unnecessary re-renders
  const content = useMemo(
    () => (props.description ? <WrapText text={props.description} /> : null),
    [props.description]
  )

  return (
    <Dialog
      {...(props.key && { key: props.key })}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      prefix={prefix}
      maxWidth={themed.maxWidth ?? 400}
      showClose={true}
      actions={actions}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      {content}
    </Dialog>
  )
}
