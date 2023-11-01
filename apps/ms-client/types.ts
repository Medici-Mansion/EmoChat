import { FaceExpressions } from 'face-api.js'

export interface Sentiment {
  name: string
  id: string
}

export interface Emotion {
  emotion: string
  others: FaceExpressions
}
