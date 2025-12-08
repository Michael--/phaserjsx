/**
 * Icon Interactive Example - Icons with hover/click effects
 */
/** @jsxImportSource @phaserjsx/ui */
import { Icon } from '@/components/Icon'
import { useState, View } from '@phaserjsx/ui'

export function InteractiveIconExample() {
  const [favorite, setFavorite] = useState(false)
  const [likes, setLikes] = useState(0)

  return (
    <View padding={20} gap={30} alignItems="center">
      <View enableGestures onTouch={() => setFavorite(!favorite)}>
        <Icon
          type={favorite ? 'star-fill' : 'star'}
          size={48}
          tint={favorite ? 0xffd700 : 0xffffff}
        />
      </View>

      <View enableGestures onTouch={() => setLikes(likes + 1)}>
        <Icon
          type={likes > 0 ? 'heart-fill' : 'heart'}
          size={48}
          tint={likes > 0 ? 0xef4444 : 0xffffff}
        />
      </View>

      <View direction="row" gap={15}>
        <Icon type="hand-thumbs-up" size={32} />
        <Icon type="hand-thumbs-down" size={32} />
      </View>
    </View>
  )
}
