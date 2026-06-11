/**
 * Button Sizing & Layout Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, View } from '@number10/phaserjsx'

export function SizingButtonExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Size variants */}
      <View direction="row" gap={12} alignItems="center">
        <Button size="small" label="Small" />
        <Button size="medium" label="Medium" />
        <Button size="large" label="Large" />
      </View>

      {/* Custom dimensions */}
      <Button width={250} height={60} label="Custom Size" />

      {/* Full width button */}
      <View width={300}>
        <Button width="fill" label="Full Width Button" />
      </View>
    </View>
  )
}
