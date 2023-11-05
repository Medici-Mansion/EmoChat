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
import { EditUserDto } from '@/users/users.dto';
import { InferSelectModel } from 'drizzle-orm';
import { SendMessageDto } from './dtos/message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from '@/messages/message.dto';
import { ChatroomsService } from '@/chatrooms/chatrooms.service';

interface RoomInfoData {
  users: Set<Socket['data']>;
  roomName: string;
}

type MapKey = keyof RoomInfoData;
type RoomNameMap<K = MapKey> = Map<
  K,
  K extends keyof RoomInfoData ? RoomInfoData[K] : never
>;

function getMapData<K extends keyof RoomInfoData>(
  map: RoomNameMap<keyof RoomInfoData>,
  key: K,
) {
  const data = map.get(key) as RoomInfoData[K];
  return data;
}

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
      const roomInfoMap = new Map();
      roomInfoMap.set('roomName', room.roomName);
      this.roomInfo.set(room.id, roomInfoMap);
    });
  }

  // { roomName: string; users: Set<Socket['data']> }
  private roomInfo: Map<string, RoomNameMap> = new Map();

  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    const room = this.roomInfo.get(roomId);

    const users = getMapData(room, 'users');

    room.set('users', users ? users.add(client.data) : new Set([client.data]));

    const roomName = getMapData(room, 'roomName');
    this.roomInfo.set(roomId, room);

    client.data.roomId = roomId;
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
    @MessageBody() body: SendMessageDto,
  ) {
    const {
      data: {
        roomId,
        user: { nickname },
      },
    } = client;
    const { emotion, others, message, sentiment = null } = body;

    const currentFont = !sentiment
      ? await this.sentimentsService.getDefaultFontByEmotion(emotion)
      : await this.sentimentsService.getFontByEmotionAndSentiment(sentiment);

    const font = currentFont?.[0];
    const messageCreatedDto: CreateMessageDto = {
      emotionTitle: emotion,
      mappingId: font?.mappingId,
      nickName: client.data.user.nickname,
      room: decodeURIComponent(roomId),
      text: message,
      others,
    };

    this.eventEmitter.emit('message.created', messageCreatedDto);

    this.io.server.to(roomId).emit('RESERVE_MESSAGE', {
      message,
      nickname,
      id: client.id,
      font,
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

  private editUserSetting(client: Socket, editUserDto: EditUserDto) {
    client.data.user.nickname = editUserDto.nickname as string;
    return this.usersService.editUser({
      ...editUserDto,
      id: client.data.user.id,
    });
  }

  // 소켓데이터 유저 아바타 추가
  private exitRoom(client: Socket) {
    const {
      data: { roomId, user: { nickname } = {} },
    } = client;
    if (roomId) {
      client.leave(roomId);
      const room = this.roomInfo.get(roomId);
      const users = getMapData(room, 'users');
      if (users) {
        users.delete(client.data);
        room.set('users', users);
        this.roomInfo.set(roomId, room);
      }

      this.io.server.to(roomId).emit('USER_EXIT', nickname);
      client.data.roomId = null;
      client.rooms.clear();
    }
    this.serverRoomChange();
  }

  private serverRoomChange(roomChangeArgs?: Partial<GetServerRoomDto>) {
    const { isEmit } = roomChangeArgs || { isEmit: true };
    // const {
    //   adapter: { rooms, sids },
    // } = this.io.server.of('/');
    // const filteredRooms = Array.from(rooms.keys()).filter((key) => {
    //   return sids.get(key) === undefined;
    // });
    // const roomObj: {
    //   [key in string]: {
    //     name: string;
    //     count: number;
    //     users: Set<Socket['data']>;
    //   };
    // } = {};
    // filteredRooms.forEach((room) => {
    //   const roomName = decodeURIComponent(room);

    //   roomObj[roomName] = {
    //     name: roomName,
    //     count: rooms.get(room).size,
    //     users: new Set(),
    //   };
    // });

    // this.io.sockets.forEach((socket) => {
    //   if (socket.data.roomName) {
    //     const userRoomName = decodeURIComponent(socket.data.roomName);
    //     roomObj[userRoomName].users.add(socket.data.user);
    //   }
    // });

    // const AllRooms = Object.keys(roomObj).map((roomName) => {
    //   const users: Socket['data'][] = [];
    //   roomObj[roomName].users.forEach((user) => {
    //     users.push(user);
    //   });
    //   return { ...roomObj[roomName], users };
    // });
    // console.log([...this.roomInfo]);
    // console.log(
    //   this.roomInfo.get('A')?.get('users'),
    //   "this.roomInfo.get('A').get('users')",
    // );

    const response = [];
    const keys = this.roomInfo.keys();
    while (true) {
      const { value, done } = keys.next();
      if (done) break;
      const temp = {};
      temp['roomId'] = value;
      temp['roomName'] = this.roomInfo.get(value).get('roomName');
      const users = [];
      getMapData(this.roomInfo.get(value), 'users')?.forEach((user) => {
        users.push(user);
      });

      temp['users'] = users;
      response.push(temp);
    }
    if (isEmit) {
      this.io.server.emit('ROOM_CHANGE', response);
    }
    return response;
  }
}
