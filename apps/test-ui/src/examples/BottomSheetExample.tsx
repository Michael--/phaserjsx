/**
 * ButtonExample - Demonstrates various Button variants, states, and configurations
 */
import { BottomSheet, Text, useState, View } from '@number10/phaserjsx'
import { Button } from '../components'

function QuickStartBottomSheetExample() {
  const [open, setOpen] = useState(false)

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center">
      <Button text="Open Sheet" onClick={() => setOpen(true)} />
      <Button text="Close Sheet" onClick={() => setOpen(false)} />
      <BottomSheet open={open} onOpenChange={setOpen} height={0.3}>
        <View padding={20} gap={12}>
          <Text text="Settings" />
          <Text text="Item 1" />
          <Text text="Item 2" />
          <Text text="Item 3" />
        </View>
      </BottomSheet>
    </View>
  )
}

export function ButtonSheetExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <QuickStartBottomSheetExample />
    </View>
  )
}
