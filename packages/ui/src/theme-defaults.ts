/**
 * Default theme values for all components
 * This file contains the default theme configuration
 * Uses oceanBlue preset with light mode for consistent, semantic colors
 */
import { getPresetWithMode } from './colors/color-presets'
import { createTextStyleTokens } from './design-tokens/design-token-presets'
import type { Theme } from './theme-base'
import './theme-custom' // Import to activate declaration merging

// Get oceanBlue preset with light mode
const preset = getPresetWithMode('oceanBlue', 'light')
const { colors } = preset
const textStyles = createTextStyleTokens(colors.text.DEFAULT.toString())

/**
 * Default theme values for all built-in and custom components
 */
export const defaultTheme: Theme = {
  View: {
    alpha: 1,
    visible: true,
  },
  Text: {
    text: '',
    align: 'left',
    alpha: 1,
    visible: true,
    style: textStyles.DEFAULT,
  },
  NineSlice: {
    alpha: 1,
    visible: true,
  },
  Sprite: {
    alpha: 1,
    visible: true,
  },
  Image: {
    alpha: 1,
    visible: true,
  },
  Graphics: {
    alpha: 1,
    visible: true,
  },
  TileSprite: {
    alpha: 1,
    visible: true,
  },
  RadioButton: {
    selectedColor: colors.primary.DEFAULT.toNumber(),
    color: colors.border.medium.toNumber(),
    gap: 8,
    size: 16,
    innerSize: 12,
    labelStyle: {
      color: colors.text.DEFAULT.toString(),
      fontSize: '14px',
    },
  },
  ScrollSlider: {
    borderColor: colors.border.medium.toNumber(),
    trackColor: colors.surface.dark.toNumber(),
    thumbColor: colors.primary.light.toNumber(),
    borderWidth: 1,
    size: 12,
    minThumbSize: 20,
  },
  Button: {
    disabledColor: colors.border.medium.toNumber(),
    iconSize: 24,
  },
  Sidebar: {
    backgroundColor: colors.surface.light.toNumber(),
    backgroundAlpha: 1,
    padding: 16,
    gap: 8,
  },
  Accordion: {
    animated: true,
    animationConfig: { tension: 170, friction: 26 } as const,
    headerStyle: {
      backgroundColor: colors.surface.dark.toNumber(),
      padding: 12,
    },
    contentStyle: {
      backgroundColor: colors.surface.light.toNumber(),
      padding: 12,
    },
    textStyle: {
      color: colors.text.DEFAULT.toString(),
      fontSize: '16px',
    },
  },
  NineSliceButton: {},
  CharText: {
    charSpacing: 0,
    cursorColor: colors.text.DEFAULT.toNumber(),
    cursorWidth: 2,
    cursorBlinkSpeed: 500,
    selectionColor: colors.primary.DEFAULT.toNumber(),
    selectionAlpha: 0.3,
    lineHeight: 1.2,
    wordWrap: true,
    textStyle: textStyles.DEFAULT,
  },
  CharTextInput: {
    charSpacing: 0,
    cursorColor: colors.text.DEFAULT.toNumber(),
    cursorWidth: 2,
    cursorBlinkSpeed: 500,
    selectionColor: colors.primary.DEFAULT.toNumber(),
    selectionAlpha: 0.3,
    lineHeight: 1.2,
    wordWrap: true,
    focusedBorderColor: colors.primary.DEFAULT.toNumber(),
    backgroundColor: colors.surface.medium.toNumber(),
    borderColor: colors.border.medium.toNumber(),
    borderWidth: 1,
    padding: 8,
    textStyle: textStyles.DEFAULT,
  },
  Dropdown: {
    trigger: {
      backgroundColor: colors.surface.medium.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 4,
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      width: 'fill',
    },
    triggerHover: {
      borderColor: colors.primary.DEFAULT.toNumber(),
    },
    triggerOpen: {
      borderColor: colors.primary.DEFAULT.toNumber(),
      backgroundColor: colors.surface.dark.toNumber(),
    },
    triggerDisabled: {
      backgroundColor: colors.surface.light.toNumber(),
      alpha: 0.5,
    },
    arrow: {
      color: colors.text.DEFAULT.toNumber(),
      size: 12,
    },
    overlay: {
      backgroundColor: colors.surface.medium.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 4,
      maxHeight: 300,
      padding: 4,
    },
    option: {
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
    },
    optionSelected: {
      backgroundColor: colors.primary.light.toNumber(),
      Text: {
        style: textStyles.DEFAULT,
      },
    },
    optionDisabled: {
      alpha: 0.3,
    },
    textStyle: textStyles.DEFAULT,
    placeholderStyle: textStyles.DEFAULT,
    filterInput: {
      backgroundColor: colors.surface.lightest.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      //height: 32,
    },
    animationConfig: 'stiff',
    optionGap: 2,
  },
  Slider: {
    // Track styling
    trackColor: colors.surface.dark.toNumber(),
    trackFilledColor: colors.primary.DEFAULT.toNumber(),
    trackHeight: 6,
    trackBorderRadius: 3,
    trackLength: 200,
    trackHoverColor: colors.surface.medium.toNumber(),

    // Thumb styling
    thumbColor: colors.primary.DEFAULT.toNumber(),
    thumbSize: 20,
    thumbBorderColor: colors.border.light.toNumber(),
    thumbBorderWidth: 2,
    thumbHoverColor: colors.primary.light.toNumber(),
    thumbActiveColor: colors.primary.dark.toNumber(),
    thumbDragScale: 1.1,

    // Marks/Ticks
    markColor: colors.border.medium.toNumber(),
    markHeight: 8,
    markWidth: 2,

    // Value label
    labelStyle: textStyles.small,
    labelOffset: 10,
    valueLabel: {
      backgroundColor: colors.surface.darkest.toNumber(),
      textStyle: { ...textStyles.small, color: colors.text.light.toString() },
      padding: { left: 6, right: 6, top: 4, bottom: 4 },
      cornerRadius: 4,
      offset: 8,
    },

    // RangeSlider specific
    minDistance: 0,

    // States
    disabledAlpha: 0.4,

    // Animation & Effects
    animationConfig: { tension: 300, friction: 30 } as const,
  },
}
