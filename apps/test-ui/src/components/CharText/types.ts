import type * as PhaserJSX from '@phaserjsx/ui'
import type { EffectDefinition } from '../../hooks'

/**
 * Information about a single rendered character
 */
export interface CharInfo {
  /** The character itself */
  char: string
  /** Phaser Text GameObject for this character */
  textObject: Phaser.GameObjects.Text | null
  /** X position in container */
  x: number
  /** Y position in container */
  y: number
  /** Width of the character */
  width: number
  /** Height of the character */
  height: number
  /** Line index (for multi-line support) */
  lineIndex: number
  /** Character index in the full text */
  charIndex: number
  /** Character index within the line */
  lineCharIndex: number
}

/**
 * Information about a text line
 */
export interface LineInfo {
  /** Characters in this line */
  chars: CharInfo[]
  /** Starting character index in full text */
  startCharIndex: number
  /** Ending character index in full text */
  endCharIndex: number
  /** Y position of this line */
  y: number
  /** Width of this line */
  width: number
  /** Height of this line */
  height: number
  /** Line number (0-based) */
  lineIndex: number
}

// Module augmentation to add CharText theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    CharText: {
      disabledColor?: number
      textStyle?: Phaser.Types.GameObjects.Text.TextStyle
      charSpacing?: number
      cursorColor?: number
      cursorWidth?: number
      cursorBlinkSpeed?: number
      selectionColor?: number
      selectionAlpha?: number
      lineHeight?: number
      wordWrap?: boolean
    } & PhaserJSX.ViewTheme &
      EffectDefinition
  }
}

/**
 * Props for CharText component
 */
export interface CharTextProps
  extends Omit<PhaserJSX.ViewProps, 'children' | 'ref'>,
    EffectDefinition {
  /** Ref to the container */
  forwardRef?: (ref: Phaser.GameObjects.Container | null) => void

  /** Text to display */
  text?: string

  /** Whether input is disabled */
  disabled?: boolean

  /** Text style for characters */
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle | undefined

  /** Spacing between characters */
  charSpacing?: number

  /** Enable multi-line text wrapping */
  multiline?: boolean

  /** Line height multiplier (default: 1.2) */
  lineHeight?: number

  /** Maximum number of lines (truncate after) */
  maxLines?: number

  /** How to handle text overflow when maxLines is reached */
  textOverflow?: 'clip' | 'ellipsis'

  /** Word wrap behavior (default: true, break at spaces) */
  wordWrap?: boolean

  /** Whether to show cursor */
  showCursor?: boolean

  /** Cursor position (index between characters, 0 to text.length) */
  cursorPosition?: number

  /** Cursor color */
  cursorColor?: number

  /** Cursor width in pixels */
  cursorWidth?: number

  /** Cursor blink speed in milliseconds */
  cursorBlinkSpeed?: number

  /** Called when text changes (for controlled mode) */
  onChange?: (text: string) => void

  /** Called when cursor position changes */
  onCursorPositionChange?: (position: number) => void

  /** Selection start index */
  selectionStart?: number

  /** Selection end index */
  selectionEnd?: number

  /** Selection background color */
  selectionColor?: number

  /** Selection background alpha */
  selectionAlpha?: number

  /** Called when selection changes */
  onSelectionChange?: (start: number, end: number) => void

  /** Called when API is ready (provides access to CharTextAPI) */
  onApiReady?: (api: CharTextAPI) => void
}

/**
 * API for programmatic text manipulation
 */
export interface CharTextAPI {
  /** Insert a character at the specified index */
  insertChar(char: string, index: number): void
  /** Delete a character at the specified index */
  deleteChar(index: number): void
  /** Replace a character at the specified index */
  replaceChar(index: number, char: string): void
  /** Set the entire text */
  setText(text: string): void
  /** Get the current displayed text */
  getText(): string
  /** Clear all text */
  clear(): void
  /** Get character index at world position */
  getCharAtPosition(worldX: number, worldY: number): number | null
  /** Check if a character can fit at the specified position (single-line only) */
  canFitChar(char: string, position: number): boolean
}
