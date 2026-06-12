/**
 * Custom components for PhaserJSX UI
 * Higher-level components built on top of built-in primitives
 */

export { Accordion, type AccordionProps } from './Accordion'
export { AlertDialog, type AlertDialogProps } from './AlertDialog'
export {
  Badge,
  Tag,
  formatBadgeCount,
  getBadgeSizeConfig,
  getBadgeText,
  resolveBadgeTextStyle,
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
  Icon,
  createIconComponent,
  useIconPreload,
  type IconLoaderFn,
  type IconProps,
} from './Icon'
export { Image, type ImageProps } from './Image'
export { Joystick, type JoystickProps, type JoystickTheme } from './Joystick'
export { Modal, type ModalProps } from './Modal'
export { NineSlice, type NineSliceProps } from './NineSlice'
export { NineSliceButton, type NineSliceButtonProps } from './NineSliceButton'
export {
  NumberInput,
  NumberInputIndicator,
  getNextNumberInputValue,
  getNumberInputPrecision,
  normalizeNumberInputValue,
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
  type NumberInputValueRenderProps,
  type NumberInputValueOptions,
} from './NumberInput'
export { Particles, type ParticlesProps } from './Particles'
export { Portal, type PortalProps } from './Portal'
export {
  ContextMenu,
  Popover,
  calculateOverlayPosition,
  type ContextMenuItem,
  type ContextMenuProps,
  type OverlayAnchorRect,
  type OverlayContentSize,
  type OverlayPosition,
  type OverlayPositionOptions,
  type PopoverPlacement,
  type PopoverProps,
} from './Popover'
export {
  ProgressBar,
  clampProgressValue,
  getProgressRatio,
  type ProgressBarFormatProps,
  type ProgressBarLabelPosition,
  type ProgressBarOrientation,
  type ProgressBarProps,
} from './ProgressBar'
export { RadioButton, type RadioButtonProps } from './RadioButton'
export { RadioGroup, type RadioGroupProps } from './RadioGroup'
export {
  SegmentedControl,
  findSegmentedControlOption,
  isSegmentedControlOptionSelectable,
  resolveSegmentedControlValue,
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
export { RefOriginView, type RefOriginViewProps } from './RefOriginView'
export {
  ScrollSlider,
  calculateSliderSize,
  type ScrollSliderProps,
  type SliderSize,
} from './ScrollSlider'
export { ScrollView, type ScrollInfo, type ScrollViewProps } from './ScrollView'
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
export { Toggle, type ToggleProps } from './Toggle'
export { TransformOriginView, type TransformOriginViewProps } from './TransformOriginView'
export { WrapText, type WrapTextProps } from './WrapText'
