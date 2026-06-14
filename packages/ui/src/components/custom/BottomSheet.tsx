/** @jsxImportSource ../.. */
/**
 * BottomSheet component — slide-up panel with backdrop and drag-to-dismiss.
 */
import type { CornerRadiusInsets } from '@number10/phaserjsx/core-props'
import type { GestureEventData, TouchMoveState } from '../../gestures/gesture-types'
import { useRef, useScene, useState, useTheme } from '../../hooks'
import { portalRegistry } from '../../portal'
import { getThemedProps, mergeThemes } from '../../theme'
import type { PartialTheme, ViewTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { View } from '../index'
import { Portal } from './Portal'

/// The default portal depth for BottomSheet — can be overridden via props.
export const BottomSheetDepth = 1100

export interface BottomSheetLabels {
  close?: string
  handle?: string
}

/** Props passed to renderHandle function for custom handle rendering. */
export interface HandleRenderProps {
  width: number
  height: number
  color: number
  cornerRadius: number
}

export interface BottomSheetThemeSlot extends ViewTheme {
  backdropAlpha?: number
  backdropColor?: number
  panelCornerRadius?: number | CornerRadiusInsets
  handleWidth?: number
  handleHeight?: number
  handleColor?: number
  handleCornerRadius?: number
  handleAreaHeight?: number
  handleAreaColor?: number
  dismissThreshold?: number
  labels?: BottomSheetLabels
}

export interface BottomSheetProps {
  /** Unique key for VDOM identification. */
  key?: string | number | undefined
  /** Controlled open state. */
  open?: boolean
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Sheet content. */
  children: ChildrenType
  /** Height as fraction of viewport (0–1). Default 0.5. */
  height?: number
  /** Drag distance in pixels to trigger dismiss. Default is half the available drag distance. */
  dismissThreshold?: number
  /** Show drag handle. Default true. */
  showHandle?: boolean
  /** Portal depth. */
  depth?: number
  /** Whether tapping the backdrop closes the sheet. Default false. */
  closeOnBackdrop?: boolean
  /** Backdrop alpha when closeOnBackdrop is active. Default 0.5. */
  backdropAlpha?: number
  /** Height of the drag-handle touch area in px. Also used as max-drag cap. Default 32. */
  handleAreaHeight?: number
  /** Custom handle renderer. Receives themed dimensions. Falls back to default bar. */
  renderHandle?: VNodeLike | ((props: HandleRenderProps) => VNodeLike)
  /** Theme overrides. */
  theme?: PartialTheme
}

/**
 * BottomSheet — slide-up panel with backdrop and drag-to-dismiss.
 *
 * Portal lifecycle: once opened, the Portal stays mounted to avoid
 * duplicate backdrop issues from mount/unmount races in the VDOM.
 * Visibility is controlled via conditional children, not by returning null.
 */
export function BottomSheet(props: BottomSheetProps): VNodeLike {
  const {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
    height: heightFraction = 0.5,
    dismissThreshold,
    showHandle = true,
    depth = BottomSheetDepth,
    closeOnBackdrop = false,
    backdropAlpha,
    handleAreaHeight = 32,
    renderHandle,
    theme,
  } = props

  const localTheme = useTheme()
  const scene = useScene()
  const mergedLocalTheme = theme ? mergeThemes(localTheme ?? {}, theme) : localTheme
  const { props: themed, nestedTheme } = getThemedProps('BottomSheet', mergedLocalTheme, {})
  const themedControl = themed as unknown as BottomSheetThemeSlot

  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? !!controlledOpen : internalOpen

  const viewport = scene ? portalRegistry.getViewportSize(scene) : { width: 800, height: 600 }
  const viewportHeight = viewport.height
  const viewportWidth = viewport.width
  const panelHeight = Math.round(viewportHeight * Math.min(1, Math.max(0.1, heightFraction)))
  const maxDrag = Math.max(0, panelHeight - handleAreaHeight)
  const explicitDismissThreshold = dismissThreshold ?? themedControl.dismissThreshold

  const [dragOffset, setDragOffset] = useState(0)
  const dragStartY = useRef(0)
  const dragDistanceRef = useRef(0)
  const possibleDragDistanceRef = useRef(maxDrag)

  // Track whether portal has ever been mounted — once true, stays true
  // to prevent duplicate Portal instances from mount/unmount races.
  const [portalEverMounted, setPortalEverMounted] = useState(false)

  const commitOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  // Open: ensure portal is mounted
  if (isOpen && !portalEverMounted) {
    setPortalEverMounted(true)
  }

  const handleTouchMove = (data: GestureEventData) => {
    data.stopPropagation()

    const state: TouchMoveState | undefined = data.state
    if (!state) return

    if (state === 'start') {
      dragStartY.current = data.pointer.worldY
      dragDistanceRef.current = 0
      possibleDragDistanceRef.current = Math.max(0, viewportHeight - data.pointer.worldY)
      setDragOffset(0)
    } else if (state === 'move') {
      const rawDelta = Math.max(0, data.pointer.worldY - dragStartY.current)
      // Cap drag so the handle area stays visible and interactive
      const nextOffset = Math.min(rawDelta, maxDrag)
      dragDistanceRef.current = rawDelta
      setDragOffset(nextOffset)
    } else if (state === 'end') {
      const finalDelta = Math.max(dragDistanceRef.current, data.pointer.worldY - dragStartY.current)
      const threshold = explicitDismissThreshold ?? possibleDragDistanceRef.current / 2
      if (finalDelta > threshold) {
        commitOpen(false)
      }
      dragDistanceRef.current = 0
      setDragOffset(0)
    }
  }

  // Never mounted and not opening → render nothing
  if (!portalEverMounted && !isOpen) return null

  // Keep Portal children mounted after first open. Portal owns its own VDOM subtree,
  // so stable children prevent theme loss when reopening the sheet.
  const isOverlayVisible = isOpen || dragOffset > 0

  const cornerRadius = themedControl.panelCornerRadius ?? 16
  const handleW = themedControl.handleWidth ?? 36
  const handleH = themedControl.handleHeight ?? 5
  const handleColor = themedControl.handleColor ?? 0x64748b
  const handleCornerRadius = themedControl.handleCornerRadius ?? 2
  const handleAreaColor = themedControl.handleAreaColor

  // Panel sits at bottom: y = viewportHeight - panelHeight + drag (drag pulls down)
  // When closed (isOpen=false and dragOffset=0), panelY is irrelevant (showContent=false)
  const panelY = isOpen ? viewportHeight - panelHeight + dragOffset : viewportHeight - panelHeight

  return (
    <Portal depth={depth} blockEvents={false}>
      <View
        width={viewportWidth}
        height={viewportHeight}
        backgroundColor={themedControl.backdropColor ?? 0x000000}
        backgroundAlpha={backdropAlpha ?? themedControl.backdropAlpha ?? 0.5}
        enableGestures
        visible={isOpen && closeOnBackdrop}
        onTouch={() => commitOpen(false)}
      />

      <View
        width={viewportWidth}
        height={panelHeight}
        y={panelY}
        backgroundColor={themedControl.backgroundColor}
        backgroundAlpha={themedControl.backgroundAlpha ?? 1}
        borderColor={themedControl.borderColor}
        borderWidth={themedControl.borderWidth}
        cornerRadius={cornerRadius}
        direction="column"
        enableGestures
        visible={isOverlayVisible}
        onTouch={(event: GestureEventData) => event.stopPropagation()}
        onTouchMove={(event: GestureEventData) => event.stopPropagation()}
        theme={nestedTheme}
      >
        {showHandle ? (
          <View
            width={viewportWidth}
            height={handleAreaHeight}
            alignItems="center"
            justifyContent="center"
            backgroundColor={handleAreaColor}
            enableGestures
            onTouch={(event: GestureEventData) => event.stopPropagation()}
            onTouchMove={handleTouchMove}
          >
            {renderHandle ? (
              typeof renderHandle === 'function' ? (
                renderHandle({
                  width: handleW,
                  height: handleH,
                  color: handleColor,
                  cornerRadius: handleCornerRadius,
                })
              ) : (
                renderHandle
              )
            ) : (
              <View
                width={handleW}
                height={handleH}
                backgroundColor={handleColor}
                cornerRadius={handleCornerRadius}
              />
            )}
          </View>
        ) : null}

        <View flex={1} width={'fill'} overflow="hidden" theme={nestedTheme}>
          {children}
        </View>
      </View>
    </Portal>
  )
}

/**
 * Pre-built handle renderers for use with {@link BottomSheetProps.renderHandle}.
 *
 * @example
 * ```tsx
 * <BottomSheet renderHandle={BottomSheetHandle.Bar} />
 * <BottomSheet renderHandle={BottomSheetHandle.Pill} />
 * <BottomSheet renderHandle={(h) => <View width={h.width} height={h.height} backgroundColor={0xff0000} cornerRadius={4} />} />
 * ```
 */
export const BottomSheetHandle = {
  /** Default bar — uses themed width, height, color, cornerRadius. */
  Bar: (props: HandleRenderProps): VNodeLike => (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={props.color}
      cornerRadius={props.cornerRadius}
    />
  ),
  /** Pill variant — cornerRadius for a fully rounded look. */
  Pill: (props: HandleRenderProps): VNodeLike => (
    <View
      width={props.width * 2}
      height={props.height * 3}
      backgroundColor={props.color}
      cornerRadius={props.height * 1.5}
    />
  ),
  /** Gripper variant*/
  Grip: (props: HandleRenderProps): VNodeLike => (
    <View gap={props.height}>
      <View
        width={props.width * 2}
        height={props.height}
        backgroundColor={props.color}
        cornerRadius={props.cornerRadius}
      />
      <View
        width={props.width * 2}
        height={props.height}
        backgroundColor={props.color}
        cornerRadius={props.cornerRadius}
      />
      <View
        width={props.width * 2}
        height={props.height}
        backgroundColor={props.color}
        cornerRadius={props.cornerRadius}
      />
    </View>
  ),
}
