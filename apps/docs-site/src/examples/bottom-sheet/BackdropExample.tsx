/** @jsxImportSource @number10/phaserjsx */
import { BottomSheet, Button, Text, View, useState } from '@number10/phaserjsx'

export function BackdropBottomSheetExample() {
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
      <Button text="Open with Backdrop" disabled={open} onClick={() => setOpen(true)} />

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.5}
        closeOnBackdrop
        backdropAlpha={0.35}
      >
        <View
          padding={20}
          gap={12}
          theme={{ Text: { style: { color: '#e0e7ff', fontSize: '14px' } } }}
        >
          <Text text="Backdrop Demo" />
          <Text text="Tap the backdrop to close." />
          <Text text="Alpha is set to 0.25 for a light overlay." />
        </View>
      </BottomSheet>
    </View>
  )
}
