import { UserModel } from '@/db/models/user.model';
import { InferSelectModel } from 'drizzle-orm';
import { Socket as S } from 'socket.io';
type Room = string;

class SocketData {
  user: InferSelectModel<typeof UserModel>;
  roomId: string;
}

export class Socket extends S<SocketOnEventMap> {
  data: Partial<SocketData>;
}

export class SocketOnEventMap {
  JOIN_ROOM: (roomName: string) => void;
  WELCOME: (userInfo: Socket['data']) => void;
  ROOM_CHANGE: (allRooms: Room[]) => void;
}
