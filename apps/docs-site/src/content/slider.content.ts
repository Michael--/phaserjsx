/**
 * Slider Component Documentation Content
 */
import { SCENE_SIZES } from '@/constants/scene-sizes'
import { CustomMarksAndLabelsExample } from '@/examples/slider/CustomMarksAndLabelsExample'
import CustomMarksAndLabelsExampleCode from '@/examples/slider/CustomMarksAndLabelsExample.tsx?raw'
import { MarksSliderExample } from '@/examples/slider/MarksExample'
import MarksSliderExampleCode from '@/examples/slider/MarksExample.tsx?raw'
import { OrientationSliderExample } from '@/examples/slider/OrientationExample'
import OrientationSliderExampleCode from '@/examples/slider/OrientationExample.tsx?raw'
import { QuickStartSliderExample } from '@/examples/slider/QuickStartExample'
import QuickStartSliderExampleCode from '@/examples/slider/QuickStartExample.tsx?raw'
import { RangeSliderExample } from '@/examples/slider/RangeSliderExample'
import RangeSliderExampleCode from '@/examples/slider/RangeSliderExample.tsx?raw'
import { StatesSliderExample } from '@/examples/slider/StatesExample'
import StatesSliderExampleCode from '@/examples/slider/StatesExample.tsx?raw'
import type { ComponentDocs } from '@/types/docs'

/**
 * Slider component documentation configuration
 */
export const sliderContent: ComponentDocs = {
  title: 'Slider',
  description:
    'Interactive value selection component with horizontal/vertical orientation. Slider provides smooth dragging interaction with marks, snapping, and value display. Also includes RangeSlider for selecting value ranges with two thumbs.',

  quickStart: {
    id: 'quick-start',
    title: 'Quick Start',
    description:
      'Basic slider with controlled value, onChange handler, and customizable range. The slider provides smooth interaction and visual feedback.',
    component: QuickStartSliderExample,
    height: SCENE_SIZES.medium,
    code: QuickStartSliderExampleCode,
  },

  examples: [
    {
      id: 'orientation',
      title: 'Orientation',
      description: 'Horizontal and vertical slider orientations with value display.',
      component: OrientationSliderExample,
      height: SCENE_SIZES.large,
      code: OrientationSliderExampleCode,
    },
    {
      id: 'marks',
      title: 'Marks and Snapping',
      description: 'Sliders with custom marks or auto-generated marks that snap to values.',
      component: MarksSliderExample,
      height: SCENE_SIZES.large,
      code: MarksSliderExampleCode,
    },
    {
      id: 'states',
      title: 'States and Modes',
      description: 'Different slider states: normal, disabled, and continuous (no snap) mode.',
      component: StatesSliderExample,
      height: SCENE_SIZES.large,
      code: StatesSliderExampleCode,
    },
    {
      id: 'range',
      title: 'Range Slider',
      description: 'RangeSlider component with two thumbs for selecting value ranges.',
      component: RangeSliderExample,
      height: SCENE_SIZES.large,
      code: RangeSliderExampleCode,
    },
    {
      id: 'custom-marks-labels',
      title: 'Custom Marks and Labels',
      description: 'RangeSlider component with custom marks and formatted value labels.',
      component: CustomMarksAndLabelsExample,
      height: SCENE_SIZES.large,
      code: CustomMarksAndLabelsExampleCode,
    },
  ],

  propsEssential: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current value (controlled mode). Use with onChange for controlled slider.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: undefined,
      description: 'Initial value (uncontrolled mode). Slider manages state internally.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired when value changes during dragging.',
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value of the slider range.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value of the slider range.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'Step increment for value changes.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Slider orientation direction.',
    },
  ],

  propsComplete: [
    {
      name: 'value',
      type: 'number',
      default: undefined,
      description: 'Current value (controlled mode). Use with onChange for controlled slider.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      default: undefined,
      description: 'Initial value (uncontrolled mode). Slider manages state internally.',
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired when value changes during dragging.',
    },
    {
      name: 'onChangeStart',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired when dragging starts.',
    },
    {
      name: 'onChangeEnd',
      type: '(value: number) => void',
      default: undefined,
      description: 'Callback fired when dragging ends.',
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value of the slider range.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value of the slider range.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'Step increment for value changes. Supports decimals (e.g., 0.1).',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Slider orientation direction.',
    },
    {
      name: 'reverse',
      type: 'boolean',
      default: 'false',
      description: 'Reverse direction: right-to-left for horizontal, bottom-to-top for vertical.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables interaction and applies reduced opacity (0.4).',
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Display current value label on or near the thumb.',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      default: undefined,
      description: 'Custom formatter for value label (e.g., `(v) => "$" + v`).',
    },
    {
      name: 'marks',
      type: 'SliderMark[] | boolean',
      default: undefined,
      description:
        'Marks/ticks to display. Use `true` for auto-generated marks at each step, or provide custom SliderMark[] array.',
    },
    {
      name: 'snap',
      type: 'boolean',
      default: 'true',
      description: 'Snap to step increments. Set false for smooth continuous movement.',
    },
    {
      name: 'trackLength',
      type: 'number',
      default: '200',
      description: 'Length of the slider track in pixels.',
    },
    {
      name: 'renderThumb',
      type: '(value: number, isDragging: boolean) => VNode',
      default: undefined,
      description: 'Custom thumb renderer. Receives current value and drag state.',
    },
    {
      name: 'renderTrack',
      type: '(fillPercentage: number) => VNode',
      default: undefined,
      description: 'Custom track renderer. Receives fill percentage (0-1).',
    },
  ],
}
