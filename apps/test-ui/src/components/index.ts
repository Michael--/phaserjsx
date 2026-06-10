/**
 * High-level UI components built with PhaserJSX
 * These demonstrate how to build composite components using the base View and Text primitives
 */

// Re-export migrated components from @number10/phaserjsx
export {
  Accordion,
  Badge,
  CharText,
  CharTextInput,
  Checkbox,
  NineSliceButton,
  ProgressBar,
  RefOriginView,
  Sidebar,
  Tag,
  TransformOriginView,
  type AccordionProps,
  type BadgeProps,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  type CharTextAPI,
  type CharTextInputProps,
  type CharTextProps,
  type CheckboxProps,
  type NineSliceButtonProps,
  type ProgressBarFormatProps,
  type ProgressBarLabelPosition,
  type ProgressBarOrientation,
  type ProgressBarProps,
  type RefOriginViewProps,
  type SidebarProps,
  type TagProps,
  type TransformOriginViewProps,
} from '@number10/phaserjsx'

// Test-UI specific components (depend on local icon system)
export { Icon, useIcon, type IconType } from './Icon'
export {
  IconButton as Button,
  IconButton,
  type IconButtonProps as ButtonProps, // Backward compatibility export
  type IconButtonProps,
} from './IconButton'
