/**
 * Tooltips Guide Page
 */
/** @jsxImportSource react */
import {
  DocDescription,
  ExampleSection,
  PropsTable,
  Section,
  SectionDescription,
} from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { SCENE_SIZES } from '@/constants/scene-sizes'
import {
  QuickStartTooltipExample,
  TooltipAnyComponentExample,
  TooltipPositionsExample,
  TooltipTimingExample,
} from '@/examples/tooltip'
import type { ExampleDefinition, PropDefinition } from '@/types/docs'
import '@/styles/docs.css'
import QuickStartTooltipExampleRaw from '@/examples/tooltip/QuickStartExample.tsx?raw'
import TooltipAnyComponentExampleRaw from '@/examples/tooltip/AnyComponentExample.tsx?raw'
import TooltipPositionsExampleRaw from '@/examples/tooltip/PositionsExample.tsx?raw'
import TooltipTimingExampleRaw from '@/examples/tooltip/TimingExample.tsx?raw'

const tooltipExamples: ExampleDefinition[] = [
  {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Add onTooltip to any component with gestures enabled.',
    component: QuickStartTooltipExample,
    height: SCENE_SIZES.medium,
    code: QuickStartTooltipExampleRaw,
  },
  {
    id: 'any-component',
    title: 'Any Component',
    description: 'Tooltips are available on any component that supports core props.',
    component: TooltipAnyComponentExample,
    height: SCENE_SIZES.medium,
    code: TooltipAnyComponentExampleRaw,
  },
  {
    id: 'positions',
    title: 'Positions',
    description: 'Prefer top, bottom, left, or right with subtle motion.',
    component: TooltipPositionsExample,
    height: SCENE_SIZES.medium,
    code: TooltipPositionsExampleRaw,
  },
  {
    id: 'timing',
    title: 'Timing & Animation',
    description: 'Tune delays, animations, auto-dismiss, and disabled state.',
    component: TooltipTimingExample,
    height: SCENE_SIZES.medium,
    code: TooltipTimingExampleRaw,
  },
]

const tooltipConfigProps: PropDefinition[] = [
  {
    name: 'content',
    type: 'string',
    description: 'Tooltip text (text only, no JSX).',
  },
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'top'",
    description: 'Preferred position relative to the target (auto-adjusted if needed).',
  },
  {
    name: 'showDelay',
    type: 'number',
    default: '500',
    description: 'Delay before showing tooltip in ms.',
  },
  {
    name: 'hideDelay',
    type: 'number',
    default: '0',
    description: 'Delay before hiding tooltip in ms.',
  },
  {
    name: 'offset',
    type: 'number',
    default: '8',
    description: 'Offset from target in pixels.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable tooltip rendering for this hover.',
  },
  {
    name: 'autoDismiss',
    type: 'number',
    default: '0',
    description: 'Auto-dismiss after duration in ms (0 disables auto-dismiss).',
  },
  {
    name: 'animation',
    type: 'TooltipNativeAnimation',
    description: 'Native Phaser animation configuration.',
  },
]

const tooltipAnimationProps: PropDefinition[] = [
  {
    name: 'fadeIn',
    type: 'number',
    default: '200',
    description: 'Fade-in duration in ms.',
  },
  {
    name: 'fadeOut',
    type: 'number',
    default: '200',
    description: 'Fade-out duration in ms.',
  },
  {
    name: 'move',
    type: '{ dx?: number; dy?: number }',
    description: 'Motion offset applied during animation.',
  },
  {
    name: 'pulse',
    type: 'boolean',
    default: 'false',
    description: 'Enable pulsing scale animation.',
  },
  {
    name: 'pulseScale',
    type: '[number, number]',
    default: '[0.75, 1.25]',
    description: 'Pulse scale range when pulse is enabled.',
  },
]

export function TooltipsPage() {
  return (
    <DocLayout>
      <h1>Tooltips</h1>
      <DocDescription>
        Tooltips are lightweight, text-only hover hints driven by the <code>onTooltip</code> core
        prop. They render as native Phaser text and are intended for desktop/mouse input.
      </DocDescription>

      <Section title="Overview">
        <SectionDescription>
          Use <code>onTooltip</code> on any component that supports core props (Buttons, Views,
          Sliders, etc.). The callback runs on hover start and returns either a string or a full
          configuration object. Return <code>null</code> or <code>undefined</code> to disable a
          tooltip dynamically.
        </SectionDescription>

        <div className="info-box">
          <strong>Note:</strong> Tooltips are disabled on touch-only devices. For touch, use
          press/long-press or dedicated UI components.
        </div>

        <CodeBlock language="tsx">
          {`// Simple string tooltip
<Button onTooltip={() => 'Delete item'}>
  <Text text="Delete" />
</Button>

// Full configuration
<Button
  onTooltip={() => ({
    content: 'Danger zone',
    position: 'top',
    showDelay: 150,
    animation: { move: { dy: -10 } },
  })}
>
  <Text text="Delete" />
</Button>`}
        </CodeBlock>
      </Section>

      <Section title="Examples">
        {tooltipExamples.map((example) => (
          <ExampleSection key={example.id} example={example} />
        ))}
      </Section>

      <Section title="TooltipConfig">
        <SectionDescription>
          The <code>onTooltip</code> callback can return a <code>TooltipConfig</code> object:
        </SectionDescription>
        <PropsTable props={tooltipConfigProps} />
      </Section>

      <Section title="TooltipNativeAnimation">
        <SectionDescription>
          Optional animation settings for tooltip appearance and motion:
        </SectionDescription>
        <PropsTable props={tooltipAnimationProps} />
      </Section>

      <Section title="Styling via Theme">
        <SectionDescription>
          Tooltip visuals are theme-driven. Override the Tooltip theme to control text styles,
          background color, padding, and corner radius.
        </SectionDescription>
        <CodeBlock language="tsx">
          {`// Example theme override
const theme: Theme = {
  ...baseTheme,
  Tooltip: {
    position: 'top',
    offset: 10,
    textStyle: {
      fontFamily: 'Helvetica',
      fontSize: '13px',
      color: '#111111',
      backgroundColor: '#ffd45a',
      padding: { x: 6, y: 4 },
    },
    cornerRadius: 10,
    animation: { fadeIn: 150, fadeOut: 150, move: { dy: -10 } },
  },
}`}
        </CodeBlock>
      </Section>
    </DocLayout>
  )
}
