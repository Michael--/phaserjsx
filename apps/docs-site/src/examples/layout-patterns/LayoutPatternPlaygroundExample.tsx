/**
 * Layout Pattern Playground Example
 */
/** @jsxImportSource @number10/phaserjsx */
import type { ChildrenType, SizeValue } from '@number10/phaserjsx'
import { Button, Divider, Text, useState, View } from '@number10/phaserjsx'

type Pattern = 'app' | 'split' | 'gallery' | 'hud'
type Direction = 'row' | 'column'
type Justify = 'start' | 'center' | 'space-between'
type Align = 'start' | 'center' | 'stretch'

const PATTERNS: Pattern[] = ['app', 'split', 'gallery', 'hud']
const DIRECTION_OPTIONS: Direction[] = ['row', 'column']
const JUSTIFY_OPTIONS: Justify[] = ['start', 'center', 'space-between']
const ALIGN_OPTIONS: Align[] = ['start', 'center', 'stretch']
const GAP_OPTIONS = [6, 12, 20] as const

const LABEL_STYLE = { color: '#dbeafe', fontSize: '12px' }
const MUTED_STYLE = { color: '#94a3b8', fontSize: '11px' }
const VALUE_STYLE = { color: '#f8fafc', fontSize: '12px' }

function ControlButton({
  label,
  active,
  onClick,
  width = 74,
}: {
  key?: string | number
  label: string
  active: boolean
  onClick: () => void
  width?: number
}) {
  return (
    <Button
      width={width}
      height={28}
      size="small"
      variant={active ? 'primary' : 'outline'}
      onClick={onClick}
    >
      <Text text={label} style={{ color: '#ffffff', fontSize: '11px' }} />
    </Button>
  )
}

function ControlGroup({ title, children }: { title: string; children: ChildrenType }) {
  return (
    <View direction="column" gap={6}>
      <Text text={title} style={LABEL_STYLE} />
      <View direction="row" gap={6} flexWrap="wrap">
        {children}
      </View>
    </View>
  )
}

function MiniBar({ color, width = 'fill' }: { color: number; width?: SizeValue }) {
  return <View width={width} height={8} backgroundColor={color} cornerRadius={4} />
}

function DataCard({
  title,
  color,
  alignItems,
}: {
  title: string
  color: number
  alignItems: Align
}) {
  return (
    <View
      width={112}
      height={76}
      direction="column"
      gap={8}
      padding={10}
      alignItems={alignItems === 'stretch' ? 'stretch' : alignItems}
      backgroundColor={0x1e293b}
      cornerRadius={6}
    >
      <Text text={title} style={VALUE_STYLE} />
      <MiniBar color={color} width={alignItems === 'stretch' ? 'fill' : 58} />
      <MiniBar color={0x475569} width={alignItems === 'stretch' ? 'fill' : 82} />
    </View>
  )
}

function AppPattern({
  direction,
  justifyContent,
  alignItems,
  gap,
}: {
  direction: Direction
  justifyContent: Justify
  alignItems: Align
  gap: (typeof GAP_OPTIONS)[number]
}) {
  return (
    <View direction="column" gap={gap} width="fill" height="fill">
      <View
        height={48}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        padding={10}
        backgroundColor={0x0f172a}
        cornerRadius={6}
      >
        <Text text="Top bar" style={VALUE_STYLE} />
        <View direction="row" gap={8}>
          <MiniBar color={0x22c55e} width={42} />
          <MiniBar color={0xf59e0b} width={42} />
        </View>
      </View>

      <View
        flex={1}
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        gap={gap}
      >
        <DataCard title="Inventory" color={0x38bdf8} alignItems={alignItems} />
        <DataCard title="Stats" color={0xa78bfa} alignItems={alignItems} />
        <DataCard title="Actions" color={0xf97316} alignItems={alignItems} />
      </View>
    </View>
  )
}

function SplitPattern({
  direction,
  justifyContent,
  alignItems,
  gap,
}: {
  direction: Direction
  justifyContent: Justify
  alignItems: Align
  gap: (typeof GAP_OPTIONS)[number]
}) {
  return (
    <View direction="row" gap={gap} width="fill" height="fill">
      <View
        width={94}
        direction="column"
        gap={8}
        padding={10}
        backgroundColor={0x0f172a}
        cornerRadius={6}
      >
        <Text text="Menu" style={VALUE_STYLE} />
        <MiniBar color={0x2563eb} />
        <MiniBar color={0x334155} />
        <MiniBar color={0x334155} />
        <View flex={1} />
        <MiniBar color={0x16a34a} />
      </View>

      <View
        flex={1}
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        gap={gap}
        padding={12}
        backgroundColor={0x111827}
        cornerRadius={6}
      >
        <View
          width={alignItems === 'stretch' ? 'fill' : 180}
          height={38}
          backgroundColor={0x334155}
          cornerRadius={5}
        >
          <Text text="Header" style={VALUE_STYLE} />
        </View>
        <View
          width={alignItems === 'stretch' ? 'fill' : 130}
          height={74}
          backgroundColor={0x0369a1}
          cornerRadius={5}
        >
          <Text text="Content" style={VALUE_STYLE} />
        </View>
        <View
          width={alignItems === 'stretch' ? 'fill' : 96}
          height={32}
          backgroundColor={0xf59e0b}
          cornerRadius={5}
        >
          <Text text="CTA" style={{ color: '#111827', fontSize: '12px' }} />
        </View>
      </View>
    </View>
  )
}

function GalleryPattern({
  justifyContent,
  alignItems,
  gap,
  wrap,
}: {
  justifyContent: Justify
  alignItems: Align
  gap: (typeof GAP_OPTIONS)[number]
  wrap: boolean
}) {
  return (
    <View
      direction="row"
      flexWrap={wrap ? 'wrap' : 'nowrap'}
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      width="fill"
      height="fill"
    >
      {Array.from({ length: 7 }, (_, index) => (
        <View
          key={`tile-${index}`}
          width={wrap ? 88 : 72}
          height={index % 3 === 0 ? 96 : 70}
          direction="column"
          gap={8}
          padding={8}
          backgroundColor={index % 2 === 0 ? 0x0ea5e9 : 0x7c3aed}
          cornerRadius={6}
        >
          <Text text={`Slot ${index + 1}`} style={{ color: '#ffffff', fontSize: '11px' }} />
          <MiniBar color={0xffffff} width="fill" />
        </View>
      ))}
    </View>
  )
}

function HudPattern({
  direction,
  justifyContent,
  alignItems,
  gap,
}: {
  direction: Direction
  justifyContent: Justify
  alignItems: Align
  gap: (typeof GAP_OPTIONS)[number]
}) {
  return (
    <View direction="stack" width="fill" height="fill" backgroundColor={0x0f172a} cornerRadius={6}>
      <View
        x={16}
        y={16}
        width={92}
        height={92}
        backgroundColor={0x14532d}
        alpha={0.9}
        cornerRadius={46}
      >
        <Text text="Map" style={VALUE_STYLE} />
      </View>
      <View x={258} y={18} width={96} height={34} backgroundColor={0xb91c1c} cornerRadius={17}>
        <Text text="Alert" style={{ color: '#ffffff', fontSize: '12px' }} />
      </View>
      <View
        x={24}
        y={152}
        width={318}
        height={88}
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        gap={gap}
        padding={10}
        backgroundColor={0x1e293b}
        cornerRadius={6}
      >
        <View
          width={76}
          height={alignItems === 'stretch' ? undefined : 34}
          backgroundColor={0x2563eb}
          cornerRadius={5}
        >
          <Text text="Skill A" style={VALUE_STYLE} />
        </View>
        <View
          width={76}
          height={alignItems === 'stretch' ? undefined : 34}
          backgroundColor={0x16a34a}
          cornerRadius={5}
        >
          <Text text="Skill B" style={VALUE_STYLE} />
        </View>
        <View
          width={76}
          height={alignItems === 'stretch' ? undefined : 34}
          backgroundColor={0xf97316}
          cornerRadius={5}
        >
          <Text text="Skill C" style={VALUE_STYLE} />
        </View>
      </View>
    </View>
  )
}

function PatternPreview({
  pattern,
  direction,
  justifyContent,
  alignItems,
  gap,
  wrap,
}: {
  pattern: Pattern
  direction: Direction
  justifyContent: Justify
  alignItems: Align
  gap: (typeof GAP_OPTIONS)[number]
  wrap: boolean
}) {
  return (
    <View
      flex={1}
      height="fill"
      direction="column"
      gap={10}
      padding={12}
      backgroundColor={0x1f2937}
      cornerRadius={8}
    >
      <View direction="row" justifyContent="space-between" alignItems="center">
        <Text text={`${pattern} layout`} style={{ color: '#f8fafc', fontSize: '14px' }} />
        <Text
          text={`${direction} / ${justifyContent} / ${alignItems}`}
          style={{ color: '#93c5fd', fontSize: '11px' }}
        />
      </View>
      <Divider color={0x334155} />

      <View flex={1} overflow="hidden">
        {pattern === 'app' && (
          <AppPattern
            direction={direction}
            justifyContent={justifyContent}
            alignItems={alignItems}
            gap={gap}
          />
        )}
        {pattern === 'split' && (
          <SplitPattern
            direction={direction}
            justifyContent={justifyContent}
            alignItems={alignItems}
            gap={gap}
          />
        )}
        {pattern === 'gallery' && (
          <GalleryPattern
            justifyContent={justifyContent}
            alignItems={alignItems}
            gap={gap}
            wrap={wrap}
          />
        )}
        {pattern === 'hud' && (
          <HudPattern
            direction={direction}
            justifyContent={justifyContent}
            alignItems={alignItems}
            gap={gap}
          />
        )}
      </View>
    </View>
  )
}

export function LayoutPatternPlaygroundExample() {
  const [pattern, setPattern] = useState<Pattern>('app')
  const [direction, setDirection] = useState<Direction>('row')
  const [justifyContent, setJustifyContent] = useState<Justify>('space-between')
  const [alignItems, setAlignItems] = useState<Align>('center')
  const [gap, setGap] = useState<(typeof GAP_OPTIONS)[number]>(12)
  const [wrap, setWrap] = useState(true)

  return (
    <View
      width="fill"
      height="fill"
      direction="row"
      gap={14}
      padding={16}
      backgroundColor={0x0f172a}
    >
      <View height="fill" direction="column" gap={12}>
        <Text text="Layout explorer" style={{ color: '#f8fafc', fontSize: '16px' }} />
        <Text text="Change one prop and watch the stage." style={MUTED_STYLE} />
        <Divider color={0x334155} />

        <ControlGroup title="Pattern">
          {PATTERNS.map((entry) => (
            <ControlButton
              key={entry}
              label={entry}
              active={pattern === entry}
              onClick={() => setPattern(entry)}
            />
          ))}
        </ControlGroup>

        <ControlGroup title="Direction">
          {DIRECTION_OPTIONS.map((entry) => (
            <ControlButton
              key={entry}
              label={entry}
              active={direction === entry}
              onClick={() => setDirection(entry)}
            />
          ))}
        </ControlGroup>

        <ControlGroup title="Main axis">
          {JUSTIFY_OPTIONS.map((entry) => (
            <ControlButton
              key={entry}
              label={entry}
              active={justifyContent === entry}
              onClick={() => setJustifyContent(entry)}
              width={entry === 'space-between' ? 154 : 74}
            />
          ))}
        </ControlGroup>

        <ControlGroup title="Cross axis">
          {ALIGN_OPTIONS.map((entry) => (
            <ControlButton
              key={entry}
              label={entry}
              active={alignItems === entry}
              onClick={() => setAlignItems(entry)}
            />
          ))}
        </ControlGroup>

        <View direction="row" gap={6} flexWrap="wrap">
          {GAP_OPTIONS.map((entry) => (
            <ControlButton
              key={entry}
              label={`gap ${entry}`}
              active={gap === entry}
              onClick={() => setGap(entry)}
            />
          ))}
          <ControlButton
            label={wrap ? 'wrap on' : 'wrap off'}
            active={wrap}
            onClick={() => setWrap((value) => !value)}
          />
        </View>
      </View>

      <PatternPreview
        pattern={pattern}
        direction={direction}
        justifyContent={justifyContent}
        alignItems={alignItems}
        gap={gap}
        wrap={wrap}
      />
    </View>
  )
}
