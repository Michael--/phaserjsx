/** @jsxImportSource ../.. */
/**
 * Dialog component - structured modal with header, content, and actions
 * Provides consistent layout and styling for dialog patterns
 * @module components/custom/Dialog
 */
import type { SizeValue } from '@phaserjsx/ui/core-props'
import type { GestureEventData } from '../../gestures/gesture-types'
import { useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Text, View } from '../index'
import { Modal } from './Modal'

/**
 * Dialog component props
 */
export interface DialogProps {
  /** Whether dialog is visible */
  isOpen: boolean
  /** Callback when dialog should close */
  onClose?: (() => void) | undefined
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean | undefined
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean | undefined
  /** Portal depth (default: 1000) */
  depth?: number | undefined

  /** Dialog title */
  title: string
  /** Optional prefix content (e.g., Icon) */
  prefix?: ChildrenType
  /** Show close button in header (default: true) */
  showClose?: boolean
  /** Maximum width of dialog (default: 600) */
  maxWidth?: SizeValue

  /** Dialog content */
  children: ChildrenType
  /** Optional action buttons in footer */
  actions?: ChildrenType
}

/**
 * Dialog component with structured layout
 * Provides header with title/icon, content area, and action footer
 *
 * @param props - Dialog props
 * @returns Dialog component
 *
 * @example
 * ```tsx
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Settings"
 *   prefix={<Icon type="gear" />}
 *   actions={
 *     <>
 *       <Button onClick={onCancel}>Cancel</Button>
 *       <Button onClick={onSave}>Save</Button>
 *     </>
 *   }
 * >
 *   <Text>Dialog content...</Text>
 * </Dialog>
 * ```
 */
export function Dialog(props: DialogProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Dialog', localTheme, {})

  const showClose = props.showClose ?? themed.showClose ?? true
  const maxWidth = props.maxWidth ?? themed.maxWidth ?? 600
  const prefix = props.prefix ?? themed.prefix

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnBackdrop={props.closeOnBackdrop}
      closeOnEscape={props.closeOnEscape}
      depth={props.depth}
    >
      <View
        maxWidth={maxWidth}
        backgroundColor={themed.backgroundColor ?? 0xffffff}
        cornerRadius={themed.cornerRadius ?? 8}
        padding={0}
        direction="column"
        theme={nestedTheme}
      >
        {/* Header */}
        <View direction="column" gap={0}>
          <View
            direction="row"
            width={'fill'}
            gap={themed.Header?.gap ?? 12}
            padding={themed.Header?.padding ?? 16}
          >
            {/* Prefix (Icon) */}
            {prefix && prefix}

            {/* Title */}
            <View flex={1}>
              <Text text={props.title} style={themed.Header?.textStyle} />
            </View>

            {/* Close Button */}
            {showClose && props.onClose && (
              <View
                width={themed.Header?.closeButton?.size ?? 32}
                height={themed.Header?.closeButton?.size ?? 32}
                justifyContent="center"
                alignItems="center"
                cornerRadius={themed.Header?.closeButton?.cornerRadius ?? 4}
                backgroundColor={themed.Header?.closeButton?.backgroundColor}
                borderColor={themed.Header?.closeButton?.backgroundColor}
                borderWidth={themed.Header?.closeButton?.borderWidth}
                onTouch={(e: GestureEventData) => {
                  e.stopPropagation()
                  props.onClose?.()
                }}
              >
                {themed.closeIcon ?? <Text text="X" />}
              </View>
            )}
          </View>
          {/* Header Divider */}
          <View height={1} width="fill" backgroundColor={themed.Header?.borderColor ?? 0xe0e0e0} />
        </View>

        {/* Content */}
        <View
          padding={themed.Content?.padding ?? 16}
          direction="column"
          gap={themed.Content?.gap ?? 12}
        >
          {props.children}
        </View>

        {/* Actions Footer */}
        {props.actions && (
          <View direction="column" gap={0}>
            {/* Actions Divider */}
            <View
              height={1}
              width="fill"
              backgroundColor={themed.Actions?.borderColor ?? 0xe0e0e0}
            />
            <View
              direction="row"
              justifyContent={themed.Actions?.justifyContent ?? 'end'}
              gap={themed.Actions?.gap ?? 8}
              padding={themed.Actions?.padding ?? 16}
            >
              {props.actions}
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}
