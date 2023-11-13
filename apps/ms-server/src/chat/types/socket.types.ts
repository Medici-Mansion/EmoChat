import { UserModel } from '@/db/models/user.model';
import { InferSelectModel } from 'drizzle-orm';
import { Socket as S } from 'socket.io';
type Room = string;
export type User = InferSelectModel<typeof UserModel>;
class SocketData {
  user: User;
  roomId: string;
}

export class Socket extends S<SocketOnEventMap> {
  data: Partial<SocketData>;
}

export class SocketOnEventMap {
  JOIN_ROOM: (roomName: string) => Promise<Partial<SocketData>[]>;
  WELCOME: (user: User) => void;
  ROOM_CHANGE: (allRooms: Room[]) => void;
}
