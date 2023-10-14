import { Socket as S } from 'socket.io';
type Room = string;
export class SocketOnEventMap {
  JOIN_ROOM: (roomName: string) => void;
  WELCOME: () => void;
  ROOM_CHANGE: (allRooms: Room[]) => void;
}

class SocketData {
  id: string;
  nickname: string;
  roomName: string;
}

export class Socket extends S<SocketOnEventMap> {
  data: Partial<SocketData>;
}
