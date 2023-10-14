import { SentimentsService } from './../sentiments/sentiments.service';
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
import { SendMessageDto } from './dtos/message.dto';
import { randomInt } from 'crypto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly usersService: UsersService,
    private readonly sentimentsService: SentimentsService,
  ) {}
  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() roomName: string,
  ) {
    client.join(roomName);
    client.data.roomName = roomName;
    client.to(roomName).emit('WELCOME', client.data);
    this.serverRoomChange();
  }

  @SubscribeMessage('EXIT_ROOM')
  handleExitRoom(@ConnectedSocket() client: Socket) {
    this.exitRoom(client);
  }

  @SubscribeMessage('SEND_MESSAGE')
  async handleSendMEssage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SendMessageDto,
  ) {
    const {
      data: { roomName, nickname },
    } = client;

    const currentFont =
      await this.sentimentsService.getFontByEmotionAndSentiment(
        message.sentiment,
      );

    this.io.server.to(roomName).emit('RESERVE_MESSAGE', {
      message,
      nickname,
      id: client.id,
      font: currentFont?.[0],
    });
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

  @SubscribeMessage('GET_SENTIMENTS')
  async getSentimentsByEmotion(
    @ConnectedSocket() client: Socket,
    @MessageBody() emotion: string,
  ) {
    return this.sentimentsService.getSentimentsByEmotion(emotion);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`CONNECTED : ${client.id}`);
    this.logger.debug(`NAMESPACE : ${client.nsp.name}`);

    client.data.nickname = '익명#' + randomInt(100000);
    this.serverRoomChange();
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`DISCONNECTED : ${client.id}`);
    this.exitRoom(client);
    this.io.server.of('/').adapter.del(client.id, client.id);
  }

  private editUserSetting(client: Socket, editUserDto: EditUserDto) {
    client.data.nickname = editUserDto.nickname as string;
    return this.usersService.editUser({ ...editUserDto, id: client.data.id });
  }

  private exitRoom(client: Socket) {
    const {
      data: { roomName, nickname },
    } = client;
    client.leave(roomName);
    this.io.server.to(roomName).emit('USER_EXIT', nickname);
    client.data.roomName = null;
    client.rooms.clear();
    this.serverRoomChange();
  }

  private serverRoomChange(roomChangeArgs?: Partial<GetServerRoomDto>) {
    const { isEmit } = roomChangeArgs || { isEmit: true };
    const {
      adapter: { rooms, sids },
    } = this.io.server.of('/');
    const AllRooms = Array.from(rooms.keys())
      .filter((key) => {
        return sids.get(key) === undefined;
      })
      .map((name) => {
        return {
          name: decodeURIComponent(name),
          count: rooms.get(name).size,
        };
      });

    if (isEmit) {
      this.io.server.emit('ROOM_CHANGE', AllRooms);
    }
    return AllRooms;
  }
}
