/**
 * Custom components for PhaserJSX UI
 * Higher-level components built on top of built-in primitives
 */

export { Accordion, type AccordionProps } from './Accordion'
export {
  ActivityIndicator,
  type ActivityIndicatorLabels,
  type ActivityIndicatorProps,
  type ActivityIndicatorSize,
  type ActivityIndicatorThemeSlot,
  type ActivityIndicatorVariant,
} from './ActivityIndicator'
export { AlertDialog, type AlertDialogProps } from './AlertDialog'
export {
  Badge,
  formatBadgeCount,
  getBadgeSizeConfig,
  getBadgeText,
  resolveBadgeTextStyle,
  Tag,
  type BadgeFormatOptions,
  type BadgeProps,
  type BadgeSize,
  type BadgeSizeConfig,
  type BadgeTextStyleOptions,
  type BadgeTone,
  type BadgeToneColors,
  type BadgeVariant,
  type TagProps,
} from './Badge'
export {
  BottomSheet,
  type BottomSheetLabels,
  type BottomSheetProps,
  type BottomSheetThemeSlot,
} from './BottomSheet'
export { Button, type ButtonProps } from './Button'
export { CharText, type CharTextAPI, type CharTextProps } from './CharText'
export { CharTextInput, type CharTextInputProps } from './CharTextInput'
export {
  Checkbox,
  type CheckboxIndicatorRenderProps,
  type CheckboxLabelPosition,
  type CheckboxProps,
  type CheckboxState,
} from './Checkbox'
export {
  ColorPicker,
  type ColorPickerLabels,
  type ColorPickerProps,
  type ColorPickerState,
  type ColorPickerTone,
} from './ColorPicker'
export {
  DebugPanel,
  type DebugMetricKey,
  type DebugPanelPreset,
  type DebugPanelProps,
} from './DebugPanel'
export { Dialog, type DialogProps } from './Dialog'
export { Divider, type DividerProps } from './Divider'
export { Dropdown, type DropdownOption, type DropdownProps } from './Dropdown'
export {
  createIconComponent,
  Icon,
  useIconPreload,
  type IconLoaderFn,
  type IconProps,
} from './Icon'
export { Image, type ImageProps } from './Image'
export { Joystick, type JoystickProps, type JoystickTheme } from './Joystick'
export {
  findListBoxItem,
  ListBox,
  resolveListBoxValue,
  type ListBoxItem,
  type ListBoxItemRenderProps,
  type ListBoxLabels,
  type ListBoxProps,
  type ListBoxThemeSlot,
} from './ListBox'
export { MenuButton, type MenuButtonProps, type MenuButtonTriggerRenderProps } from './MenuButton'
export { Modal, type ModalProps } from './Modal'
export { NineSlice, type NineSliceProps } from './NineSlice'
export { NineSliceButton, type NineSliceButtonProps } from './NineSliceButton'
export {
  getNextNumberInputValue,
  getNumberInputPrecision,
  normalizeNumberInputValue,
  NumberInput,
  NumberInputIndicator,
  type NumberInputButtonAction,
  type NumberInputButtonDirection,
  type NumberInputButtonPlacement,
  type NumberInputButtonRenderProps,
  type NumberInputIndicatorDirection,
  type NumberInputIndicatorProps,
  type NumberInputIndicatorVariant,
  type NumberInputLabelPosition,
  type NumberInputLabels,
  type NumberInputProps,
  type NumberInputValueOptions,
  type NumberInputValueRenderProps,
} from './NumberInput'
export {
  chunkPalettePickerColors,
  getPalettePickerContrastColor,
  normalizePalettePickerColor,
  normalizePalettePickerColors,
  PalettePicker,
  resolvePalettePickerValue,
  type NormalizedPalettePickerOption,
  type PalettePickerColor,
  type PalettePickerLabels,
  type PalettePickerOption,
  type PalettePickerProps,
  type PalettePickerSwatchRenderProps,
  type PalettePickerThemeSlot,
} from './PalettePicker'
export { Particles, type ParticlesProps } from './Particles'
export {
  calculateOverlayPosition,
  ContextMenu,
  Popover,
  type ContextMenuItem,
  type ContextMenuProps,
  type OverlayAnchorRect,
  type OverlayContentSize,
  type OverlayPosition,
  type OverlayPositionOptions,
  type PopoverPlacement,
  type PopoverProps,
} from './Popover'
export { Portal, type PortalProps } from './Portal'
export {
  clampProgressValue,
  getProgressRatio,
  ProgressBar,
  type ProgressBarFormatProps,
  type ProgressBarLabelPosition,
  type ProgressBarOrientation,
  type ProgressBarProps,
} from './ProgressBar'
export {
  ProgressView,
  type ProgressViewLabels,
  type ProgressViewProps,
  type ProgressViewThemeSlot,
} from './ProgressView'
export { RadioButton, type RadioButtonProps } from './RadioButton'
export { RadioGroup, type RadioGroupProps } from './RadioGroup'
export {
  RatingBar,
  type RatingBarIconRenderProps,
  type RatingBarLabels,
  type RatingBarProps,
  type RatingBarSize,
  type RatingBarThemeSlot,
} from './RatingBar'
export { RefOriginView, type RefOriginViewProps } from './RefOriginView'
export {
  calculateSliderSize,
  ScrollSlider,
  type ScrollSliderProps,
  type SliderSize,
} from './ScrollSlider'
export { ScrollView, type ScrollInfo, type ScrollViewProps } from './ScrollView'
export {
  findSegmentedControlOption,
  isSegmentedControlOptionSelectable,
  resolveSegmentedControlValue,
  SegmentedControl,
  type SegmentedControlLabelPosition,
  type SegmentedControlLabels,
  type SegmentedControlOption,
  type SegmentedControlOptionRenderProps,
  type SegmentedControlOrientation,
  type SegmentedControlProps,
  type SegmentedControlSize,
  type SegmentedControlThemeSlot,
  type SegmentedControlVariant,
} from './SegmentedControl'
export {
  Sidebar,
  type SidebarNavItem,
  type SidebarProps,
  type SidebarSection,
  type SidebarSize,
  type SidebarVariant,
} from './Sidebar'
export {
  RangeSlider,
  Slider,
  type RangeSliderProps,
  type SliderMark,
  type SliderProps,
} from './Slider'
export { Tab, TabPanel, Tabs, type TabPanelProps, type TabProps, type TabsProps } from './Tabs'
export {
  getToastAutoDismissDuration,
  NotificationStack,
  resolveNotificationStackAlignment,
  Toast,
  type NotificationStackAlignment,
  type NotificationStackPosition,
  type NotificationStackProps,
  type ToastItem,
  type ToastLabels,
  type ToastProps,
  type ToastThemeSlot,
  type ToastVariant,
  type ToastVariantTheme,
} from './Toast'
export { Toggle, type ToggleProps } from './Toggle'
export {
  getToolbarItemId,
  isToolbarMenuItem,
  isToolbarSeparatorItem,
  isToolbarToggleItem,
  resolveToolbarActiveId,
  Toolbar,
  ToolButtonGroup,
  type ToolbarActionItem,
  type ToolbarDensity,
  type ToolbarItem,
  type ToolbarItemType,
  type ToolbarLabels,
  type ToolbarMenuItem,
  type ToolbarOrientation,
  type ToolbarProps,
  type ToolbarSeparatorItem,
  type ToolbarThemeSlot,
  type ToolbarToggleItem,
} from './Toolbar'
export { TransformOriginView, type TransformOriginViewProps } from './TransformOriginView'
export {
  WheelPicker,
  type WheelPickerItem,
  type WheelPickerItemRenderProps,
  type WheelPickerLabels,
  type WheelPickerProps,
  type WheelPickerSize,
  type WheelPickerThemeSlot,
} from './WheelPicker'
export { WrapText, type WrapTextProps } from './WrapText'
