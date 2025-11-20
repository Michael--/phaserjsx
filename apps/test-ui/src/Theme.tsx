/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
import { createTheme, getPresetWithMode, hexToNumber, type PresetName } from '@phaserjsx/ui'

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

  return createTheme(
    {
      // the default Text theme
      Text: {
        style: {
          color: colors.text.DEFAULT,
          fontSize: '20px',
          fontFamily: 'Arial',
        },
      },
      // the default View theme is transparent
      View: {
        backgroundColor: 0x000000,
        cornerRadius: 0,
        backgroundAlpha: 0,
      },

      // custom component theme for Sidebar
      Sidebar: {
        backgroundColor: hexToNumber(colors.surface.light),
        backgroundAlpha: 1.0,
        padding: 10,
        gap: 10,
        Text: {
          style: {
            color: colors.text.light,
            fontSize: '30px',
          },
        },
      },

      RadioGroup: {
        labelColor: hexToNumber(colors.text.DEFAULT),
        selectedColor: hexToNumber(colors.accent.DEFAULT),
        unselectedColor: hexToNumber(colors.border.medium),
        gap: 10,
        View: {
          cornerRadius: 8, // rounded radio buttons
        },
      },

      ScrollSlider: {
        borderColor: hexToNumber(colors.border.dark),
        trackColor: hexToNumber(colors.surface.dark),
        thumbColor: hexToNumber(colors.primary.light),
        borderWidth: 2,
        minThumbSize: 30,
        size: 30,
      },

      Button: {
        disabledColor: hexToNumber(colors.border.medium),
        backgroundColor: hexToNumber(colors.primary.DEFAULT),
        backgroundAlpha: 1.0,
        borderColor: hexToNumber(colors.primary.dark),
        borderWidth: 1,
        cornerRadius: 6,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        effect: 'pulse',
        effectConfig: { intensity: 1.1, time: 100 },
        textStyle: {
          color: '#ffffff',
          fontSize: '18px',
        },
        primary: {
          backgroundColor: hexToNumber(colors.primary.medium),
          borderColor: hexToNumber(colors.primary.dark),
          effect: 'pulse',
          effectConfig: { intensity: 1.2, time: 150 },
        },
        secondary: {
          backgroundColor: hexToNumber(colors.secondary.DEFAULT),
          borderColor: hexToNumber(colors.secondary.dark),
          effect: 'press',
          effectConfig: { intensity: 0.9, time: 200 },
        },
        outline: {
          backgroundColor: 0x000000,
          backgroundAlpha: 0.0,
          borderColor: hexToNumber(colors.accent.DEFAULT),
          borderWidth: 2,
          effect: 'flash',
          effectConfig: { intensity: 1.15, time: 200 },
        },
        small: {
          padding: 6,
          cornerRadius: 4,
          textStyle: {
            fontSize: '14px',
          },
        },
        medium: {
          padding: 8,
          cornerRadius: 6,
          textStyle: {
            fontSize: '18px',
          },
        },
        large: {
          padding: 12,
          cornerRadius: 8,
          textStyle: {
            fontSize: '24px',
          },
        },
      },

      ExampleContainer: {
        View: {
          backgroundColor: hexToNumber(colors.surface.DEFAULT),
          backgroundAlpha: 1.0,
          padding: 10,
          gap: 10,
        },
      },
    },
    preset
  )
}

// Initial theme with default preset
export const globalTheme = createAppTheme('oceanBlue', 'light')
