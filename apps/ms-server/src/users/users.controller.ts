import { CreateUserDto } from './users.dto';
import { USER_UNIQUE_KEY } from '@/common/common.constants';
import { UsersService } from '@/users/users.service';
import { generateNickname } from '@/utils';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('')
  @HttpCode(200)
  async checkUser(
    @Body('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = (await this.usersService.findUserdById(userId)) || null;
      if (user) {
        res.cookie(USER_UNIQUE_KEY, user.id);
      }
      return { user };
    } catch (err) {
      return { user: null };
    }
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!createUserDto.nickname) {
      createUserDto.nickname = generateNickname();
    }
    const newUser = await this.usersService.createUser(createUserDto);
    if (newUser) {
      res.cookie(USER_UNIQUE_KEY, newUser.id);
    }
    return newUser;
  }
}
