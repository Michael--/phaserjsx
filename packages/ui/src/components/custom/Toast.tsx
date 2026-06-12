/** @jsxImportSource ../.. */
/**
 * Toast and NotificationStack components.
 * Compact transient feedback for saves, errors, confirmations, and status updates.
 */
import type { EdgeInsets, GapInsets } from '../../core-props'
import { useEffect, useMemo, useScene, useTheme } from '../../hooks'
import { portalRegistry } from '../../portal'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Button, Text, View, type ViewProps } from '../index'
import { Portal } from './Portal'
import { WrapText } from './WrapText'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'
export type NotificationStackPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'

export interface ToastLabels {
  close?: string
}

export interface ToastVariantTheme extends ViewTheme {
  accentColor?: number
  prefix?: ChildrenType
  titleStyle?: Phaser.Types.GameObjects.Text.TextStyle
  messageStyle?: Phaser.Types.GameObjects.Text.TextStyle
}

export interface ToastThemeSlot extends ViewTheme {
  variant?: ToastVariant
  width?: ViewProps['width']
  minHeight?: ViewProps['height']
  gap?: number
  contentGap?: number
  accentWidth?: number
  prefixWidth?: number
  titleStyle?: Phaser.Types.GameObjects.Text.TextStyle
  messageStyle?: Phaser.Types.GameObjects.Text.TextStyle
  closeButtonSize?: number
  closeTextStyle?: Phaser.Types.GameObjects.Text.TextStyle
  labels?: ToastLabels
  variants?: Partial<Record<ToastVariant, ToastVariantTheme>>
}

export interface ToastItem {
  id: string
  variant?: ToastVariant
  title?: string
  message?: string
  content?: ChildrenType
  prefix?: ChildrenType
  suffix?: ChildrenType
  action?: ChildrenType
  dismissible?: boolean
  duration?: number
  autoDismiss?: boolean
}

export interface ToastProps extends Omit<ViewProps, 'children'> {
  variant?: ToastVariant
  title?: string
  message?: string
  children?: ChildrenType
  prefix?: ChildrenType
  suffix?: ChildrenType
  action?: ChildrenType
  dismissible?: boolean
  onDismiss?: () => void
  labels?: ToastLabels
  theme?: PartialTheme
}

export interface NotificationStackProps extends Omit<ViewProps, 'children'> {
  items: ToastItem[]
  position?: NotificationStackPosition
  width?: ViewProps['width']
  gap?: number
  offset?: number
  duration?: number
  depth?: number
  labels?: ToastLabels
  onDismiss?: (id: string) => void
  theme?: PartialTheme
}

export interface NotificationStackAlignment {
  justifyContent: NonNullable<ViewProps['justifyContent']>
  alignItems: NonNullable<ViewProps['alignItems']>
}

export interface ToastContentWidthOptions {
  width: ViewProps['width']
  padding: ViewProps['padding']
  gap: number
  accentWidth: number
  hasPrefix: boolean
  prefixWidth: number
  hasClose: boolean
  closeButtonSize: number
  minContentWidth?: number
}

export function resolveNotificationStackAlignment(
  position: NotificationStackPosition
): NotificationStackAlignment {
  const justifyContent = position.startsWith('bottom') ? 'end' : 'start'

  if (position.endsWith('left')) return { justifyContent, alignItems: 'start' }
  if (position.endsWith('right')) return { justifyContent, alignItems: 'end' }
  return { justifyContent, alignItems: 'center' }
}

export function getToastAutoDismissDuration(item: ToastItem, fallbackDuration: number): number {
  if (item.autoDismiss === false) return 0
  return item.duration ?? fallbackDuration
}

function getHorizontalPadding(padding: ViewProps['padding']): number {
  if (typeof padding === 'number') return padding * 2
  if (!padding) return 0

  const edgeInsets = padding as EdgeInsets
  return (edgeInsets.left ?? 0) + (edgeInsets.right ?? 0)
}

function getHorizontalGap(gap: ViewProps['gap']): number {
  if (typeof gap === 'number') return gap
  if (!gap) return 0

  return (gap as GapInsets).horizontal ?? 0
}

export function getToastContentWidth(options: ToastContentWidthOptions): number | undefined {
  if (typeof options.width !== 'number') return undefined

  const columnCount = 1 + 1 + (options.hasPrefix ? 1 : 0) + (options.hasClose ? 1 : 0)
  const totalGap = Math.max(0, columnCount - 1) * options.gap
  const reservedWidth =
    getHorizontalPadding(options.padding) +
    options.accentWidth +
    (options.hasPrefix ? options.prefixWidth : 0) +
    (options.hasClose ? options.closeButtonSize : 0) +
    totalGap

  return Math.max(options.minContentWidth ?? 96, options.width - reservedWidth)
}

function isPositiveDuration(duration: number): boolean {
  return Number.isFinite(duration) && duration > 0
}

export function Toast(props: ToastProps): VNodeLike {
  const {
    variant,
    title,
    message,
    children,
    prefix,
    suffix,
    action,
    dismissible = true,
    onDismiss,
    labels,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('Toast', mergedTheme, {})
  const themedToast = themed as ToastThemeSlot
  const resolvedVariant = variant ?? themedToast.variant ?? 'info'
  const variantTheme = themedToast.variants?.[resolvedVariant] ?? {}
  const resolvedWidth = viewProps.width ?? themedToast.width ?? 320
  const resolvedPadding = viewProps.padding ??
    themedToast.padding ?? { left: 10, right: 10, top: 9, bottom: 9 }
  const resolvedGap = getHorizontalGap(viewProps.gap ?? themedToast.gap ?? 10)
  const accentWidth = themedToast.accentWidth ?? 4
  const prefixWidth = themedToast.prefixWidth ?? 24
  const closeButtonSize = themedToast.closeButtonSize ?? 22

  const resolvedPrefix = prefix ?? variantTheme.prefix
  const resolvedTitleStyle =
    themedToast.titleStyle || variantTheme.titleStyle
      ? { ...(themedToast.titleStyle ?? {}), ...(variantTheme.titleStyle ?? {}) }
      : undefined
  const resolvedMessageStyle =
    themedToast.messageStyle || variantTheme.messageStyle
      ? { ...(themedToast.messageStyle ?? {}), ...(variantTheme.messageStyle ?? {}) }
      : undefined
  const closeLabel = labels?.close ?? themedToast.labels?.close ?? 'x'
  const hasTextContent = title !== undefined || message !== undefined || children !== undefined
  const hasCloseButton = dismissible && onDismiss !== undefined
  const contentWidth = getToastContentWidth({
    width: resolvedWidth,
    padding: resolvedPadding,
    gap: resolvedGap,
    accentWidth,
    hasPrefix: resolvedPrefix !== undefined,
    prefixWidth,
    hasClose: hasCloseButton,
    closeButtonSize,
  })

  return (
    <View
      {...viewProps}
      direction="row"
      alignItems="stretch"
      gap={resolvedGap}
      width={resolvedWidth}
      minHeight={viewProps.minHeight ?? themedToast.minHeight ?? 58}
      padding={resolvedPadding}
      backgroundColor={
        viewProps.backgroundColor ?? variantTheme.backgroundColor ?? themedToast.backgroundColor
      }
      backgroundAlpha={
        viewProps.backgroundAlpha ?? variantTheme.backgroundAlpha ?? themedToast.backgroundAlpha
      }
      borderColor={viewProps.borderColor ?? variantTheme.borderColor ?? themedToast.borderColor}
      borderWidth={viewProps.borderWidth ?? variantTheme.borderWidth ?? themedToast.borderWidth}
      cornerRadius={viewProps.cornerRadius ?? variantTheme.cornerRadius ?? themedToast.cornerRadius}
      theme={nestedTheme}
    >
      <View
        width={accentWidth}
        backgroundColor={variantTheme.accentColor ?? variantTheme.borderColor ?? 0x38bdf8}
        cornerRadius={2}
      />

      {resolvedPrefix && (
        <View width={prefixWidth} alignItems="center" justifyContent="center" padding={{ top: 1 }}>
          {resolvedPrefix}
        </View>
      )}

      {hasTextContent && (
        <View
          {...(contentWidth === undefined ? { flex: 1 } : {})}
          width={contentWidth ?? 'fill'}
          flexShrink={1}
          gap={themedToast.contentGap ?? 2}
          justifyContent="center"
          overflow="hidden"
        >
          {title !== undefined && <Text text={title} style={resolvedTitleStyle} />}
          {message !== undefined && <WrapText text={message} style={resolvedMessageStyle} />}
          {children}
        </View>
      )}

      {action}
      {suffix}

      {hasCloseButton && (
        <View alignItems="center" justifyContent="center" padding={{ top: 1 }}>
          <Button
            variant="ghost"
            maxWidth={closeButtonSize}
            maxHeight={closeButtonSize}
            cornerRadius={closeButtonSize}
            padding={0}
            onClick={onDismiss}
          >
            <Text text={closeLabel} />
          </Button>
        </View>
      )}
    </View>
  )
}

export function NotificationStack(props: NotificationStackProps): VNodeLike {
  const {
    items,
    position,
    width,
    gap,
    offset,
    duration,
    depth,
    labels,
    onDismiss,
    theme,
    ...viewProps
  } = props

  const localTheme = useTheme()
  const mergedTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('NotificationStack', mergedTheme, {})
  const scene = useScene()
  const viewport = scene ? portalRegistry.getViewportSize(scene) : { width: 800, height: 600 }

  const resolvedPosition = position ?? themed.position ?? 'top-right'
  const resolvedDuration = duration ?? themed.duration ?? 4000
  const resolvedGap = gap ?? themed.gap ?? 8
  const resolvedOffset = offset ?? themed.offset ?? 16
  const resolvedWidth = width ?? themed.width ?? 320
  const alignment = resolveNotificationStackAlignment(resolvedPosition)
  const scheduleKey = useMemo(
    () =>
      items
        .map((item) => `${item.id}:${getToastAutoDismissDuration(item, resolvedDuration)}`)
        .join('|'),
    [items, resolvedDuration]
  )

  useEffect(() => {
    if (!onDismiss || items.length === 0) return

    const timeouts = items
      .map((item) => {
        const itemDuration = getToastAutoDismissDuration(item, resolvedDuration)
        if (!isPositiveDuration(itemDuration)) return null

        return setTimeout(() => onDismiss(item.id), itemDuration)
      })
      .filter((timeout): timeout is ReturnType<typeof setTimeout> => timeout !== null)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [scheduleKey, onDismiss])

  return (
    <Portal depth={depth ?? themed.depth ?? 1200} blockEvents={false}>
      <View
        {...viewProps}
        width={viewport.width}
        height={viewport.height}
        direction="column"
        justifyContent={alignment.justifyContent}
        alignItems={alignment.alignItems}
        padding={viewProps.padding ?? resolvedOffset}
        theme={nestedTheme}
      >
        <View direction="column" gap={resolvedGap} width={resolvedWidth}>
          {items.map((item) => (
            <Toast
              key={item.id}
              {...(item.variant !== undefined ? { variant: item.variant } : {})}
              {...(item.title !== undefined ? { title: item.title } : {})}
              {...(item.message !== undefined ? { message: item.message } : {})}
              {...(item.prefix !== undefined ? { prefix: item.prefix } : {})}
              {...(item.suffix !== undefined ? { suffix: item.suffix } : {})}
              {...(item.action !== undefined ? { action: item.action } : {})}
              {...(item.dismissible !== undefined ? { dismissible: item.dismissible } : {})}
              {...(onDismiss ? { onDismiss: () => onDismiss(item.id) } : {})}
              {...(labels !== undefined ? { labels } : {})}
              theme={nestedTheme}
            >
              {item.content}
            </Toast>
          ))}
        </View>
      </View>
    </Portal>
  )
}
