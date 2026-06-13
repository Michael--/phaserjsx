/** @jsxImportSource @number10/phaserjsx */
import { BottomSheet, Button, Text, View, useState } from '@number10/phaserjsx'

export function QuickStartBottomSheetExample() {
  const [open, setOpen] = useState(false)

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center">
      <Button width={160} height={40} onClick={() => setOpen(true)}>
        <Text text="Open Sheet" />
      </Button>

      <BottomSheet open={open} onOpenChange={setOpen} height={0.4}>
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
