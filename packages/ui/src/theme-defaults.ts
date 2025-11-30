/**
 * Default theme values for all components
 * This file contains the default theme configuration
 */
import type { Theme } from './theme-base'
import './theme-custom' // Import to activate declaration merging

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
    style: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial',
    },
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
    selectedColor: 0x4a9eff,
    color: 0x333333,
    gap: 8,
    size: 16,
    innerSize: 12,
    labelStyle: {
      color: '#ffffff',
      fontSize: '14px',
    },
  },
  ScrollSlider: {
    borderColor: 0x666666,
    trackColor: 0x333333,
    thumbColor: 0x999999,
    borderWidth: 1,
    size: 12,
    minThumbSize: 20,
  },
  Button: {
    disabledColor: 0x666666,
    iconSize: 24,
  },
  Sidebar: {
    backgroundColor: 0x1a1a1a,
    backgroundAlpha: 1,
    padding: 16,
    gap: 8,
  },
  Accordion: {
    animated: true,
    animationConfig: { tension: 170, friction: 26 } as const,
    headerStyle: {
      backgroundColor: 0x2a2a2a,
      padding: 12,
    },
    contentStyle: {
      backgroundColor: 0x1a1a1a,
      padding: 12,
    },
    textStyle: {
      color: '#ffffff',
      fontSize: '16px',
    },
  },
  NineSliceButton: {},
  CharText: {
    charSpacing: 0,
    cursorColor: 0xffffff,
    cursorWidth: 2,
    cursorBlinkSpeed: 500,
    selectionColor: 0x4a9eff,
    selectionAlpha: 0.3,
    lineHeight: 1.2,
    wordWrap: true,
    textStyle: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial',
    },
  },
  CharTextInput: {
    charSpacing: 0,
    cursorColor: 0xffffff,
    cursorWidth: 2,
    cursorBlinkSpeed: 500,
    selectionColor: 0x4a9eff,
    selectionAlpha: 0.3,
    lineHeight: 1.2,
    wordWrap: true,
    focusedBorderColor: 0x4a9eff,
    backgroundColor: 0x2a2a2a,
    borderColor: 0x666666,
    borderWidth: 1,
    padding: 8,
    textStyle: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial',
    },
  },
}
