import { FaceExpressions } from 'face-api.js'
import type { Socket as S } from 'socket.io-client'
import { Sentiment, User } from './types'

interface RoomInfoUser {
  roomId: string
  user: User
}
interface RoomInfo {
  id: string
  roomName: string
  createdAt: string
  displayName: string
  maxUserCount: number
  category: string
}

interface Font {
  id: string
  code: number
  alias: string
  name: string
}
interface Message {
  message: string
  emotion: string
}

interface SendMessageData {
  roomId: string
  userId: string
  message: string
  emotion: string
  sentiment?: string
  others?: FaceExpressions
}

export interface ReservedMessage {
  id: string
  userId: string
  message: string
  nickname: string
  font?: Font
  user: User
}

interface ServerToClientEvents {
  ROOM_CHANGE: (rooms: RoomInfo[]) => void
  WELCOME: (user: User) => void
  RESERVE_MESSAGE: (sender: ReservedMessage) => void
  USER_SETTING: (user: User) => void
  [key: `USERS:${string}`]: (users: RoomInfoUser[]) => void
  [key: `ROOM:${string}`]: (sender: ReservedMessage) => void
}

interface ClientToServerEvents {
  CONFIG: (data: string) => void
  USER_JOIN: (userKey: string | null, cb: (user: User) => void) => void
  JOIN_ROOM: (roomName: string, cb: (users: RoomInfoUser[]) => void) => void
  SEND_MESSAGE: (body: SendMessageData) => void
  GET_SENTIMENTS: (
    emotion: string,
    cb: (sentiments: Sentiment[]) => void,
  ) => void
  EXIT_ROOM: () => void
  USER_SETTING: (data: any, cb?: (user: RoomInfoUser) => void) => void
  ROOM_SETTING: (data: { roomName: string }) => void
  GET_ME: (userId: string) => void
}

class DefaultSocket extends S<ServerToClientEvents, ClientToServerEvents> {}

declare module 'socket.io-client' {
  export declare class SocketClient extends DefaultSocket {
    listen: DefaultSocket['on']
  }
}
