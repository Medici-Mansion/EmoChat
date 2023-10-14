import { UserModel } from '@/db/models/user.model';
import { DB_MODULE } from '@/common/common.constants';
import { Repository } from '@/db/models';
import { Inject, Injectable } from '@nestjs/common';
import { InferInsertModel, eq } from 'drizzle-orm';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { CreateUserDto, EditUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DB_MODULE) private readonly db: Repository) {}

  async findUserdById(userId: string) {
    const user = await this.db
      .select()
      .from(UserModel)
      .where(eq(UserModel.id, userId))
      .limit(1);
    return user[0];
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.db
      .insert(UserModel)
      .values(createUserDto)
      .returning();
    return user[0];
  }

  async editUser(editUserDto: EditUserDto) {
    return await this.db
      .update(UserModel)
      .set(editUserDto)
      .where(eq(UserModel.id, editUserDto.id))
      .returning();
  }
}
