/**
 * BottomSheetExample — Tests controlled/uncontrolled, double-open guard, drag-to-dismiss
 */
import { BottomSheet, Text, useState, View } from '@number10/phaserjsx'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Controlled BottomSheet — open/close via parent state.
 * Tests: controlled open, controlled close, double-open guard.
 */
function ControlledSheet() {
  const [open, setOpen] = useState(false)

  return (
    <ViewLevel3>
      <Text text={`Controlled (open=${String(open)})`} />
      <Button text="Open Sheet" onClick={() => setOpen(true)} />
      <Button text="Close Sheet" onClick={() => setOpen(false)} />
      <Button text="Toggle Sheet" onClick={() => setOpen(!open)} />
      <BottomSheet open={open} onOpenChange={setOpen} height={0.3}>
        <View padding={20} gap={12}>
          <Text text="Controlled Sheet" />
          <Text text="Tap backdrop or drag handle to close" />
          <Text text="Item 1" />
          <Text text="Item 2" />
          <Text text="Item 3" />
        </View>
      </BottomSheet>
    </ViewLevel3>
  )
}

/**
 * Uncontrolled BottomSheet — manages its own open state.
 * Tests: defaultOpen, internal state, onOpenChange callback.
 */
function UncontrolledSheet() {
  const [lastEvent, setLastEvent] = useState('none')

  return (
    <ViewLevel3>
      <Text text={`Uncontrolled (last event: ${lastEvent})`} />
      <BottomSheet
        defaultOpen={false}
        height={0.4}
        onOpenChange={(o: boolean) => setLastEvent(o ? 'opened' : 'closed')}
      >
        <View padding={20} gap={12}>
          <Text text="Uncontrolled Sheet" />
          <Text text="Drag handle down to dismiss" />
          <Text text="Item A" />
          <Text text="Item B" />
          <Text text="Item C" />
        </View>
      </BottomSheet>
    </ViewLevel3>
  )
}

/**
 * Drag-threshold test — custom dismiss threshold for drag-to-dismiss.
 */
function DragThresholdSheet() {
  const [open, setOpen] = useState(false)

  return (
    <ViewLevel3>
      <Text text="Drag Threshold (dismiss=120px)" />
      <Button text="Open Sheet" onClick={() => setOpen(true)} />
      <BottomSheet open={open} onOpenChange={setOpen} height={0.5} dismissThreshold={120}>
        <View padding={20} gap={12}>
          <Text text="High Threshold Sheet" />
          <Text text="Need to drag >120px to dismiss" />
          <Text text="Item X" />
          <Text text="Item Y" />
          <Text text="Item Z" />
        </View>
      </BottomSheet>
    </ViewLevel3>
  )
}

export function ButtonSheetExample() {
  return (
    <View width={'100%'} height={'100%'} direction="row" gap={20} padding={20} flexWrap="wrap">
      <ViewLevel2>
        <ControlledSheet />
      </ViewLevel2>
      <ViewLevel2>
        <UncontrolledSheet />
      </ViewLevel2>
      <ViewLevel2>
        <DragThresholdSheet />
      </ViewLevel2>
    </View>
  )
}
