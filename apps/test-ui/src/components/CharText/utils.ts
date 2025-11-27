import type { CharInfo, LineInfo } from './types'

type MutableRefObject<T> = { current: T }

/**
 * Break text into lines based on width constraints
 */
export const breakIntoLines = (
  text: string,
  scene: Phaser.Scene,
  effectiveMaxWidth: number,
  textStyle: Phaser.Types.GameObjects.Text.TextStyle | undefined,
  charSpacing: number,
  multiline: boolean,
  wordWrap: boolean
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
      lines.push(createLineInfo(currentLine, currentLineIndex, charSpacing))
      currentLine = []
      currentLineIndex++
      currentX = 0
      charIndex++
      continue
    }

    // Check if we need to wrap (check with spacing included for existing chars)
    const nextX = currentX + charWidth
    const wouldExceedWidth = currentLine.length > 0 ? nextX > effectiveMaxWidth : false

    if (multiline && wouldExceedWidth) {
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
          // Break at space - remove space and everything after it
          const charsToMove = currentLine.splice(lastSpaceIdx + 1)
          // Remove the space itself from current line
          currentLine.splice(lastSpaceIdx, 1)

          lines.push(createLineInfo(currentLine, currentLineIndex, charSpacing))
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
          // No space found, hard break - current char goes to next line
          lines.push(createLineInfo(currentLine, currentLineIndex, charSpacing))
          currentLine = []
          currentLineIndex++
          currentX = 0
        }
      } else {
        // Hard break (or at space) - current char goes to next line
        lines.push(createLineInfo(currentLine, currentLineIndex, charSpacing))
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
    lines.push(createLineInfo(currentLine, currentLineIndex, charSpacing))
  }

  return lines
}

/**
 * Create LineInfo from array of CharInfo
 */
export const createLineInfo = (
  chars: CharInfo[],
  lineIndex: number,
  charSpacing: number
): LineInfo => {
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
export const positionLinesVertically = (lines: LineInfo[], lineHeight: number): void => {
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
export const handleOverflow = (
  lines: LineInfo[],
  maxLines?: number,
  textOverflow?: 'clip' | 'ellipsis'
): LineInfo[] => {
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
export const getPositionFromPointer = (
  worldX: number,
  worldY: number,
  chars: CharInfo[],
  cursorPosition: number
): number => {
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
        return charInfo.charIndex + 1
      }
    }
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
      // Return position after last character in original text
      return lastChar.charIndex + 1
    }
  }

  return cursorPosition
}

/**
 * Get a text object from pool or create new one
 */
export const getTextObject = (
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  textStyle: Phaser.Types.GameObjects.Text.TextStyle | undefined,
  textObjectPool: MutableRefObject<Phaser.GameObjects.Text[]>,
  activeTextObjects: MutableRefObject<Phaser.GameObjects.Text[]>
): Phaser.GameObjects.Text => {
  let textObj = textObjectPool.current.pop()
  if (textObj != null) {
    textObj.setVisible(true)
  } else {
    textObj = scene.add.text(0, 0, '', textStyle ?? {})
    textObj.setOrigin(0, 0)
    container.add(textObj)
  }
  activeTextObjects.current.push(textObj)
  return textObj
}

/**
 * Return a text object to pool (make invisible)
 */
export const returnToPool = (
  textObj: Phaser.GameObjects.Text,
  textObjectPool: MutableRefObject<Phaser.GameObjects.Text[]>,
  activeTextObjects: MutableRefObject<Phaser.GameObjects.Text[]>
): void => {
  textObj.setVisible(false)
  const index = activeTextObjects.current.indexOf(textObj)
  if (index > -1) {
    activeTextObjects.current.splice(index, 1)
  }
  textObjectPool.current.push(textObj)
}
