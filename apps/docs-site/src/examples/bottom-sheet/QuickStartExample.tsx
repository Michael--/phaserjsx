/** @jsxImportSource @number10/phaserjsx */
import { BottomSheet, Button, Text, View, useState } from '@number10/phaserjsx'

export function QuickStartBottomSheetExample() {
  const [open, setOpen] = useState(false)

  return (
    <View
      width="fill"
      height="fill"
      alignItems="center"
      justifyContent="start"
      padding={20}
      gap={12}
    >
      <Button text="Open Sheet" disabled={open} onClick={() => setOpen(true)} />

      <BottomSheet open={open} onOpenChange={setOpen} height={0.5}>
        <View
          padding={20}
          gap={12}
          theme={{ Text: { style: { color: '#e0e7ff', fontSize: '14px' } } }}
        >
          <Text text="Settings" />
          <Text text="Item 1" />
          <Text text="Item 2" />
          <Text text="Item 3" />
        </View>
      </BottomSheet>
    </View>
  )
}
