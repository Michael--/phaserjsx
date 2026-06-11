/** @jsxImportSource ../.. */
/**
 * Dropdown/Select component
 * Provides single and multi-select functionality with filtering
 */
import type * as Phaser from 'phaser'
import type { ViewProps } from '..'
import { useSpring, type AnimationConfig } from '../../animation'
import type { GestureEventData } from '../../core-props'
import {
  applyEffectByName,
  resolveEffect,
  useGameObjectEffect,
  type EffectDefinition,
} from '../../effects'
import { useForceRedraw, useRef, useState, useTheme } from '../../hooks'
import { getThemedProps } from '../../theme'
import type { PartialTheme } from '../../theme-base'
import type { ChildrenType } from '../../types'
import type { VNodeLike } from '../../vdom'
import { Graphics, Text, View } from '../index'
import { CharTextInput } from './CharTextInput'
import { Popover, type PopoverPlacement } from './Popover'
import { ScrollView } from './ScrollView'
import { TransformOriginView } from './TransformOriginView'

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

  /** @deprecated Dropdown overlays are portal-based; this legacy prop is ignored. */
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
 * Default arrow component - chevron indicator.
 */
function DefaultArrow(props: { color?: number; size?: number; strokeWidth?: number }) {
  const color = props.color ?? 0xffffff
  const size = props.size ?? 8
  const strokeWidth = props.strokeWidth ?? Math.max(2, Math.round(size * 0.16))

  return (
    <Graphics
      width={size}
      height={size}
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()
        g.lineStyle(strokeWidth, color, 1)
        g.beginPath()
        g.moveTo(size * 0.18, size * 0.35)
        g.lineTo(size * 0.5, size * 0.68)
        g.lineTo(size * 0.82, size * 0.35)
        g.strokePath()
      }}
    />
  )
}

function DefaultOptionIndicator(props: {
  selected: boolean
  multiple: boolean
  disabled: boolean
  color?: number
  size?: number
  strokeWidth?: number
}) {
  const size = props.size ?? 16
  const color = props.color ?? 0xffffff
  const strokeWidth = props.strokeWidth ?? 2
  const alpha = props.disabled ? 0.4 : 1

  return (
    <Graphics
      width={size}
      height={size}
      dependencies={[props.selected, props.multiple, props.disabled, color, size, strokeWidth]}
      onDraw={(g: Phaser.GameObjects.Graphics) => {
        g.clear()

        if (props.multiple) {
          g.lineStyle(strokeWidth, color, props.selected ? alpha : alpha * 0.55)
          g.strokeRoundedRect(
            strokeWidth / 2,
            strokeWidth / 2,
            size - strokeWidth,
            size - strokeWidth,
            3
          )

          if (!props.selected) return
        } else if (!props.selected) {
          return
        }

        g.lineStyle(strokeWidth + 1, color, alpha)
        g.beginPath()
        g.moveTo(size * 0.22, size * 0.52)
        g.lineTo(size * 0.43, size * 0.72)
        g.lineTo(size * 0.8, size * 0.28)
        g.strokePath()
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
export function Dropdown<T = string>(props: DropdownProps<T>): VNodeLike {
  const localTheme = useTheme()
  const { props: themed, nestedTheme } = getThemedProps('Dropdown', localTheme, {})

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<T | T[]>(
    props.defaultValue ?? (props.multiple ? [] : ('' as T))
  )
  const [filterQuery, setFilterQuery] = useState('')

  // Refs
  const triggerRef = useRef<Phaser.GameObjects.Container | null>(null)
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
  const arrowSize = arrowConfig.size ?? 12
  const indicatorConfig = themed.selectionIndicator ?? {}
  const indicatorSize = indicatorConfig.size ?? 16
  const indicatorColor = indicatorConfig.color ?? arrowConfig.color
  const indicatorStrokeWidth = indicatorConfig.strokeWidth ?? 2
  const placement = props.placement ?? 'bottom'
  const popoverPlacement: PopoverPlacement = placement === 'top' ? 'top-start' : 'bottom-start'

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

  // Arrow rotation animation
  const targetRotation = isOpen ? Math.PI : 0
  const [arrowRotation, setArrowRotation] = useSpring(targetRotation, animationConfig)
  useForceRedraw(20, arrowRotation)

  const openDropdown = () => {
    if (props.disabled) return
    if (isOpen) return

    setIsOpen(true)
    setArrowRotation(Math.PI)
    setFilterQuery('')
    props.onOpen?.()

    const resolved = resolveEffect(props, themed as EffectDefinition)
    applyEffectByName(applyEffect, resolved.effect, resolved.effectConfig)
  }

  // Close dropdown (for click outside)
  const handleClose = () => {
    if (!isOpen) return

    setIsOpen(false)
    setArrowRotation(0)
    setFilterQuery('')
    props.onClose?.()
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openDropdown()
    } else {
      handleClose()
    }
  }

  // Select option
  const handleSelect = (value: T, event?: GestureEventData) => {
    // Stop propagation to prevent closing dropdown when clicking options
    event?.stopPropagation()

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

  // Render ALL options, use visible prop to show/hide based on filter
  // No useMemo - re-render on every filter change to ensure proper updates
  const renderedOptions = (() => {
    return props.options.map((option, _index) => {
      const isSelected = props.multiple
        ? (currentValue as T[]).includes(option.value)
        : currentValue === option.value
      const isDisabled = option.disabled ?? false

      // Check if option matches current filter
      const matchesFilter = props.isFilterable
        ? option.label.toLowerCase().includes(filterQuery.toLowerCase())
        : true

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
          visible={matchesFilter ? true : 'none'}
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
              <DefaultOptionIndicator
                selected={isSelected}
                multiple={props.multiple === true}
                disabled={isDisabled}
                color={indicatorColor ?? 0xffffff}
                size={indicatorSize}
                strokeWidth={indicatorStrokeWidth}
              />
              {option.prefix}
              <Text text={option.label} />
              {option.suffix}
            </>
          )}
        </View>
      )
    })
  })()

  // Render trigger
  const trigger = (
    <View
      ref={triggerRef}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      {...triggerStyle}
    >
      <View flex={1}>{renderSelectedValue()}</View>

      {/* Arrow */}
      <TransformOriginView
        width={arrowSize}
        height={arrowSize}
        rotation={arrowRotation.value}
        originX={0.5}
        originY={0.5}
      >
        {props.arrow ? (
          props.arrow
        ) : (
          <DefaultArrow
            color={arrowConfig.color ?? 0xffffff}
            size={arrowSize}
            strokeWidth={arrowConfig.strokeWidth ?? 2}
          />
        )}
      </TransformOriginView>
    </View>
  )

  // Render filter input
  const filterInput = props.isFilterable && (
    <CharTextInput
      value={filterQuery}
      onChange={(newValue) => {
        setFilterQuery(newValue)
      }}
      placeholder={props.filterInputPlaceholder ?? 'Filter...'}
      height={themed.filterInput?.height ?? 32}
      margin={placement === 'top' ? { top: 8 } : { bottom: 8 }}
      {...(themed.filterInput ?? {})}
    />
  )

  // Render options list
  const optionsList = (
    <View flex={1} width={'fill'}>
      <ScrollView
        ref={scrollViewRef}
        showVerticalSlider="auto"
        height="fill"
        width="100%"
        onTouch={() => {
          // Blur active element (CharTextInput) to allow scrolling
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
        }}
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
    <View
      direction="column"
      width="fill"
      height={maxHeight}
      overflow="hidden"
      theme={nestedTheme}
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
  )

  const popoverTheme: PartialTheme = {
    ...nestedTheme,
    Popover: {
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      borderWidth: 0,
      cornerRadius: 0,
      padding: 0,
      gap: 0,
    },
  }

  return (
    <View direction="column" width={props.width || 'fill'} height="auto" ref={props.ref}>
      <Popover
        trigger={trigger}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        placement={popoverPlacement}
        offset={4}
        matchTriggerWidth
        contentHeight={maxHeight}
        contentProps={{
          height: maxHeight,
          backgroundAlpha: 0,
          borderWidth: 0,
          padding: 0,
          gap: 0,
          cornerRadius: 0,
        }}
        triggerProps={{ width: props.width ?? 'fill' }}
        closeOnOutside
        closeOnEscape
        disabled={props.disabled === true}
        theme={popoverTheme}
      >
        {overlay}
      </Popover>
    </View>
  )
}
