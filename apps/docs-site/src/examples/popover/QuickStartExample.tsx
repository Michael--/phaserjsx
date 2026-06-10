/**
 * Popover Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Popover, Tag, Text, View, WrapText } from '@number10/phaserjsx'

export function QuickStartPopoverExample() {
  return (
    <View width="fill" height="fill" padding={24} justifyContent="start" alignItems="center">
      <Popover
        placement="bottom"
        contentWidth={180}
        trigger={
          <View
            width={160}
            height={42}
            justifyContent="center"
            alignItems="center"
            backgroundColor={0x2563eb}
            cornerRadius={8}
          >
            <Text text="Open popover" style={{ color: '#ffffff', fontSize: '14px' }} />
          </View>
        }
      >
        <Text text="Potion Details" style={{ color: '#ffffff', fontSize: '16px' }} />
        <WrapText
          text="Portal content is positioned above the app layout and does not reserve parent space."
          style={{ fontSize: '12px' }}
        />
        <View direction="row" gap={8}>
          <Tag label="Consumable" tone="success" />
          <Tag label="Rare" tone="warning" />
        </View>
      </Popover>
    </View>
  )
}
