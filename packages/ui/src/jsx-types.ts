/**
 * Global JSX type definitions for all components
 * This file must be imported to register JSX IntrinsicElements
 */
import type { TextProps } from './components/text'
import type { ViewProps } from './components/view'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      View: ViewProps
      Text: TextProps
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// This export is needed to make this a module
export {}
