/**
 * Toolbar Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, Toolbar, type ToolbarItem, useState, View } from '@number10/phaserjsx'

const quickStartItems: ToolbarItem[] = [
  { id: 'select', type: 'toggle', label: 'Select' },
  { id: 'move', type: 'toggle', label: 'Move' },
  { type: 'separator' },
  { id: 'save', type: 'action', label: 'Save' },
]

export function QuickStartToolbarExample() {
  const [activeTool, setActiveTool] = useState('select')
  const [lastAction, setLastAction] = useState('none')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <Toolbar
        items={quickStartItems}
        activeId={activeTool}
        onToggle={(id) => setActiveTool(id)}
        onSelect={(id, item) => {
          if (item.type !== 'toggle') setLastAction(id)
        }}
      />

      <Text text={`Tool: ${activeTool} | Action: ${lastAction}`} style={{ color: '#9fb3c8' }} />
    </View>
  )
}
