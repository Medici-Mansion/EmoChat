import type { Socket as S } from 'socket.io-client'

interface Room {
  name: string
  count: number
}
interface Message {
  message: string
  emotion: string
}

export interface ReservedMessage {
  id: string
  message: Message
  nickname: string
}

interface ServerToClientEvents {
  ROOM_CHANGE: (rooms: Room[]) => void
  WELCOME: (message: string) => void
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
