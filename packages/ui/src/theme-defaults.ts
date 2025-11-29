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
}
