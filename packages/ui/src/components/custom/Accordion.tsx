/** @jsxImportSource ../.. */
import { useSpring, type AnimationConfig } from '../../animation'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useEffect, useForceRedraw, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Text, View } from '../index'
import type { ViewProps } from '..'

/**
 * Props for Accordion component
 */
export interface AccordionProps extends ViewProps, EffectDefinition {
  /** Title as string or custom JSX element */
  title?: string | ChildrenType
  /** Initial open state (default: false) */
  defaultOpen?: boolean
  /** Controlled open state */
  isOpen?: boolean
  /** Callback when accordion is toggled */
  onToggle?: (isOpen: boolean) => void
  /** Enable smooth height animation (default: false) */
  animated?: boolean
  /** Maximum height for animation (default: 200) */
  maxHeight?: number
  /** Automatically measure content height for animation. Note: Creates a duplicate invisible container for measurement. */
  autoHeight?: boolean
  /** Spring animation config (preset name or custom config, default: 'gentle') */
  animationConfig?: AnimationConfig
  /** Callback when accordion animation ends */
  onAnimationEnd?: () => void
}

/**
 * Accordion component - collapsible header with content
 * @param props - Accordion properties
 * @returns Accordion JSX element
 */
export function Accordion(props: AccordionProps) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Accordion', localTheme, {})

  const [internalOpen, setInternalOpen] = useState<boolean>(props.defaultOpen ?? false)
  const isOpen = props.isOpen !== undefined ? props.isOpen : internalOpen

  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const measurementRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(ref)

  const autoHeight = props.autoHeight ?? themed.animated ?? false
  const maxHeight = props.maxHeight ?? 200
  const animated = props.animated ?? themed.animated ?? false
  const animationConfig = props.animationConfig ?? themed.animationConfig ?? 'gentle'

  const [measuredHeight, setMeasuredHeight] = useState<number>(maxHeight)

  // Measure content height when opened
  useEffect(() => {
    if (autoHeight && isOpen && measurementRef.current) {
      // Wait for next frame to ensure rendering
      setTimeout(() => {
        if (measurementRef.current) {
          const height = measurementRef.current.height
          setMeasuredHeight(height)
          setContentHeight(height)
        }
      }, 0)
    }
  }, [isOpen, autoHeight])

  // Animate content height if enabled
  const [contentHeight, setContentHeight] = useSpring(
    animated
      ? isOpen
        ? autoHeight
          ? measuredHeight
          : maxHeight
        : 0
      : isOpen
        ? autoHeight
          ? measuredHeight
          : maxHeight
        : 0,
    animationConfig,
    props.onAnimationEnd
  )
  if (animated) {
    useForceRedraw(20, contentHeight)
  }

  const handleToggle = () => {
    const newState = !isOpen
    setInternalOpen(newState)
    if (animated) {
      const targetHeight = autoHeight ? measuredHeight : maxHeight
      setContentHeight(newState ? targetHeight : 0)
    }
    props.onToggle?.(newState)

    // Apply effect: props override theme, theme overrides default
    const resolved = resolveEffect(props, themed as EffectDefinition)
    applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
  }

  const headerTheme = themed.headerStyle ?? {}
  const contentTheme = themed.contentStyle ?? {}
  const textStyle = themed.textStyle

  return (
    <View
      key={props.key}
      width={props.width}
      height={props.height}
      direction="column"
      {...themed}
      theme={nestedTheme}
    >
      {/* Header */}
      <View
        ref={ref}
        direction="row"
        alignItems="center"
        enableGestures={true}
        onTouch={handleToggle}
        {...headerTheme}
      >
        {typeof props.title === 'string' ? (
          <Text text={props.title} {...(textStyle && { style: textStyle })} />
        ) : (
          props.title
        )}
      </View>

      {/* Invisible measurement container */}
      {autoHeight && (
        <View visible={false} direction="stack">
          <View ref={measurementRef} {...contentTheme}>
            {props.children}
          </View>
        </View>
      )}

      {/* Content */}
      <View
        direction="column"
        height={animated ? contentHeight.value : isOpen ? undefined : 0}
        overflow="hidden"
        visible={animated ? contentHeight.value > 0.5 : isOpen}
        {...contentTheme}
      >
        {props.children}
      </View>
    </View>
  )
}
