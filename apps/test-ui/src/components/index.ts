/**
 * High-level UI components built with PhaserJSX
 * These demonstrate how to build composite components using the base View and Text primitives
 */

// Re-export migrated components from @number10/phaserjsx
export {
  Accordion,
  CharText,
  CharTextInput,
  NineSliceButton,
  RefOriginView,
  Sidebar,
  TransformOriginView,
  type AccordionProps,
  type CharTextAPI,
  type CharTextInputProps,
  type CharTextProps,
  type NineSliceButtonProps,
  type RefOriginViewProps,
  type SidebarProps,
  type TransformOriginViewProps,
} from '@number10/phaserjsx'

// Test-UI specific components (depend on local icon system)
export { Checkbox, type CheckboxProps } from './Checkbox'
export { Icon, useIcon, type IconType } from './Icon'
export {
  IconButton as Button,
  IconButton,
  type IconButtonProps as ButtonProps, // Backward compatibility export
  type IconButtonProps,
} from './IconButton'
