/** @jsxImportSource ../.. */
/**
 * BottomSheet component — slide-up panel with backdrop and drag-to-dismiss.
 */
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

export interface BottomSheetThemeSlot extends ViewTheme {
  backdropAlpha?: number
  backdropColor?: number
  panelCornerRadius?: number
  handleWidth?: number
  handleHeight?: number
  handleColor?: number
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
  /** Drag distance in pixels to trigger dismiss. Default 80. */
  dismissThreshold?: number
  /** Show drag handle. Default true. */
  showHandle?: boolean
  /** Portal depth. */
  depth?: number
  /** Whether tapping the backdrop closes the sheet. Default false. */
  closeOnBackdrop?: boolean
  /** Backdrop alpha when closeOnBackdrop is active. Default 0.5. */
  backdropAlpha?: number
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
  const threshold = dismissThreshold ?? themedControl.dismissThreshold ?? 80

  const [dragOffset, setDragOffset] = useState(0)
  const dragStartY = useRef(0)
  const dragOffsetRef = useRef(0)

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
      dragOffsetRef.current = 0
      setDragOffset(0)
    } else if (state === 'move') {
      const delta = data.pointer.worldY - dragStartY.current
      // Cap drag so the handle area (32px) stays visible and interactive
      const maxDrag = panelHeight - 32
      const nextOffset = Math.max(0, Math.min(delta, maxDrag))
      dragOffsetRef.current = nextOffset
      setDragOffset(nextOffset)
    } else if (state === 'end') {
      if (dragOffsetRef.current > threshold) {
        commitOpen(false)
      }
      dragOffsetRef.current = 0
      setDragOffset(0)
    }
  }

  // Never mounted and not opening → render nothing
  if (!portalEverMounted && !isOpen) return null

  // Content visible when open or during drag animation
  const showContent = isOpen || dragOffset > 0

  const cornerRadius = themedControl.panelCornerRadius ?? 16
  const handleW = themedControl.handleWidth ?? 36
  const handleH = themedControl.handleHeight ?? 5
  const handleColor = themedControl.handleColor ?? 0x64748b

  // Panel sits at bottom: y = viewportHeight - panelHeight + drag (drag pulls down)
  // When closed (isOpen=false and dragOffset=0), panelY is irrelevant (showContent=false)
  const panelY = isOpen ? viewportHeight - panelHeight + dragOffset : viewportHeight - panelHeight

  return (
    <Portal depth={depth} blockEvents={false}>
      {isOpen && closeOnBackdrop ? (
        <View
          width={viewportWidth}
          height={viewportHeight}
          backgroundColor={themedControl.backdropColor ?? 0x000000}
          backgroundAlpha={backdropAlpha ?? themedControl.backdropAlpha ?? 0.5}
          enableGestures
          onTouch={() => commitOpen(false)}
        />
      ) : null}

      {showContent ? (
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
          onTouch={(event: GestureEventData) => event.stopPropagation()}
          onTouchMove={(event: GestureEventData) => event.stopPropagation()}
          theme={nestedTheme}
        >
          {showHandle ? (
            <View
              width={viewportWidth}
              height={32}
              alignItems="center"
              justifyContent="center"
              enableGestures
              onTouch={(event: GestureEventData) => event.stopPropagation()}
              onTouchMove={handleTouchMove}
            >
              <View
                width={handleW}
                height={handleH}
                backgroundColor={handleColor}
                cornerRadius={handleH / 2}
              />
            </View>
          ) : null}

          <View flex={1} width={'fill'} overflow="hidden" theme={nestedTheme}>
            {children}
          </View>
        </View>
      ) : null}
    </Portal>
  )
}
