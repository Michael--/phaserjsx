/**
 * Custom component theme definitions
 * This file contains theme interfaces for custom/composite components
 *
 * HOW TO ADD A NEW CUSTOM COMPONENT THEME:
 * 1. Add the theme definition to the CustomComponentThemes interface below
 * 2. Add the corresponding default values in theme-defaults.ts
 */
import type { AnimationConfig } from './animation/spring-physics'
import type { NestedComponentThemes, TextTheme, ViewTheme } from './theme-base'
import type { ChildrenType } from './types'

/**
 * Custom component themes
 */
export interface CustomComponentThemes {
  // Custom components can extend this interface via module augmentation
  // or be defined directly here for built-in custom components
  RadioButton: {
    selectedColor?: number
    color?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    gap?: number
    size?: number
    innerSize?: number
  } & NestedComponentThemes
  ScrollSlider: {
    borderColor?: number
    trackColor?: number
    thumbColor?: number
    borderWidth?: number
    size?: number
    minThumbSize?: number
  } & NestedComponentThemes
  Button: ViewTheme & {
    disabledColor?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle
    iconSize?: number
    primary?: Record<string, unknown>
    secondary?: Record<string, unknown>
    outline?: Record<string, unknown>
    small?: Record<string, unknown>
    medium?: Record<string, unknown>
    large?: Record<string, unknown>
  }
  Sidebar: {
    backgroundColor?: number
    backgroundAlpha?: number
    padding?:
      | number
      | {
          top?: number
          right?: number
          bottom?: number
          left?: number
        }
    gap?: number
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
    thumbColor?: number
    disabledColor?: number
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
        buttonVariant?: string
        prefixTint?: number
      }
      warning?: {
        prefix?: ChildrenType
        buttonVariant?: string
        prefixTint?: number
      }
      destructive?: {
        prefix?: ChildrenType
        buttonVariant?: string
        prefixTint?: number
      }
      success?: {
        prefix?: ChildrenType
        buttonVariant?: string
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
      moveUp?: number
      pulse?: boolean
    }
  } & NestedComponentThemes
}
