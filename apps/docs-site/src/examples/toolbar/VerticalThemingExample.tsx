/**
 * Toolbar vertical and theming example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { Text, Toolbar, type ToolbarItem, useState, View } from '@number10/phaserjsx'

const verticalItems: ToolbarItem[] = [
  { id: 'paint', type: 'toggle', label: 'Paint', icon: <Icon type="star" /> },
  { id: 'folder', type: 'toggle', label: 'Files', icon: <Icon type="folder" /> },
  { type: 'separator' },
  {
    id: 'more',
    type: 'menu',
    label: 'More',
    icon: <Icon type="gear" />,
    items: [
      { id: 'export', label: 'Export' },
      { id: 'reset', label: 'Reset' },
    ],
  },
]

export function VerticalThemingToolbarExample() {
  const [activeTool, setActiveTool] = useState('paint')
  const [lastAction, setLastAction] = useState('none')

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <View direction="row" alignItems="center" gap={24}>
        <Toolbar
          items={verticalItems}
          activeId={activeTool}
          orientation="vertical"
          density="compact"
          showLabels={false}
          onToggle={(id) => setActiveTool(id)}
          onSelect={(id, item) => {
            if (item.type === 'menu') setLastAction(id)
          }}
          labels={{ menuIndicator: '+' }}
          theme={{
            Toolbar: {
              backgroundColor: 0x111827,
              borderColor: 0x475569,
              itemGap: 8,
              activeButtonVariant: 'outline',
              separatorColor: 0x64748b,
              Icon: {
                tint: 0xffff00,
              },
              Button: {
                secondary: {
                  backgroundColor: 0x2563eb,
                  backgroundAlpha: 0.24,
                },
                outline: {
                  backgroundColor: 0x2563eb,
                  backgroundAlpha: 0.24,
                  borderColor: 0x93c5fd,
                },
              },
            },
          }}
        />

        <View gap={8}>
          <Text text={`Active: ${activeTool}`} style={{ color: '#e2e8f0' }} />
          <Text text={`Trigger: ${lastAction}`} style={{ color: '#9fb3c8' }} />
        </View>
      </View>
    </View>
  )
}
