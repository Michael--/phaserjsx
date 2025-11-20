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
import type { ChildrenType } from '@phaserjsx/ui'
import { View } from '@phaserjsx/ui'

/**
 * Props for origin-based transformations and optional styling
 * Only includes props where origin/pivot point is relevant (rotation, scale)
 * Background props are optional for styling the transformed content
 */
export interface TransformOriginViewProps {
  // Transform props where origin matters
  rotation?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  // Optional background styling (transforms with content)
  backgroundColor?: number
  backgroundAlpha?: number
  cornerRadius?: number | { tl?: number; tr?: number; bl?: number; br?: number }
  borderWidth?: number
  borderColor?: number
  borderAlpha?: number
}

/**
 * TransformOriginView component - declarative transforms around custom origin point
 *
 * Uses three nested Views to apply rotation/scale around configurable origin:
 * - Outer View: Defines bounding box
 * - Middle View: Positioned at origin point, receives transform props
 * - Inner View: Contains content, offset to align with origin
 *
 * @param originX - Origin X position (0..1, where 0.5 is center)
 * @param originY - Origin Y position (0..1, where 0.5 is center)
 * @param width - Width of the container
 * @param height - Height of the container
 * @param children - Child elements to render with centered origin
 * @param transformProps - rotation, scale/scaleX/scaleY, and optional backgroundColor/cornerRadius/border
 * @returns JSX element
 */
export function TransformOriginView({
  originX = 0.5,
  originY = 0.5,
  width,
  height,
  children,
  ...transformProps
}: {
  originX?: number
  originY?: number
  width: number
  height: number
  children: ChildrenType
} & TransformOriginViewProps) {
  const offsetX = width * originX
  const offsetY = height * originY

  return (
    <View width={width} height={height} padding={0} direction="stack">
      <View
        x={offsetX}
        y={offsetY}
        width={width}
        height={height}
        padding={0}
        direction="stack"
        backgroundAlpha={0}
        {...transformProps}
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
