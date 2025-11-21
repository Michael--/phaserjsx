/**
 * Text component - Phaser Text GameObject for rendering text
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 *
 * 1. Component Role: TEXT RENDERING
 *    Purpose: Display styled text in UI layouts
 *    Phaser Type: Phaser.GameObjects.Text (bitmap-based text rendering)
 *    Characteristics:
 *    - Layout-aware by default (participates in parent layout)
 *    - Auto-sizing based on text content + font metrics
 *    - Supports Phaser text styling (color, font, alignment, etc.)
 *
 * 2. Headless Default: FALSE ✅
 *    Decision: Text participates in layout by default
 *    Reasoning:
 *    - Text is a UI element (labels, paragraphs, buttons)
 *    - Should affect parent container dimensions
 *    - Similar to HTML text nodes
 *    Use Cases:
 *    - ✅ Layout-aware (default): Labels, buttons, paragraphs, UI text
 *    - ❌ Headless (optional): Floating damage numbers, debug text, tooltips
 *    Usage:
 *      <Text text="Label" />                    // Layout-aware
 *      <Text text="+100" headless={true} />    // Floating (no layout impact)
 *
 * 3. Layout Size Provider: UNROTATED DIMENSIONS ✅
 *    Implementation: Uses text.width and text.height (unrotated)
 *    Behavior:
 *    - Returns unrotated text dimensions
 *    - Rotation is IGNORED for layout-aware text (headless=false)
 *    - Rotation only works with headless=true (no layout impact)
 *    Reasoning:
 *    - Flow layout is incompatible with rotation (causes positioning issues)
 *    - Rotated text would overlap siblings in flow layout
 *    - getBounds() position compensation is complex and error-prone
 *    Example:
 *      <Text text="Hello" />                        // ✅ Layout size: 100x20
 *      <Text text="World" rotation={Math.PI/4} />   // ⚠️ Rotation IGNORED, size: 100x20
 *      <Text text="World" rotation={Math.PI/4} headless={true} /> // ✅ Rotated, no layout
 *    Recommendation: Use rotation only with headless=true or absolute positioning
 *
 * 4. Text Content & Styling:
 *    Props:
 *    - text: string (required, the text to display)
 *    - style: Phaser.Types.GameObjects.Text.TextStyle (font, color, etc.)
 *    - fontStyle, align, maxWidth: Convenience props (legacy)
 *    Styling Priority:
 *    1. Inline style prop (highest)
 *    2. Individual props (fontStyle, align)
 *    3. Theme defaults (lowest)
 *    Example:
 *      <Text
 *        text="Hello"
 *        style={{ fontSize: '24px', color: '#ffffff', fontFamily: 'Arial' }}
 *      />
 *
 * 5. Margin Support:
 *    Feature: Text supports margin prop (unique among primitives)
 *    Reasoning:
 *    - Text often needs spacing from siblings (inline elements)
 *    - Margin affects layout calculations (added to text dimensions)
 *    - Similar to CSS inline element margin
 *    Usage:
 *      <Text text="Label" margin={{ left: 10, right: 10 }} />
 *      <Text text="Spaced" margin={8} />  // All sides
 *
 * 6. Layout Behavior:
 *    Sizing:
 *    - Auto-size: Text dimensions = rendered text bounds (default)
 *    - No explicit width/height props (text size determined by content)
 *    - maxWidth prop wraps text (Phaser feature)
 *    Positioning:
 *    - Positioned by parent layout engine (flexbox-style)
 *    - x/y props override layout position (absolute positioning)
 *
 * 7. Origin Behavior:
 *    Current: Phaser default origin (0, 0) - top-left
 *    Reasoning:
 *    - Text aligns naturally with layout flow
 *    - Top-left origin simplifies position calculations
 *    - Consistent with HTML text rendering
 *    Note: Origin affects rotation pivot (if rotation applied)
 *
 * 8. Common Patterns:
 *    Label:
 *      <View direction="row" gap={10}>
 *        <Text text="Name:" />
 *        <Text text={userName} />
 *      </View>
 *    Styled Text:
 *      <Text
 *        text="Title"
 *        style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff0000' }}
 *      />
 *    Wrapped Text:
 *      <Text text={longParagraph} maxWidth={300} />
 *    Floating Damage:
 *      <Text text="-50 HP" headless={true} alpha={0.8} />
 *
 * 9. Performance Considerations:
 *    - Text rendering is relatively expensive (canvas-based)
 *    - Frequent text changes trigger re-render
 *    - Long text with maxWidth: word-wrap calculation cost
 *    - Consider BitmapText for better performance (future component)
 *    - Text batching: Multiple Text objects don't batch (separate draw calls)
 *
 * 10. Known Limitations:
 *     - Rotation only supported with headless=true (ignored for layout-aware text)
 *       → Flow layout is incompatible with rotation
 *     - No rich text support (HTML tags, colors within text)
 *     - Limited text effects (no shadows, outlines in base component)
 *     - WordWrap with maxWidth: Can't specify ellipsis truncation
 *     - Changing text frequently: Performance impact
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser Text creation with style support
 * [✅] Transform props (position, scale, alpha)
 * [✅] Layout system integration (__layoutProps, __getLayoutSize)
 * [✅] Margin support (unique feature)
 * [✅] Text content and style patching
 * [✅] Theme system integration
 * [⚠️] Rotation - Only with headless=true (ignored for layout-aware text)
 * [❌] Rich text support - Future feature
 * [❌] Text effects (shadow, outline) - Future feature
 */
import type Phaser from 'phaser'
import type { EdgeInsets, TextSpecificProps, TransformProps } from '../core-props'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsDefaultExtension } from '../types'
import { applyTextProps } from './appliers/applyText'
import { applyTextLayout } from './appliers/applyTextLayout'
import { applyTransformProps } from './appliers/applyTransform'
import { createTextLayout } from './creators/createTextLayout'
import { createTransform } from './creators/createTransform'

/**
 * Base props for Text - composing shared prop groups
 * Includes optional margin for layout engine use
 */
export interface TextBaseProps extends TransformProps, TextSpecificProps {
  margin?: EdgeInsets
  // Legacy: support Phaser's style object directly
  style?: Phaser.Types.GameObjects.Text.TextStyle | undefined
}

/**
 * Props for Text component - extends base props with JSX-specific props
 */
export interface TextProps extends TextBaseProps, PropsDefaultExtension<Phaser.GameObjects.Text> {}

/**
 * Text creator - creates a Phaser Text object
 */
export const textCreator: HostCreator<'Text'> = (scene, props) => {
  const text = scene.add.text(props.x ?? 0, props.y ?? 0, props.text, props.style)

  // Set origin based on headless flag
  // Headless: (0.5, 0.5) - centered, works naturally with rotation/scale
  // Layout-aware: (0, 0) - top-left, aligns with layout flow
  if (props.headless) {
    text.setOrigin(0.5, 0.5)
  } else {
    text.setOrigin(0, 0)
  }

  // Normalize props for headless objects
  // Headless objects are positioned as points - no spacing or rotation constraints
  const normalizedProps = { ...props } as Record<string, unknown>
  if (props.headless) {
    // Remove spacing props (headless = positioned as point)
    delete normalizedProps.padding
    delete normalizedProps.margin
    delete normalizedProps.gap
  } else {
    // Remove rotation (only supported with headless=true)
    if (normalizedProps.rotation !== undefined) {
      delete normalizedProps.rotation
    }
  }

  // Apply transform props (visible, depth, alpha, scale, rotation if headless)
  createTransform(text, normalizedProps)

  // Setup layout system (props and size provider)
  createTextLayout(text, normalizedProps)

  return text
}

/**
 * Text patcher - updates Text properties
 */
export const textPatcher: HostPatcher<'Text'> = (node, prev, next) => {
  // Update origin if headless flag changed
  if (prev.headless !== next.headless) {
    if (next.headless) {
      node.setOrigin(0.5, 0.5) // Headless: centered
    } else {
      node.setOrigin(0, 0) // Layout-aware: top-left
    }
  }

  // Normalize props for headless objects
  const normalizedPrev = { ...prev } as Record<string, unknown>
  const normalizedNext = { ...next } as Record<string, unknown>

  if (next.headless) {
    // Remove spacing props (headless = positioned as point)
    delete normalizedNext.padding
    delete normalizedNext.margin
    delete normalizedNext.gap
  } else {
    // Remove rotation (only supported with headless=true)
    if (normalizedNext.rotation !== undefined) {
      delete normalizedNext.rotation
    }
  }

  if (prev.headless) {
    delete normalizedPrev.padding
    delete normalizedPrev.margin
    delete normalizedPrev.gap
  } else {
    if (normalizedPrev.rotation !== undefined) {
      delete normalizedPrev.rotation
    }
  }

  // Apply transform props (position, rotation only if headless, scale, alpha, depth, visibility)
  applyTransformProps(node, normalizedPrev, normalizedNext)

  // Apply text-specific props (text content, color, font, etc.)
  applyTextProps(node, normalizedPrev, normalizedNext)

  // Apply layout props and update size provider if needed
  applyTextLayout(node, normalizedPrev, normalizedNext)
}
