/**
 * Default theme values for all components
 * This file contains the default theme configuration
 * Uses oceanBlue preset with light mode for consistent, semantic colors
 */
import { getPresetWithMode, type PresetName } from './colors/color-presets'
import type { ColorTokens } from './colors/color-types'
import { createTextStyleTokens } from './design-tokens/design-token-presets'
import type { Theme } from './theme-base'
import './theme-custom' // Import to activate declaration merging

function buildDefaultTheme(colors: ColorTokens): Theme {
  const textStyles = createTextStyleTokens(colors.text.DEFAULT.toString())

  /**
   * Default theme values for all built-in and custom components
   */
  return {
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
    particles: {
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
    Particles: {
      alpha: 1,
      visible: true,
    },
    RadioButton: {
      selectedColor: colors.primary.DEFAULT.toNumber(),
      color: colors.border.dark.toNumber(),
      borderWidth: 2,
      gap: 8,
      size: 18,
      innerSize: 8,
      disabledAlpha: 0.5,
      labelPosition: 'right',
      labelStyle: {
        color: colors.text.DEFAULT.toString(),
        fontSize: '14px',
      },
    },
    Checkbox: {
      checkedColor: colors.primary.DEFAULT.toNumber(),
      indeterminateColor: colors.primary.medium.toNumber(),
      color: colors.border.medium.toNumber(),
      gap: 10,
      size: 20,
      disabledAlpha: 0.5,
      labelPosition: 'right',
      labelStyle: {
        color: colors.text.DEFAULT.toString(),
        fontSize: '14px',
      },
    },
    ColorPicker: {
      backgroundColor: colors.surface.dark.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: 14,
      gap: 18,
      previewSize: 116,
      previewGap: 10,
      previewBorderWidth: 2,
      previewCornerRadius: 8,
      trackLength: 280,
      trackHeight: 14,
      gradientSteps: 32,
      controlGap: 12,
      controlBackgroundColor: colors.surface.medium.toNumber(),
      controlBackgroundAlpha: 0.65,
      closeButtonSize: 24,
      closeButtonCornerRadius: 5,
      thumbSize: 18,
      thumbBorderColor: colors.surface.lightest.toNumber(),
      swatchSize: 18,
      swatchGap: 6,
      swatchCornerRadius: 4,
      labelStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
      },
      valueStyle: {
        ...textStyles.small,
        color: colors.text.DEFAULT.toString(),
      },
      titleStyle: {
        ...textStyles.medium,
        color: colors.text.DEFAULT.toString(),
        fontStyle: 'bold',
      },
      hexStyle: {
        ...textStyles.small,
        color: '#ffffff',
        fontStyle: 'bold',
      },
      labels: {
        title: 'Color Picker',
        tone: 'Tone',
        vivid: 'Vivid',
        muted: 'Muted',
        hue: 'Hue',
        saturation: 'Saturation',
        lightness: 'Lightness',
        close: 'X',
      },
      RadioButton: {
        labelStyle: {
          ...textStyles.small,
          color: colors.text.DEFAULT.toString(),
        },
        size: 16,
        innerSize: 7,
        gap: 6,
      },
    },
    PalettePicker: {
      columns: 6,
      swatchSize: 28,
      swatchGap: 8,
      rowGap: 8,
      itemWidth: 28,
      swatchCornerRadius: 5,
      swatchBorderColor: colors.border.medium.toNumber(),
      swatchBorderWidth: 1,
      swatchSelectedBorderColor: colors.surface.lightest.toNumber(),
      swatchSelectedBorderWidth: 3,
      swatchDisabledAlpha: 0.45,
      selectedCheckColor: colors.surface.lightest.toNumber(),
      disabledAlpha: 0.5,
      showTitle: true,
      showHex: false,
      padding: 0,
      gap: 10,
      titleStyle: {
        ...textStyles.medium,
        color: colors.text.DEFAULT.toString(),
        fontStyle: 'bold',
      },
      emptyStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
      },
      hexStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
      },
      labels: {
        title: 'Palette',
        empty: 'No colors',
      },
    },
    NumberInput: {
      gap: 10,
      padding: 0,
      valueWidth: 78,
      controlHeight: 34,
      controlGap: 0,
      buttonControlSize: 34,
      buttonGap: 0,
      buttonPlacement: 'split',
      buttonDirection: 'row',
      buttonVariant: 'secondary',
      buttonSize: 'small',
      buttonTextStyle: {
        ...textStyles.DEFAULT,
        fontStyle: 'bold',
      },
      buttonIndicatorColor: colors.text.DEFAULT.toNumber(),
      buttonIndicatorActiveColor: colors.surface.DEFAULT.toNumber(),
      labelPosition: 'left',
      valueBackgroundColor: colors.surface.light.toNumber(),
      valueBackgroundAlpha: 1,
      valueBorderColor: colors.border.medium.toNumber(),
      valueBorderWidth: 1,
      valueCornerRadius: 0,
      valuePadding: { left: 6, right: 6, top: 4, bottom: 4 },
      disabledAlpha: 0.5,
      repeatOnHold: true,
      holdDelay: 350,
      repeatInterval: 90,
      labelStyle: {
        ...textStyles.medium,
        color: colors.text.DEFAULT.toString(),
      },
      valueStyle: {
        ...textStyles.medium,
        color: colors.text.DEFAULT.toString(),
        fontStyle: 'bold',
      },
      labels: {
        decrement: '-',
        increment: '+',
        value: 'Value',
      },
      Button: {
        minWidth: 34,
        width: 34,
        height: 34,
        padding: 0,
        cornerRadius: 0,
        backgroundColor: colors.primary.medium.toNumber(),
        borderColor: colors.primary.dark.toNumber(),
        borderWidth: 1,
        textStyle: {
          ...textStyles.DEFAULT,
          fontStyle: 'bold',
        },
      },
    },
    SegmentedControl: {
      orientation: 'horizontal',
      size: 'medium',
      variant: 'solid',
      backgroundColor: colors.surface.dark.toNumber(),
      backgroundAlpha: 0.95,
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: 3,
      gap: 8,
      segmentGap: 0,
      segmentWidth: 88,
      segmentHeight: 34,
      segmentPadding: { left: 10, right: 10, top: 6, bottom: 6 },
      segmentCornerRadius: 6,
      segmentStyle: {
        backgroundColor: colors.surface.dark.toNumber(),
        backgroundAlpha: 0,
        borderWidth: 0,
      },
      segmentHoverStyle: {
        backgroundColor: colors.surface.medium.toNumber(),
        backgroundAlpha: 0.55,
      },
      segmentSelectedStyle: {
        backgroundColor: colors.primary.medium.toNumber(),
        backgroundAlpha: 1,
        borderColor: colors.primary.dark.toNumber(),
        borderWidth: 1,
      },
      segmentDisabledStyle: {
        alpha: 0.45,
      },
      iconGap: 6,
      iconSize: 16,
      disabledAlpha: 0.5,
      labelPosition: 'none',
      labelStyle: {
        ...textStyles.medium,
        color: colors.text.DEFAULT.toString(),
      },
      textStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
        fontStyle: 'bold',
      },
      selectedTextStyle: {
        color: colors.text.lightest.toString(),
        fontStyle: 'bold',
      },
      disabledTextStyle: {
        color: colors.text.lightest.toString(),
      },
      labels: {
        group: 'Options',
      },
    },
    Toolbar: {
      orientation: 'horizontal',
      density: 'normal',
      backgroundColor: colors.surface.dark.toNumber(),
      backgroundAlpha: 0.92,
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: 4,
      gap: 6,
      itemGap: 6,
      groupGap: 10,
      itemWidth: 42,
      itemHeight: 36,
      compactItemWidth: 34,
      compactItemHeight: 34,
      buttonVariant: 'secondary',
      activeButtonVariant: 'primary',
      menuButtonVariant: 'outline',
      buttonSize: 'small',
      compactButtonSize: 'small',
      iconSize: 18,
      compactIconSize: 16,
      separatorColor: colors.border.medium.toNumber(),
      separatorThickness: 1,
      separatorLength: 26,
      disabledAlpha: 0.55,
      textStyle: {
        ...textStyles.small,
        color: colors.text.DEFAULT.toString(),
        fontStyle: 'bold',
      },
      activeTextStyle: {
        color: colors.text.DEFAULT.toString(),
        fontStyle: 'bold',
      },
      disabledTextStyle: {
        color: colors.text.lightest.toString(),
      },
      menuIndicatorStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
      },
      labels: {
        overflow: 'More',
        menuIndicator: 'v',
      },
      Icon: {
        tint: colors.text.DEFAULT.toNumber(),
      },
      Button: {
        minWidth: 0,
        padding: { left: 8, right: 8, top: 6, bottom: 6 },
        cornerRadius: 6,
        gap: 6,
      },
    },
    MenuButton: {
      buttonVariant: 'secondary',
      buttonSize: 'medium',
      placement: 'bottom-start',
      width: 220,
      gap: 6,
      iconGap: 8,
    },
    Badge: {
      tone: 'neutral',
      variant: 'solid',
      size: 'medium',
      maxCount: 99,
      disabledAlpha: 0.5,
      textStyle: {
        fontFamily: 'Arial',
      },
    },
    Tag: {
      tone: 'neutral',
      variant: 'soft',
      size: 'medium',
      closeSize: 16,
      disabledAlpha: 0.5,
      textStyle: {
        fontFamily: 'Arial',
      },
    },
    Popover: {
      placement: 'bottom',
      offset: 8,
      depth: 1100,
      closeOnOutside: true,
      closeOnEscape: true,
      viewportPadding: 8,
      openDuration: 120,
      closeDuration: 100,
      backgroundColor: colors.surface.dark.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      gap: 8,
    },
    ContextMenu: {
      width: 220,
      itemHeight: 34,
      itemGap: 8,
      itemPadding: { left: 10, right: 10, top: 6, bottom: 6 },
      itemCornerRadius: 5,
      backgroundColor: colors.surface.dark.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: 6,
      gap: 2,
      textStyle: {
        ...textStyles.small,
        color: colors.text.medium.toString(),
      },
      disabledTextColor: colors.text.lightest.toString(),
      dangerTextColor: colors.error.darkest.toString(),
      dangerBackgroundColor: colors.error.dark.toNumber(),
    },
    ProgressBar: {
      width: 240,
      height: 22,
      orientation: 'horizontal',
      labelPosition: 'right',
      trackColor: colors.surface.dark.toNumber(),
      fillColor: colors.success.DEFAULT.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 11,
      gap: 8,
      disabledAlpha: 0.5,
      labelStyle: {
        color: colors.text.DEFAULT.toString(),
        fontSize: '13px',
      },
    },
    ScrollSlider: {
      borderColor: colors.border.medium.toNumber(),
      trackColor: colors.surface.dark.toNumber(),
      trackCornerRadius: 0,
      thumbColor: colors.primary.DEFAULT.toNumber(),
      thumbActiveColor: colors.primary.dark.toNumber(),
      thumbBorderColor: colors.primary.light.toNumber(),
      thumbBorderWidth: 1,
      thumbCornerRadius: 0,
      borderWidth: 1,
      cornerRadius: 0,
      minThumbSize: 30,
      size: 24,
    },
    Button: {
      variant: 'primary',
      size: 'medium',
      disabledColor: colors.surface.medium.toNumber(),
      disabledAlpha: 0.48,
      iconSize: 18,
      minWidth: 92,
      height: 40,
      backgroundColor: colors.primary.medium.toNumber(),
      backgroundAlpha: 1,
      borderColor: colors.primary.dark.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      padding: { top: 8, bottom: 8, left: 16, right: 16 },
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
      effect: 'press',
      effectConfig: { intensity: 0.94, time: 140 },
      textStyle: {
        ...textStyles.medium,
        color: '#ffffff',
        fontStyle: 'bold',
      },
      Text: {
        style: {
          ...textStyles.medium,
          color: '#ffffff',
          fontStyle: 'bold',
        },
      },
      Icon: {
        size: 18,
        tint: colors.text.DEFAULT.toNumber(),
      },
      primary: {
        backgroundColor: colors.primary.medium.toNumber(),
        borderColor: colors.primary.dark.toNumber(),
        textStyle: {
          color: '#ffffff',
          fontStyle: 'bold',
        },
        Icon: {
          tint: colors.text.DEFAULT.toNumber(),
        },
      },
      secondary: {
        backgroundColor: colors.surface.lightest.toNumber(),
        backgroundAlpha: 0.92,
        borderColor: colors.border.light.toNumber(),
        borderWidth: 1,
        textStyle: {
          color: colors.text.dark.toString(),
          fontStyle: 'bold',
        },
        Icon: {
          tint: colors.text.dark.toNumber(),
        },
      },
      outline: {
        backgroundColor: colors.primary.dark.toNumber(),
        backgroundAlpha: 0.08,
        borderColor: colors.primary.light.toNumber(),
        borderWidth: 2,
        textStyle: {
          color: colors.primary.light.toString(),
          fontStyle: 'bold',
        },
        Icon: {
          tint: colors.primary.light.toNumber(),
        },
      },
      ghost: {
        backgroundColor: colors.surface.light.toNumber(),
        backgroundAlpha: 0.18,
        borderColor: colors.border.medium.toNumber(),
        borderAlpha: 0.35,
        borderWidth: 1,
        textStyle: {
          color: colors.text.light.toString(),
          fontStyle: 'bold',
        },
        Icon: {
          tint: colors.text.light.toNumber(),
        },
      },
      danger: {
        backgroundColor: colors.error.medium.toNumber(),
        borderColor: colors.error.dark.toNumber(),
        textStyle: {
          color: '#ffffff',
          fontStyle: 'bold',
        },
        Icon: {
          tint: colors.text.DEFAULT.toNumber(),
        },
      },
      variants: {
        primary: {
          backgroundColor: colors.primary.medium.toNumber(),
          borderColor: colors.primary.dark.toNumber(),
        },
        secondary: {
          backgroundColor: colors.surface.lightest.toNumber(),
          backgroundAlpha: 0.92,
          borderColor: colors.border.light.toNumber(),
          borderWidth: 1,
        },
        outline: {
          backgroundColor: colors.primary.dark.toNumber(),
          backgroundAlpha: 0.08,
          borderColor: colors.primary.light.toNumber(),
          borderWidth: 2,
        },
        ghost: {
          backgroundColor: colors.surface.light.toNumber(),
          backgroundAlpha: 0.18,
          borderColor: colors.border.medium.toNumber(),
          borderAlpha: 0.35,
          borderWidth: 1,
        },
        danger: {
          backgroundColor: colors.error.medium.toNumber(),
          borderColor: colors.error.dark.toNumber(),
        },
      },
      small: {
        minWidth: 72,
        height: 32,
        padding: { top: 6, bottom: 6, left: 12, right: 12 },
        cornerRadius: 7,
        gap: 6,
        iconSize: 15,
        textStyle: {
          fontSize: '12px',
        },
        Icon: {
          size: 15,
        },
      },
      medium: {
        minWidth: 92,
        height: 40,
        padding: { top: 8, bottom: 8, left: 16, right: 16 },
        cornerRadius: 8,
        gap: 8,
        iconSize: 18,
        Icon: {
          size: 18,
        },
      },
      large: {
        minWidth: 116,
        height: 48,
        padding: { top: 10, bottom: 10, left: 20, right: 20 },
        cornerRadius: 10,
        gap: 10,
        iconSize: 22,
        textStyle: {
          fontSize: '18px',
        },
        Icon: {
          size: 22,
        },
      },
      sizes: {
        small: {
          minWidth: 72,
          height: 32,
          padding: { top: 6, bottom: 6, left: 12, right: 12 },
          cornerRadius: 7,
          gap: 6,
          iconSize: 15,
        },
        medium: {
          minWidth: 92,
          height: 40,
          padding: { top: 8, bottom: 8, left: 16, right: 16 },
          cornerRadius: 8,
          gap: 8,
          iconSize: 18,
        },
        large: {
          minWidth: 116,
          height: 48,
          padding: { top: 10, bottom: 10, left: 20, right: 20 },
          cornerRadius: 10,
          gap: 10,
          iconSize: 22,
          textStyle: {
            fontSize: '18px',
          },
        },
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
    Tabs: {
      tabListStyle: {
        backgroundColor: colors.surface.dark.toNumber(),
        padding: { left: 8, right: 8, top: 8, bottom: 0 },
        cornerRadius: { tl: 6, tr: 6, bl: 0, br: 0 },
        width: 'fill',
        gap: 10,
        alignItems: 'end',
        justifyContent: 'start',
      },
      tabStyle: {
        backgroundColor: colors.surface.medium.toNumber(),
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
        padding: { left: 8, right: 8, top: 8, bottom: 3 },
        cornerRadius: { tl: 6, tr: 6, bl: 0, br: 0 },
      },
      tabActiveStyle: {
        padding: { left: 8, right: 8, top: 8, bottom: 8 },
        backgroundColor: colors.primary.DEFAULT.toNumber(),
        borderColor: colors.primary.dark.toNumber(),
        borderWidth: 2,
      },
      tabDisabledStyle: {
        alpha: 0.4,
      },
      panelStyle: {
        backgroundColor: colors.surface.light.toNumber(),
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
        padding: 10,
        cornerRadius: { tl: 0, tr: 0, bl: 6, br: 6 },
        width: 'fill',
      },
    },
    NineSliceButton: {},
    CharText: {
      charSpacing: 0,
      cursorColor: colors.secondary.DEFAULT.toNumber(),
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
      cursorColor: colors.secondary.DEFAULT.toNumber(),
      cursorWidth: 3,
      cursorBlinkSpeed: 200,
      selectionColor: colors.accent.light.toNumber(),
      selectionAlpha: 0.5,
      lineHeight: 1.2,
      wordWrap: false,
      disabledColor: colors.border.dark.toNumber(),
      disabledBackgroundColor: colors.surface.medium.toNumber(),
      disabledBorderColor: colors.border.light.toNumber(),
      disabledAlpha: 0.6,
      focusedBorderColor: colors.primary.DEFAULT.toNumber(),
      backgroundColor: colors.surface.lightest.toNumber(),
      borderColor: colors.border.medium.toNumber(),
      borderWidth: 1,
      cornerRadius: 7,
      padding: { left: 10, right: 10, top: 8, bottom: 8 },
      textStyle: {
        ...textStyles.DEFAULT,
        color: colors.text.dark.toString(),
      },
      placeholderStyle: {
        ...textStyles.DEFAULT,
        color: colors.text.light.toString(),
      },
    },
    Dropdown: {
      trigger: {
        backgroundColor: colors.surface.light.toNumber(),
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
        cornerRadius: 7,
        padding: { left: 12, right: 10, top: 9, bottom: 9 },
        width: 'fill',
        gap: 8,
      },
      triggerHover: {
        borderColor: colors.primary.DEFAULT.toNumber(),
      },
      triggerOpen: {
        borderColor: colors.primary.DEFAULT.toNumber(),
        borderWidth: 2,
        backgroundColor: colors.surface.lightest.toNumber(),
      },
      triggerDisabled: {
        backgroundColor: colors.surface.light.toNumber(),
        alpha: 0.5,
      },
      arrow: {
        color: colors.text.dark.toNumber(),
        size: 12,
        strokeWidth: 2,
      },
      selectionIndicator: {
        color: colors.primary.dark.toNumber(),
        size: 16,
        strokeWidth: 2,
      },
      overlay: {
        backgroundColor: colors.surface.lightest.toNumber(),
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
        cornerRadius: 7,
        maxHeight: 300,
        padding: 6,
      },
      option: {
        padding: { left: 10, right: 10, top: 8, bottom: 8 },
        cornerRadius: 5,
        gap: 8,
      },
      optionSelected: {
        backgroundColor: colors.primary.lightest.toNumber(),
        borderColor: colors.primary.light.toNumber(),
        borderWidth: 1,
        backgroundAlpha: 0.9,
        Text: {
          style: {
            ...textStyles.DEFAULT,
            color: colors.text.dark.toString(),
            fontStyle: 'bold',
          },
        },
      },
      optionDisabled: {
        alpha: 0.3,
      },
      textStyle: textStyles.DEFAULT,
      placeholderStyle: {
        ...textStyles.DEFAULT,
        color: colors.text.light.toString(),
      },
      filterInput: {
        backgroundColor: colors.surface.lightest.toNumber(),
        borderColor: colors.border.medium.toNumber(),
        borderWidth: 1,
        cornerRadius: 6,
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
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
      trackColorOn: colors.primary.DEFAULT.toNumber(),
      trackBorderColorOff: colors.border.medium.toNumber(),
      trackBorderColorOn: colors.primary.dark.toNumber(),
      trackBorderWidth: 1,
      thumbColor: colors.surface.lightest.toNumber(),
      thumbBorderColor: colors.border.light.toNumber(),
      thumbBorderWidth: 1,
      disabledColor: colors.border.medium.toNumber(),
      disabledAlpha: 0.5,
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
    Toast: {
      variant: 'info',
      width: 320,
      minHeight: 58,
      gap: 10,
      contentGap: 2,
      accentWidth: 4,
      padding: { left: 10, right: 10, top: 9, bottom: 9 },
      backgroundColor: colors.surface.dark.toNumber(),
      backgroundAlpha: 0.98,
      borderColor: colors.border.dark.toNumber(),
      borderWidth: 1,
      cornerRadius: 8,
      closeButtonSize: 24,
      titleStyle: {
        ...textStyles.small,
        color: colors.text.lightest.toString(),
        fontStyle: 'bold',
      },
      messageStyle: {
        ...textStyles.small,
        color: colors.text.light.toString(),
      },
      labels: {
        close: 'x',
      },
      variants: {
        info: {
          accentColor: colors.info.DEFAULT.toNumber(),
          borderColor: colors.info.dark.toNumber(),
        },
        success: {
          accentColor: colors.success.DEFAULT.toNumber(),
          borderColor: colors.success.dark.toNumber(),
        },
        warning: {
          accentColor: colors.warning.DEFAULT.toNumber(),
          borderColor: colors.warning.dark.toNumber(),
        },
        error: {
          accentColor: colors.error.DEFAULT.toNumber(),
          borderColor: colors.error.dark.toNumber(),
        },
      },
      Button: {
        ghost: {
          padding: 0,
          backgroundAlpha: 0,
          textStyle: {
            color: colors.text.light.toString(),
            fontStyle: 'bold',
          },
        },
      },
    },
    NotificationStack: {
      position: 'top-right',
      width: 320,
      gap: 8,
      offset: 16,
      duration: 4000,
      depth: 1200,
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
}

// Get oceanBlue preset with light mode
const preset = getPresetWithMode('oceanBlue', 'light')

/**
 * Default theme values for all built-in and custom components (oceanBlue / light)
 */
export const defaultTheme: Theme = buildDefaultTheme(preset.colors)

/**
 * Create a default theme for any preset + mode combination
 * Useful when apps want the library defaults but re-colored by their own palette
 */
export function createDefaultTheme(
  presetName: PresetName = 'oceanBlue',
  mode: 'light' | 'dark' = 'light'
): Theme {
  const presetForMode = getPresetWithMode(presetName, mode)
  return buildDefaultTheme(presetForMode.colors)
}
