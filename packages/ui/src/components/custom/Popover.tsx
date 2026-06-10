/** @jsxImportSource ../.. */
/**
 * Popover and ContextMenu components - portal-based overlays that do not participate in parent layout.
 */
import type * as Phaser from 'phaser'
import {
  createFadeInEffect,
  createFadeOutEffect,
  useGameObjectEffect,
  type EffectFn,
} from '../../effects/use-effect'
import type { GestureEventData } from '../../gestures/gesture-types'
import { useEffect, useRef, useScene, useState, useTheme } from '../../hooks'
import { DeferredLayoutQueue } from '../../layout/layout-engine'
import type { GameObjectWithLayout, LayoutSize } from '../../layout/types'
import { portalRegistry } from '../../portal'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType, Ref } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Text, View, type ViewProps } from '../index'
import { Portal } from './Portal'
import { useOverlayPresence } from './useOverlayPresence'

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export interface OverlayAnchorRect {
  x: number
  y: number
  width: number
  height: number
}

export interface OverlayContentSize {
  width: number
  height: number
}

export interface OverlayPositionOptions {
  anchor: OverlayAnchorRect
  content: OverlayContentSize
  placement: PopoverPlacement
  offset: number
  viewport?: OverlayContentSize | undefined
  viewportPadding?: number | undefined
}

export interface OverlayPosition {
  x: number
  y: number
  placement: PopoverPlacement
}

export interface PopoverProps {
  /** Unique key for VDOM identification. */
  key?: string | number | undefined
  /** Trigger content rendered in normal layout. */
  trigger: ChildrenType
  /** Overlay content rendered through Portal. */
  children: ChildrenType
  /** Controlled open state. */
  isOpen?: boolean
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean
  /** Called when open state should change. */
  onOpenChange?: (open: boolean) => void
  /** Placement relative to the trigger. */
  placement?: PopoverPlacement
  /** Distance between trigger and content. */
  offset?: number
  /** Portal depth. */
  depth?: number
  /** Close when clicking outside. */
  closeOnOutside?: boolean
  /** Close on Escape key. */
  closeOnEscape?: boolean
  /** Disable trigger interaction. */
  disabled?: boolean
  /** Optional fixed width override. By default Popover measures its content after layout. */
  contentWidth?: number
  /** Optional fixed height override. By default Popover measures its content after layout. */
  contentHeight?: number
  /** Use trigger width for content width. */
  matchTriggerWidth?: boolean
  /** Padding inside the viewport clamp. */
  viewportPadding?: number
  /** Custom effect for showing overlay content. */
  openEffect?: EffectFn
  /** Custom effect for hiding overlay content. */
  closeEffect?: EffectFn
  /** Open animation duration in milliseconds. */
  openDuration?: number
  /** Close animation duration in milliseconds. */
  closeDuration?: number
  /** Props applied to the trigger wrapper. */
  triggerProps?: Omit<ViewProps, 'children'>
  /** Props applied to the content wrapper. */
  contentProps?: Omit<ViewProps, 'children'>
  /** Theme overrides. */
  theme?: PartialTheme
}

export interface ContextMenuItem {
  id: string
  label: string
  disabled?: boolean
  danger?: boolean
  prefix?: ChildrenType
  suffix?: ChildrenType
  onSelect?: () => void
}

export interface ContextMenuProps extends Omit<
  PopoverProps,
  'children' | 'contentWidth' | 'contentHeight' | 'contentProps' | 'matchTriggerWidth'
> {
  /** Menu items shown in the context menu. */
  items: ContextMenuItem[]
  /** Menu width. */
  width?: number
  /** Called when an item is selected. */
  onSelect?: (item: ContextMenuItem) => void
}

function getMainPlacement(placement: PopoverPlacement): 'top' | 'bottom' | 'left' | 'right' {
  return placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right'
}

function getCrossPlacement(placement: PopoverPlacement): 'center' | 'start' | 'end' {
  return (placement.split('-')[1] as 'start' | 'end' | undefined) ?? 'center'
}

export function calculateOverlayPosition(options: OverlayPositionOptions): OverlayPosition {
  const { anchor, content, placement, offset } = options
  const main = getMainPlacement(placement)
  const cross = getCrossPlacement(placement)

  let x: number
  let y: number

  if (main === 'top' || main === 'bottom') {
    y = main === 'top' ? anchor.y - content.height - offset : anchor.y + anchor.height + offset

    if (cross === 'start') x = anchor.x
    else if (cross === 'end') x = anchor.x + anchor.width - content.width
    else x = anchor.x + (anchor.width - content.width) / 2
  } else {
    x = main === 'left' ? anchor.x - content.width - offset : anchor.x + anchor.width + offset

    if (cross === 'start') y = anchor.y
    else if (cross === 'end') y = anchor.y + anchor.height - content.height
    else y = anchor.y + (anchor.height - content.height) / 2
  }

  const viewport = options.viewport
  if (viewport) {
    const padding = options.viewportPadding ?? 8
    x = Math.min(Math.max(padding, x), Math.max(padding, viewport.width - content.width - padding))
    y = Math.min(
      Math.max(padding, y),
      Math.max(padding, viewport.height - content.height - padding)
    )
  }

  return { x, y, placement }
}

function getLayoutSize(container: Phaser.GameObjects.Container | null): LayoutSize {
  const withLayout = container as GameObjectWithLayout | null
  return (
    withLayout?.__getLayoutSize?.() ?? withLayout?.__cachedLayoutSize ?? { width: 0, height: 0 }
  )
}

function getWorldPosition(container: Phaser.GameObjects.Container): { x: number; y: number } {
  const withMatrix = container as Phaser.GameObjects.Container & {
    getWorldTransformMatrix?: () => { tx: number; ty: number }
  }
  const matrix = withMatrix.getWorldTransformMatrix?.()
  if (matrix) return { x: matrix.tx, y: matrix.ty }
  return { x: container.x ?? 0, y: container.y ?? 0 }
}

function getAnchorRect(container: Phaser.GameObjects.Container | null): OverlayAnchorRect {
  if (!container) return { x: 0, y: 0, width: 0, height: 0 }

  const size = getLayoutSize(container)
  const position = getWorldPosition(container)

  return {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  }
}

const FALLBACK_CONTENT_SIZE: OverlayContentSize = { width: 220, height: 120 }

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ref.current = value
}

export function Popover(props: PopoverProps): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Popover', localTheme, props.theme ?? {})
  const scene = useScene()
  const triggerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const [measuredContentSize, setMeasuredContentSize] = useState<OverlayContentSize | null>(null)
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false)
  const isControlled = props.isOpen !== undefined
  const isOpen = isControlled ? props.isOpen === true : internalOpen
  const presence = useOverlayPresence(isOpen)
  const { applyEffect: contentAnimation, stopEffects: stopContentEffects } =
    useGameObjectEffect(contentRef)

  const placement = props.placement ?? themed.placement ?? 'bottom'
  const offset = props.offset ?? themed.offset ?? 8
  const depth = props.depth ?? themed.depth ?? 1100
  const closeOnOutside = props.closeOnOutside ?? themed.closeOnOutside ?? true
  const closeOnEscape = props.closeOnEscape ?? themed.closeOnEscape ?? true
  const viewportPadding = props.viewportPadding ?? themed.viewportPadding ?? 8
  const openEffect = props.openEffect ?? themed.openEffect ?? createFadeInEffect
  const closeEffect = props.closeEffect ?? themed.closeEffect ?? createFadeOutEffect
  const openDuration = props.openDuration ?? themed.openDuration ?? 120
  const closeDuration = props.closeDuration ?? themed.closeDuration ?? 100
  const explicitContentWidth = props.contentWidth ?? themed.contentWidth
  const explicitContentHeight = props.contentHeight ?? themed.contentHeight
  const viewport = portalRegistry.getViewportSize(scene)
  const anchor = getAnchorRect(triggerRef.current)
  const measuredWidth = measuredContentSize?.width ?? FALLBACK_CONTENT_SIZE.width
  const measuredHeight = measuredContentSize?.height ?? FALLBACK_CONTENT_SIZE.height
  const needsMeasurement = explicitContentWidth === undefined || explicitContentHeight === undefined
  const isPositionReady = !needsMeasurement || measuredContentSize !== null
  const contentWidth = props.matchTriggerWidth
    ? Math.max(anchor.width, explicitContentWidth ?? measuredWidth)
    : (explicitContentWidth ?? measuredWidth)
  const contentHeight = explicitContentHeight ?? measuredHeight
  const overlayPosition = calculateOverlayPosition({
    anchor,
    content: { width: contentWidth, height: contentHeight },
    placement,
    offset,
    viewport,
    viewportPadding,
  })

  const setOpen = (open: boolean) => {
    if (props.disabled && open) return
    if (!isControlled) setInternalOpen(open)
    props.onOpenChange?.(open)
  }

  const toggleOpen = (event: GestureEventData) => {
    event.stopPropagation()
    setOpen(!isOpen)
  }

  const close = (event?: GestureEventData) => {
    event?.stopPropagation()
    setOpen(false)
  }

  const contentProps = props.contentProps ?? {}
  const contentPropsRef = contentProps.ref as Ref<Phaser.GameObjects.Container> | undefined
  const contentPropsAlpha = contentProps.alpha
  const handleContentRef = (container: Phaser.GameObjects.Container | null) => {
    contentRef.current = container
    assignRef(contentPropsRef, container)
  }

  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeOnEscape, isOpen])

  useEffect(() => {
    if (!presence.isPresent) return

    DeferredLayoutQueue.defer(() => {
      const size = getLayoutSize(contentRef.current)
      if (size.width <= 0 || size.height <= 0) return

      setMeasuredContentSize((current) => {
        if (current?.width === size.width && current?.height === size.height) return current
        return { width: size.width, height: size.height }
      })
    })
  }, [presence.isPresent, props.children, explicitContentWidth, explicitContentHeight])

  useEffect(() => {
    const content = contentRef.current
    if (!content || !presence.isPresent) return

    if (presence.phase === 'entering') {
      if (!isPositionReady) return

      stopContentEffects()
      content.setVisible(true)
      contentAnimation(openEffect, {
        time: openDuration,
        onComplete: presence.finishEnter,
      })
    } else if (presence.phase === 'exiting') {
      stopContentEffects()
      contentAnimation(closeEffect, {
        time: closeDuration,
        onComplete: () => {
          contentRef.current?.setVisible(false)
          setMeasuredContentSize(null)
          presence.finishExit()
        },
      })
    }
  }, [presence.phase, presence.isPresent, isPositionReady, openDuration, closeDuration])

  return (
    <>
      <View
        {...(props.triggerProps ?? {})}
        ref={triggerRef}
        enableGestures={!props.disabled}
        onTouch={toggleOpen}
      >
        {props.trigger}
      </View>

      {presence.isPresent && (
        <Portal depth={depth} blockEvents={false}>
          {closeOnOutside && (
            <View
              width={viewport.width}
              height={viewport.height}
              backgroundColor={0x000000}
              backgroundAlpha={0}
              onTouch={close}
              onTouchMove={(event: GestureEventData) => event.stopPropagation()}
            />
          )}
          <View
            direction="column"
            backgroundColor={themed.backgroundColor ?? 0x111827}
            borderColor={themed.borderColor ?? 0x334155}
            borderWidth={themed.borderWidth ?? 1}
            cornerRadius={themed.cornerRadius ?? 8}
            padding={themed.padding ?? 10}
            gap={themed.gap ?? 8}
            {...contentProps}
            ref={handleContentRef}
            x={overlayPosition.x}
            y={overlayPosition.y}
            {...(props.matchTriggerWidth || explicitContentWidth !== undefined
              ? { width: contentWidth }
              : {})}
            {...(isPositionReady
              ? contentPropsAlpha !== undefined
                ? { alpha: contentPropsAlpha }
                : {}
              : { alpha: 0 })}
            onTouch={(event: GestureEventData) => event.stopPropagation()}
            theme={nestedTheme}
          >
            {props.children}
          </View>
        </Portal>
      )}
    </>
  )
}

export function ContextMenu(props: ContextMenuProps): VNodeLike {
  const {
    items,
    width: explicitWidth,
    onSelect,
    isOpen: explicitOpen,
    defaultOpen,
    onOpenChange,
    ...popoverProps
  } = props
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps(
    'ContextMenu',
    localTheme,
    props.theme ?? {}
  )
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false)
  const isControlled = explicitOpen !== undefined
  const isOpen = isControlled ? explicitOpen === true : internalOpen
  const width = explicitWidth ?? themed.width ?? 220
  const itemHeight = themed.itemHeight ?? 34

  const setOpen = (open: boolean) => {
    if (!isControlled) setInternalOpen(open)
    onOpenChange?.(open)
  }

  const handleSelect = (item: ContextMenuItem) => {
    if (item.disabled) return
    item.onSelect?.()
    onSelect?.(item)
    setOpen(false)
  }

  return (
    <Popover
      {...popoverProps}
      isOpen={isOpen}
      onOpenChange={setOpen}
      contentWidth={width}
      contentHeight={Math.max(1, items.length) * itemHeight + 20}
      contentProps={{
        padding: themed.padding ?? 6,
        gap: themed.gap ?? 2,
        backgroundColor: themed.backgroundColor,
        borderColor: themed.borderColor,
        borderWidth: themed.borderWidth,
        cornerRadius: themed.cornerRadius,
        theme: nestedTheme,
      }}
    >
      {items.map((item) => {
        const textColor = item.disabled
          ? (themed.disabledTextColor ?? '#64748b')
          : item.danger
            ? (themed.dangerTextColor ?? '#fecaca')
            : (themed.textStyle?.color ?? '#f8fafc')

        return (
          <View
            key={item.id}
            width="fill"
            height={itemHeight}
            direction="row"
            alignItems="center"
            gap={themed.itemGap ?? 8}
            padding={themed.itemPadding ?? { left: 10, right: 10, top: 6, bottom: 6 }}
            cornerRadius={themed.itemCornerRadius ?? 5}
            backgroundColor={item.danger ? (themed.dangerBackgroundColor ?? 0x1f2937) : 0x000000}
            backgroundAlpha={item.danger ? 0.35 : 0}
            enableGestures={!item.disabled}
            onTouch={(event: GestureEventData) => {
              event.stopPropagation()
              handleSelect(item)
            }}
          >
            {item.prefix}
            <View flex={1}>
              <Text text={item.label} style={{ ...(themed.textStyle ?? {}), color: textColor }} />
            </View>
            {item.suffix}
          </View>
        )
      })}
    </Popover>
  )
}
