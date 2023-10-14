import type { Socket as S } from 'socket.io-client'

type Room = string

interface ServerToClientEvents {
  ROOM_CHANGE: (rooms: Room[]) => void
  WELCOME: (message: string) => void
}

interface ClientToServerEvents {
  CONFIG: (data: string) => void
}

class DefaultSocket extends S<ServerToClientEvents, ClientToServerEvents> {}

declare module 'socket.io-client' {
  export declare class Socket extends DefaultSocket {
    listen: S<ServerToClientEvents>['on']
  }
}
