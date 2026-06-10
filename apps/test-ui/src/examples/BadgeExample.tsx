/** @jsxImportSource @number10/phaserjsx */
import {
  Badge,
  Button,
  ScrollView,
  Tag,
  Text,
  useState,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

const tones = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const

export function BadgeExample() {
  const [notifications, setNotifications] = useState(12)
  const [tags, setTags] = useState(['Quest', 'Rare', 'Crafting', 'Equipped'])
  const tokens = useThemeTokens()
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#ffffff'
  const headingStyle =
    tokens?.textStyles.title ?? ({ fontSize: '28px', fontStyle: 'bold', color: textColor } as const)
  const labelStyle = tokens?.textStyles.medium ?? ({ fontSize: '16px', color: textColor } as const)

  return (
    <ScrollView width="fill" height="fill" padding={20}>
      <ViewLevel2 width="fill">
        <SectionHeader title="Badge / Tag Components" />

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Counts and Status" style={headingStyle} />
          <View direction="row" gap={12} alignItems="center" flexWrap="wrap">
            <Text text="Inbox" style={labelStyle} />
            <Badge count={notifications} tone="danger" />
            <Badge count={notifications} tone="danger" maxCount={9} />
            <Badge dot tone="success" />
            <Badge label="Live" tone="success" />
            <Badge label="Offline" tone="neutral" variant="outline" />
          </View>
          <View direction="row" gap={8}>
            <Button
              width={96}
              height={32}
              onClick={() => setNotifications((value) => Math.max(0, value - 1))}
            >
              <Text text="-1" style={{ color: '#ffffff', fontSize: '13px' }} />
            </Button>
            <Button width={96} height={32} onClick={() => setNotifications((value) => value + 10)}>
              <Text text="+10" style={{ color: '#ffffff', fontSize: '13px' }} />
            </Button>
          </View>
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Tones and Sizes" style={headingStyle} />
          <View direction="row" gap={8} flexWrap="wrap">
            {tones.map((tone) => (
              <Badge key={tone} label={tone} tone={tone} />
            ))}
          </View>
          <View direction="row" gap={10} alignItems="center" flexWrap="wrap">
            <Badge label="Small" size="small" tone="info" />
            <Badge label="Medium" size="medium" tone="info" />
            <Badge label="Large" size="large" tone="info" />
            <Badge label="Soft" variant="soft" tone="primary" />
            <Badge label="Outline" variant="outline" tone="primary" />
          </View>
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Tags" style={headingStyle} />
          <View direction="row" gap={10} flexWrap="wrap">
            {tags.map((tag, index) => (
              <Tag
                key={tag}
                label={tag}
                selected={index === 0}
                tone={index === 1 ? 'warning' : index === 2 ? 'info' : 'neutral'}
                onRemove={() => setTags((current) => current.filter((entry) => entry !== tag))}
              />
            ))}
            <Tag label="Disabled" disabled />
          </View>
        </ViewLevel3>
      </ViewLevel2>
    </ScrollView>
  )
}
