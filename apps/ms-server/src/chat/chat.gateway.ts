import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { GetServerRoomDto } from '@/chat/dtos/room.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChatGateway {
  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`CONNECTED : ${client.id}`);
    this.logger.debug(`NAMESPACE : ${client.nsp.name}`);

    this.newUserJoinbroadcast(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`DISCONNECTED : ${client.id}`);
    this.serverRoomChange();
  }

  private serverRoomChange(roomChangeArgs?: Partial<GetServerRoomDto>) {
    const { isEmit } = roomChangeArgs || { isEmit: true };
    const {
      adapter: { rooms, sids },
    } = this.io.server.of('/');
    const AllRooms = Array.from(rooms.keys()).filter(
      (key) => sids.get(key) === undefined,
    );
    if (isEmit) {
      this.io.server.emit('ROOM_CHANGE', AllRooms);
    }
    return AllRooms;
  }

  private newUserJoinbroadcast(joinedUser: Socket) {
    joinedUser.emit('WELCOME', 'HI');
    this.serverRoomChange();
  }
}
