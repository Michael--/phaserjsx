/**
 * Badge Variants Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Badge, Text, View } from '@number10/phaserjsx'

const tones = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const
const variants = ['solid', 'soft', 'outline'] as const

export function VariantsBadgeExample() {
  return (
    <View width="fill" height="fill" padding={24} gap={18} justifyContent="center">
      {variants.map((variant) => (
        <View key={variant} gap={8}>
          <Text text={variant} style={{ color: '#ffffff', fontSize: '14px' }} />
          <View direction="row" gap={8} flexWrap="wrap">
            {tones.map((tone) => (
              <Badge key={`${variant}-${tone}`} label={tone} tone={tone} variant={variant} />
            ))}
          </View>
        </View>
      ))}

      <View direction="row" gap={10} alignItems="center">
        <Badge label="Small" size="small" tone="info" />
        <Badge label="Medium" size="medium" tone="info" />
        <Badge label="Large" size="large" tone="info" />
        <Badge count={142} tone="danger" maxCount={99} />
      </View>
    </View>
  )
}
