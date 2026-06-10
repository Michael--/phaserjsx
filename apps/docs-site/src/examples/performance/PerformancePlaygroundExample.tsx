/**
 * Performance Playground Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, DebugPanel, Text, useMemo, useState, View } from '@number10/phaserjsx'

const NODE_COUNTS = [24, 72, 5000, 15000, 50000] as const

type UpdateMode = 'stable' | 'changing'

function getCellColor(index: number, tick: number, mode: UpdateMode): number {
  if (mode === 'stable') return index % 3 === 0 ? 0x3b82f6 : index % 3 === 1 ? 0x22c55e : 0xf59e0b
  return (index + tick) % 3 === 0 ? 0xef4444 : (index + tick) % 3 === 1 ? 0x8b5cf6 : 0x06b6d4
}

export function PerformancePlaygroundExample() {
  const [nodeCount, setNodeCount] = useState<(typeof NODE_COUNTS)[number]>(72)
  const [mode, setMode] = useState<UpdateMode>('stable')
  const [tick, setTick] = useState(0)

  const cells = useMemo(() => Array.from({ length: nodeCount }, (_, index) => index), [nodeCount])

  return (
    <View width="fill" height="fill" padding={16} gap={12} backgroundColor={0x111827}>
      <View direction="row" gap={8} alignItems="center">
        <Text text="Nodes" style={{ color: '#ffffff', fontSize: '15px' }} />
        {NODE_COUNTS.map((count) => (
          <Button key={`count-${count}`} onClick={() => setNodeCount(count)}>
            <Text text={String(count)} />
          </Button>
        ))}
        <Button onClick={() => setMode((value) => (value === 'stable' ? 'changing' : 'stable'))}>
          <Text text={mode} />
        </Button>
        <Button onClick={() => setTick((value) => value + 1)}>
          <Text text="Update" />
        </Button>
      </View>

      <View
        width={'fill'}
        height={'calc(100% - 48px)'}
        direction="stack"
        backgroundColor={0x20283a}
        cornerRadius={8}
      >
        <View x={16} y={18} width={360} direction="row" flexWrap="wrap" gap={5}>
          {cells.map((index) => (
            <View
              key={`cell-${index}`}
              width={24}
              height={16}
              backgroundColor={getCellColor(index, tick, mode)}
              alpha={mode === 'stable' ? 0.72 : 0.92}
              cornerRadius={3}
            />
          ))}
        </View>

        <DebugPanel
          x={392}
          y={16}
          width={150}
          padding={8}
          backgroundColor={0x0f172a}
          borderColor={0x3b82f6}
          borderWidth={1}
          cornerRadius={4}
          preset="perf"
          intervalMs={250}
        />

        <DebugPanel
          x={392}
          y={120}
          width={150}
          padding={8}
          backgroundColor={0x0f172a}
          borderColor={0x22c55e}
          borderWidth={1}
          cornerRadius={4}
          metrics={['mountsTotal', 'textureCount']}
          intervalMs={250}
          maxRows={3}
        />
      </View>
    </View>
  )
}
