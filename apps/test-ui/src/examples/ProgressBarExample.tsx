/** @jsxImportSource @number10/phaserjsx */
import {
  ProgressBar,
  ScrollView,
  Slider,
  Text,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

export function ProgressBarExample() {
  const [health, setHealth] = useState(74)
  const [mana, setMana] = useState(42)
  const [cooldown, setCooldown] = useState(25)
  const tokens = useThemeTokens()
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#ffffff'
  const headingStyle =
    tokens?.textStyles.title ?? ({ fontSize: '28px', fontStyle: 'bold', color: textColor } as const)
  const labelStyle = tokens?.textStyles.medium ?? ({ fontSize: '16px', color: textColor } as const)
  const mutedStyle = {
    ...(tokens?.textStyles.small ?? { fontSize: '12px', color: textColor }),
    color: tokens?.colors.text.light.toString() ?? textColor,
  }

  return (
    <ScrollView width="fill" height="fill" padding={20}>
      <ViewLevel2 width="fill">
        <View direction="row" gap={10} alignItems="center">
          <SectionHeader title="ProgressBar Component" />
        </View>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Controlled HUD Values" style={headingStyle} />
          <ProgressBar
            value={health}
            label="Health"
            showValue
            width={360}
            height={28}
            fillColor={health < 35 ? 0xef4444 : 0x22c55e}
          />
          <Slider
            value={health}
            onChange={setHealth}
            min={0}
            max={100}
            step={1}
            trackLength={360}
          />
          <ProgressBar value={mana} label="Mana" showValue width={360} fillColor={0x3b82f6} />
          <Slider value={mana} onChange={setMana} min={0} max={100} step={1} trackLength={360} />
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Label Positions" style={headingStyle} />
          <ProgressBar
            value={cooldown}
            label="Inside"
            showValue
            labelPosition="inside"
            width={360}
            height={30}
            fillColor={0xf59e0b}
          />
          <ProgressBar
            value={cooldown}
            label="Bottom"
            showValue
            labelPosition="bottom"
            width={360}
            fillColor={0x14b8a6}
          />
          <Slider
            value={cooldown}
            onChange={setCooldown}
            min={0}
            max={100}
            step={5}
            trackLength={360}
          />
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={16}>
          <Text text="Vertical Cooldowns" style={headingStyle} />
          <View direction="row" gap={24} alignItems="end">
            <ProgressBar
              value={30}
              orientation="vertical"
              label="Q"
              showValue
              labelPosition="top"
              height={170}
              fillColor={0xf97316}
            />
            <ProgressBar
              value={65}
              orientation="vertical"
              label="E"
              showValue
              labelPosition="top"
              height={170}
              fillColor={0x14b8a6}
            />
            <ProgressBar
              value={100}
              orientation="vertical"
              label="R"
              showValue
              labelPosition="top"
              height={170}
              fillColor={0xfacc15}
            />
            <View gap={8}>
              <Text text="Disabled" style={labelStyle} />
              <ProgressBar value={55} label="Locked" showValue disabled width={240} />
              <Text text="Theme alpha is applied without changing value." style={mutedStyle} />
            </View>
          </View>
        </ViewLevel3>
      </ViewLevel2>
    </ScrollView>
  )
}
