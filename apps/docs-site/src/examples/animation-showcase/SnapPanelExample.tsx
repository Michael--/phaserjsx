/**
 * Snap Panel Example - spring transitions between fixed UI states
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Text,
  TransformOriginView,
  useForceRedraw,
  useSprings,
  useState,
  View,
} from '@number10/phaserjsx'

const PANEL_STATES = {
  closed: { y: 198, alpha: 0, scale: 0.98, label: 'Closed' },
  peek: { y: 136, alpha: 0.25, scale: 1, label: 'Peek' },
  open: { y: 96, alpha: 0.55, scale: 1, label: 'Open' },
} as const

type PanelState = keyof typeof PANEL_STATES

/**
 * Overlay panel snaps between states with one coordinated spring update.
 */
export function SnapPanelExample() {
  const [mode, setMode] = useState<PanelState>('peek')
  const [panel, setPanel] = useSprings({ y: 136, alpha: 0.25, scale: 1 }, 'gentle')
  useForceRedraw(20, panel.y, panel.alpha, panel.scale)

  const snapTo = (nextMode: PanelState) => {
    const next = PANEL_STATES[nextMode]
    setMode(nextMode)
    setPanel({ y: next.y, alpha: next.alpha, scale: next.scale })
  }

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
    >
      <View
        width={360}
        direction="column"
        gap={12}
        padding={16}
        backgroundColor={0x1e1b2f}
        cornerRadius={10}
      >
        <View direction="row" justifyContent="space-between" alignItems="center">
          <View direction="column" gap={4}>
            <Text text="Problem" style={{ fontSize: 11, color: '#9d91bf' }} />
            <Text
              text="Panels need stable snap states"
              style={{ fontSize: 15, color: '#ffffff' }}
            />
          </View>
          <Text text={PANEL_STATES[mode].label} style={{ fontSize: 11, color: '#d9ccff' }} />
        </View>

        <View
          width="fill"
          height={190}
          backgroundColor={0x100f1a}
          cornerRadius={10}
          overflow="hidden"
          direction="stack"
        >
          <View
            width={328}
            height={190}
            padding={12}
            direction="column"
            justifyContent="space-between"
          >
            <View direction="row" justifyContent="space-between">
              <Text text="Inventory" style={{ fontSize: 13, color: '#ddd8ff' }} />
              <Text text="12 items" style={{ fontSize: 10, color: '#8f86aa' }} />
            </View>

            <View
              width="fill"
              height={58}
              backgroundColor={0x6d5dfc}
              backgroundAlpha={panel.alpha.value}
              cornerRadius={8}
            />
          </View>

          <TransformOriginView
            width={304}
            height={82}
            x={12}
            y={panel.y.value}
            scale={panel.scale.value}
            cornerRadius={10}
          >
            <View
              width={304}
              height={82}
              backgroundColor={0xf3f0ff}
              cornerRadius={10}
              padding={12}
              direction="column"
              gap={8}
            >
              <Text text="Quick actions" style={{ fontSize: 13, color: '#17142a' }} />
              <View direction="row" gap={8}>
                <View
                  width={82}
                  height={24}
                  backgroundColor={0x6d5dfc}
                  cornerRadius={6}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="Equip" style={{ fontSize: 10, color: '#ffffff' }} />
                </View>
                <View
                  width={82}
                  height={24}
                  backgroundColor={0x201a38}
                  cornerRadius={6}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="Inspect" style={{ fontSize: 10, color: '#ffffff' }} />
                </View>
              </View>
            </View>
          </TransformOriginView>
        </View>

        <View direction="row" gap={8} justifyContent="center">
          {(Object.keys(PANEL_STATES) as PanelState[]).map((state) => (
            <View
              key={state}
              width={80}
              height={30}
              backgroundColor={state === mode ? 0xd9ccff : 0x2d2744}
              cornerRadius={6}
              alignItems="center"
              justifyContent="center"
              enableGestures
              onTouch={() => snapTo(state)}
            >
              <Text
                text={PANEL_STATES[state].label}
                style={{ fontSize: 10, color: state === mode ? '#17142a' : '#ddd8ff' }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
