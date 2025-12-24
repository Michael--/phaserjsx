/**
 * Tooltip Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function QuickStartTooltipExample() {
  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={14}>
      <Text text="Hover to show tooltips" style={{ color: '#ffffff', fontSize: '16px' }} />
      <View direction="row" gap={12}>
        <Button onTooltip={() => 'Primary action'}>
          <Text text="Primary" />
        </Button>
        <Button variant="secondary" onTooltip={() => 'Secondary action'}>
          <Text text="Secondary" />
        </Button>
        <Button variant="outline" onTooltip={() => (Math.random() > 0.5 ? 'Lucky!' : null)}>
          <Text text="Conditional" />
        </Button>
      </View>
      <Text
        text="Desktop/mouse only - tooltips are disabled on touch devices"
        style={{ color: '#9aa0a6', fontSize: '12px' }}
      />
    </View>
  )
}
