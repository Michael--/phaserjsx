/**
 * Toolbar icon-only example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { Text, Toolbar, type ToolbarItem, useState, View } from '@number10/phaserjsx'

const iconItems: ToolbarItem[] = [
  { id: 'inspect', type: 'toggle', label: 'Inspect', icon: <Icon type="search" /> },
  { id: 'settings', type: 'toggle', label: 'Settings', icon: <Icon type="gear" /> },
  { type: 'separator' },
  { id: 'download', type: 'action', label: 'Download', icon: <Icon type="download" /> },
  { id: 'delete', type: 'action', label: 'Delete', icon: <Icon type="trash" />, disabled: true },
]

export function IconOnlyToolbarExample() {
  const [activeTool, setActiveTool] = useState('inspect')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <Toolbar
        items={iconItems}
        activeId={activeTool}
        onToggle={(id) => setActiveTool(id)}
        density="compact"
        showLabels={false}
      />

      <Text text={`Active icon tool: ${activeTool}`} style={{ color: '#9fb3c8' }} />
    </View>
  )
}
