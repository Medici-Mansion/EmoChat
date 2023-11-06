import { ChatroomsService } from '@/chatrooms/chatrooms.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UpdateRoomDTO } from './dtos/update-room.dto';

@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @Post('')
  @HttpCode(200)
  async updateRoom(@Body() updateRoomDTO: UpdateRoomDTO) {
    return this.chatroomsService.updateRoomNameById(updateRoomDTO);
  }
}
