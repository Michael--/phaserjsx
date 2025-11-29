/**
 * High-level UI components built with PhaserJSX
 * These demonstrate how to build composite components using the base View and Text primitives
 */
export { Accordion, type AccordionProps } from './Accordion'
export { CharText } from './CharText/CharText'
export type { CharInfo, CharTextAPI, CharTextProps, LineInfo } from './CharText/types'
export { CharTextInput, type CharTextInputProps } from './CharTextInput'
export { Icon, useIcon, type IconType } from './Icon'
export {
  IconButton as Button,
  IconButton,
  type IconButtonProps as ButtonProps, // Backward compatibility export
  type IconButtonProps,
} from './IconButton'
export { NineSliceButton, type NineSliceButtonProps } from './NineSliceButton'
export { RefOriginView, type RefOriginViewProps } from './RefOriginView'
export { Sidebar, type SidebarProps } from './Sidebar'
export { TransformOriginView, type TransformOriginViewProps } from './TransformOriginView'
