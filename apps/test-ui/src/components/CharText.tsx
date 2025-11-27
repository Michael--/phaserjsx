import type * as PhaserJSX from '@phaserjsx/ui'
import { getThemedProps, useEffect, useRef, useState, View, type ViewProps } from '@phaserjsx/ui'
import { useGameObjectEffect, type EffectDefinition } from '../hooks'

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
export interface CharTextProps extends Omit<ViewProps, 'children'>, EffectDefinition {
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
}

/**
 * CharText component - renders text using individual Phaser Text GameObjects per character
 * @param props - CharText properties
 * @returns CharText JSX element
 */
export function CharText(props: CharTextProps) {
  const { props: themed } = getThemedProps('CharText', undefined, {})
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect: _applyEffect } = useGameObjectEffect(ref)

  // Character state management
  const [chars, setChars] = useState<CharInfo[]>([])
  const [internalText, setInternalText] = useState('')
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // Cursor management
  const cursorRef = useRef<Phaser.GameObjects.Rectangle | null>(null)
  const cursorTweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  // Selection management
  const selectionRefs = useRef<Phaser.GameObjects.Rectangle[]>([])
  const dragStartPosRef = useRef<number>(-1)

  // Track if we're in controlled mode
  const isControlled = props.text !== undefined
  const displayedText = isControlled ? (props.text ?? '') : internalText

  // Extract style and spacing from props/theme
  const textStyle = props.textStyle ?? themed.textStyle
  const charSpacing = props.charSpacing ?? themed.charSpacing ?? 0
  const padding = props.padding ?? themed.padding ?? 0
  const padLeft = typeof padding === 'number' ? padding : (padding.left ?? 0)
  const padRight = typeof padding === 'number' ? padding : (padding.right ?? 0)
  const horizontalPadding = padLeft + padRight
  const padTop = typeof padding === 'number' ? padding : (padding.top ?? 0)
  const padBottom = typeof padding === 'number' ? padding : (padding.bottom ?? 0)
  const verticalPadding = padTop + padBottom

  const showCursor = props.showCursor ?? false
  const cursorPosition = props.cursorPosition ?? displayedText.length
  const cursorColor = props.cursorColor ?? themed.cursorColor ?? 0xffffff
  const cursorWidth = props.cursorWidth ?? themed.cursorWidth ?? 2
  const cursorBlinkSpeed = props.cursorBlinkSpeed ?? themed.cursorBlinkSpeed ?? 530

  const selectionStart = props.selectionStart ?? -1
  const selectionEnd = props.selectionEnd ?? -1
  const selectionColor = props.selectionColor ?? themed.selectionColor ?? 0x4a90e2
  const selectionAlpha = props.selectionAlpha ?? themed.selectionAlpha ?? 0.3

  const multiline = props.multiline ?? false
  const lineHeight = props.lineHeight ?? themed.lineHeight ?? 1.2
  const maxLines = props.maxLines
  const textOverflow = props.textOverflow ?? 'clip'
  const wordWrap = props.wordWrap ?? themed.wordWrap ?? true

  /**
   * Text manipulation API
   */
  const api: CharTextAPI = {
    insertChar: (char: string, index: number) => {
      const newText = displayedText.slice(0, index) + char + displayedText.slice(index)
      if (isControlled) {
        props.onChange?.(newText)
      } else {
        setInternalText(newText)
        props.onChange?.(newText)
      }
    },
    deleteChar: (index: number) => {
      if (index < 0 || index >= displayedText.length) return
      const newText = displayedText.slice(0, index) + displayedText.slice(index + 1)
      if (isControlled) {
        props.onChange?.(newText)
      } else {
        setInternalText(newText)
        props.onChange?.(newText)
      }
    },
    replaceChar: (index: number, char: string) => {
      if (index < 0 || index >= displayedText.length) return
      const newText = displayedText.slice(0, index) + char + displayedText.slice(index + 1)
      if (isControlled) {
        props.onChange?.(newText)
      } else {
        setInternalText(newText)
        props.onChange?.(newText)
      }
    },
    setText: (text: string) => {
      if (isControlled) {
        props.onChange?.(text)
      } else {
        setInternalText(text)
        props.onChange?.(text)
      }
    },
    getText: () => displayedText,
    clear: () => {
      if (isControlled) {
        props.onChange?.('')
      } else {
        setInternalText('')
        props.onChange?.('')
      }
    },
    getCharAtPosition: (worldX: number, worldY: number) => {
      for (let i = 0; i < chars.length; i++) {
        const charInfo = chars[i]
        if (charInfo?.textObject) {
          const bounds = charInfo.textObject.getBounds()
          if (
            worldX >= bounds.left &&
            worldX <= bounds.right &&
            worldY >= bounds.top &&
            worldY <= bounds.bottom
          ) {
            return i
          }
        }
      }
      return null
    },
  }

  // Store API in ref for external access (future use)
  const apiRef = useRef<CharTextAPI>(api)
  apiRef.current = api

  /**
   * Break text into lines based on width constraints
   */
  const breakIntoLines = (
    text: string,
    scene: Phaser.Scene,
    effectiveMaxWidth: number
  ): LineInfo[] => {
    const lines: LineInfo[] = []
    let currentLine: CharInfo[] = []
    let currentX = 0
    let currentLineIndex = 0
    let charIndex = 0

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i)

      // Create temporary text object to measure
      const tempText = scene.add.text(0, 0, char, textStyle ?? {})
      const charWidth = tempText.width
      const charHeight = tempText.height
      tempText.destroy()

      // Check for explicit line break
      if (char === '\n') {
        // Finish current line
        lines.push(createLineInfo(currentLine, currentLineIndex))
        currentLine = []
        currentLineIndex++
        currentX = 0
        charIndex++
        continue
      }

      // Check if we need to wrap
      if (multiline && currentX + charWidth > effectiveMaxWidth && currentLine.length > 0) {
        // Try word wrap
        if (wordWrap && char !== ' ') {
          // Find last space in current line
          let lastSpaceIdx = -1
          for (let j = currentLine.length - 1; j >= 0; j--) {
            if (currentLine[j]?.char === ' ') {
              lastSpaceIdx = j
              break
            }
          }

          if (lastSpaceIdx >= 0) {
            // Break at space
            const charsToMove = currentLine.splice(lastSpaceIdx + 1)
            lines.push(createLineInfo(currentLine, currentLineIndex))
            currentLine = charsToMove
            currentLineIndex++

            // Recalculate X for moved chars
            currentX = 0
            for (const movedChar of currentLine) {
              movedChar.x = currentX
              movedChar.lineIndex = currentLineIndex
              movedChar.lineCharIndex = currentLine.indexOf(movedChar)
              currentX += movedChar.width + charSpacing
            }
          } else {
            // No space found, hard break
            lines.push(createLineInfo(currentLine, currentLineIndex))
            currentLine = []
            currentLineIndex++
            currentX = 0
          }
        } else {
          // Hard break (or at space)
          lines.push(createLineInfo(currentLine, currentLineIndex))
          currentLine = []
          currentLineIndex++
          currentX = 0
        }
      }

      // Add char to current line
      const charInfo: CharInfo = {
        char,
        textObject: null,
        x: currentX,
        y: 0,
        width: charWidth,
        height: charHeight,
        lineIndex: currentLineIndex,
        charIndex,
        lineCharIndex: currentLine.length,
      }

      currentLine.push(charInfo)
      currentX += charWidth + charSpacing
      charIndex++
    }

    // Add last line
    if (currentLine.length > 0) {
      lines.push(createLineInfo(currentLine, currentLineIndex))
    }

    return lines
  }

  /**
   * Create LineInfo from array of CharInfo
   */
  const createLineInfo = (chars: CharInfo[], lineIndex: number): LineInfo => {
    if (chars.length === 0) {
      return {
        chars: [],
        startCharIndex: 0,
        endCharIndex: 0,
        y: 0,
        width: 0,
        height: 0,
        lineIndex,
      }
    }

    const width = chars.reduce((sum, char, idx) => {
      return sum + char.width + (idx < chars.length - 1 ? charSpacing : 0)
    }, 0)

    const height = Math.max(...chars.map((c) => c.height))

    return {
      chars,
      startCharIndex: chars[0]?.charIndex ?? 0,
      endCharIndex: chars[chars.length - 1]?.charIndex ?? 0,
      y: 0,
      width,
      height,
      lineIndex,
    }
  }

  /**
   * Position lines vertically with lineHeight spacing
   */
  const positionLinesVertically = (lines: LineInfo[]): void => {
    let currentY = 0

    for (const line of lines) {
      line.y = currentY

      // Update Y position for all chars in line
      for (const char of line.chars) {
        char.y = currentY
      }

      // Calculate spacing to next line
      const lineHeightPx = line.height * lineHeight
      currentY += lineHeightPx
    }
  }

  /**
   * Handle text overflow with maxLines limit
   */
  const handleOverflow = (lines: LineInfo[]): LineInfo[] => {
    if (!maxLines || lines.length <= maxLines) {
      return lines
    }

    const visibleLines = lines.slice(0, maxLines)

    if (textOverflow === 'ellipsis' && visibleLines.length > 0) {
      const lastLine = visibleLines[maxLines - 1]
      if (lastLine) {
        // Add ellipsis indicator by modifying last chars
        const ellipsis = '...'
        if (lastLine.chars.length > ellipsis.length) {
          // Replace last chars with ellipsis
          for (let i = 0; i < ellipsis.length; i++) {
            const charIdx = lastLine.chars.length - ellipsis.length + i
            const char = lastLine.chars[charIdx]
            if (char) {
              char.char = ellipsis[i] ?? '.'
            }
          }
        }
      }
    }

    return visibleLines
  }

  /**
   * Get cursor position from pointer world coordinates
   */
  const getPositionFromPointer = (worldX: number, worldY: number): number => {
    const charIndex = api.getCharAtPosition(worldX, worldY)

    if (charIndex !== null) {
      return charIndex + 1
    }

    if (chars.length === 0) {
      return 0
    }

    const firstChar = chars[0]
    const lastChar = chars[chars.length - 1]

    if (firstChar?.textObject && lastChar?.textObject) {
      const firstBounds = firstChar.textObject.getBounds()
      const lastBounds = lastChar.textObject.getBounds()

      if (worldX < firstBounds.left) {
        return 0
      } else if (worldX > lastBounds.right) {
        return chars.length
      }
    }

    return cursorPosition
  }

  /**
   * Create or update character GameObjects based on text prop
   */
  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    const scene = container.scene

    // Get the previous displayed text from chars state
    const prevText = chars.map((c) => c.char).join('')

    // Check if text has changed
    if (displayedText === prevText) return

    // Cleanup old character GameObjects
    chars.forEach((charInfo) => {
      if (charInfo.textObject) {
        charInfo.textObject.destroy()
      }
    })

    // Wait for container bounds to be available
    setTimeout(() => {
      const startX = padLeft
      const startY = padTop

      // Get effective max width (use container width if multiline and no explicit maxWidth)
      const effectiveMaxWidth =
        multiline && props.maxWidth !== undefined && typeof props.maxWidth === 'number'
          ? props.maxWidth
          : multiline && props.width !== undefined && typeof props.width === 'number'
            ? props.width - horizontalPadding
            : Infinity

      let lines: LineInfo[]
      let allChars: CharInfo[]

      if (multiline) {
        // Multi-line layout
        lines = breakIntoLines(displayedText, scene, effectiveMaxWidth)
        positionLinesVertically(lines)
        lines = handleOverflow(lines)

        // Flatten lines to chars array
        allChars = []
        for (const line of lines) {
          for (const charInfo of line.chars) {
            allChars.push(charInfo)
          }
        }
      } else {
        // Single-line layout (original logic)
        allChars = []
        let currentX = 0

        for (let i = 0; i < displayedText.length; i++) {
          const char = displayedText.charAt(i)
          const tempText = scene.add.text(0, 0, char, textStyle ?? {})
          const charWidth = tempText.width
          const charHeight = tempText.height
          tempText.destroy()

          allChars.push({
            char,
            textObject: null,
            x: currentX,
            y: 0,
            width: charWidth,
            height: charHeight,
            lineIndex: 0,
            charIndex: i,
            lineCharIndex: i,
          })

          currentX += charWidth + charSpacing
        }

        lines = allChars.length > 0 ? [createLineInfo(allChars, 0)] : []
      }

      // Create GameObjects for all characters
      for (const charInfo of allChars) {
        const textObj = scene.add.text(0, 0, charInfo.char, textStyle ?? {})
        textObj.setOrigin(0, 0)
        textObj.setPosition(startX + charInfo.x, startY + charInfo.y)
        container.add(textObj)
        charInfo.textObject = textObj
      }

      // Calculate total dimensions
      const calculatedWidth = lines.length > 0 ? Math.max(...lines.map((l) => l.width)) : 0
      const lastLine = lines[lines.length - 1]
      const calculatedHeight = lines.length > 0 && lastLine ? lastLine.y + lastLine.height : 0

      // Update state
      setChars(allChars)
      setWidth(calculatedWidth + horizontalPadding)
      setHeight(calculatedHeight + verticalPadding)
    }, 0)

    // Cleanup function
    return () => {
      chars.forEach((charInfo) => {
        if (charInfo.textObject) {
          charInfo.textObject.destroy()
        }
      })
    }
  }, [
    displayedText,
    textStyle,
    charSpacing,
    padLeft,
    padTop,
    horizontalPadding,
    verticalPadding,
    multiline,
    lineHeight,
    maxLines,
    textOverflow,
    wordWrap,
    props.maxWidth,
    props.width,
  ])

  /**
   * Update cursor position and visibility
   */
  useEffect(() => {
    if (!ref.current || !showCursor) {
      // Hide cursor if not needed
      if (cursorRef.current) {
        cursorRef.current.setVisible(false)
        if (cursorTweenRef.current) {
          cursorTweenRef.current.stop()
          cursorTweenRef.current = null
        }
      }
      return
    }

    const container = ref.current
    const scene = container.scene

    // Wait for chars to be ready
    if (chars.length === 0 && displayedText.length > 0) return

    setTimeout(() => {
      const startX = padLeft
      const startY = padTop

      // Find the character at cursor position to get correct line Y
      let cursorX = startX
      let cursorY = startY
      const clampedPosition = Math.max(0, Math.min(cursorPosition, chars.length))

      // Find which line the cursor is on
      if (clampedPosition > 0 && clampedPosition <= chars.length) {
        const charBeforeCursor = chars[clampedPosition - 1]
        if (charBeforeCursor) {
          cursorY = startY + charBeforeCursor.y
        }
      } else if (clampedPosition === 0 && chars.length > 0) {
        const firstChar = chars[0]
        if (firstChar) {
          cursorY = startY + firstChar.y
        }
      }

      // Calculate cursor X position
      for (let i = 0; i < clampedPosition; i++) {
        const char = chars[i]
        if (char) {
          // If we're at the start of a new line, reset X
          const prevChar = chars[i - 1]
          if (i > 0 && prevChar && char.lineIndex !== prevChar.lineIndex) {
            cursorX = startX
          }
          cursorX += char.width + charSpacing
        }
      }

      // Get cursor height from character at cursor line
      let cursorHeight = 20
      const charAtCursor = chars[clampedPosition - 1]
      if (clampedPosition > 0 && charAtCursor) {
        cursorHeight = charAtCursor.height
      } else if (chars.length > 0 && chars[0]) {
        cursorHeight = chars[0].height
      }

      // Create or update cursor rectangle
      if (!cursorRef.current) {
        cursorRef.current = scene.add.rectangle(
          cursorX,
          cursorY,
          cursorWidth,
          cursorHeight,
          cursorColor
        )
        cursorRef.current.setOrigin(0, 0)
        container.add(cursorRef.current)

        // Create blinking tween
        cursorTweenRef.current = scene.tweens.add({
          targets: cursorRef.current,
          alpha: { from: 1, to: 0 },
          duration: cursorBlinkSpeed,
          yoyo: true,
          repeat: -1,
        })
      } else {
        // Update existing cursor
        cursorRef.current.setPosition(cursorX, cursorY)
        cursorRef.current.setSize(cursorWidth, cursorHeight)
        cursorRef.current.setFillStyle(cursorColor)
        cursorRef.current.setVisible(true)

        // Restart blink animation
        if (cursorTweenRef.current) {
          cursorTweenRef.current.stop()
        }
        cursorRef.current.setAlpha(1)
        cursorTweenRef.current = scene.tweens.add({
          targets: cursorRef.current,
          alpha: { from: 1, to: 0 },
          duration: cursorBlinkSpeed,
          yoyo: true,
          repeat: -1,
        })
      }
    }, 10)

    // Cleanup
    return () => {
      if (cursorTweenRef.current) {
        cursorTweenRef.current.stop()
      }
    }
  }, [
    showCursor,
    cursorPosition,
    chars,
    displayedText.length,
    cursorColor,
    cursorWidth,
    cursorBlinkSpeed,
    padLeft,
    padTop,
    charSpacing,
  ])

  /**
   * Render selection background
   */
  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    const scene = container.scene

    // Clear old selection rectangles
    selectionRefs.current.forEach((rect) => rect.destroy())
    selectionRefs.current = []

    // Check if we have a valid selection
    if (selectionStart < 0 || selectionEnd < 0 || selectionStart >= selectionEnd) {
      return
    }

    // Wait for chars to be ready
    if (chars.length === 0) return

    setTimeout(() => {
      const startX = padLeft
      const startY = padTop

      // Calculate selection bounds
      let selectionX = startX
      let selectionWidth = 0

      // Calculate X position for selection start
      for (let i = 0; i < selectionStart && i < chars.length; i++) {
        const char = chars[i]
        if (char) {
          selectionX += char.width + charSpacing
        }
      }

      // Calculate selection width
      for (let i = selectionStart; i < selectionEnd && i < chars.length; i++) {
        const char = chars[i]
        if (char) {
          selectionWidth += char.width + charSpacing
        }
      }

      if (selectionWidth > 0) {
        const selectionHeight = chars[0] ? chars[0].height : 20

        // Create selection rectangle
        const selectionRect = scene.add.rectangle(
          selectionX,
          startY,
          selectionWidth,
          selectionHeight,
          selectionColor,
          selectionAlpha
        )
        selectionRect.setOrigin(0, 0)
        container.add(selectionRect)

        // Move selection behind text
        container.moveDown(selectionRect)

        selectionRefs.current.push(selectionRect)
      }
    }, 15)

    // Cleanup
    return () => {
      selectionRefs.current.forEach((rect) => rect.destroy())
      selectionRefs.current = []
    }
  }, [
    selectionStart,
    selectionEnd,
    chars,
    selectionColor,
    selectionAlpha,
    padLeft,
    padTop,
    charSpacing,
  ])

  return (
    <View
      ref={ref}
      width={width}
      height={height}
      enableGestures={!props.disabled && showCursor}
      onTouch={(data) => {
        if (!showCursor) return
        const pos = getPositionFromPointer(data.pointer.worldX, data.pointer.worldY)
        dragStartPosRef.current = pos
        props.onCursorPositionChange?.(pos)
        props.onSelectionChange?.(-1, -1)
        data.stopPropagation()
      }}
      onTouchMove={(data) => {
        if (!showCursor) return
        if (data.state === 'start') {
          dragStartPosRef.current = getPositionFromPointer(data.pointer.worldX, data.pointer.worldY)
        } else if (data.state === 'move' && dragStartPosRef.current >= 0) {
          const currentPos = getPositionFromPointer(data.pointer.worldX, data.pointer.worldY)
          if (currentPos !== dragStartPosRef.current) {
            const start = Math.min(dragStartPosRef.current, currentPos)
            const end = Math.max(dragStartPosRef.current, currentPos)
            props.onSelectionChange?.(start, end)
          }
        } else if (data.state === 'end') {
          dragStartPosRef.current = -1
        }
        data.stopPropagation()
      }}
      {...props}
      {...themed}
    />
  )
}
