/** @jsxImportSource @number10/phaserjsx */
import { RatingBar, Text, View, useState } from '@number10/phaserjsx'

export function QuickStartRatingBarExample() {
  const [rating, setRating] = useState(3)

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <RatingBar value={rating} onChange={setRating} />
      <Text text={`Rating: ${rating}/5`} />
    </View>
  )
}
