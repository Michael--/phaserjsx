/**
 * ButtonExample - Demonstrates various Button variants, states, and configurations
 */
import { View } from '@phaserjsx/ui'
import { Button } from '../components/Button'
import { ViewLevel1, ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

export function ButtonExample() {
  return (
    <ViewLevel1>
      <ViewLevel2>
        {/* Basic Buttons */}
        <ViewLevel3 alignItems="center" direction="row">
          <Button text="Default Button" onClick={() => console.log('Default clicked')} />
          <Button text="Disabled" disabled onClick={() => console.log('Disabled clicked')} />
        </ViewLevel3>

        {/* Variants */}
        <ViewLevel3 alignItems="center" direction="row">
          <Button text="Primary" variant="primary" onClick={() => console.log('Primary clicked')} />
          <Button
            text="Secondary"
            variant="secondary"
            onClick={() => console.log('Secondary clicked')}
          />
          <Button text="Outline" variant="outline" onClick={() => console.log('Outline clicked')} />
        </ViewLevel3>

        {/* Disabled Variants */}
        <ViewLevel3 alignItems="center" direction="row">
          <Button text="Primary Disabled" variant="primary" disabled />
          <Button text="Secondary Disabled" variant="secondary" disabled />
          <Button text="Outline Disabled" variant="outline" disabled />
        </ViewLevel3>

        {/* Size Variants */}
        <ViewLevel3 alignItems="center" direction="row">
          <Button text="Small" size="small" width={80} height={30} />
          <Button text="Medium" size="medium" width={120} height={40} />
          <Button text="Large" size="large" width={160} height={50} />
        </ViewLevel3>

        {/* With Children */}
        <ViewLevel3 alignItems="center" direction="row">
          <Button width={100} height={40}>
            <View width={40} height={20} backgroundColor={0xaa33aa} backgroundAlpha={1}>
              {/* Custom content can be added here */}
            </View>
          </Button>
        </ViewLevel3>
      </ViewLevel2>
    </ViewLevel1>
  )
}
