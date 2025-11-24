/**
 * Size resolution utilities for handling different size value types
 * Supports fixed pixels, percentages, viewport units (vw/vh), auto sizing, and calc() expressions
 */
import { DebugLogger } from '../../dev-config'
import { viewportRegistry } from '../../viewport-context'
import type { CalcExpression, CalcOperand, ParsedSize } from '../types'

// Re-export for convenience
export type { ParsedSize } from '../types'

/**
 * Cache for parseSize results to avoid repeated string parsing
 * Key: original size value, Value: parsed size object
 */
const parseSizeCache = new Map<unknown, ParsedSize>()

/**
 * Set of size values that already triggered a warning
 * Prevents console spam from repeated warnings for the same invalid value
 */
const warnedSizes = new Set<string>()

/**
 * Parse a calc operand (e.g., "50%" or "20px" or "100vw")
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

  // Viewport width: "100vw"
  const vwMatch = trimmed.match(/^(\d+(?:\.\d+)?)vw$/)
  if (vwMatch && vwMatch[1]) {
    return { type: 'vw', value: parseFloat(vwMatch[1]) }
  }

  // Viewport height: "100vh"
  const vhMatch = trimmed.match(/^(\d+(?:\.\d+)?)vh$/)
  if (vhMatch && vhMatch[1]) {
    return { type: 'vh', value: parseFloat(vhMatch[1]) }
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
  // Remove spaces
  expr = expr.replace(/\s+/g, '')

  // Simple recursive parser for calc expressions
  function parseExpression(str: string): CalcExpression | CalcOperand {
    str = str.trim()

    // Handle parentheses
    if (str.startsWith('(') && str.endsWith(')')) {
      return parseExpression(str.slice(1, -1))
    }

    // Check if it's just an operand
    try {
      return parseCalcOperand(str)
    } catch {
      // Not an operand, continue parsing
    }

    // Find operators, respecting precedence: * / before + -
    const operators = ['+', '-', '*', '/']
    let parenDepth = 0
    let lastOpIndex = -1
    let lastOp = ''

    for (let i = str.length - 1; i >= 0; i--) {
      const char = str.charAt(i)
      if (char === ')') parenDepth++
      else if (char === '(') parenDepth--
      else if (parenDepth === 0 && operators.includes(char)) {
        // Check precedence: prefer * / over + -
        if (char === '*' || char === '/' || (lastOp !== '*' && lastOp !== '/')) {
          lastOpIndex = i
          lastOp = char
          if (char === '+' || char === '-') break // Lowest precedence, stop here
        }
      }
    }

    if (lastOpIndex === -1) {
      throw new Error(`[Size] No valid operator found in calc expression: "${str}"`)
    }

    const leftStr = str.slice(0, lastOpIndex)
    const rightStr = str.slice(lastOpIndex + 1)

    if (!leftStr || !rightStr) {
      throw new Error(`[Size] Invalid calc expression: "${str}"`)
    }

    return {
      left: parseExpression(leftStr),
      operator: lastOp as '+' | '-' | '*' | '/',
      right: parseExpression(rightStr),
    }
  }

  return parseExpression(expr) as CalcExpression
}

/**
 * Parse a size value into its components
 * Results are cached to avoid repeated string parsing during layout calculations
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
  // Debug: Track parseSize call frequency
  // console.log('parseSize called:', size)

  // Check cache first (huge performance win for repeated calls)
  const cached = parseSizeCache.get(size)
  if (cached !== undefined) {
    return cached
  }

  // Parse the size value
  const result = parseSizeInternal(size)

  // Cache the result for future calls
  parseSizeCache.set(size, result)

  return result
}

/**
 * Internal parsing logic for size values
 * Separated to allow caching in parseSize()
 * @param size - Size value to parse
 * @returns Parsed size information
 */
function parseSizeInternal(size: number | string | undefined): ParsedSize {
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
      // Only warn once per unique invalid value to prevent console spam
      const warnKey = `percent:${value}`
      if (!warnedSizes.has(warnKey)) {
        warnedSizes.add(warnKey)
        DebugLogger.warn('Size', `Percentage value ${value}% is outside valid range (0-100%)`)
      }
    }
    return { type: 'percent', value }
  }

  // Viewport width: "100vw", "50vw"
  const vwMatch = size.match(/^(\d+(?:\.\d+)?)vw$/)
  if (vwMatch && vwMatch[1]) {
    return { type: 'vw', value: parseFloat(vwMatch[1]) }
  }

  // Viewport height: "100vh", "50vh"
  const vhMatch = size.match(/^(\d+(?:\.\d+)?)vh$/)
  if (vhMatch && vhMatch[1]) {
    return { type: 'vh', value: parseFloat(vhMatch[1]) }
  }

  // Unknown format
  throw new Error(
    `[Size] Invalid size format: "${size}". Supported formats: number, "X%", "XvW", "Xvh", "calc(...)", "auto", "fill", undefined`
  )
}

/**
 * Resolve a calc operand to pixel value
 * @param operand - Calc operand or sub-expression
 * @param parentSize - Parent dimension for percentage resolution
 * @param viewportSize - Viewport dimensions for vw/vh resolution
 * @returns Resolved pixel value
 */
function resolveCalcOperand(
  operand: CalcOperand | CalcExpression,
  parentSize?: number,
  viewportSize?: { width: number; height: number }
): number {
  if ('type' in operand) {
    // It's a CalcOperand
    if (operand.type === 'fixed') {
      return operand.value
    }

    // Percentage
    if (operand.type === 'percent') {
      if (parentSize === undefined) {
        DebugLogger.warn(
          'Size',
          'Cannot resolve percentage in calc() without parent size. Using 0.'
        )
        return 0
      }
      return (parentSize * operand.value) / 100
    }

    // Viewport width
    if (operand.type === 'vw') {
      const viewport = viewportSize || viewportRegistry.getViewport()
      if (!viewport) {
        DebugLogger.warn('Size', 'Cannot resolve vw without viewport size. Using 0.')
        return 0
      }
      return (viewport.width * operand.value) / 100
    }

    // Viewport height
    if (operand.type === 'vh') {
      const viewport = viewportSize || viewportRegistry.getViewport()
      if (!viewport) {
        DebugLogger.warn('Size', 'Cannot resolve vh without viewport size. Using 0.')
        return 0
      }
      return (viewport.height * operand.value) / 100
    }

    return 0
  } else {
    // It's a CalcExpression
    return resolveCalcExpression(operand, parentSize, viewportSize)
  }
}

/**
 * Resolve a calc expression to pixel value
 * @param calc - Calc expression
 * @param parentSize - Parent dimension for percentage resolution
 * @param viewportSize - Viewport dimensions for vw/vh resolution
 * @returns Resolved pixel value
 */
function resolveCalcExpression(
  calc: CalcExpression,
  parentSize?: number,
  viewportSize?: { width: number; height: number }
): number {
  const left = resolveCalcOperand(calc.left, parentSize, viewportSize)
  const right = resolveCalcOperand(calc.right, parentSize, viewportSize)

  switch (calc.operator) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      if (right === 0) {
        DebugLogger.error('Size', 'Division by zero in calc expression')
        return 0
      }
      return left / right
    default:
      DebugLogger.error('Size', `Unknown calc operator: ${calc.operator}`)
      return 0
  }
}

/**
 * Resolve a parsed size to actual pixel value
 * @param parsed - Parsed size information
 * @param parentSize - Parent dimension in pixels (required for percentage and calc)
 * @param contentSize - Content dimension in pixels (fallback for auto)
 * @param parentPadding - Parent padding in the relevant direction (for fill)
 * @param viewportSize - Viewport dimensions for vw/vh resolution
 * @returns Resolved size in pixels
 *
 * @example
 * resolveSize({ type: 'fixed', value: 100 }, 200)                    // 100
 * resolveSize({ type: 'percent', value: 50 }, 200)                   // 100 (50% of 200)
 * resolveSize({ type: 'vw', value: 100 }, undefined, undefined, undefined, viewport) // viewport.width
 * resolveSize({ type: 'vh', value: 50 }, undefined, undefined, undefined, viewport)  // viewport.height * 0.5
 * resolveSize({ type: 'calc', calc: {...} }, 200)                    // calc result
 * resolveSize({ type: 'auto' }, 200, 150)                            // 150 (content size)
 * resolveSize({ type: 'fill' }, 200, undefined, 40)                  // 160 (200 - 40)
 */
export function resolveSize(
  parsed: ParsedSize,
  parentSize?: number,
  contentSize?: number,
  parentPadding?: number,
  viewportSize?: { width: number; height: number }
): number {
  switch (parsed.type) {
    case 'fixed':
      return parsed.value ?? 100

    case 'percent':
      if (parentSize === undefined) {
        // Only warn if we also don't have a fallback content size
        if (contentSize === undefined) {
          DebugLogger.warn(
            'Size',
            'Cannot resolve percentage without parent size and no content fallback.'
          )
          return 100
        }
        // Parent size will be available in next layout pass - use content size for now
        return contentSize
      }
      return (parentSize * (parsed.value ?? 0)) / 100

    case 'vw': {
      const viewport = viewportSize || viewportRegistry.getViewport()
      if (!viewport) {
        DebugLogger.warn('Size', 'Cannot resolve vw without viewport size. Using fallback 100px')
        return 100
      }
      return (viewport.width * (parsed.value ?? 0)) / 100
    }

    case 'vh': {
      const viewport = viewportSize || viewportRegistry.getViewport()
      if (!viewport) {
        DebugLogger.warn('Size', 'Cannot resolve vh without viewport size. Using fallback 100px')
        return 100
      }
      return (viewport.height * (parsed.value ?? 0)) / 100
    }

    case 'calc':
      if (!parsed.calc) {
        DebugLogger.error('Size', 'Calc type without calc expression')
        return 100
      }
      return resolveCalcExpression(parsed.calc, parentSize, viewportSize)

    case 'auto':
      if (contentSize === undefined) {
        DebugLogger.warn('Size', 'Auto size without content size, using fallback 100px')
        return 100
      }
      return contentSize

    case 'fill': {
      if (parentSize === undefined) {
        // this would be possible at startup before parent sizes are known, therefore just return 0
        // DebugLogger.warn('Size', 'Fill size without parent size, using fallback 0px')
        return 0
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
      DebugLogger.error('Size', `Unknown size type: ${(parsed as ParsedSize).type}`)
      return 100
  }
}

/**
 * Clear the parseSize cache and warning deduplication set
 * Useful for testing or memory management in long-running applications
 *
 * @example
 * ```typescript
 * // Clear caches after major UI rebuild
 * clearSizeCaches()
 * ```
 */
export function clearSizeCaches(): void {
  parseSizeCache.clear()
  warnedSizes.clear()
}

/**
 * Check if a calc expression requires parent context
 * @param calc - Calc expression
 * @returns True if expression contains percentages
 */
function calcRequiresParent(calc: CalcExpression): boolean {
  const checkOperand = (op: CalcOperand | CalcExpression): boolean => {
    if ('type' in op) {
      return op.type === 'percent'
    } else {
      return calcRequiresParent(op)
    }
  }
  return checkOperand(calc.left) || checkOperand(calc.right)
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
    return calcRequiresParent(parsed.calc)
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
    parsed.type === 'vw' ||
    parsed.type === 'vh' ||
    parsed.type === 'calc' ||
    parsed.type === 'fill'
  )
}

/**
 * Clamp a size value to min/max constraints
 * Min/max constraints can be SizeValue (pixels, percentage, viewport units, calc)
 * They are resolved relative to the same parent/viewport context as the size itself
 *
 * @param size - Resolved size in pixels
 * @param minSize - Minimum size constraint (SizeValue or undefined = no constraint)
 * @param maxSize - Maximum size constraint (SizeValue or undefined = no constraint)
 * @param parentSize - Parent dimension for percentage resolution in constraints
 * @param fallbackSize - Fallback size for auto constraints (not typically used for min/max)
 * @param parentPadding - Parent padding for fill constraints (not typically used for min/max)
 * @returns Clamped size in pixels
 *
 * @example
 * clampSize(150, 100, 200)  // 150 (within bounds)
 * clampSize(50, 100, 200)   // 100 (clamped to min)
 * clampSize(300, 100, 200)  // 200 (clamped to max)
 * clampSize(150, undefined, "80%", 1000)  // 150 (max = 800px)
 * clampSize(1000, undefined, "80%", 1000) // 800 (clamped to 80% of parent)
 */
export function clampSize(
  size: number,
  minSize?: number | string,
  maxSize?: number | string,
  parentSize?: number,
  fallbackSize?: number,
  parentPadding?: number
): number {
  let clamped = size

  // Resolve and apply minimum constraint
  if (minSize !== undefined) {
    const parsedMin = parseSize(minSize)
    const resolvedMin = resolveSize(parsedMin, parentSize, fallbackSize, parentPadding)
    if (clamped < resolvedMin) {
      clamped = resolvedMin
    }
  }

  // Resolve and apply maximum constraint
  if (maxSize !== undefined) {
    const parsedMax = parseSize(maxSize)
    const resolvedMax = resolveSize(parsedMax, parentSize, fallbackSize, parentPadding)
    if (clamped > resolvedMax) {
      clamped = resolvedMax
    }
  }

  return clamped
}
