/**
 * TooltipExample - Demonstrates onTooltip property on various components
 */
import { createTextStyle, ScrollView, Text, useThemeTokens } from '@phaserjsx/ui'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

function Example() {
  const tokens = useThemeTokens()
  const textStyle = createTextStyle(tokens?.textStyles?.small, { fontStyle: 'italic' })

  return (
    <ViewLevel2>
      {/* Basic tooltip */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Hover me" onTooltip={() => 'This is a simple tooltip'} />
      </ViewLevel3>

      {/* Different positions */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button
          text="Top"
          onTooltip={() => ({
            content: 'Top tooltip',
            position: 'top',
            animation: { move: { dx: 0, dy: -20 } },
          })}
        />
        <Button
          text="Bottom"
          onTooltip={() => ({
            content: 'Bottom tooltip',
            position: 'bottom',
            animation: { move: { dx: 0, dy: 20 } },
          })}
        />
        <Button
          text="Left"
          onTooltip={() => ({
            content: 'Left tooltip',
            position: 'left',
            animation: { move: { dx: -20, dy: 0 } },
          })}
        />
        <Button
          text="Right"
          onTooltip={() => ({
            content: 'Right tooltip',
            position: 'right',
            animation: { move: { dx: 20, dy: 0 } },
          })}
        />
      </ViewLevel3>

      {/* Custom delay */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Fast show" onTooltip={() => ({ content: 'Fast (100ms)', showDelay: 100 })} />
        <Button
          text="Slow show"
          onTooltip={() => ({ content: 'Slow (1000ms)', showDelay: 1000 })}
        />
        <Button
          text="Hide delay"
          onTooltip={() => ({ content: 'With hide delay', showDelay: 200, hideDelay: 2500 })}
        />
      </ViewLevel3>

      {/* Conditional tooltip */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button text="Conditional" onTooltip={() => (Math.random() > 0.5 ? 'Lucky!' : null)} />
        <Button text="Always null" onTooltip={() => null} />
      </ViewLevel3>

      {/* Disabled state */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button
          text="Disabled tooltip"
          onTooltip={() => ({ content: "Won't show", disabled: true })}
        />
      </ViewLevel3>

      {/* Animations */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button
          text="Fade in"
          onTooltip={() => ({
            content: 'Fading in...',
            animation: { fadeIn: 500, move: { dx: 0, dy: 0 } },
          })}
        />
        <Button
          text="Move up"
          onTooltip={() => ({
            content: 'Moving up!',
            animation: { fadeIn: 200, move: { dx: 0, dy: -10 } },
          })}
        />
        <Button
          text="Pulse"
          onTooltip={() => ({
            content: 'Pulsing!',
            animation: { pulse: true, fadeIn: 200 },
          })}
        />
      </ViewLevel3>

      {/* Auto-dismiss */}
      <ViewLevel3 alignItems="center" direction="row">
        <Button
          text="Auto-dismiss (2s)"
          onTooltip={() => ({
            content: 'Disappears after 2 seconds',
            autoDismiss: 2000,
          })}
        />
        <Button
          text="Animated + auto-dismiss"
          onTooltip={() => ({
            content: 'Fancy & timed!',
            autoDismiss: 3000,
            animation: { fadeIn: 300, pulse: true },
          })}
        />
      </ViewLevel3>

      {/* Info text */}
      <ViewLevel3 alignItems="center" direction="column">
        <Text
          text="💡 Desktop/mouse only - Tooltips don't work on touch devices"
          style={textStyle}
        />
        <Text
          text="🎨 Native Phaser text with tweens - text only, great performance"
          style={textStyle}
        />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * TooltipExample component with ScrollView wrapper
 */
export function TooltipExample() {
  return (
    <ScrollView width="fill" height="fill">
      <Example />
    </ScrollView>
  )
}
