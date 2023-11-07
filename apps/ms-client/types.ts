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
  id: string
  createdAt: string
  nickname: string
  avatar: string
  isDefaultAvatar: boolean
  profile: string
}

export type WithParam<T extends string> = {
  params: {
    [key in T]: string
  }
}
