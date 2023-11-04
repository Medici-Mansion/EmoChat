import { FaceExpressions } from 'face-api.js'

export interface Sentiment {
  name: string
  id: string
}

export interface Emotion {
  emotion: string
  others: FaceExpressions
}
export interface User {
  avatar: string
  createdAt: string
  id: string
  isDefaultAvatar: boolean
  nickname: string
}
