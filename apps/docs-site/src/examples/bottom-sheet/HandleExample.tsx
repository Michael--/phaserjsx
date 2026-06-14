/** @jsxImportSource @number10/phaserjsx */
import { BottomSheet, BottomSheetHandle, Button, Text, View, useState } from '@number10/phaserjsx'

export function HandleBottomSheetExample() {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<'Bar' | 'Grip' | 'Pill'>('Bar')

  const handleMap = {
    Bar: BottomSheetHandle.Bar,
    Grip: BottomSheetHandle.Grip,
    Pill: BottomSheetHandle.Pill,
  } as const

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <View direction="row" gap={8}>
        <Button
          width={64}
          height={32}
          onClick={() => {
            setVariant('Bar')
            setOpen(true)
          }}
        >
          <Text text="Bar" />
        </Button>
        <Button
          width={64}
          height={32}
          onClick={() => {
            setVariant('Grip')
            setOpen(true)
          }}
        >
          <Text text="Grip" />
        </Button>
        <Button
          width={64}
          height={32}
          onClick={() => {
            setVariant('Pill')
            setOpen(true)
          }}
        >
          <Text text="Pill" />
        </Button>
      </View>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.3}
        handleAreaHeight={48}
        renderHandle={handleMap[variant]}
        closeOnBackdrop
      >
        <View
          padding={20}
          gap={12}
          theme={{ Text: { style: { color: '#e0e7ff', fontSize: '14px' } } }}
        >
          <Text text={`Handle: ${variant}`} />
          <Text text="handleAreaHeight is 48px for a larger touch target." />
          <Text text="Try all three variants to compare." />
        </View>
      </BottomSheet>
    </View>
  )
}
