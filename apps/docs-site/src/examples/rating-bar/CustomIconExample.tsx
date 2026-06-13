/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { RatingBar, useState, View } from '@number10/phaserjsx'

export function CustomIconRatingBarExample() {
  const [rating, setRating] = useState(4)
  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <RatingBar
        value={rating}
        onChange={setRating}
        max={7}
        size="large"
        renderIcon={({ filled }) => (
          <Icon type={filled ? 'star-fill' : 'star'} size={32} tint={0xffff00} />
        )}
      />
    </View>
  )
}
