import {
  getThemedProps,
  useEffect,
  useRef,
  useState,
  View,
  type GestureEventData,
} from '@phaserjsx/ui'
import { useGameObjectEffect } from '../../hooks'
import type { CharInfo, CharTextAPI, CharTextProps } from './types'
import {
  breakIntoLines,
  createLineInfo,
  getPositionFromPointer,
  getTextObject,
  handleOverflow,
  positionLinesVertically,
  returnToPool,
} from './utils'

/**
 * CharText component - renders text using individual Phaser Text GameObjects per character
 * @param props - CharText properties
 * @returns CharText JSX element
 */
export function CharText(props: CharTextProps) {
  const { props: themed } = getThemedProps('CharText', undefined, {})
  const internalRef = useRef<Phaser.GameObjects.Container | null>(null)
  const { applyEffect: _applyEffect } = useGameObjectEffect(internalRef)

  // Character state management
  const [chars, setChars] = useState<CharInfo[]>([])
  const charsRef = useRef<CharInfo[]>([])
  const [internalText, setInternalText] = useState('')
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [containerReady, setContainerReady] = useState(false)

  // Object pool for text objects to avoid creating/destroying on every text change
  const textObjectPool = useRef<Phaser.GameObjects.Text[]>([])
  const activeTextObjects = useRef<Phaser.GameObjects.Text[]>([])

  // Track when container is ready
  useEffect(() => {
    if (internalRef.current && !containerReady) {
      setContainerReady(true)
    }
  })

  // Sync external ref with internal ref when container becomes available
  useEffect(() => {
    if (!containerReady || !internalRef.current) return

    const currentRef = props.forwardRef
    currentRef?.(internalRef.current)

    // Cleanup: reset external ref on unmount or ref change
    return () => {
      currentRef?.(null)
    }
  }, [containerReady, props.forwardRef])

  // Cursor management
  const cursorRef = useRef<Phaser.GameObjects.Rectangle | null>(null)
  const cursorTweenRef = useRef<Phaser.Tweens.Tween | null>(null)

  // Selection management
  const selectionRefs = useRef<Phaser.GameObjects.Rectangle[]>([])
  const dragStartPosRef = useRef<number>(-1)

  // Track if we're in controlled mode
  const isControlled = props.text !== undefined
  const displayedText = isControlled ? (props.text ?? '') : internalText

  // Keep charsRef in sync with chars state
  useEffect(() => {
    charsRef.current = chars
  }, [chars])

  // Cleanup all text objects on unmount
  useEffect(() => {
    return () => {
      // Destroy all pooled text objects
      textObjectPool.current.forEach((textObj) => {
        if (textObj && textObj.scene) {
          textObj.destroy()
        }
      })
      textObjectPool.current = []

      // Destroy all active text objects
      activeTextObjects.current.forEach((textObj) => {
        if (textObj && textObj.scene) {
          textObj.destroy()
        }
      })
      activeTextObjects.current = []

      // Also destroy any remaining in chars
      charsRef.current.forEach((charInfo) => {
        if (charInfo.textObject && charInfo.textObject.scene) {
          charInfo.textObject.destroy()
        }
      })
    }
  }, [])

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
            return charInfo.charIndex
          }
        }
      }
      return null
    },
    canFitChar: (char: string, position: number) => {
      // Only applies to single-line mode
      if (multiline) return true

      // If no maxWidth set, always fits
      const effectiveMaxWidth =
        props.maxWidth !== undefined && typeof props.maxWidth === 'number'
          ? props.maxWidth
          : props.width !== undefined && typeof props.width === 'number'
            ? props.width
            : Infinity

      if (effectiveMaxWidth === Infinity) return true

      // Calculate available content width (excluding padding)
      const availableWidth = effectiveMaxWidth - horizontalPadding

      if (!internalRef.current) return false

      const scene = internalRef.current.scene

      // Build the text that would result from inserting the character
      const textWithChar = displayedText.slice(0, position) + char + displayedText.slice(position)

      // Calculate total width of the new text
      let totalWidth = 0
      for (let i = 0; i < textWithChar.length; i++) {
        const c = textWithChar.charAt(i)
        const tempText = scene.add.text(0, 0, c, textStyle ?? {})
        const charWidth = tempText.width
        tempText.destroy()

        totalWidth += charWidth
        if (i < textWithChar.length - 1) {
          totalWidth += charSpacing
        }
      }

      return totalWidth <= availableWidth
    },
  }

  // Store API in ref for external access (future use)
  const apiRef = useRef<CharTextAPI>(api)
  apiRef.current = api

  // Expose API to parent via callback
  useEffect(() => {
    if (containerReady && props.onApiReady) {
      props.onApiReady(api)
    }
  }, [containerReady, props.onApiReady])

  /**
   * Create or update character GameObjects based on text prop
   */
  useEffect(() => {
    if (!internalRef.current) return

    const container = internalRef.current
    const scene = container.scene

    // Get the previous displayed text from chars state
    const prevText = chars.map((c) => c.char).join('')

    // Check if text has changed
    if (displayedText === prevText) return

    // Wait for container bounds to be available
    const timeoutId = setTimeout(() => {
      const startX = padLeft
      const startY = padTop

      // Get effective max width (use container width if multiline and no explicit maxWidth)
      // Important: maxWidth is the content area width, not including padding
      const effectiveMaxWidth =
        multiline && props.maxWidth !== undefined && typeof props.maxWidth === 'number'
          ? props.maxWidth - horizontalPadding
          : multiline && props.width !== undefined && typeof props.width === 'number'
            ? props.width - horizontalPadding
            : Infinity

      let lines: import('./types').LineInfo[]
      let allChars: CharInfo[]

      if (multiline) {
        // Multi-line layout
        lines = breakIntoLines(
          displayedText,
          scene,
          effectiveMaxWidth,
          textStyle,
          charSpacing,
          multiline,
          wordWrap
        )
        positionLinesVertically(lines, lineHeight)
        lines = handleOverflow(lines, maxLines, textOverflow)

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

        lines = allChars.length > 0 ? [createLineInfo(allChars, 0, charSpacing)] : []
      }

      // Assign text objects to characters, reusing from pool
      const usedTextObjects: Phaser.GameObjects.Text[] = []
      for (const charInfo of allChars) {
        const textObj = getTextObject(
          scene,
          container,
          textStyle,
          textObjectPool,
          activeTextObjects
        )
        textObj.setText(charInfo.char)
        textObj.setPosition(startX + charInfo.x, startY + charInfo.y)
        charInfo.textObject = textObj
        usedTextObjects.push(textObj)
      }

      // Return unused active text objects to pool
      const currentActive = [...activeTextObjects.current]
      for (const textObj of currentActive) {
        if (!usedTextObjects.includes(textObj)) {
          returnToPool(textObj, textObjectPool, activeTextObjects)
        }
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

    // Cleanup function - clear timeout
    return () => {
      clearTimeout(timeoutId)
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
    if (!internalRef.current || !showCursor) {
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

    const container = internalRef.current
    const scene = container.scene

    // Wait for chars to be ready
    if (chars.length === 0 && displayedText.length > 0) return

    setTimeout(() => {
      const startX = padLeft
      const startY = padTop

      // Find the character at cursor position to get correct line Y
      let cursorX = startX
      let cursorY = startY
      const clampedPosition = Math.max(0, Math.min(cursorPosition, displayedText.length))

      // Find the character right before the cursor position (charIndex < clampedPosition)
      // The cursor is positioned AFTER this character
      let charBeforeCursor: CharInfo | null = null

      for (const char of chars) {
        if (char.charIndex < clampedPosition) {
          if (!charBeforeCursor || char.charIndex > charBeforeCursor.charIndex) {
            charBeforeCursor = char
          }
        }
      }

      // Position cursor based on the character before it
      if (charBeforeCursor) {
        // Cursor goes after this character
        cursorX = startX + charBeforeCursor.x + charBeforeCursor.width + charSpacing
        cursorY = startY + charBeforeCursor.y
      } else if (chars.length > 0 && chars[0]) {
        // Cursor at position 0 (before first char)
        const firstChar = chars[0]
        cursorX = startX + firstChar.x
        cursorY = startY + firstChar.y
      } else {
        // No chars at all
        cursorX = startX
        cursorY = startY
      }

      // Get cursor height from character before cursor
      let cursorHeight = 20
      if (charBeforeCursor) {
        cursorHeight = charBeforeCursor.height
      } else if (chars.length > 0 && chars[0]) {
        cursorHeight = chars[0].height
      }

      // console.log('cursorPosition', cursorPosition, 'cursorX', cursorX, 'cursorY', cursorY)

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
    if (!internalRef.current) return

    const container = internalRef.current
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

      // Group selected characters by line
      const lineGroups = new Map<number, CharInfo[]>()

      // Filter chars by their charIndex (text position), not array index
      for (const char of chars) {
        if (char && char.charIndex >= selectionStart && char.charIndex < selectionEnd) {
          const lineIndex = char.lineIndex
          if (!lineGroups.has(lineIndex)) {
            lineGroups.set(lineIndex, [])
          }
          lineGroups.get(lineIndex)?.push(char)
        }
      }

      // Create one selection rectangle per line
      for (const [_lineIndex, lineChars] of lineGroups) {
        if (lineChars.length === 0) continue

        const firstChar = lineChars[0]
        const lastChar = lineChars[lineChars.length - 1]

        if (firstChar && lastChar) {
          const selectionX = startX + firstChar.x
          const selectionY = startY + firstChar.y
          const selectionWidth =
            lastChar.x + lastChar.width - firstChar.x + (lineChars.length > 1 ? charSpacing : 0)
          const selectionHeight = firstChar.height

          // Create selection rectangle for this line
          const selectionRect = scene.add.rectangle(
            selectionX,
            selectionY,
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
      ref={internalRef}
      width={width}
      height={height}
      enableGestures={!props.disabled && showCursor}
      onTouch={(data: GestureEventData) => {
        if (!showCursor) return
        const pos = getPositionFromPointer(
          data.pointer.worldX,
          data.pointer.worldY,
          chars,
          cursorPosition
        )
        dragStartPosRef.current = pos
        props.onCursorPositionChange?.(pos)
        props.onSelectionChange?.(-1, -1)
        data.stopPropagation()
      }}
      onTouchMove={(data: GestureEventData) => {
        if (!showCursor) return
        if (data.state === 'start') {
          dragStartPosRef.current = getPositionFromPointer(
            data.pointer.worldX,
            data.pointer.worldY,
            chars,
            cursorPosition
          )
        } else if (data.state === 'move' && dragStartPosRef.current >= 0) {
          const currentPos = getPositionFromPointer(
            data.pointer.worldX,
            data.pointer.worldY,
            chars,
            cursorPosition
          )
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
