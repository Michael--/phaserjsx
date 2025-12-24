/**
 * Tooltip Timing & Animation Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function TooltipTimingExample() {
  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={16}>
      <Text text="Delays, animation, auto-dismiss" style={{ color: '#ffffff', fontSize: '16px' }} />
      <View direction="row" gap={10}>
        <Button onTooltip={() => ({ content: 'Fast (100ms)', showDelay: 100 })}>
          <Text text="Fast show" />
        </Button>
        <Button onTooltip={() => ({ content: 'Slow (1000ms)', showDelay: 1000 })}>
          <Text text="Slow show" />
        </Button>
        <Button
          onTooltip={() => ({
            content: 'Hide delay 2s',
            showDelay: 200,
            hideDelay: 2000,
          })}
        >
          <Text text="Hide delay" />
        </Button>
      </View>
      <View direction="row" gap={10}>
        <Button
          onTooltip={() => ({
            content: 'Pulsing',
            animation: { pulse: true, fadeIn: 200 },
          })}
        >
          <Text text="Pulse" />
        </Button>
        <Button
          onTooltip={() => ({
            content: 'Auto-dismiss (2s)',
            autoDismiss: 2000,
          })}
        >
          <Text text="Auto-dismiss" />
        </Button>
        <Button
          onTooltip={() => ({
            content: "Won't show",
            disabled: true,
          })}
        >
          <Text text="Disabled" />
        </Button>
      </View>
    </View>
  )
}
