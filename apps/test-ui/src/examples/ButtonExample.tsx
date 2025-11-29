/**
 * ButtonExample - Demonstrates various Button variants, states, and configurations
 */
import { ScrollView, View } from '@phaserjsx/ui'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

function Example() {
  return (
    <ViewLevel2>
      {/* Basic Buttons */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Default Button" onClick={() => undefined} />
        <Button text="Disabled" disabled onClick={() => undefined} />
      </ViewLevel3>

      {/* Variants */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Primary" variant="primary" onClick={() => undefined} />
        <Button text="Secondary" variant="secondary" onClick={() => undefined} />
        <Button text="Outline" variant="outline" onClick={() => undefined} />
      </ViewLevel3>

      {/* Disabled Variants */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Primary Disabled" variant="primary" disabled />
        <Button text="Secondary Disabled" variant="secondary" disabled />
        <Button text="Outline Disabled" variant="outline" disabled />
      </ViewLevel3>

      {/* Size Variants */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button icon="bricks" text="Small" size="small" onClick={() => undefined} />
        <Button icon="bricks" text="Medium" size="medium" onClick={() => undefined} />
        <Button icon="bricks" text="Large" size="large" onClick={() => undefined} />
      </ViewLevel3>

      {/* With Children */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button
          effect="tada" // override effect from theme to demonstrate
          effectConfig={{ time: 500 }}
          icon="bricks"
          width={100}
          height={40}
          onClick={() => undefined}
        >
          <View width={40} height={20} backgroundColor={0xaa33aa} backgroundAlpha={1}>
            {/* Custom content can be added here */}
          </View>
        </Button>
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function ButtonExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <Example />
      </ScrollView>
    </View>
  )
}
