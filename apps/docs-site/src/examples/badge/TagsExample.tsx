/**
 * Tag Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Tag, Text, useState, View } from '@number10/phaserjsx'

const initialTags = ['Fire', 'Ice', 'Quest', 'Crafting']

export function TagsBadgeExample() {
  const [tags, setTags] = useState(initialTags)

  return (
    <View width="fill" height="fill" padding={24} gap={18} justifyContent="center">
      <Text text="Inventory Filters" style={{ color: '#ffffff', fontSize: '18px' }} />

      <View direction="row" gap={10} flexWrap="wrap">
        {tags.map((tag, index) => (
          <Tag
            key={tag}
            label={tag}
            tone={index === 0 ? 'danger' : index === 1 ? 'info' : 'neutral'}
            selected={index === 2}
            onRemove={() => setTags((current) => current.filter((entry) => entry !== tag))}
          />
        ))}
      </View>

      <View direction="row" gap={10} flexWrap="wrap">
        <Tag label="Locked" disabled />
        <Tag label="Equipped" tone="success" selected />
        <Tag label="Tradeable" tone="warning" variant="outline" />
      </View>
    </View>
  )
}
