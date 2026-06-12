/**
 * SegmentedControl icon segments example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon, type IconType } from '@/components/Icon'
import { SegmentedControl, Text, useState, View } from '@number10/phaserjsx'

const iconByValue: Record<string, IconType> = {
  favorite: 'star',
  settings: 'gear',
  export: 'download',
}

export function IconSegmentsSegmentedControlExample() {
  const [tool, setTool] = useState('favorite')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={18}>
      <SegmentedControl
        value={tool}
        onChange={setTool}
        size="large"
        variant="soft"
        options={[
          { value: 'favorite', label: 'Starred' },
          { value: 'settings', label: 'Settings' },
          { value: 'export', label: 'Export' },
        ]}
        renderOption={({ option, selected }) => (
          <View direction="row" gap={8} alignItems="center">
            <Icon
              type={iconByValue[option.value] ?? 'star'}
              size={18}
              tint={selected ? 0xffffff : 0x94a3b8}
            />
            <Text text={option.label ?? option.value} />
          </View>
        )}
      />

      <Text text={`Tool: ${tool}`} style={{ color: '#9fb3c8' }} />
    </View>
  )
}
