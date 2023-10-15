import type { Socket as S } from 'socket.io-client'

interface Room {
  name: string
  count: number
  users: string[]
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

export interface ReservedMessage {
  id: string
  message: string
  nickname: string
  font?: Font
}

interface ServerToClientEvents {
  ROOM_CHANGE: (rooms: Room[]) => void
  WELCOME: (userInfo: {
    id: string
    nickname: string
    roomName: string
  }) => void
  RESERVE_MESSAGE: (sender: ReservedMessage) => void
}

interface ClientToServerEvents {
  CONFIG: (data: string) => void
}

class DefaultSocket extends S<ServerToClientEvents, ClientToServerEvents> {}

declare module 'socket.io-client' {
  export declare class Socket extends DefaultSocket {
    listen: DefaultSocket['on']
  }
}
