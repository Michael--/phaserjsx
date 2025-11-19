/**
 * ButtonExample - Demonstrates various Button variants, states, and configurations
 */
import { View } from '@phaserjsx/ui'
import { Button } from '../components/Button'

export function ButtonExample() {
  return (
    <View direction="column" gap={20} padding={20}>
      {/* Basic Buttons */}
      <View direction="row" gap={10} alignItems="center">
        <Button text="Default Button" onClick={() => console.log('Default clicked')} />
        <Button text="Disabled" disabled onClick={() => console.log('Disabled clicked')} />
      </View>

      {/* Variants */}
      <View direction="row" gap={10} alignItems="center">
        <Button text="Primary" variant="primary" onClick={() => console.log('Primary clicked')} />
        <Button
          text="Secondary"
          variant="secondary"
          onClick={() => console.log('Secondary clicked')}
        />
        <Button text="Outline" variant="outline" onClick={() => console.log('Outline clicked')} />
      </View>

      {/* Disabled Variants */}
      <View direction="row" gap={10} alignItems="center">
        <Button text="Primary Disabled" variant="primary" disabled />
        <Button text="Secondary Disabled" variant="secondary" disabled />
        <Button text="Outline Disabled" variant="outline" disabled />
      </View>

      {/* Size Variants */}
      <View direction="row" gap={10} alignItems="center">
        <Button text="Small" size="small" width={80} height={30} />
        <Button text="Medium" size="medium" width={120} height={40} />
        <Button text="Large" size="large" width={160} height={50} />
      </View>

      {/* With Children */}
      <View direction="row" gap={10} alignItems="center">
        <Button width={100} height={40}>
          <View width={40} height={20} backgroundColor={0xaa33aa} backgroundAlpha={1}>
            {/* Custom content can be added here */}
          </View>
        </Button>
      </View>
    </View>
  )
}
