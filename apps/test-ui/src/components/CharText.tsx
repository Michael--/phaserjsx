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
  const [displayedText, setDisplayedText] = useState('')
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

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

  const text = props.text ?? ''

  /**
   * Create or update character GameObjects based on text prop
   */
  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    const scene = container.scene

    // Check if text has changed
    if (text === displayedText) return

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
      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i)
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
      setDisplayedText(text)
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
  }, [text, textStyle, charSpacing, padLeft, padTop, horizontalPadding, verticalPadding])

  return (
    <View
      ref={ref}
      width={width}
      height={height}
      enableGestures={!props.disabled}
      {...props}
      {...themed}
    />
  )
}
