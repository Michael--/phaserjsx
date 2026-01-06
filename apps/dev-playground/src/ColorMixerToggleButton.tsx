import { Text, useThemeTokens, View } from '@number10/phaserjsx'

interface ColorMixerToggleButtonProps {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

export function ColorMixerToggleButton(props: ColorMixerToggleButtonProps) {
  const tokens = useThemeTokens()
  const borderColor = tokens?.colors.border.light.toNumber() ?? 0x333333
  const overlayColor = tokens?.colors.surface.light.toNumber() ?? 0x2a2a2a
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#ffffff'
  const labelStyle = tokens?.textStyles.small ?? { fontSize: '12px', color: textColor }

  const onTouch = () => {
    props.onToggle(!props.isOpen)
  }

  return (
    <View
      alignItems="center"
      padding={{ left: 12, right: 12, top: 8, bottom: 8 }}
      backgroundColor={overlayColor}
      backgroundAlpha={0.8}
      borderColor={borderColor}
      borderWidth={1}
      cornerRadius={10}
      alpha={props.isOpen ? 0 : 1}
      onTouch={onTouch}
    >
      <Text text="Show Color Mixer" style={labelStyle} />
    </View>
  )
}
