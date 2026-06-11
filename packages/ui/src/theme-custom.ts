/**
 * Custom component theme definitions
 * This file contains theme interfaces for custom/composite components
 *
 * HOW TO ADD A NEW CUSTOM COMPONENT THEME:
 * 1. Add the theme definition to the CustomComponentThemes interface below
 * 2. Add the corresponding default values in theme-defaults.ts
 */
import type { AnimationConfig } from './animation/spring-physics'
import type { BadgeSize, BadgeTone, BadgeVariant } from './components/custom/Badge'
import type { ButtonSize, ButtonVariant } from './components/custom/Button'
import type { PopoverPlacement } from './components/custom/Popover'
import type { SidebarSize, SidebarVariant } from './components/custom/Sidebar'
import type { EffectFn } from './effects/use-effect'
import type { NestedComponentThemes, TextTheme, ViewTheme } from './theme-base'
import type { ChildrenType } from './types'

type ButtonThemeSlot = ViewTheme & {
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle
  iconSize?: number
  effect?: string
  effectConfig?: Record<string, unknown>
}

/**
 * Custom component themes
 */
export interface CustomComponentThemes {
  // Custom components can extend this interface via module augmentation
  // or be defined directly here for built-in custom components
  RadioButton: {
    selectedColor?: number
    color?: number
    backgroundColor?: number
    borderWidth?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    gap?: number
    size?: number
    innerSize?: number
    disabledAlpha?: number
    labelPosition?: 'left' | 'right' | 'none'
  } & NestedComponentThemes
  Checkbox: {
    color?: number
    checkedColor?: number
    indeterminateColor?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    gap?: number
    size?: number
    disabledAlpha?: number
    labelPosition?: 'left' | 'right' | 'none'
  } & NestedComponentThemes
  Badge: ViewTheme & {
    tone?: BadgeTone
    variant?: BadgeVariant
    size?: BadgeSize
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    disabledAlpha?: number
    dotSize?: number
    maxCount?: number
  } & NestedComponentThemes
  Tag: ViewTheme & {
    tone?: BadgeTone
    variant?: BadgeVariant
    size?: BadgeSize
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    disabledAlpha?: number
    closeSize?: number
  } & NestedComponentThemes
  Popover: ViewTheme & {
    placement?: PopoverPlacement
    offset?: number
    depth?: number
    closeOnOutside?: boolean
    closeOnEscape?: boolean
    contentWidth?: number
    contentHeight?: number
    viewportPadding?: number
    openEffect?: EffectFn
    closeEffect?: EffectFn
    openDuration?: number
    closeDuration?: number
  } & NestedComponentThemes
  ContextMenu: ViewTheme & {
    width?: number
    itemHeight?: number
    itemGap?: number
    itemPadding?: ViewTheme['padding']
    itemCornerRadius?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    disabledTextColor?: string
    dangerTextColor?: string
    dangerBackgroundColor?: number
  } & NestedComponentThemes
  ProgressBar: ViewTheme & {
    orientation?: 'horizontal' | 'vertical'
    labelPosition?: 'none' | 'inside' | 'top' | 'bottom' | 'left' | 'right'
    trackColor?: number
    fillColor?: number
    borderColor?: number
    borderWidth?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    disabledAlpha?: number
    gap?: number
    formatValue?: (props: {
      value: number
      min: number
      max: number
      ratio: number
      percent: number
    }) => string
  } & NestedComponentThemes
  ScrollSlider: {
    borderColor?: number
    trackColor?: number
    trackCornerRadius?: number
    thumbColor?: number
    thumbActiveColor?: number
    thumbBorderColor?: number
    thumbBorderWidth?: number
    thumbCornerRadius?: number
    borderWidth?: number
    cornerRadius?: number
    size?: number
    minThumbSize?: number
  } & NestedComponentThemes
  Button: ViewTheme & {
    variant?: ButtonVariant
    size?: ButtonSize
    disabledColor?: number
    disabledAlpha?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    iconSize?: number
    effect?: string
    effectConfig?: Record<string, unknown>
    variants?: Partial<Record<ButtonVariant, ButtonThemeSlot>>
    sizes?: Partial<Record<ButtonSize, ButtonThemeSlot>>
    primary?: ButtonThemeSlot
    secondary?: ButtonThemeSlot
    outline?: ButtonThemeSlot
    ghost?: ButtonThemeSlot
    danger?: ButtonThemeSlot
    small?: ButtonThemeSlot
    medium?: ButtonThemeSlot
    large?: ButtonThemeSlot
  } & NestedComponentThemes
  Sidebar: ViewTheme & {
    variant?: SidebarVariant
    size?: SidebarSize
    variants?: Partial<Record<SidebarVariant, ViewTheme>>
    sizes?: Partial<Record<SidebarSize, ViewTheme>>
    dividerColor?: number
    dividerAlpha?: number
    headerStyle?: ViewTheme
    footerStyle?: ViewTheme
    sectionStyle?: ViewTheme & {
      titleStyle?: Phaser.Types.GameObjects.Text.TextStyle
    }
    itemStyle?: ViewTheme & {
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      active?: ViewTheme
      disabledAlpha?: number
    }
    badgeStyle?: ViewTheme & {
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    }
    scrollable?: boolean
    itemGap?: number
    sectionGap?: number
  } & NestedComponentThemes
  Accordion: ViewTheme & {
    headerStyle?: ViewTheme
    contentStyle?: ViewTheme
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    animated?: boolean
    animationConfig?: AnimationConfig
    effect?: string
    effectConfig?: Record<string, unknown>
  }
  Tabs: ViewTheme & {
    tabListStyle?: ViewTheme
    tabStyle?: ViewTheme
    tabActiveStyle?: ViewTheme
    tabDisabledStyle?: ViewTheme
    panelStyle?: ViewTheme
  }
  NineSliceButton: ViewTheme & {
    effect?: string
    effectConfig?: Record<string, unknown>
  }
  CharText: {
    disabledColor?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    charSpacing?: number
    cursorColor?: number
    cursorWidth?: number
    cursorBlinkSpeed?: number
    selectionColor?: number
    selectionAlpha?: number
    lineHeight?: number
    wordWrap?: boolean
  } & ViewTheme
  CharTextInput: {
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    charSpacing?: number
    cursorColor?: number
    cursorWidth?: number
    cursorBlinkSpeed?: number
    selectionColor?: number
    selectionAlpha?: number
    lineHeight?: number
    wordWrap?: boolean
    focusedBorderColor?: number
    disabledColor?: number
  } & ViewTheme
  Dropdown: ViewTheme & {
    trigger?: ViewTheme
    triggerHover?: ViewTheme
    triggerOpen?: ViewTheme
    triggerDisabled?: ViewTheme
    arrow?: {
      color?: number
      size?: number
      strokeWidth?: number
    }
    selectionIndicator?: {
      color?: number
      size?: number
      strokeWidth?: number
    }
    overlay?: ViewTheme & {
      maxHeight?: number
    }
    option?: ViewTheme
    optionSelected?: ViewTheme & {
      Text?: TextTheme
    }
    optionDisabled?: ViewTheme
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    placeholderStyle?: Phaser.Types.GameObjects.Text.TextStyle
    filterInput?: ViewTheme & {
      height?: number
    }
    animationConfig?: AnimationConfig
    optionGap?: number
    effect?: string
    effectConfig?: Record<string, unknown>
  }
  Slider: ViewTheme & {
    // Track styling
    trackColor?: number
    trackFilledColor?: number
    trackHeight?: number
    trackBorderRadius?: number
    trackLength?: number
    trackHoverColor?: number

    // Thumb styling
    thumbColor?: number
    thumbSize?: number
    thumbBorderColor?: number
    thumbBorderWidth?: number
    thumbHoverColor?: number
    thumbActiveColor?: number
    thumbDragScale?: number

    // Marks/Ticks
    markColor?: number
    markHeight?: number
    markWidth?: number

    // Value label
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    labelOffset?: number
    valueLabel?: {
      backgroundColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      padding?: number | { left?: number; right?: number; top?: number; bottom?: number }
      cornerRadius?: number
      offset?: number
    }

    // RangeSlider specific
    minDistance?: number

    // States
    disabledAlpha?: number

    // Animation & Effects
    animated?: boolean
    animationConfig?: AnimationConfig
    effect?: string
    effectConfig?: Record<string, unknown>
  }
  Toggle: {
    width?: number
    height?: number
    thumbSize?: number
    trackColorOff?: number
    trackColorOn?: number
    trackBorderColorOff?: number
    trackBorderColorOn?: number
    trackBorderWidth?: number
    thumbColor?: number
    thumbBorderColor?: number
    thumbBorderWidth?: number
    disabledColor?: number
    disabledAlpha?: number
    padding?: number
    duration?: number
    gap?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    labelPosition?: 'left' | 'right' | 'none'
  } & NestedComponentThemes
  Modal: {
    backdropColor?: number
    backdropOpacity?: number
  } & NestedComponentThemes
  Dialog: ViewTheme & {
    showClose?: boolean
    maxWidth?: number
    prefix?: ChildrenType
    closeIcon?: ChildrenType
    Header?: ViewTheme & {
      gap?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      closeButton?: {
        size?: number
        cornerRadius?: number
        backgroundColor?: number
        borderColor?: number
        borderWidth?: number
      }
    }
    Content?: ViewTheme & {
      gap?: number
    }
    Actions?: ViewTheme & {
      gap?: number
      justifyContent?:
        | 'start'
        | 'center'
        | 'end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    }
  }
  AlertDialog: {
    maxWidth?: number
    variants?: {
      info?: {
        prefix?: ChildrenType
        buttonVariant?: ButtonVariant
        prefixTint?: number
      }
      warning?: {
        prefix?: ChildrenType
        buttonVariant?: ButtonVariant
        prefixTint?: number
      }
      destructive?: {
        prefix?: ChildrenType
        buttonVariant?: ButtonVariant
        prefixTint?: number
      }
      success?: {
        prefix?: ChildrenType
        buttonVariant?: ButtonVariant
        prefixTint?: number
      }
    }
  } & NestedComponentThemes
  WrapText: {
    wrap?: boolean
    paddingOffset?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    minWidth?: number
  } & NestedComponentThemes
  Tooltip: {
    /** Preferred position */
    position?: 'top' | 'bottom' | 'left' | 'right'
    /** Show delay in ms */
    showDelay?: number
    /** Hide delay in ms */
    hideDelay?: number
    /** Offset from target */
    offset?: number

    /** Text style */
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    /** Background corner radius */
    cornerRadius?: number

    /** Default animation config */
    animation?: {
      fadeIn?: number
      fadeOut?: number
      move?: { dx?: number; dy?: number }
      pulse?: boolean
    }
  } & NestedComponentThemes
}
