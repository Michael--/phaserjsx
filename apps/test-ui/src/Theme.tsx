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
        //backgroundColor: 0x000000,
        //cornerRadius: 0,
        //backgroundAlpha: 0,
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

      RadioButton: {
        color: colors.border.medium.toNumber(),
        selectedColor: colors.accent.darkest.toNumber(),
        labelStyle: { color: colors.text.DEFAULT.toString(), fontSize: 14 },
        gap: 10,
        size: 16,
        innerSize: 16,
        View: {
          padding: 2,
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

      CharText: {
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 2,
        cornerRadius: 6,
        padding: 10,
        textStyle: {
          color: colors.text.toString(),
          fontSize: '20px',
          fontFamily: 'Arial',
        },
        cursorColor: colors.accent.DEFAULT.toNumber(),
        cursorWidth: 3,
        cursorBlinkSpeed: 200,
      },

      CharTextInput: {
        textStyle: {
          color: colors.text.DEFAULT.toString(),
          fontSize: '20px',
          fontFamily: 'Arial',
        },
        charSpacing: 2,
        cursorColor: colors.accent.DEFAULT.toNumber(),
        cursorWidth: 3,
        cursorBlinkSpeed: 200,
        selectionColor: colors.accent.light.toNumber(),
        selectionAlpha: 0.5,
        lineHeight: 1.2,
        wordWrap: false,
        focusedBorderColor: colors.accent.lightest.toNumber(),
        disabledColor: colors.border.dark.toNumber(),
      },

      Accordion: {
        effect: 'wobble',
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
        iconSize: 24,
        textStyle: {
          color: colors.text.DEFAULT.toString(),
          fontSize: '18px',
        },
      },

      ScrollSlider: {
        borderColor: colors.border.dark.toNumber(),
        trackColor: colors.surface.dark.toNumber(),
        thumbColor: colors.primary.light.toNumber(),
        borderWidth: 2,
        minThumbSize: 30,
        size: 24,
      },

      Button: {
        disabledColor: colors.border.medium.toNumber(),
        backgroundColor: colors.primary.DEFAULT.toNumber(),
        backgroundAlpha: 1.0,
        borderColor: colors.primary.dark.toNumber(),
        borderWidth: 1,
        cornerRadius: 6,
        padding: 8,
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: '18px',
        },
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
          iconSize: 16,
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
          padding: { top: 12, bottom: 12, left: 8, right: 8 },
          cornerRadius: 8,
          iconSize: 32,
          textStyle: {
            fontSize: '24px',
          },
        },
      },

      ExampleContainer: {
        View: {
          //backgroundColor: colors.surface.DEFAULT.toNumber(),
          //backgroundAlpha: 0.1,
          // padding: 10,
          //gap: 10,
          //cornerRadius: 0,
        },
      },
    },
    preset
  )
}

// Initial theme with default preset
export const globalTheme = createAppTheme('oceanBlue', 'light')
