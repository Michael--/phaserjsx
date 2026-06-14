/**
 * BottomSheetExample — Tests controlled/uncontrolled, backdrop modes, drag-to-dismiss
 */
import {
  BottomSheet,
  BottomSheetDepth,
  BottomSheetHandle,
  Text,
  useState,
  View,
} from '@number10/phaserjsx'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Controlled + closeOnBackdrop — toggle via parent state.
 * Tests: controlled open, controlled close.
 */
function ControlledSheet() {
  const [open, setOpen] = useState(false)

  return (
    <ViewLevel3>
      <Text text={`Controlled (open=${String(open)})`} />
      <Button text="Toggle Sheet" onClick={() => setOpen(!open)} />
      <BottomSheet open={open} onOpenChange={setOpen} height={0.3}>
        <View padding={20} gap={12}>
          <Text text="Controlled Sheet" />
          <Text text="Tap Toggle or drag handle to close" />
          <Text text="Item 1" />
          <Text text="Item 2" />
          <Text text="Item 3" />
        </View>
      </BottomSheet>
    </ViewLevel3>
  )
}

/**
 * Uncontrolled — defaultOpen starts open, drag-to-dismiss only.
 * Tests: uncontrolled mode (no parent open state), onOpenChange callback.
 */
function UncontrolledSheet() {
  const [lastEvent, setLastEvent] = useState('opened')

  return (
    <ViewLevel3>
      <Text text={`Uncontrolled (defaultOpen, event: ${lastEvent})`} />
      <BottomSheet
        defaultOpen
        height={0.4}
        onOpenChange={(o: boolean) => setLastEvent(o ? 'opened' : 'closed')}
        depth={BottomSheetDepth - 1} // test custom depth below default sheet
        theme={{ BottomSheet: { panelCornerRadius: { tl: 10, bl: 0, tr: 10, br: 0 } } }}
      >
        <View padding={20} gap={12}>
          <Text text="Uncontrolled Sheet" />
          <Text text="Starts open — drag handle to dismiss" />
          <Text text="No parent button needed" />
          <Text text="Item A" />
          <Text text="Item B" />
          <Text text="Item C" />
        </View>
      </BottomSheet>
    </ViewLevel3>
  )
}

/**
 * Custom backdropAlpha — closeOnBackdrop with lighter backdrop.
 */
function BackdropAlphaSheet() {
  const [open, setOpen] = useState(false)

  return (
    <ViewLevel3>
      <Text text="Backdrop Alpha (0.25)" />
      <Button text="Open Sheet" disabled={open} onClick={() => setOpen(true)} />
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.4}
        closeOnBackdrop
        backdropAlpha={0.25}
        depth={BottomSheetDepth + 2} // test custom depth above default sheet
      >
        <View padding={20} gap={12}>
          <Text text="Light Backdrop Sheet" />
          <Text text="Backdrop alpha=0.25, tap to close" />
          <Text text="Item X" />
          <Text text="Item Y" />
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
      <Button text="Open Sheet" disabled={open} onClick={() => setOpen(true)} />
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.5}
        dismissThreshold={120}
        depth={BottomSheetDepth + 1} // test custom depth above default sheet
      >
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

/**
 * Custom handle — Pill variant via renderHandle, larger handle area.
 */
function CustomHandleSheet() {
  const [open, setOpen] = useState(false)

  return (
    <ViewLevel3>
      <Text text="Custom Handle (Grip, area=48)" />
      <Button text="Open Sheet" disabled={open} onClick={() => setOpen(true)} />
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.35}
        handleAreaHeight={48}
        renderHandle={BottomSheetHandle.Grip}
        closeOnBackdrop
      >
        <View padding={20} gap={12}>
          <Text text="Pill Handle Sheet" />
          <Text text="renderHandle + handleAreaHeight=48" />
          <Text text="Item P" />
          <Text text="Item Q" />
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
        <BackdropAlphaSheet />
      </ViewLevel2>
      <ViewLevel2>
        <DragThresholdSheet />
      </ViewLevel2>
      <ViewLevel2>
        <CustomHandleSheet />
      </ViewLevel2>
    </View>
  )
}
