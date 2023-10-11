import type { Socket as S, SocketReservedEvents } from 'socket.io-client'
declare module 'socket.io-client' {
  interface Socket extends S<ServerToClientEvents, ClientToServerEvents> {
    listen: S<ServerToClientEvents, ClientToServerEvents>['on']
  }
}

type Room = string

interface ServerToClientEvents extends SocketReservedEvents {
  ROOM_CHANGE: (rooms: Room[]) => void
  WELCOME: (message: string) => void
}

interface ClientToServerEvents {}
