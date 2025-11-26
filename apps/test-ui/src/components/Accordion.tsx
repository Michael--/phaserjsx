import type * as PhaserJSX from '@phaserjsx/ui'
import {
  getThemedProps,
  Text,
  useEffect,
  useForceRedraw,
  useRef,
  useSpring,
  useState,
  useTheme,
  View,
  type AnimationConfig,
  type ChildrenType,
  type ViewProps,
} from '@phaserjsx/ui'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../hooks'
import { Icon, type IconType } from './Icon'

// Module augmentation to add Accordion theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    Accordion: {
      headerStyle?: PhaserJSX.ViewTheme
      contentStyle?: PhaserJSX.ViewTheme
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      iconSize?: number
      iconColor?: number
      animationConfig?: AnimationConfig
    } & PhaserJSX.ViewTheme &
      EffectDefinition
  }
}

/**
 * Props for Accordion component
 */
export interface AccordionProps extends ViewProps, EffectDefinition {
  /** Title as string or custom JSX element */
  title?: string | ChildrenType
  /** Optional icon displayed in header */
  icon?: IconType
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
  const { props: themed } = getThemedProps('Accordion', localTheme, {})

  const [internalOpen, setInternalOpen] = useState<boolean>(props.defaultOpen ?? false)
  const isOpen = props.isOpen !== undefined ? props.isOpen : internalOpen

  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(ref)

  const animated = props.animated ?? false
  const autoHeight = props.autoHeight ?? false
  const maxHeight = props.maxHeight ?? 200
  const animationConfig = props.animationConfig ?? themed.animationConfig ?? 'gentle'

  const [measuredHeight, setMeasuredHeight] = useState<number>(maxHeight)

  // Measure content height when opened
  useEffect(() => {
    if (autoHeight && isOpen && contentRef.current) {
      // Wait for next frame to ensure rendering
      setTimeout(() => {
        if (contentRef.current) {
          const height = contentRef.current.height
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
    const resolved = resolveEffect(props, themed)
    applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
  }

  const headerTheme = themed.headerStyle ?? {}
  const contentTheme = themed.contentStyle ?? {}
  const iconSize = themed.iconSize ?? 24
  const textStyle = themed.textStyle

  return (
    <View width={props.width} height={props.height} direction="column" {...themed}>
      {/* Header */}
      <View
        direction="row"
        alignItems="center"
        enableGestures={true}
        onTouch={handleToggle}
        {...headerTheme}
      >
        {props.icon && <Icon type={props.icon} size={iconSize} />}
        {typeof props.title === 'string' ? (
          <Text text={props.title} {...(textStyle && { style: textStyle })} />
        ) : (
          props.title
        )}
      </View>

      {/* Invisible measurement container */}
      {autoHeight && (
        <View visible={false} direction="stack">
          <View ref={contentRef} {...contentTheme}>
            {props.children}
          </View>
        </View>
      )}

      {/* Content */}
      <View
        direction="column"
        height={animated ? contentHeight.value : isOpen ? undefined : 0}
        overflow="hidden"
        {...contentTheme}
      >
        {props.children}
      </View>
    </View>
  )
}
