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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMessageDto } from '@/messages/message.dto';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private roomInfo: Map<string, Set<string>> = new Map();

  @WebSocketServer() private readonly io: Namespace;
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage('JOIN_ROOM')
  handleJoinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() roomName: string,
  ) {
    client.join(roomName);
    const users = this.roomInfo.get(roomName);
    if (!users) {
      this.roomInfo.set(roomName, new Set([client.data.nickname]));
    } else {
      this.roomInfo.set(roomName, users.add(client.data.nickname));
    }

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
    @MessageBody() body: SendMessageDto,
  ) {
    const {
      data: { roomName, nickname },
    } = client;
    const { emotion, others, message, sentiment = null } = body;

    const currentFont = !sentiment
      ? await this.sentimentsService.getDefaultFontByEmotion(emotion)
      : await this.sentimentsService.getFontByEmotionAndSentiment(sentiment);

    const font = currentFont?.[0];
    const messageCreatedDto: CreateMessageDto = {
      emotionTitle: emotion,
      mappingId: font?.mappingId,
      nickName: client.data.nickname,
      room: decodeURIComponent(roomName),
      text: message,
      others,
    };

    this.eventEmitter.emit('message.created', messageCreatedDto);

    this.io.server.to(roomName).emit('RESERVE_MESSAGE', {
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
    }

    if (!userKey || !user) {
      const {
        data: { nickname },
      } = client;
      user = await this.usersService.createUser({ nickname });
    }
    client.data.nickname = user.nickname;
    client.data.id = user.id;
    this.serverRoomChange();

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
    const users = this.roomInfo.get(roomName);
    if (users) {
      users.delete(client.data.nickname);
    }
    this.roomInfo.set(roomName, users);
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
    const filteredRooms = Array.from(rooms.keys()).filter((key) => {
      return sids.get(key) === undefined;
    });
    const roomObj: {
      [key in string]: { name: string; count: number; users: Set<string> };
    } = {};
    filteredRooms.forEach((room) => {
      const roomName = decodeURIComponent(room);
      roomObj[roomName] = {
        name: roomName,
        count: rooms.get(room).size,
        users: new Set(),
      };
    });
    this.io.sockets.forEach((socket) => {
      if (socket.data.roomName) {
        roomObj[socket.data.roomName].users.add(socket.data.nickname);
      }
    });

    const AllRooms = Object.keys(roomObj).map((roomName) => {
      roomObj[roomName].users = [...roomObj[roomName].users].reverse() as any;
      return roomObj[roomName];
    });
    if (isEmit) {
      this.io.server.emit('ROOM_CHANGE', AllRooms);
    }
    return AllRooms;
  }
}
