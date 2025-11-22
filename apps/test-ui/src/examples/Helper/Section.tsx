import { Text, useThemeTokens } from '@phaserjsx/ui'

/**
 * Section header component
 */
export function SectionHeader({ title }: { title: string }) {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return <Text text={title} style={tokens.textStyles.title} />
}
