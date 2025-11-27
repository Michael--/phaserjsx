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

    // Create new character array
    const newChars: CharInfo[] = []
    let currentX = 0
    let maxHeight = 0

    // Wait for container bounds to be available
    setTimeout(() => {
      const bounds = container.getBounds()
      const startX = bounds.left + padLeft
      const startY = bounds.top + padTop

      // Create a character GameObject for each character
      for (let i = 0; i < displayedText.length; i++) {
        const char = displayedText.charAt(i)
        const textObj = scene.add.text(0, 0, char, textStyle ?? {})
        textObj.setOrigin(0, 0)

        const charWidth = textObj.width
        const charHeight = textObj.height

        // Position the character
        const x = startX + currentX
        const y = startY

        textObj.setPosition(x, y)

        // Add to container
        container.add(textObj)

        // Store character info
        newChars.push({
          char,
          textObject: textObj,
          x: currentX,
          y: 0,
          width: charWidth,
          height: charHeight,
          lineIndex: 0,
          charIndex: i,
        })

        // Update position for next character
        currentX += charWidth + charSpacing
        maxHeight = Math.max(maxHeight, charHeight)
      }

      // Update state
      setChars(newChars)
      setWidth(currentX - charSpacing + horizontalPadding)
      setHeight(maxHeight + verticalPadding)
    }, 0)

    // Cleanup function
    return () => {
      newChars.forEach((charInfo) => {
        if (charInfo.textObject) {
          charInfo.textObject.destroy()
        }
      })
    }
  }, [displayedText, textStyle, charSpacing, padLeft, padTop, horizontalPadding, verticalPadding])

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

      // Calculate cursor X position based on cursorPosition
      let cursorX = startX
      const clampedPosition = Math.max(0, Math.min(cursorPosition, chars.length))

      for (let i = 0; i < clampedPosition; i++) {
        const char = chars[i]
        if (char) {
          cursorX += char.width + charSpacing
        }
      }

      // Get cursor height from first character or default
      const cursorHeight = chars.length > 0 && chars[0] ? chars[0].height : 20

      // Create or update cursor rectangle
      if (!cursorRef.current) {
        cursorRef.current = scene.add.rectangle(
          cursorX,
          startY,
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
        cursorRef.current.setPosition(cursorX, startY)
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
