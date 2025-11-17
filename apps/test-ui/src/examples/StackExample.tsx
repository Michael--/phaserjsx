import { Text, View } from '@phaserjsx/ui'

export function StackExample() {
  return (
    <View
      backgroundColor={0x222222}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text="Stack Demo" style={{ fontSize: 16, color: 'orange' }} />
      <View
        direction="stack"
        width={220}
        height={120}
        backgroundColor={0x444444}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      >
        <View width={200} height={100} backgroundColor={0x880000} />
        <View x={20} y={30} width={150} height={80} backgroundColor={0x008800} />
        <View width={100} height={60} backgroundColor={0x000088} />
      </View>
    </View>
  )
}
