/** @jsxImportSource ../.. */
/**
 * Dropdown/Select component
 * Provides single and multi-select functionality with filtering
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
import { useForceRedraw, useMemo, useRef, useState, useTheme } from '../../hooks'
import type { GameObjectWithLayout } from '../../layout/types'
import { getThemedProps } from '../../theme'
import type { ChildrenType } from '../../types'
import { Graphics, Text, View } from '../index'
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

  /** optional use stack layout, then only the trigger is part of automatic layout, rest as overlay */
  stackLayout?: boolean

  /** Selected value (controlled) */
  value?: T | T[]

  /** Default selected value (uncontrolled) */
  defaultValue?: T | T[]

  /** Placeholder text when nothing selected */
  placeholder?: string

  /** Multi-select mode */
  multiple?: boolean

  /** Enable filter */
  isFilterable?: boolean

  /** Filtering placeholder */
  filterInputPlaceholder?: string

  /** Disabled state */
  disabled?: boolean

  /** Maximum height of dropdown list */
  maxHeight?: number

  /** Position of dropdown (default: 'bottom') */
  placement?: 'top' | 'bottom'

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
function DefaultArrow(props: { color?: number; size?: number }) {
  const color = props.color ?? 0xffffff
  const size = props.size ?? 8

  return (
    <Graphics
      width={size}
      height={size}
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()
        g.fillStyle(color, 1)
        g.beginPath()
        g.moveTo(0, 0)
        g.lineTo(size, 0)
        g.lineTo(size / 2, size)
        g.closePath()
        g.fillPath()
      }}
    />
  )
}

/**
 * Dropdown/Select component
 * Themeable dropdown with single/multi-select, Filtering, and custom rendering
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
 * // Multi-select with filtering
 * <Dropdown
 *   options={options}
 *   multiple={true}
 *   isFiltering={true}
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
  const [filterQuery, setFilterQuery] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // Flag to prevent closing on option/overlay clicks
  const shouldIgnoreNextClick = useRef(false)

  // Refs
  const triggerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const overlayRef = useRef<Phaser.GameObjects.Container | null>(null)
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const scrollViewRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect } = useGameObjectEffect(triggerRef)

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

  // Filter options based on filterQuery
  const filteredOptions = useMemo(() => {
    return props.isFilterable
      ? props.options.filter((opt) => opt.label.toLowerCase().includes(filterQuery.toLowerCase()))
      : props.options
  }, [props.isFilterable, props.options, filterQuery])

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
  const [overlayHeight, setOverlayHeight] = useSpring(targetHeight, animationConfig, () =>
    setIsAnimating(false)
  )
  useForceRedraw(20, overlayHeight)

  // Arrow rotation animation
  const targetRotation = isOpen ? Math.PI : 0
  const [arrowRotation, setArrowRotation] = useSpring(targetRotation, animationConfig)
  useForceRedraw(20, arrowRotation)

  // Toggle dropdown
  const handleToggle = (event?: GestureEventData) => {
    if (props.disabled) return

    event?.stopPropagation()

    if (isOpen) {
      // If open, close it (like clicking outside)
      handleClose()
    } else {
      // If closed, open it
      setIsOpen(true)
      setIsAnimating(true)
      setOverlayHeight(maxHeight)
      setArrowRotation(Math.PI)
      setFilterQuery('')
      props.onOpen?.()

      // Prevent immediate close from outside click detection
      // Especially important for placement="top" where overlay overlaps trigger
      shouldIgnoreNextClick.current = true

      // Apply effect
      const resolved = resolveEffect(props, themed as EffectDefinition)
      applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
    }
  }

  // Close dropdown (for click outside)
  const handleClose = () => {
    setIsAnimating(true)
    setIsOpen(false)
    setOverlayHeight(0)
    setArrowRotation(0)
    props.onClose?.()
  }

  // Select option
  const handleSelect = (value: T, event?: GestureEventData) => {
    // Stop propagation to prevent closing dropdown when clicking options
    event?.stopPropagation()
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

  // Calculate overlay position and width
  const calculateOverlayPosition = (): { x: number; y: number; width: number } => {
    const triggerContainer = triggerRef.current as GameObjectWithLayout
    if (!triggerContainer) return { x: 0, y: 0, width: 0 }

    const triggerSize = triggerContainer.__getLayoutSize?.() ?? { width: 0, height: 0 }
    const triggerX = triggerContainer.x ?? 0
    const triggerY = triggerContainer.y ?? 0

    const gap = 4

    // Auto-placement logic
    let placement = props.placement ?? 'bottom'

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

  // Render options list
  const renderedOptions = useMemo((): ChildrenType => {
    return filteredOptions.map((option, _index) => {
      const isSelected = props.multiple
        ? (currentValue as T[]).includes(option.value)
        : currentValue === option.value
      const isDisabled =
        (option.disabled ?? false) || (isAnimating && (props.placement ?? 'bottom') === 'top')

      const optionStyle = {
        ...optionTheme,
        ...(isSelected ? (themed.optionSelected ?? {}) : {}),
        ...(isDisabled ? (themed.optionDisabled ?? {}) : {}),
      }

      // Extract nested theme for selected option (for Text component)
      const optionNestedTheme = isSelected ? themed.optionSelected : undefined

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
          theme={optionNestedTheme}
          {...optionStyle}
        >
          {/* Custom render or default */}
          {props.renderOption ? (
            props.renderOption(option, isSelected)
          ) : (
            <>
              {option.prefix}
              <Text text={option.label} />
              {option.suffix}
            </>
          )}
        </View>
      )
    })
  }, [
    filteredOptions,
    currentValue,
    props.multiple,
    props.renderOption,
    optionTheme,
    themed.optionSelected,
    themed.optionDisabled,
    textStyle,
    isAnimating,
  ])

  const placement = props.placement ?? 'bottom'

  // Render trigger
  const trigger = (
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
        <DefaultArrow color={arrowConfig.color ?? 0xffffff} size={arrowConfig.size ?? 8} />
      )}
    </View>
  )

  // Render filter input
  const filterInput = props.isFilterable && (
    <CharTextInput
      value={filterQuery}
      onChange={setFilterQuery}
      placeholder={props.filterInputPlaceholder ?? 'Filter...'}
      height={themed.filterInput?.height ?? 32}
      margin={placement === 'top' ? { top: 8 } : { bottom: 8 }}
      onFocus={() => {
        shouldIgnoreNextClick.current = true
      }}
      {...(themed.filterInput ?? {})}
    />
  )

  // Render options list
  const optionsList = (
    <View flex={1} width={'fill'}>
      <ScrollView
        key={`scroll-${filteredOptions.length}-${filterQuery}`}
        ref={scrollViewRef}
        showVerticalSlider={isAnimating ? false : 'auto'}
        height="fill"
        width="100%"
      >
        <View
          direction="column"
          gap={themed.optionGap ?? 2}
          width="100%"
          theme={
            textStyle
              ? {
                  Text: { style: textStyle },
                }
              : undefined
          }
        >
          {renderedOptions}
        </View>
      </ScrollView>
    </View>
  )

  // Render overlay
  const overlay = (
    <View height={overlayHeight.value} width={overlayPosition.width} overflow="hidden">
      <View
        ref={overlayRef}
        direction="column"
        width={'fill'}
        height={'fill'}
        visible={isOpen || Math.abs(overlayHeight.value) > 0.1}
        {...overlayTheme}
      >
        {placement === 'top' ? (
          <>
            {optionsList}
            {filterInput}
          </>
        ) : (
          <>
            {filterInput}
            {optionsList}
          </>
        )}
      </View>
    </View>
  )

  return (
    <View
      direction={props.stackLayout ? 'stack' : 'column'}
      width={props.width || 'fill'}
      height={props.stackLayout ? triggerRef.current?.height : 'auto'}
      ref={props.ref}
      //borderColor={0x00ff00}
      //borderWidth={14}
    >
      <View
        key={`dropdown-${placement}`}
        ref={containerRef}
        direction="column"
        width={props.width}
        theme={nestedTheme}
        enableGestures={true}
        onTouchOutside={handleOutsideClick}
        borderColor={0x0000ff}
        borderWidth={2}
      >
        {placement === 'top' ? (
          <>
            {overlay}
            {trigger}
          </>
        ) : (
          <>
            {trigger}
            {overlay}
          </>
        )}
      </View>
    </View>
  )
}
