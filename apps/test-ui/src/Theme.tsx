/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
import { createTheme, getPresetWithMode, type PresetName } from '@phaserjsx/ui'

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
          color: colors.text.DEFAULT.toString(),
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
        backgroundColor: colors.surface.light.toNumber(),
        backgroundAlpha: 1.0,
        padding: 10,
        gap: 10,
        Text: {
          style: {
            color: colors.text.light.toString(),
            fontSize: '30px',
          },
        },
      },

      RadioGroup: {
        labelColor: colors.text.DEFAULT.toNumber(),
        selectedColor: colors.accent.DEFAULT.toNumber(),
        unselectedColor: colors.border.medium.toNumber(),
        gap: 10,
        View: {
          cornerRadius: 8, // rounded radio buttons
        },
      },

      ScrollSlider: {
        borderColor: colors.border.dark.toNumber(),
        trackColor: colors.surface.dark.toNumber(),
        thumbColor: colors.primary.light.toNumber(),
        borderWidth: 2,
        minThumbSize: 30,
        size: 30,
      },

      Button: {
        disabledColor: colors.border.medium.toNumber(),
        backgroundColor: colors.primary.DEFAULT.toNumber(),
        backgroundAlpha: 1.0,
        borderColor: colors.primary.dark.toNumber(),
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
          backgroundColor: colors.primary.medium.toNumber(),
          borderColor: colors.primary.dark.toNumber(),
          effect: 'pulse',
          effectConfig: { intensity: 1.2, time: 150 },
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
          //backgroundColor: colors.surface.DEFAULT.toNumber(),
          //backgroundAlpha: 0.1,
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
