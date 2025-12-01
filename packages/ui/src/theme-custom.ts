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
    trackColor?: number
    trackFilledColor?: number
    trackHeight?: number
    trackBorderRadius?: number
    trackLength?: number
    thumbColor?: number
    thumbSize?: number
    thumbBorderColor?: number
    thumbBorderWidth?: number
    markColor?: number
    markHeight?: number
    markWidth?: number
    labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    labelOffset?: number
    valueLabel?: {
      backgroundColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      padding?: number | { left?: number; right?: number; top?: number; bottom?: number }
      cornerRadius?: number
      offset?: number
    }
    disabledAlpha?: number
    animated?: boolean
    animationConfig?: AnimationConfig
    effect?: string
    effectConfig?: Record<string, unknown>
  }
}
