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
        <Icon type={'star-fill'} size={48} tint={0xffd700} visible={favorite ? true : 'none'} />
        <Icon type={'star'} size={48} tint={0xffffff} visible={favorite ? 'none' : true} />
      </View>

      <View enableGestures onTouch={() => setLikes(likes + 1)}>
        <Icon type={'heart-fill'} size={48} tint={0xef4444} visible={likes > 0 ? true : 'none'} />
        <Icon type={'heart'} size={48} tint={0xffffff} visible={likes > 0 ? 'none' : true} />
      </View>

      <View direction="row" gap={15}>
        <Icon type="hand-thumbs-up" size={32} />
        <Icon type="hand-thumbs-down" size={32} />
      </View>
    </View>
  )
}
