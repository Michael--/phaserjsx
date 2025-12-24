/**
 * Tooltip Positions Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Text, View } from '@number10/phaserjsx'

export function TooltipPositionsExample() {
  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={16}>
      <Text text="Preferred position per tooltip" style={{ color: '#ffffff', fontSize: '16px' }} />
      <View direction="row" gap={10}>
        <Button
          onTooltip={() => ({
            content: 'Top tooltip',
            position: 'top',
            animation: { move: { dx: 0, dy: -16 } },
          })}
        >
          <Text text="Top" />
        </Button>
        <Button
          onTooltip={() => ({
            content: 'Bottom tooltip',
            position: 'bottom',
            animation: { move: { dx: 0, dy: 16 } },
          })}
        >
          <Text text="Bottom" />
        </Button>
        <Button
          onTooltip={() => ({
            content: 'Left tooltip',
            position: 'left',
            animation: { move: { dx: -16, dy: 0 } },
          })}
        >
          <Text text="Left" />
        </Button>
        <Button
          onTooltip={() => ({
            content: 'Right tooltip',
            position: 'right',
            animation: { move: { dx: 16, dy: 0 } },
          })}
        >
          <Text text="Right" />
        </Button>
      </View>
    </View>
  )
}
