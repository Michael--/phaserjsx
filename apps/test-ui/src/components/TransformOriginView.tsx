/**
 * TransformOriginView - declarative transform component with custom origin point
 *
 * Applies transformations (rotation, scale) around a configurable origin point.
 * Unlike OriginView which returns a ref for imperative manipulation,
 * TransformOriginView applies transforms declaratively via props.
 *
 * Perfect for:
 * - Spring animations with useSpring
 * - Reactive transforms based on state/signals
 * - Declarative rotation/scale around center or custom origin
 *
 * @example
 * const [rotation, setRotation] = useSpring(0, 'gentle')
 * <TransformOriginView width={100} height={100} rotation={rotation.value}>
 *   <View backgroundColor={0xff0000} />
 * </TransformOriginView>
 */
import type { ViewProps, VNode } from '@phaserjsx/ui'
import { View } from '@phaserjsx/ui'

/**
 * Extended ViewProps with origin support for declarative transforms
 */
export interface TransformOriginViewProps extends Omit<ViewProps, 'children'> {
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
   * Child elements to render with centered origin
   */
  children?: VNode
}

/**
 * TransformOriginView component - declarative transforms around custom origin point
 *
 * Uses three nested Views to apply rotation/scale around configurable origin:
 * - Outer View: Defines bounding box, receives layout/position props
 * - Middle View: Positioned at origin point, receives transform/visual props
 * - Inner View: Contains content, offset to align with origin
 *
 * @param props - TransformOriginView props
 * @returns JSX element
 */
export function TransformOriginView({
  originX = 0.5,
  originY = 0.5,
  width,
  height,
  x = 0,
  y = 0,
  children,
  // Transform props go to middle View
  rotation,
  scale,
  scaleX,
  scaleY,
  // Visual props go to middle View
  backgroundColor,
  backgroundAlpha,
  cornerRadius,
  borderWidth,
  borderColor,
  borderAlpha,
  // All other ViewProps go to outer View
  ...outerViewProps
}: TransformOriginViewProps) {
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('TransformOriginView requires numeric width and height')
  }

  const offsetX = width * originX
  const offsetY = height * originY

  // Only pass defined transform/visual props to middle View
  const middleViewProps: Partial<ViewProps> = {}
  if (rotation !== undefined) middleViewProps.rotation = rotation
  if (scale !== undefined) middleViewProps.scale = scale
  if (scaleX !== undefined) middleViewProps.scaleX = scaleX
  if (scaleY !== undefined) middleViewProps.scaleY = scaleY
  if (backgroundColor !== undefined) middleViewProps.backgroundColor = backgroundColor
  if (backgroundAlpha !== undefined) middleViewProps.backgroundAlpha = backgroundAlpha
  if (cornerRadius !== undefined) middleViewProps.cornerRadius = cornerRadius
  if (borderWidth !== undefined) middleViewProps.borderWidth = borderWidth
  if (borderColor !== undefined) middleViewProps.borderColor = borderColor
  if (borderAlpha !== undefined) middleViewProps.borderAlpha = borderAlpha

  return (
    <View
      x={x}
      y={y}
      width={width}
      height={height}
      padding={0}
      direction="stack"
      {...outerViewProps}
    >
      <View
        x={offsetX}
        y={offsetY}
        width={width}
        height={height}
        padding={0}
        direction="stack"
        {...middleViewProps}
      >
        <View
          x={-offsetX}
          y={-offsetY}
          width={width}
          height={height}
          padding={0}
          direction="stack"
          backgroundAlpha={0}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
