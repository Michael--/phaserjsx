import type * as PhaserJSX from '@phaserjsx/ui'
import {
  DOMInputElement,
  getThemedProps,
  Text,
  useEffect,
  useRef,
  View,
  type DOMInputConfig,
  type InputEventData,
  type KeyboardEventData,
} from '@phaserjsx/ui'

/**
 * TextInput theme configuration
 */
type TextInputTheme = PhaserJSX.ViewTheme & {
  textStyle?: {
    fontFamily?: string
    fontSize?: string
    color?: string
  }
  focusedBorderColor?: number
  disabledColor?: number
}

// Module augmentation to add TextInput theme to CustomComponentThemes
declare module '@phaserjsx/ui' {
  interface CustomComponentThemes {
    TextInput: TextInputTheme
  }
}

/**
 * Props for TextInput component
 */
export interface TextInputProps {
  /** Input value (controlled) */
  value?: string
  /** Placeholder text */
  placeholder?: string
  /** Input type (text, password, email, etc.) */
  type?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Maximum length of input */
  maxLength?: number
  /** Width of input */
  width?: number
  /** Height of input */
  height?: number
  /** Called when input value changes */
  onChange?: (event: InputEventData) => void
  /** Called when key is pressed */
  onKeyDown?: (event: KeyboardEventData) => void
  /** Called when key is released */
  onKeyUp?: (event: KeyboardEventData) => void
  /** Called when input receives focus */
  onFocus?: () => void
  /** Called when input loses focus */
  onBlur?: () => void
  /** Called when Enter key is pressed */
  onSubmit?: (value: string) => void
}

/**
 * TextInput component with DOM overlay for native keyboard support
 * @param props - TextInput properties
 * @returns TextInput JSX element
 */
export function TextInput(props: TextInputProps) {
  const { props: themed } = getThemedProps('TextInput', undefined, {})
  const containerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const inputRef = useRef<DOMInputElement | null>(null)

  const width = props.width ?? 200
  const height = props.height ?? 40

  // Setup DOM input element
  useEffect(() => {
    if (!containerRef.current) return

    const config: DOMInputConfig = {
      type: props.type ?? 'text',
      // ...(props.placeholder !== undefined && { placeholder: props.placeholder }),
      value: props.value ?? '',
      ...(props.disabled !== undefined && { disabled: props.disabled }),
      ...(props.maxLength !== undefined && { maxLength: props.maxLength }),
      onInput: (value, event) => {
        if (props.onChange) {
          const inputEventData: InputEventData = {
            value,
            event,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onChange(inputEventData)
        }
      },
      onKeyDown: (event) => {
        if (props.onKeyDown) {
          const keyboardEventData: KeyboardEventData = {
            event,
            key: event.key,
            code: event.code,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            repeat: event.repeat,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onKeyDown(keyboardEventData)
        }

        // Handle Enter key for submit
        if (event.key === 'Enter' && props.onSubmit) {
          const input = inputRef.current?.getElement()
          if (input) {
            props.onSubmit(input.value)
          }
        }
      },
      onKeyUp: (event) => {
        if (props.onKeyUp) {
          const keyboardEventData: KeyboardEventData = {
            event,
            key: event.key,
            code: event.code,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            metaKey: event.metaKey,
            repeat: event.repeat,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
          props.onKeyUp(keyboardEventData)
        }
      },
      onFocus: () => {
        props.onFocus?.()
      },
      onBlur: () => {
        props.onBlur?.()
      },
      styles: {
        fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
        fontSize: themed.textStyle?.fontSize ?? '16px',
        paddingLeft: '12px',
        paddingRight: '12px',
        border: '2px solid #ff0000',
      } as Partial<CSSStyleDeclaration>,
    }

    console.log(
      'Container position:',
      containerRef.current.x,
      containerRef.current.y,
      containerRef.current.width,
      containerRef.current.height
    )

    inputRef.current = new DOMInputElement(containerRef.current, config)

    return () => {
      inputRef.current?.destroy()
      inputRef.current = null
    }
  }, [
    containerRef.current,
    props.type,
    props.placeholder,
    props.disabled,
    props.maxLength,
    themed.textStyle?.fontFamily,
    themed.textStyle?.fontSize,
    themed.textStyle?.color,
    themed.backgroundColor,
    themed.borderColor,
    themed.borderWidth,
    themed.cornerRadius,
    themed.disabledColor,
  ])

  // Update value when props change
  useEffect(() => {
    if (inputRef.current && props.value !== undefined) {
      inputRef.current.setValue(props.value)
    }
  }, [props.value])

  // get the text to display, text when existing (length > 0), otherwise placeholder
  const text = props.value && props.value.length > 0 ? props.value : props.placeholder

  return (
    <View
      ref={containerRef}
      width={width}
      height={height}
      backgroundColor={
        props.disabled
          ? (themed.disabledColor ?? themed.backgroundColor)
          : (themed.backgroundColor ?? 0x2a2a2a)
      }
      borderColor={themed.borderColor ?? 0x666666}
      borderWidth={themed.borderWidth ?? 2}
      cornerRadius={typeof themed.cornerRadius === 'number' ? themed.cornerRadius : 4}
      justifyContent={'center'}
      alignItems={'start'}
      padding={{ left: 12, right: 12 }}
    >
      <Text
        text={text ?? ''}
        style={{
          fontFamily: themed.textStyle?.fontFamily ?? 'Arial, sans-serif',
          fontSize: themed.textStyle?.fontSize ?? '16px',
          color: themed.textStyle?.color ?? '#ffffff',
        }}
      />
    </View>
  )
}
