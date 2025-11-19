/**
 * Main app component with example selector
 * @param props - App props from Phaser scene
 * @returns App component JSX
 */
import { createTheme } from '@phaserjsx/ui'

export const globalTheme = createTheme({
  // the default Text theme
  Text: {
    style: {
      color: '#ffffff',
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
    backgroundColor: 0x2e1e1e,
    backgroundAlpha: 1.0,
    padding: 10,
    gap: 10,
    Text: {
      style: {
        color: '#ffffaa',
        fontSize: '30px',
      },
    },
  },

  RadioGroup: {
    labelColor: 0xffffff,
    selectedColor: 0x4ecdc4,
    unselectedColor: 0x666666,
    gap: 10,
    View: {
      cornerRadius: 8, // rounded radio buttons
    },
  },

  ScrollSlider: {
    borderColor: 0x222222,
    trackColor: 0x444444,
    thumbColor: 0xeeeedd,
    borderWidth: 2,
    minThumbSize: 30,
    size: 30,
  },

  Button: {
    disabledColor: 0x666666,
    backgroundColor: 0x4a90e2,
    backgroundAlpha: 1.0,
    borderColor: 0x357abd,
    borderWidth: 1,
    cornerRadius: 6,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    primary: {
      backgroundColor: 0x007bff,
      borderColor: 0x0056b3,
    },
    secondary: {
      backgroundColor: 0x6c757d,
      borderColor: 0x545b62,
    },
    outline: {
      backgroundColor: 0x000000,
      backgroundAlpha: 0.0,
      borderColor: 0xaa7bff,
      borderWidth: 2,
    },
    Text: {
      style: {
        color: '#ffffff',
        fontSize: '20px',
      },
    },
  },

  ExampleContainer: {
    View: {
      backgroundColor: 0x2e2e2e,
      backgroundAlpha: 1.0,
      padding: 10,
      gap: 10,
    },
  },
})
