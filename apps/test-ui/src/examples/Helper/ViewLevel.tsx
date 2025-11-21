import { useThemeTokens, View, type ViewProps } from '@phaserjsx/ui'

export function ViewLevel1(props: ViewProps) {
  return (
    <View
      width={'100%'}
      height={'100%'}
      justifyContent="start"
      padding={20}
      gap={10}
      cornerRadius={5}
      {...props}
    />
  )
}

export function ViewLevel2(props: ViewProps) {
  const colors = useThemeTokens()?.colors
  return (
    <View
      backgroundColor={colors?.surface.medium.toNumber()}
      padding={10}
      direction="column"
      gap={10}
      cornerRadius={5}
      {...props}
    />
  )
}

export function ViewLevel3(props: ViewProps) {
  const colors = useThemeTokens()?.colors
  return (
    <View
      //backgroundColor={colors?.surface.medium.toNumber()}
      borderColor={colors?.border.medium.toNumber()}
      padding={10}
      gap={10}
      cornerRadius={5}
      {...props}
    />
  )
}
