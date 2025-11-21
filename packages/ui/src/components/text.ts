/**
 * Text component - Phaser Text GameObject for rendering text
 * Status: IMPLEMENTED ✅ (Rotation fix pending)
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
 * 3. Layout Size Provider: CURRENT IMPLEMENTATION ⚠️
 *    Current: Uses text.width and text.height (NOT rotation-aware)
 *    Issue: Rotation breaks layout calculations
 *    Problem:
 *      <Text text="Hello" rotation={Math.PI / 4} />  // Layout size incorrect!
 *    Solution: Use getBounds() instead of width/height
 *    Correct Implementation:
 *      __getLayoutSize = () => {
 *        const bounds = text.getBounds()
 *        return { width: bounds.width, height: bounds.height }
 *      }
 *    Status: NEEDS FIX 🔧 (Phase 3 implementation)
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
 *     - Rotation breaks layout size calculation (needs getBounds fix)
 *     - No rich text support (HTML tags, colors within text)
 *     - Limited text effects (no shadows, outlines in base component)
 *     - WordWrap with maxWidth: Can't specify ellipsis truncation
 *     - Changing text frequently: Performance impact
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser Text creation with style support
 * [✅] Transform props (position, rotation, scale, alpha)
 * [✅] Layout system integration (__layoutProps, __getLayoutSize)
 * [✅] Margin support (unique feature)
 * [✅] Text content and style patching
 * [✅] Theme system integration
 * [❌] Rotation-aware layout size (needs getBounds) - PENDING FIX 🔧
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

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(text, props)

  // Setup layout system (props and size provider)
  createTextLayout(text, props)

  return text
}

/**
 * Text patcher - updates Text properties
 */
export const textPatcher: HostPatcher<'Text'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, prev, next)

  // Apply text-specific props (text content, color, font, etc.)
  applyTextProps(node, prev, next)

  // Apply layout props and update size provider if needed
  applyTextLayout(node, prev, next)
}
