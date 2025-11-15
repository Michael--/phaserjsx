/**
 * Size resolution utilities for handling different size value types
 * Supports fixed pixels, percentages, auto sizing, and calc() expressions
 */
import type { CalcExpression, CalcOperand, ParsedSize } from '../types'

// Re-export for convenience
export type { ParsedSize } from '../types'

/**
 * Parse a calc operand (e.g., "50%" or "20px")
 * @param operand - String operand from calc expression
 * @returns Parsed operand
 */
function parseCalcOperand(operand: string): CalcOperand {
  const trimmed = operand.trim()

  // Percentage: "50%"
  const percentMatch = trimmed.match(/^(\d+(?:\.\d+)?)%$/)
  if (percentMatch && percentMatch[1]) {
    return { type: 'percent', value: parseFloat(percentMatch[1]) }
  }

  // Fixed pixels: "20px" or "20"
  const pixelMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)(?:px)?$/)
  if (pixelMatch && pixelMatch[1]) {
    return { type: 'fixed', value: parseFloat(pixelMatch[1]) }
  }

  throw new Error(`[Size] Invalid calc operand: "${operand}"`)
}

/**
 * Parse a calc() expression
 * @param expr - Calc expression string without "calc(" prefix
 * @returns Parsed calc expression
 */
function parseCalcExpression(expr: string): CalcExpression {
  // Support: +, -, *, /
  // Find operator (look for operators not inside parentheses)
  const operators = ['+', '-', '*', '/']

  for (const op of operators) {
    const parts = expr.split(op)
    if (parts.length === 2 && parts[0] && parts[1]) {
      return {
        left: parseCalcOperand(parts[0]),
        operator: op as '+' | '-' | '*' | '/',
        right: parseCalcOperand(parts[1]),
      }
    }
  }

  throw new Error(`[Size] Invalid calc expression: "calc(${expr})"`)
}

/**
 * Parse a size value into its components
 * @param size - Size value (number, string, or undefined)
 * @returns Parsed size information
 * @throws Error if string format is invalid
 *
 * @example
 * parseSize(100)                    // { type: 'fixed', value: 100 }
 * parseSize('50%')                  // { type: 'percent', value: 50 }
 * parseSize('calc(100% - 40px)')    // { type: 'calc', calc: {...} }
 * parseSize(undefined)              // { type: 'auto' }
 * parseSize('auto')                 // { type: 'auto' }
 */
export function parseSize(size: number | string | undefined): ParsedSize {
  // undefined -> auto (dynamic based on content)
  if (size === undefined) {
    return { type: 'auto' }
  }

  // number -> fixed pixel value
  if (typeof size === 'number') {
    return { type: 'fixed', value: size }
  }

  // string -> parse format
  if (size === 'auto') {
    return { type: 'auto' }
  }

  if (size === 'fill') {
    return { type: 'fill' }
  }

  // Calc expression: "calc(100% - 40px)"
  const calcMatch = size.match(/^calc\((.+)\)$/)
  if (calcMatch && calcMatch[1]) {
    return { type: 'calc', calc: parseCalcExpression(calcMatch[1]) }
  }

  // Percentage format: "50%", "75.5%", "100%"
  const percentMatch = size.match(/^(\d+(?:\.\d+)?)%$/)
  if (percentMatch && percentMatch[1]) {
    const value = parseFloat(percentMatch[1])
    if (value < 0 || value > 100) {
      console.warn(`[Size] Percentage value ${value}% is outside valid range (0-100%)`)
    }
    return { type: 'percent', value }
  }

  // Unknown format
  throw new Error(
    `[Size] Invalid size format: "${size}". Supported formats: number, "X%", "calc(...)", "auto", "fill", undefined`
  )
}

/**
 * Resolve a calc operand to pixel value
 * @param operand - Calc operand
 * @param parentSize - Parent dimension for percentage resolution
 * @returns Resolved pixel value
 */
function resolveCalcOperand(operand: CalcOperand, parentSize?: number): number {
  if (operand.type === 'fixed') {
    return operand.value
  }

  // Percentage
  if (parentSize === undefined) {
    console.warn(`[Size] Cannot resolve percentage in calc() without parent size. Using 0.`)
    return 0
  }
  return (parentSize * operand.value) / 100
}

/**
 * Resolve a calc expression to pixel value
 * @param calc - Calc expression
 * @param parentSize - Parent dimension for percentage resolution
 * @returns Resolved pixel value
 */
function resolveCalcExpression(calc: CalcExpression, parentSize?: number): number {
  const left = resolveCalcOperand(calc.left, parentSize)
  const right = resolveCalcOperand(calc.right, parentSize)

  switch (calc.operator) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      if (right === 0) {
        console.error('[Size] Division by zero in calc expression')
        return 0
      }
      return left / right
    default:
      console.error(`[Size] Unknown calc operator: ${calc.operator}`)
      return 0
  }
}

/**
 * Resolve a parsed size to actual pixel value
 * @param parsed - Parsed size information
 * @param parentSize - Parent dimension in pixels (required for percentage and calc)
 * @param contentSize - Content dimension in pixels (fallback for auto)
 * @param parentPadding - Parent padding in the relevant direction (for fill)
 * @returns Resolved size in pixels
 *
 * @example
 * resolveSize({ type: 'fixed', value: 100 }, 200)                    // 100
 * resolveSize({ type: 'percent', value: 50 }, 200)                   // 100 (50% of 200)
 * resolveSize({ type: 'calc', calc: {...} }, 200)                    // calc result
 * resolveSize({ type: 'auto' }, 200, 150)                            // 150 (content size)
 * resolveSize({ type: 'fill' }, 200, undefined, 40)                  // 160 (200 - 40)
 */
export function resolveSize(
  parsed: ParsedSize,
  parentSize?: number,
  contentSize?: number,
  parentPadding?: number
): number {
  switch (parsed.type) {
    case 'fixed':
      return parsed.value ?? 100

    case 'percent':
      if (parentSize === undefined) {
        // Only warn if we also don't have a fallback content size
        if (contentSize === undefined) {
          console.warn(
            `[Size] Cannot resolve percentage without parent size and no content fallback.`
          )
          return 100
        }
        // Parent size will be available in next layout pass - use content size for now
        return contentSize
      }
      return (parentSize * (parsed.value ?? 0)) / 100

    case 'calc':
      if (!parsed.calc) {
        console.error('[Size] Calc type without calc expression')
        return 100
      }
      return resolveCalcExpression(parsed.calc, parentSize)

    case 'auto':
      if (contentSize === undefined) {
        console.warn('[Size] Auto size without content size, using fallback 100px')
        return 100
      }
      return contentSize

    case 'fill': {
      if (parentSize === undefined) {
        console.warn('[Size] Fill size without parent size, using fallback 100px')
        return 100
      }
      // Fill = parent size minus padding (content-area)
      if (parentPadding !== undefined && parentPadding > 0) {
        return Math.max(0, parentSize - parentPadding)
      }
      // No padding or already content-area
      return parentSize
    }

    default:
      // Should never happen with proper typing
      console.error(`[Size] Unknown size type: ${(parsed as ParsedSize).type}`)
      return 100
  }
}

/**
 * Check if a size needs parent context to resolve
 * @param parsed - Parsed size information
 * @returns True if size requires parent dimension
 */
export function requiresParent(parsed: ParsedSize): boolean {
  if (parsed.type === 'percent' || parsed.type === 'fill') {
    return true
  }

  // Calc expressions might contain percentages
  if (parsed.type === 'calc' && parsed.calc) {
    return parsed.calc.left.type === 'percent' || parsed.calc.right.type === 'percent'
  }

  return false
}

/**
 * Check if a size can be determined without content measurement
 * @param parsed - Parsed size information
 * @returns True if size is explicitly defined (not auto)
 */
export function isExplicit(parsed: ParsedSize): boolean {
  return (
    parsed.type === 'fixed' ||
    parsed.type === 'percent' ||
    parsed.type === 'calc' ||
    parsed.type === 'fill'
  )
}
