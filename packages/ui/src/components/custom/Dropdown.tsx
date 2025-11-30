/** @jsxImportSource ../.. */
/**
 * Dropdown/Select component
 * Provides single and multi-select functionality with keyboard navigation and search
 */
import type Phaser from 'phaser'
import { useSpring, type AnimationConfig } from '../../animation'
import type { GestureEventData } from '../../core-props'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useEffect, useForceRedraw, useRef, useState, useTheme } from '../../hooks'
import type { GameObjectWithLayout } from '../../layout/types'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Text, View } from '../index'
import type { ViewProps } from '../view'
import { CharTextInput } from './CharTextInput'
import { ScrollView } from './ScrollView'

/**
 * Option type for Dropdown
 */
export interface DropdownOption<T = string> {
  /** Unique value */
  value: T
  /** Display label */
  label: string
  /** Disabled state */
  disabled?: boolean
  /** Custom prefix content (e.g., Icon) */
  prefix?: ChildrenType
  /** Custom suffix content */
  suffix?: ChildrenType
}

/**
 * Props for Dropdown component
 */
export interface DropdownProps<T = string> extends Omit<ViewProps, 'children'>, EffectDefinition {
  /** Available options */
  options: DropdownOption<T>[]

  /** Selected value (controlled) */
  value?: T | T[]

  /** Default selected value (uncontrolled) */
  defaultValue?: T | T[]

  /** Placeholder text when nothing selected */
  placeholder?: string

  /** Multi-select mode */
  multiple?: boolean

  /** Enable search/filter */
  searchable?: boolean

  /** Search placeholder */
  searchPlaceholder?: string

  /** Disabled state */
  disabled?: boolean

  /** Maximum height of dropdown list */
  maxHeight?: number

  /** Position of dropdown (default: 'bottom') */
  placement?: 'top' | 'bottom' | 'auto'

  /** Custom render function for selected value */
  renderValue?: (selected: DropdownOption<T> | DropdownOption<T>[] | null) => ChildrenType

  /** Custom render function for option */
  renderOption?: (option: DropdownOption<T>, isSelected: boolean) => ChildrenType

  /** Custom arrow/indicator (default: simple Graphics triangle) */
  arrow?: ChildrenType

  /** Callback when selection changes */
  onChange?: (value: T | T[]) => void

  /** Callback when dropdown opens */
  onOpen?: () => void

  /** Callback when dropdown closes */
  onClose?: () => void

  /** Animation config for expand/collapse */
  animationConfig?: AnimationConfig

  /** Close on select (default: true for single, false for multi) */
  closeOnSelect?: boolean
}

/**
 * Default arrow component - simple Graphics triangle
 */
function DefaultArrow(props: { color?: number; size?: number; rotation?: number }) {
  const color = props.color ?? 0xffffff
  const size = props.size ?? 8
  const rotation = props.rotation ?? 0

  return (
    <View width={size} height={size} rotation={rotation}>
      <View
        width={size}
        height={size}
        onReady={(node) => {
          const graphics = node as Phaser.GameObjects.Graphics
          if (graphics.clear) {
            graphics.clear()
            graphics.fillStyle(color, 1)
            graphics.beginPath()
            graphics.moveTo(0, 0)
            graphics.lineTo(size, 0)
            graphics.lineTo(size / 2, size)
            graphics.closePath()
            graphics.fillPath()
          }
        }}
        headless={true}
      />
    </View>
  )
}

/**
 * Dropdown/Select component
 * Themeable dropdown with single/multi-select, search, and keyboard navigation
 *
 * @example
 * ```tsx
 * // Single select
 * <Dropdown
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Select an option"
 * />
 *
 * // Multi-select with search
 * <Dropdown
 *   options={options}
 *   multiple={true}
 *   searchable={true}
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 * />
 * ```
 */
export function Dropdown<T = string>(props: DropdownProps<T>) {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Dropdown', localTheme, {})

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<T | T[]>(
    props.defaultValue ?? (props.multiple ? [] : ('' as T))
  )
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')

  // Flag to prevent closing on option/overlay clicks
  const shouldIgnoreNextClick = useRef(false)

  // Refs
  const triggerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const overlayRef = useRef<Phaser.GameObjects.Container | null>(null)
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const scrollViewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(triggerRef)

  // Track scroll position for auto-scroll to hovered item
  const [scrollPosition, setScrollPosition] = useState({ dx: 0, dy: 0 })
  const [scrollInfo, setScrollInfo] = useState<{
    viewportHeight: number
    contentHeight: number
    maxScrollY: number
  } | null>(null)

  // Controlled vs uncontrolled
  const isControlled = props.value !== undefined
  const currentValue = isControlled ? props.value : internalValue

  // Merge theme props
  const triggerTheme = themed.trigger ?? {}
  const overlayTheme = themed.overlay ?? {}
  const optionTheme = themed.option ?? {}
  const textStyle = themed.textStyle
  const placeholderStyle = themed.placeholderStyle
  const animationConfig = props.animationConfig ?? themed.animationConfig ?? 'gentle'
  const maxHeight = props.maxHeight ?? overlayTheme.maxHeight ?? 300
  const arrowConfig = themed.arrow ?? {}

  // Filter options based on search
  const filteredOptions = props.searchable
    ? props.options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : props.options

  // Update hovered index based on search query
  useEffect(() => {
    if (!props.searchable) return

    // When search query changes, find first filtered option in original list
    if (filteredOptions.length > 0 && filteredOptions[0]) {
      const firstFilteredOption = filteredOptions[0]
      const indexInOriginalList = props.options.findIndex(
        (opt) => opt.value === firstFilteredOption.value
      )
      setHoveredIndex(indexInOriginalList >= 0 ? indexInOriginalList : 0)
    } else {
      setHoveredIndex(-1)
    }
  }, [searchQuery, props.searchable, props.options])

  // Auto-scroll to hovered item
  useEffect(() => {
    if (hoveredIndex < 0 || !scrollInfo) return

    const optionHeight = typeof optionTheme.height === 'number' ? optionTheme.height : 40
    const targetY = hoveredIndex * optionHeight
    const viewportHeight = scrollInfo.viewportHeight

    // Only scroll if item is outside viewport
    const currentScrollY = scrollPosition.dy
    if (targetY < currentScrollY || targetY + optionHeight > currentScrollY + viewportHeight) {
      // Calculate new scroll position to center the item if possible
      const idealScrollY = targetY - viewportHeight / 2 + optionHeight / 2
      const newScrollY = Math.max(0, Math.min(idealScrollY, scrollInfo.maxScrollY))
      setScrollPosition({ dx: 0, dy: newScrollY })
    }
  }, [hoveredIndex, scrollInfo, optionTheme.height, scrollPosition.dy])

  // Get selected options
  const getSelectedOptions = (): DropdownOption<T>[] => {
    if (props.multiple) {
      const values = currentValue as T[]
      return props.options.filter((opt) => values.includes(opt.value))
    } else {
      const option = props.options.find((opt) => opt.value === currentValue)
      return option ? [option] : []
    }
  }

  const selectedOptions = getSelectedOptions()

  // Animation for overlay height
  const targetHeight = isOpen ? maxHeight : 0
  const [overlayHeight, setOverlayHeight] = useSpring(targetHeight, animationConfig)
  useForceRedraw(20, overlayHeight)

  // Arrow rotation animation
  const targetRotation = isOpen ? Math.PI : 0
  const [arrowRotation, setArrowRotation] = useSpring(targetRotation, animationConfig)
  useForceRedraw(20, arrowRotation)

  // Toggle dropdown
  const handleToggle = (event?: GestureEventData) => {
    if (props.disabled) return

    console.log('Dropdown handleToggle', event)

    event?.stopPropagation()

    if (isOpen) {
      // If open, close it (like clicking outside)
      handleClose()
    } else {
      // If closed, open it
      setIsOpen(true)
      setOverlayHeight(maxHeight)
      setArrowRotation(Math.PI)
      setSearchQuery('')
      setHoveredIndex(-1)
      props.onOpen?.()

      // Apply effect
      const resolved = resolveEffect(props, themed as EffectDefinition)
      applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
    }
  }

  // Close dropdown (for click outside)
  const handleClose = () => {
    if (!isOpen) return
    setIsOpen(false)
    setOverlayHeight(0)
    setArrowRotation(0)
    props.onClose?.()
  }

  // Select option
  const handleSelect = (value: T, event?: GestureEventData) => {
    // Stop propagation to prevent closing dropdown when clicking options
    event?.stopPropagation()
    console.log('Dropdown handleSelect', value, event)
    shouldIgnoreNextClick.current = true

    if (props.multiple) {
      const values = currentValue as T[]
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]

      if (!isControlled) {
        setInternalValue(newValues)
      }
      props.onChange?.(newValues)

      const shouldClose = props.closeOnSelect ?? false
      if (shouldClose) {
        handleClose()
      }
    } else {
      if (!isControlled) {
        setInternalValue(value)
      }
      props.onChange?.(value)

      const shouldClose = props.closeOnSelect ?? true
      if (shouldClose) {
        handleClose()
      }
    }
  }

  // Click outside detection
  const handleOutsideClick = () => {
    console.log('Dropdown handleOutsideClick')
    // Check and reset flag
    if (shouldIgnoreNextClick.current) {
      shouldIgnoreNextClick.current = false
      return
    }

    // Close dropdown when clicked outside
    if (isOpen) {
      handleClose()
    }
  }

  // Keyboard navigation (only when NOT searchable, to avoid conflicts with CharTextInput)
  useEffect(() => {
    if (!isOpen || !containerRef.current || props.searchable) return

    const container = containerRef.current
    const scene = container.scene
    const keyboard = scene.input.keyboard

    if (!keyboard) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setHoveredIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setHoveredIndex((prev) => Math.max(prev - 1, 0))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (hoveredIndex >= 0 && hoveredIndex < filteredOptions.length) {
          const option = filteredOptions[hoveredIndex]
          if (option && !option.disabled) {
            handleSelect(option.value)
          }
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        handleToggle()
      }
    }

    keyboard.on('keydown', handleKeyDown)

    return () => {
      keyboard.off('keydown', handleKeyDown)
    }
  }, [isOpen, hoveredIndex, filteredOptions, props.searchable])

  // Calculate overlay position and width
  const calculateOverlayPosition = (): { x: number; y: number; width: number } => {
    const triggerContainer = triggerRef.current as GameObjectWithLayout
    if (!triggerContainer) return { x: 0, y: 0, width: 0 }

    const triggerSize = triggerContainer.__getLayoutSize?.() ?? { width: 0, height: 0 }
    const triggerX = triggerContainer.x ?? 0
    const triggerY = triggerContainer.y ?? 0

    const scene = triggerContainer.scene
    const sceneHeight = scene.scale.height

    const gap = 4

    // Auto-placement logic
    let placement = props.placement ?? 'bottom'
    if (placement === 'auto') {
      const spaceBelow = sceneHeight - (triggerY + triggerSize.height)
      const spaceAbove = triggerY

      placement = spaceBelow < maxHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
    }

    const overlayX = triggerX
    const overlayY =
      placement === 'bottom' ? triggerY + triggerSize.height + gap : triggerY - maxHeight - gap

    return { x: overlayX, y: overlayY, width: triggerSize.width }
  }

  // Render selected value
  const renderSelectedValue = () => {
    if (props.renderValue) {
      return props.renderValue(selectedOptions.length > 0 ? selectedOptions : null)
    }

    if (selectedOptions.length === 0) {
      return <Text text={props.placeholder ?? 'Select...'} style={placeholderStyle} />
    }

    if (props.multiple) {
      const label = `${selectedOptions.length} selected`
      return <Text text={label} style={textStyle} />
    }

    return <Text text={selectedOptions[0]?.label ?? ''} style={textStyle} />
  }

  // Calculate trigger state styles
  const getTriggerStyle = () => {
    if (props.disabled) {
      return { ...triggerTheme, ...(themed.triggerDisabled ?? {}) }
    }
    if (isOpen) {
      return { ...triggerTheme, ...(themed.triggerOpen ?? {}) }
    }
    return triggerTheme
  }

  const triggerStyle = getTriggerStyle()
  const overlayPosition = calculateOverlayPosition()

  return (
    <View
      ref={containerRef}
      direction="column"
      width={props.width}
      theme={nestedTheme}
      enableGestures={true}
      onTouchOutside={handleOutsideClick}
    >
      {/* Trigger */}
      <View
        ref={triggerRef}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        enableGestures={!props.disabled}
        onTouch={(data) => handleToggle(data)}
        {...triggerStyle}
      >
        <View flex={1}>{renderSelectedValue()}</View>

        {/* Arrow */}
        {props.arrow ? (
          props.arrow
        ) : (
          <DefaultArrow
            color={arrowConfig.color ?? 0xffffff}
            size={arrowConfig.size ?? 8}
            rotation={arrowRotation.value}
          />
        )}
      </View>

      {/* Overlay - always rendered but hidden when closed */}
      <View
        ref={overlayRef}
        direction="column"
        x={overlayPosition.x}
        y={overlayPosition.y}
        width={overlayPosition.width}
        height={overlayHeight.value}
        visible={isOpen}
        depth={1000}
        {...overlayTheme}
      >
        {/* Search Input */}
        {props.searchable && (
          <CharTextInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={props.searchPlaceholder ?? 'Search...'}
            height={themed.searchInput?.height ?? 32}
            margin={{ bottom: 8 }}
            {...(themed.searchInput ?? {})}
          />
        )}

        {/* Options List */}
        <View flex={1} width={'fill'}>
          <ScrollView
            ref={scrollViewRef}
            showVerticalSlider="auto"
            height="fill"
            width="100%"
            scroll={scrollPosition}
            onScrollInfoChange={(info) =>
              setScrollInfo({
                viewportHeight: info.viewportHeight,
                contentHeight: info.contentHeight,
                maxScrollY: info.maxScrollY,
              })
            }
          >
            <View direction="column" gap={themed.optionGap ?? 2} width="100%">
              {filteredOptions.map((option, index) => {
                const isSelected = props.multiple
                  ? (currentValue as T[]).includes(option.value)
                  : currentValue === option.value
                const isHovered = index === hoveredIndex
                const isDisabled = option.disabled ?? false

                const optionStyle = {
                  ...optionTheme,
                  ...(isHovered && !isDisabled ? (themed.optionHover ?? {}) : {}),
                  ...(isSelected ? (themed.optionSelected ?? {}) : {}),
                  ...(isDisabled ? (themed.optionDisabled ?? {}) : {}),
                }

                return (
                  <View
                    key={String(option.value)}
                    width={'fill'}
                    direction="row"
                    alignItems="center"
                    enableGestures={!isDisabled}
                    onTouch={(data) => {
                      data.stopPropagation()
                      if (!isDisabled) handleSelect(option.value, data)
                    }}
                    {...optionStyle}
                  >
                    {/* Custom render or default */}
                    {props.renderOption ? (
                      props.renderOption(option, isSelected)
                    ) : (
                      <>
                        {option.prefix}
                        <Text
                          text={option.label}
                          style={isSelected ? themed.optionSelected?.textStyle : textStyle}
                        />
                        {option.suffix}
                      </>
                    )}
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
