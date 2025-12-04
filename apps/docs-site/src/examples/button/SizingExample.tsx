/**
 * Button Sizing & Layout Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Button, Text, View } from '@phaserjsx/ui'

export function SizingButtonExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Size variants */}
      <View direction="row" gap={12} alignItems="center">
        <Button size="small">
          <Text text="Small" />
        </Button>

        <Button size="medium">
          <Text text="Medium" />
        </Button>

        <Button size="large">
          <Text text="Large" />
        </Button>
      </View>

      {/* Custom dimensions */}
      <Button width={250} height={60}>
        <Text text="Custom Size (250x60)" />
      </Button>

      {/* Full width button */}
      <View width={300}>
        <Button width="fill">
          <Text text="Full Width Button" />
        </Button>
      </View>
    </View>
  )
}
