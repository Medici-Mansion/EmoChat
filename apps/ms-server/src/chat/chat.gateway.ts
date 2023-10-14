import { UserModel } from './../db/models/user.model';
import { UsersService } from '@/users/users.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { GetServerRoomDto } from '@/chat/dtos/room.dto';
import { Logger } from '@nestjs/common';
import { Socket } from '@/chat/types/socket.types';
import { EditUserDto } from '@/users/users.dto';
import { InferSelectModel } from 'drizzle-orm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody() roomName: string,
  ) {
    console.log('??');
    socket.join(roomName);
    socket.to(roomName).emit('WELCOME');
    this.serverRoomChange();
  }

  @SubscribeMessage('EXIT_ROOM')
  handleExitRoom(@ConnectedSocket() client: Socket) {
    const {
      data: { roomName, nickname },
    } = client;
    this.io.server.to(roomName).emit('USER_EXIT', nickname);
    this.exitRoom(client);
  }

  @SubscribeMessage('SEND_MESSAGE')
  handleSendMEssage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const {
      data: { roomName, nickname },
    } = client;
    this.io.server.to(roomName).emit('RESERVE_MESSAGE', { message, nickname });
  }

  @SubscribeMessage('USER_SETTING')
  handleUserSetting(
    @ConnectedSocket() client: Socket,
    @MessageBody() userSeetingParam: { nickname: string },
  ) {
    this.editUserSetting(client, userSeetingParam);
    return client.data;
  }

  // 유저가 첫 페이지 진입 시 회원조회 & 가입
  @SubscribeMessage('USER_JOIN')
  async handleUserJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() userKey?: string,
  ) {
    let user: InferSelectModel<typeof UserModel>;
    if (userKey) {
      user = await this.usersService.findUserdById(userKey);
    }

    if (!userKey || !user) {
      const {
        data: { nickname },
      } = client;
      user = await this.usersService.createUser({ nickname });
    }
    client.data.nickname = user.nickname;
    client.data.id = user.id;
    return user;
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`CONNECTED : ${client.id}`);
    this.logger.debug(`NAMESPACE : ${client.nsp.name}`);

    this.newUserJoinbroadcast(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`DISCONNECTED : ${client.id}`);
    this.exitRoom(client);
    this.serverRoomChange();
  }

  private editUserSetting(client: Socket, editUserDto: EditUserDto) {
    client.data.nickname = editUserDto.nickname as string;
    return this.usersService.editUser({ ...editUserDto, id: client.data.id });
  }

  private exitRoom(client: Socket) {
    client.data.roomName = null;
    client.rooms.clear();
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
    joinedUser.emit('WELCOME');
    this.serverRoomChange();
  }
}
