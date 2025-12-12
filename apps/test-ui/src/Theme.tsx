/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
import {
  createDefaultTheme,
  createTheme,
  getPresetWithMode,
  themeRegistry,
  type PresetName,
} from '@number10/phaserjsx'
import { Icon } from './components'

/**
 * Create theme from preset and mode
 * @param presetName - Preset to use
 * @param mode - Color mode (light or dark)
 * @returns Generated theme
 */
export function createAppTheme(
  presetName: PresetName = 'oceanBlue',
  mode: 'light' | 'dark' = 'light'
) {
  const preset = getPresetWithMode(presetName, mode)
  const { colors } = preset
  const baseTheme = createDefaultTheme(presetName, mode)
  themeRegistry.setGlobalTheme(baseTheme)

  return createTheme(
    {
      // the default Text theme
      Text: {
        style: {
          color: colors.text.DEFAULT.toString(),
          fontSize: '20px',
          fontFamily: 'Arial',
        },
      },

      // custom component theme for Sidebar
      Sidebar: {
        backgroundColor: colors.surface.light.toNumber(),
        backgroundAlpha: 1.0,
        padding: 10,
        gap: 10,
        Text: {
          style: {
            color: colors.text.light.toString(),
            fontSize: '20px',
          },
        },
        View: {
          gap: 5,
        },
        Accordion: {
          animated: true,
          animationConfig: 'default',
        },
      },

      Checkbox: {
        color: colors.border.medium.toNumber(),
        labelStyle: { color: colors.text.DEFAULT.toString(), fontSize: 14 },
        gap: 10,
        size: 24,
        View: {
          padding: 0,
        },
      },

      Icon: {
        size: 24,
        tint: colors.text.DEFAULT.toNumber(),
      },

      Accordion: {
        effect: 'wobble',
      },

      IconButton: {
        textStyle: {
          color: colors.text.DEFAULT.toString(),
          fontSize: '18px',
        },
        iconSize: 24,
        primary: {
          textStyle: {
            color: colors.text.DEFAULT.toString(),
          },
        },
        secondary: {
          textStyle: {
            color: colors.text.DEFAULT.toString(),
          },
        },
        outline: {
          textStyle: {
            color: colors.accent.DEFAULT.toString(),
          },
        },
        small: {
          iconSize: 16,
          textStyle: {
            fontSize: '14px',
          },
        },
        medium: {
          iconSize: 24,
          textStyle: {
            fontSize: '18px',
          },
        },
        large: {
          iconSize: 32,
          textStyle: {
            fontSize: '24px',
          },
        },
      },

      AlertDialog: {
        variants: {
          info: {
            prefix: <Icon type="info-circle" size={24} />,
          },
          warning: {
            prefix: <Icon type="exclamation-triangle" size={24} />,
          },
          destructive: {
            prefix: <Icon type="trash" size={24} />,
          },
          success: {
            prefix: <Icon type="check-circle" size={24} />,
          },
        },
      },
    },
    preset
  )
}

// Initial theme with default preset
export const globalTheme = createAppTheme('oceanBlue', 'light')
