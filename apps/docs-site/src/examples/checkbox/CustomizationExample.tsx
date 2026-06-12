/**
 * Checkbox Customization Example
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Checkbox,
  createTheme,
  Graphics,
  Text,
  View,
  type CheckboxIndicatorRenderProps,
} from '@number10/phaserjsx'

const customIndicator = ({
  checked,
  disabled,
  size,
  color,
  checkedColor,
  indeterminateColor,
}: CheckboxIndicatorRenderProps) => (
  <Graphics
    width={size}
    height={size}
    dependencies={[checked, disabled, size, color, checkedColor, indeterminateColor]}
    onDraw={(g: Phaser.GameObjects.Graphics) => {
      const alpha = disabled ? 0.45 : 1
      const center = size / 2
      const inset = Math.max(3, Math.round(size * 0.16))
      const fillColor =
        checked === 'indeterminate' ? indeterminateColor : checked === true ? checkedColor : color

      g.fillStyle(fillColor, checked === false ? 0.15 * alpha : alpha)
      g.lineStyle(2, fillColor, alpha)
      g.beginPath()
      g.moveTo(center, inset)
      g.lineTo(size - inset, center)
      g.lineTo(center, size - inset)
      g.lineTo(inset, center)
      g.closePath()
      g.fillPath()
      g.strokePath()

      if (checked === true) {
        g.lineStyle(3, 0xffffff, alpha)
        g.beginPath()
        g.moveTo(size * 0.3, size * 0.52)
        g.lineTo(size * 0.44, size * 0.66)
        g.lineTo(size * 0.72, size * 0.36)
        g.strokePath()
      }

      if (checked === 'indeterminate') {
        g.lineStyle(3, 0xffffff, alpha)
        g.beginPath()
        g.moveTo(size * 0.3, center)
        g.lineTo(size * 0.7, center)
        g.strokePath()
      }
    }}
  />
)

const customTheme = createTheme({
  Checkbox: {
    size: 40,
    gap: 14,
    checkedColor: 0x8bd450,
    indeterminateColor: 0xffc857,
    labelStyle: {
      color: '#ffffff',
      fontSize: '16px',
    },
  },
})

export function CustomizationCheckboxExample() {
  return (
    <View
      width="fill"
      height="fill"
      padding={20}
      gap={16}
      justifyContent="center"
      theme={customTheme}
    >
      <Text text="Themed Checkboxes" style={{ color: '#ffffff', fontSize: '18px' }} />
      <Checkbox label="Large checked" checked={true} />
      <Checkbox label="Large indeterminate" checked="indeterminate" tristate />
      <Checkbox label="Label on the left" checked={true} labelPosition="left" />
      <Checkbox label="Custom unchecked" checked={false} renderIndicator={customIndicator} />
      <Checkbox label="Custom checked" checked={true} renderIndicator={customIndicator} />
      <Checkbox
        label="Custom indeterminate"
        checked={'indeterminate'}
        tristate
        renderIndicator={customIndicator}
      />
    </View>
  )
}
