/** @jsxImportSource ../.. */
/**
 * RefOriginView - ref-based component for imperative transforms with custom origin point
 *
 * Returns a ref to the pivot container, enabling imperative manipulation
 * (e.g., Phaser tweens) with correct origin point. Uses nested Views to
 * calculate and maintain the pivot point based on actual rendered dimensions.
 *
 * Use TransformOriginView instead for declarative/reactive transforms via props.
 *
 * @example
 * const ref = useRef<Phaser.GameObjects.Container>(null)
 * useEffect(() => {
 *   ref.current?.scene.tweens.add({ targets: ref.current, rotation: Math.PI * 2 })
 * }, [])
 * <RefOriginView ref={ref} originX={0.5} originY={0.5} width={200} height={100}>
 *   <Text>Rotates around center</Text>
 * </RefOriginView>
 */
import type Phaser from 'phaser'
import { useRef, useState, type VNode } from '../../hooks'
import { View } from '../index'
import type { ViewProps } from '../view'

/**
 * Extended ViewProps with origin support
 */
export interface RefOriginViewProps extends Omit<ViewProps, 'x' | 'y' | 'children'> {
  /**
   * Origin X for rotation and scale (0 = left, 0.5 = center, 1 = right)
   * @default 0.5
   */
  originX?: number
  /**
   * Origin Y for rotation and scale (0 = top, 0.5 = center, 1 = bottom)
   * @default 0.5
   */
  originY?: number
  /**
   * X position of the view
   */
  x?: number
  /**
   * Y position of the view
   */
  y?: number
  /**
   * Child node! Only one child allowed.
   */
  children?: VNode
}

/**
 * RefOriginView component - ref-based transforms around custom origin point
 *
 * Returns ref to middle View positioned at the origin point, enabling
 * imperative transformations. Calculates actual dimensions after layout.
 *
 * Uses nested View structure internally:
 * - Outer View: Defines bounding box and position
 * - Middle View: Positioned at origin point, receives ref (transform target)
 * - Inner View: Contains actual content, offset by negative padding
 *
 * @param props - RefOriginView props
 * @returns JSX element
 */
export function RefOriginView({
  originX = 0.5,
  originY = 0.5,
  x = 0,
  y = 0,
  width,
  height,
  ref,
  padding,
  children,
  ...viewProps
}: RefOriginViewProps) {
  // Ref to outer View to get computed dimensions after layout
  const outerRef = useRef<Phaser.GameObjects.Container | null>(null)
  const [numericDimension, setNumericWidth] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  /**
   * Handler for outer View - calculates and updates pivot position based on actual size
   */
  const handleOuterRef = (container: Phaser.GameObjects.Container | null) => {
    if (!container) return
    outerRef.current = container

    setTimeout(() => {
      // Use layout dimensions or fallback to getBounds
      const width = container.width
      const height = container.height
      const actualWidth = Number.isNaN(width) ? 0 : width
      const actualHeight = Number.isNaN(height) ? 0 : height
      if (actualHeight !== numericDimension.y || actualWidth !== numericDimension.x)
        setNumericWidth({ x: actualWidth, y: actualHeight })
    }, 0)
  }

  // Calculate pivot point position (relative to outer View)
  const pivotX = numericDimension.x * originX
  const pivotY = numericDimension.y * originY

  // Calculate offset for inner content (to center it around pivot)
  const offsetX = -numericDimension.x * originX
  const offsetY = -numericDimension.y * originY

  return (
    <View
      ref={handleOuterRef}
      direction="stack"
      width={width}
      height={height}
      x={x}
      y={y}
      padding={padding}
    >
      {/* Middle View: Positioned at origin point, receives ref for rotation */}
      <View
        ref={ref as ((instance: Phaser.GameObjects.Container | null) => void) | undefined}
        x={pivotX}
        y={pivotY}
        width={0}
        height={0}
        padding={{ left: offsetX, top: offsetY }}
        margin={0}
        direction="stack"
        backgroundColor={0xff88ff}
      >
        {/* Inner View: Contains actual content with all original props */}
        <View width={width} height={height} {...viewProps} direction="stack" padding={0} margin={0}>
          {children}
        </View>
      </View>
    </View>
  )
}
