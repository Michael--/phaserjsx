/**
 * Popover Placements Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Popover, Text, View, WrapText, type PopoverPlacement } from '@number10/phaserjsx'

const placements: PopoverPlacement[] = ['top', 'bottom', 'left', 'right']

export function PlacementsPopoverExample() {
  return (
    <View width="fill" height="fill" padding={26} justifyContent="center" alignItems="center">
      <View direction="row" gap={18} alignItems="center">
        {placements.map((placement) => (
          <Popover
            key={placement}
            placement={placement}
            contentWidth={180}
            trigger={
              <View
                width={86}
                height={42}
                justifyContent="center"
                alignItems="center"
                backgroundColor={0x1e293b}
                borderColor={0x475569}
                borderWidth={1}
                cornerRadius={7}
              >
                <Text text={placement} style={{ color: '#ffffff', fontSize: '12px' }} />
              </View>
            }
          >
            <Text text={`${placement} placement`} style={{ color: '#ffffff', fontSize: '13px' }} />
            <WrapText
              text="The overlay is clamped inside the scene viewport."
              style={{ fontSize: '11px' }}
            />
          </Popover>
        ))}
      </View>
    </View>
  )
}
