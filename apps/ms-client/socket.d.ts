import { FaceExpressions } from 'face-api.js'
import type { Socket as S } from 'socket.io-client'
import { Sentiment, User } from './types'

interface RoomInfoUser {
  roomId: string
  user: User
}
interface RoomInfo {
  roomId: string
  roomName: string
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
  message: string
  emotion: string
  sentiment?: string
  others?: FaceExpressions
}

export interface ReservedMessage {
  id: string
  message: string
  nickname: string
  font?: Font
}

interface ServerToClientEvents {
  ROOM_CHANGE: (rooms: RoomInfo[]) => void
  WELCOME: (userInfo: {
    id: string
    nickname: string
    roomName: string
  }) => void
  RESERVE_MESSAGE: (sender: ReservedMessage) => void
  USER_SETTING: (user: User) => void
  [key: `USERS:${string}`]: (users: RoomInfoUser[]) => void
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
}

class DefaultSocket extends S<ServerToClientEvents, ClientToServerEvents> {}

declare module 'socket.io-client' {
  export declare class SocketClient extends DefaultSocket {
    listen: DefaultSocket['on']
  }
}
