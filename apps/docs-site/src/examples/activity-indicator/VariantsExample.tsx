/** @jsxImportSource @number10/phaserjsx */
import { ActivityIndicator, Text, View } from '@number10/phaserjsx'

export function VariantsActivityIndicatorExample() {
  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={20}>
      <View direction="row" gap={24} alignItems="center">
        <View direction="column" alignItems="center" gap={6}>
          <ActivityIndicator variant="spinner" size="large" />
          <Text text="Spinner" />
        </View>
        <View direction="column" alignItems="center" gap={6}>
          <ActivityIndicator variant="dots" size="large" color={0xf59e0b} />
          <Text text="Dots" />
        </View>
        <View direction="column" alignItems="center" gap={6}>
          <ActivityIndicator variant="pulse" size="large" color={0x34d399} label="Syncing..." />
        </View>
      </View>
    </View>
  )
}
