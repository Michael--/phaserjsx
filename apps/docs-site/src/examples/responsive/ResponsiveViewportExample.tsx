/**
 * Responsive Viewport Playground Example
 */
/** @jsxImportSource @number10/phaserjsx */
import type { SizeValue } from '@number10/phaserjsx'
import { Button, Divider, Text, useState, View } from '@number10/phaserjsx'

type ViewportPreset = {
  id: 'phone' | 'tablet' | 'desktop'
  label: string
  width: number
  height: number
}

const VIEWPORTS: ViewportPreset[] = [
  { id: 'phone', label: 'Phone', width: 250, height: 420 },
  { id: 'tablet', label: 'Tablet', width: 420, height: 330 },
  { id: 'desktop', label: 'Desktop', width: 560, height: 330 },
]

const TEXT = { color: '#f8fafc', fontSize: '12px' }
const MUTED = { color: '#94a3b8', fontSize: '11px' }

function PresetButton({
  preset,
  active,
  onClick,
}: {
  key?: string
  preset: ViewportPreset
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      width={92}
      height={34}
      size="small"
      variant={active ? 'primary' : 'outline'}
      onClick={onClick}
    >
      <Text text={preset.label} style={{ color: '#ffffff', fontSize: '12px' }} />
    </Button>
  )
}

function Meter({ label, width, color }: { label: string; width: SizeValue; color: number }) {
  return (
    <View direction="column" gap={5}>
      <View direction="row" justifyContent="space-between" width="fill">
        <Text text={label} style={MUTED} />
        <Text text={String(width)} style={MUTED} />
      </View>
      <View width="fill" height={12} backgroundColor={0x1e293b} cornerRadius={6}>
        <View width={width} height={12} backgroundColor={color} cornerRadius={6} />
      </View>
    </View>
  )
}

function InfoCard({ title, value, accent }: { title: string; value: string; accent: number }) {
  return (
    <View
      width="fill"
      minWidth={60}
      maxWidth={120}
      height={54}
      direction="column"
      gap={8}
      padding={10}
      backgroundColor={0x1e293b}
      borderColor={accent}
      borderWidth={2}
      cornerRadius={6}
    >
      <Text text={title} style={MUTED} />
      <Text text={value} style={{ color: '#f8fafc', fontSize: '15px' }} />
    </View>
  )
}

function SimulatedApp({ viewport }: { viewport: ViewportPreset }) {
  const compact = viewport.width < 320
  const roomy = viewport.width >= 500

  return (
    <View
      width={viewport.width}
      height={viewport.height}
      direction="column"
      gap={compact ? 8 : 12}
      padding={compact ? 10 : 16}
      backgroundColor={0x0f172a}
      borderColor={0x38bdf8}
      borderWidth={2}
      cornerRadius={8}
    >
      <View
        width="fill"
        height={compact ? 48 : 58}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={10}
        backgroundColor={0x1e293b}
        cornerRadius={6}
      >
        <Text text="Game UI" style={{ color: '#f8fafc', fontSize: compact ? '13px' : '16px' }} />
        <View width={compact ? 52 : 92} height={10} backgroundColor={0x22c55e} cornerRadius={5} />
      </View>

      <View flex={1} width="fill" direction={roomy ? 'row' : 'column'} gap={compact ? 8 : 12}>
        <View
          width={roomy ? 160 : 'fill'}
          height={roomy ? 'fill' : undefined}
          direction="column"
          gap={8}
          padding={10}
          backgroundColor={0x111827}
          cornerRadius={6}
        >
          <Text text={roomy ? 'Sidebar' : 'Quick stats'} style={TEXT} />
          <Meter label="HP" width="78%" color={0x22c55e} />
          <Meter label="MP" width="52%" color={0x38bdf8} />
        </View>

        <View flex={1} width="fill" direction="column" gap={compact ? 8 : 12}>
          <View
            direction="row"
            flexWrap="wrap"
            gap={compact ? 8 : 12}
            width="fill"
            cornerRadius={6}
          >
            <InfoCard title="Score" value="42,800" accent={0xf59e0b} />
            <InfoCard title="Quest" value="3 / 5" accent={0xa78bfa} />
            {!compact && <InfoCard title="Crafting" value="Ready" accent={0x22c55e} />}
          </View>

          <View
            flex={1}
            width="fill"
            minHeight={60}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={8}
            backgroundColor={0x1e293b}
            cornerRadius={6}
          >
            <Text
              text={
                compact
                  ? 'Compact column layout'
                  : roomy
                    ? 'Wide split layout'
                    : 'Wrapped tablet layout'
              }
              style={TEXT}
            />
            <Text text={`${viewport.width} x ${viewport.height}`} style={MUTED} />
          </View>
        </View>
      </View>
    </View>
  )
}

export function ResponsiveViewportExample() {
  const [viewport, setViewport] = useState<ViewportPreset>(VIEWPORTS[1])

  return (
    <View width="fill" height="fill" gap={16} padding={16} backgroundColor={0x020617}>
      <View width={190} direction="column" gap={12}>
        <Text text="Viewport simulator" style={{ color: '#f8fafc', fontSize: '16px' }} />
        <Text text="Switch canvas sizes and watch layout rules respond." style={MUTED} />
        <Divider color={0x334155} />

        <View direction="row" gap={8} flexWrap="wrap" justifyContent="center" alignItems="center">
          {VIEWPORTS.map((entry) => (
            <PresetButton
              key={entry.id}
              preset={entry}
              active={viewport.id === entry.id}
              onClick={() => setViewport(entry)}
            />
          ))}
          <Text text="Rules shown" style={TEXT} />
          <View direction="column" gap={8} padding={10} backgroundColor={0x0f172a} cornerRadius={6}>
            <Text text="width < 320: compact" style={MUTED} />
            <Text text="width >= 500: split view" style={MUTED} />
            <Text text="cards use min/max" style={MUTED} />
          </View>
        </View>
      </View>

      <View flex={1} height="fill" justifyContent="center" alignItems="center">
        <SimulatedApp viewport={viewport} />
      </View>
    </View>
  )
}
