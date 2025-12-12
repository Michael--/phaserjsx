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
  // Primitives (lowercase) - share same defaults as uppercase
  view: {
    alpha: 1,
    visible: true,
  },
  Icon: {
    size: 24,
    tint: colors.border.dark.toNumber(),
  },
  text: {
    text: '',
    alpha: 1,
    visible: true,
    style: textStyles.DEFAULT,
  },
  nineslice: {
    alpha: 1,
    visible: true,
  },
  sprite: {
    alpha: 1,
    visible: true,
  },
  image: {
    alpha: 1,
    visible: true,
  },
  graphics: {
    alpha: 1,
    visible: true,
  },
  tilesprite: {
    alpha: 1,
    visible: true,
  },
  // Public API (uppercase)
  View: {
    alpha: 1,
    visible: true,
  },
  Text: {
    text: '',
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
    borderColor: colors.border.dark.toNumber(),
    trackColor: colors.surface.dark.toNumber(),
    thumbColor: colors.primary.dark.toNumber(),
    borderWidth: 2,
    minThumbSize: 30,
    size: 24,
  },
  Button: {
    disabledColor: colors.background.DEFAULT.toNumber(),
    iconSize: 24,
    backgroundColor: colors.primary.DEFAULT.toNumber(),
    backgroundAlpha: 1.0,
    borderColor: colors.primary.dark.toNumber(),
    borderWidth: 1,
    cornerRadius: 6,
    padding: 8,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    primary: {
      backgroundColor: colors.primary.medium.toNumber(),
      borderColor: colors.primary.dark.toNumber(),
    },
    secondary: {
      backgroundColor: colors.secondary.DEFAULT.toNumber(),
      borderColor: colors.secondary.dark.toNumber(),
      effect: 'press',
      effectConfig: { intensity: 0.9, time: 200 },
    },
    outline: {
      backgroundColor: 0x000000,
      backgroundAlpha: 0.0,
      borderColor: colors.accent.DEFAULT.toNumber(),
      borderWidth: 2,
      effect: 'flash',
      effectConfig: { intensity: 1.15, time: 200 },
    },
    small: {
      padding: 6,
      cornerRadius: 4,
    },
    medium: {
      padding: 8,
      cornerRadius: 6,
    },
    large: {
      padding: { top: 12, bottom: 12, left: 8, right: 8 },
      cornerRadius: 8,
    },
  },
  Sidebar: {
    variant: 'solid',
    size: 'md',
    backgroundColor: colors.surface.light.toNumber(),
    backgroundAlpha: 1,
    padding: 16,
    gap: 8,
    dividerColor: colors.border.light.toNumber(),
    itemGap: 8,
    sectionGap: 10,
    headerStyle: {
      gap: 10,
      padding: { bottom: 6 },
      width: 'fill',
    },
    footerStyle: {
      gap: 8,
      padding: { top: 6 },
      width: 'fill',
    },
    sectionStyle: {
      gap: 8,
      padding: { top: 4, bottom: 8 },
      width: 'fill',
      titleStyle: {
        ...textStyles.medium,
        color: colors.text.dark.toString(),
        fontStyle: 'bold',
      },
    },
    itemStyle: {
      gap: 8,
      padding: { top: 8, bottom: 8, left: 10, right: 10 },
      width: 'fill',
      cornerRadius: 8,
      backgroundColor: colors.surface.lightest.toNumber(),
      textStyle: {
        ...textStyles.medium,
        color: colors.text.dark.toString(),
      },
      active: {
        backgroundColor: colors.primary.lightest.toNumber(),
        borderColor: colors.primary.light.toNumber(),
        borderWidth: 1,
        backgroundAlpha: 0.9,
      },
      disabledAlpha: 0.5,
    },
    badgeStyle: {
      backgroundColor: colors.primary.light.toNumber(),
      backgroundAlpha: 0.15,
      cornerRadius: 6,
      padding: { top: 4, bottom: 4, left: 8, right: 8 },
      textStyle: {
        ...textStyles.small,
        color: colors.primary.dark.toString(),
        fontStyle: 'bold',
      },
    },
    variants: {
      solid: {
        backgroundColor: colors.surface.light.toNumber(),
        borderColor: colors.border.light.toNumber(),
        borderWidth: 1,
      },
      muted: {
        backgroundColor: colors.surface.medium.toNumber(),
        backgroundAlpha: 0.85,
        borderColor: colors.border.light.toNumber(),
        borderWidth: 1,
      },
      ghost: {
        backgroundColor: colors.background.lightest.toNumber(),
        backgroundAlpha: 0.6,
        borderWidth: 0,
      },
      inset: {
        backgroundColor: colors.surface.dark.toNumber(),
        backgroundAlpha: 1,
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
      },
    },
    sizes: {
      sm: {
        padding: 10,
        gap: 6,
      },
      md: {
        padding: 16,
        gap: 8,
      },
      lg: {
        padding: { top: 20, bottom: 20, left: 16, right: 16 },
        gap: 12,
      },
    },
  },
  Accordion: {
    effect: 'none',
    effectConfig: { magnitude: 0.02, time: 150 },
    headerStyle: {
      backgroundColor: colors.surface.dark.toNumber(),
      padding: 10,
      gap: 10,
      cornerRadius: 5,
      width: 'fill',
    },
    contentStyle: {
      backgroundColor: colors.surface.light.toNumber(),
      padding: 10,
      cornerRadius: 5,
      width: 'fill',
    },
    Icon: {
      size: 24,
    },
    textStyle: {
      color: colors.text.DEFAULT.toString(),
      fontSize: '18px',
    },
  },
  NineSliceButton: {},
  CharText: {
    charSpacing: 0,
    cursorColor: colors.accent.DEFAULT.toNumber(),
    cursorWidth: 3,
    cursorBlinkSpeed: 200,
    selectionAlpha: 0.3,
    lineHeight: 1.2,
    wordWrap: true,
    textStyle: textStyles.DEFAULT,
    borderColor: colors.border.medium.toNumber(),
    borderWidth: 2,
    cornerRadius: 6,
    padding: 10,
  },
  CharTextInput: {
    charSpacing: 2,
    cursorColor: colors.accent.DEFAULT.toNumber(),
    cursorWidth: 3,
    cursorBlinkSpeed: 200,
    selectionColor: colors.accent.light.toNumber(),
    selectionAlpha: 0.5,
    lineHeight: 1.2,
    wordWrap: false,
    disabledColor: colors.border.dark.toNumber(),
    focusedBorderColor: colors.accent.lightest.toNumber(),
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
    trackFilledColor: colors.primary.dark.toNumber(),
    trackHeight: 6,
    trackBorderRadius: 3,
    trackLength: 200,
    trackHoverColor: colors.surface.dark.toNumber(),

    // Thumb styling
    thumbColor: colors.primary.light.toNumber(),
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
      backgroundColor: colors.background.dark.toNumber(),
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
  Toggle: {
    width: 50,
    height: 28,
    thumbSize: 24,
    trackColorOff: colors.surface.dark.toNumber(),
    trackColorOn: colors.success.DEFAULT.toNumber(),
    thumbColor: colors.surface.lightest.toNumber(),
    disabledColor: colors.border.medium.toNumber(),
    padding: 2,
    duration: 200,
    gap: 8,
    labelStyle: textStyles.DEFAULT,
    labelPosition: 'right',
  },
  Modal: {
    backdropColor: 0x000000,
    backdropOpacity: 0.5,
  },
  Dialog: {
    backgroundColor: colors.surface.DEFAULT.toNumber(),
    borderColor: colors.border.light.toNumber(),
    borderWidth: 1,
    cornerRadius: 8,
    padding: 0,
    maxWidth: 600,
    showClose: true,
    Header: {
      padding: { left: 24, right: 24, top: 20, bottom: 16 },
      gap: 12,
      textStyle: textStyles.heading,
      closeButton: {
        size: 32,
        cornerRadius: 4,
        backgroundColor: colors.surface.dark.toNumber(),
        borderColor: colors.border.light.toNumber(),
        borderWidth: 1,
      },
    },
    Content: {
      padding: { left: 24, right: 24, top: 16, bottom: 16 },
      gap: 12,
    },
    Actions: {
      padding: { left: 24, right: 24, top: 16, bottom: 20 },
      gap: 12,
      justifyContent: 'end',
    },
  },
  AlertDialog: {
    maxWidth: 500,
  },
  WrapText: {
    wrap: true,
    paddingOffset: 0,
    textStyle: textStyles.DEFAULT,
  },
  Tooltip: {
    position: 'top',
    showDelay: 1000,
    hideDelay: 500,
    offset: 8,
    textStyle: {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: colors.text.dark.toString(),
      backgroundColor: colors.warning.medium.toString(),
      padding: { x: 2, y: 2 },
    },
    cornerRadius: 8,
    animation: {
      fadeIn: 200,
      fadeOut: 200,
      move: { dx: 0, dy: -20 },
      pulse: false,
    },
  },
}
