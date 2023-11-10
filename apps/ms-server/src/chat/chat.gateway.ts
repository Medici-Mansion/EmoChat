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
import { Logger, OnModuleInit } from '@nestjs/common';
import { Socket } from '@/chat/types/socket.types';
import { InferSelectModel } from 'drizzle-orm';
import { SendMessageDto } from './dtos/message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from '@/messages/message.dto';
import { ChatroomsService } from '@/chatrooms/chatrooms.service';
import { ChatRoomModel } from '@/db/models/chat-room.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly usersService: UsersService,
    private readonly sentimentsService: SentimentsService,
    private readonly chatRoomsService: ChatroomsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async onModuleInit() {
    const rooms = await this.chatRoomsService.getChatRooms();
    rooms.forEach((room) => {
      this.roomInfo.set(room.id, room);
    });
  }

  private roomInfo: Map<string, InferSelectModel<typeof ChatRoomModel>> =
    new Map();

  private roomGroupInfo = {
    '9f8bbd24-9d98-4580-927f-15168791c121': 'Group A',
    '42b8fb59-c78e-49ff-bfaa-685c590e73c0': 'Group B',
    'c486c072-5900-4163-8fba-ffa3350a1680': 'Group C',
    '487b239c-0435-4968-a423-573655a03dbf': 'Group D',
    '265a5d3b-9dcd-4441-8925-206eb66172e9': 'Group E',
    'd4152886-a972-496f-8fa7-727026d466e7': 'Group F',
    '764a41c1-f25d-4cc1-a752-031059e16dd9': 'Group G',
    '8dbb2e02-5987-4fc2-bab0-37a61881e905': 'Group H',
    'dfaca612-1b67-4157-8187-2992725d08a9': 'Group I',
    '8d828608-bf68-4927-b0b9-12144053728d': 'Group J',
  };

  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage('JOIN_ROOM')
  async handleJoinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    client.data.roomId = roomId;
    client.to(roomId).emit('WELCOME', client.data);
    this.serverRoomChange();
    return this.getJoinedUser(roomId);
  }

  private async getJoinedUser(roomId: string) {
    const sockets = await this.io.in(roomId).fetchSockets();
    const users = sockets.map((socket) => socket.data) as Socket['data'][];
    this.io.to(roomId).emit(`USERS:${roomId}`, users);
    return users;
  }

  @SubscribeMessage('EXIT_ROOM')
  handleExitRoom(@ConnectedSocket() client: Socket) {
    this.exitRoom(client);
  }

  @SubscribeMessage('SEND_MESSAGE')
  async handleSendMEssage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SendMessageDto,
  ) {
    const {
      data: { roomId, user: { nickname = '' } = {} },
    } = client;
    const { emotion, others, message, sentiment = null } = body;

    const currentFont = !sentiment
      ? await this.sentimentsService.getDefaultFontByEmotion(emotion)
      : await this.sentimentsService.getFontByEmotionAndSentiment(sentiment);

    const font = currentFont?.[0];
    const messageCreatedDto: CreateMessageDto = {
      emotionTitle: emotion,
      mappingId: font?.mappingId,
      nickName: client.data.user?.nickname,
      roomName: this.roomGroupInfo[client.data.roomId] || '',
      roomId: decodeURIComponent(roomId),
      text: message,
      others,
    };

    this.eventEmitter.emit('message.created', messageCreatedDto);

    this.io.server.to(roomId).emit('RESERVE_MESSAGE', {
      message,
      nickname,
      id: client.id,
      userId: client.data.user.id,
      font,
    });
  }

  @SubscribeMessage('USER_SETTING')
  handleUserSetting(
    @ConnectedSocket() client: Socket,
    @MessageBody() userSettingParam: { nickname: string; avatar: string },
  ) {
    this.editUserSetting(client, userSettingParam);
    const {
      data: { roomId },
    } = client;
    if (roomId) {
      this.getJoinedUser(roomId);
    }
    client.emit('USER_SETTING' as any, client.data.user);
    return client.data;
  }

  @SubscribeMessage('ROOM_SETTING')
  async handleRoomSetting(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomSettingParam: { roomName: string },
  ) {
    if (client.data.roomId && roomSettingParam?.roomName) {
      const newRoom = await this.chatRoomsService.updateRoomNameById({
        roomId: client.data.roomId,
        ...roomSettingParam,
      });
      this.roomInfo.set(client.data.roomId, newRoom);
      this.serverRoomChange();
    }
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
      client.data.user = user;

      this.serverRoomChange();
      return user;
    }
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
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`DISCONNECTED : ${client.id}`);
    this.exitRoom(client);
    this.io.server.of('/').adapter.del(client.id, client.id);
  }

  private editUserSetting(
    client: Socket,
    editUserDto: { nickname: string; avatar: string },
  ) {
    client.data.user.nickname = editUserDto.nickname || '';
    client.data.user.avatar = editUserDto.avatar as string;
    return this.usersService.editUser({
      ...editUserDto,
      id: client.data.user.id,
    });
  }

  // 소켓데이터 유저 아바타 추가
  private exitRoom(client: Socket) {
    const {
      data: { roomId, user: { nickname = '' } = {} },
    } = client;
    if (roomId) {
      client.leave(roomId);
      this.io.server.to(roomId).emit('USER_EXIT', nickname);
      client.data.roomId = null;
      client.rooms.clear();
      this.getJoinedUser(roomId);
    }
    this.serverRoomChange();
  }

  private async serverRoomChange(roomChangeArgs?: Partial<GetServerRoomDto>) {
    const { isEmit } = roomChangeArgs || { isEmit: true };

    const response: InferSelectModel<typeof ChatRoomModel>[] = [];
    const keys = this.roomInfo.keys();
    while (true) {
      const { value, done } = keys.next();
      if (done) break;
      response.push(this.roomInfo.get(value));
    }
    if (isEmit) {
      this.io.server.emit('ROOM_CHANGE', response);
    }
    return response;
  }
}
