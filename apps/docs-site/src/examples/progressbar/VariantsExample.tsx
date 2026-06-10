/**
 * ProgressBar Variants Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { ProgressBar, Text, View } from '@number10/phaserjsx'

export function VariantsProgressBarExample() {
  return (
    <View width="fill" height="fill" padding={24} gap={22} justifyContent="center">
      <View gap={10}>
        <Text text="HUD Bars" style={{ color: '#ffffff', fontSize: '16px' }} />
        <ProgressBar value={72} label="Health" showValue width={340} fillColor={0x22c55e} />
        <ProgressBar value={48} label="Mana" showValue width={340} fillColor={0x3b82f6} />
        <ProgressBar value={91} label="Shield" showValue width={340} fillColor={0xa855f7} />
      </View>

      <View direction="row" gap={24} alignItems="end">
        <View gap={8} alignItems="center">
          <ProgressBar
            value={30}
            orientation="vertical"
            labelPosition="top"
            label="Q"
            showValue
            height={150}
            fillColor={0xf97316}
          />
        </View>
        <View gap={8} alignItems="center">
          <ProgressBar
            value={65}
            orientation="vertical"
            labelPosition="top"
            label="E"
            showValue
            height={150}
            fillColor={0x14b8a6}
          />
        </View>
        <View gap={8} alignItems="center">
          <ProgressBar
            value={100}
            orientation="vertical"
            labelPosition="top"
            label="R"
            showValue
            height={150}
            fillColor={0xfacc15}
          />
        </View>
      </View>
    </View>
  )
}
