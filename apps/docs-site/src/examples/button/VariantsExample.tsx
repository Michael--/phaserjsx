/**
 * Button Variants Example - Visual styles
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, View } from '@number10/phaserjsx'

export function VariantsButtonExample() {
  return (
    <View padding={20} gap={12} justifyContent="center" alignItems="center">
      <View direction="row" gap={12} alignItems="center" justifyContent="center">
        <Button variant="primary" label="Primary" />
        <Button variant="secondary" label="Secondary" />
        <Button variant="outline" label="Outline" />
      </View>

      <View direction="row" gap={12} alignItems="center" justifyContent="center">
        <Button variant="ghost" label="Ghost" />
        <Button variant="danger" label="Danger" />
      </View>
    </View>
  )
}
