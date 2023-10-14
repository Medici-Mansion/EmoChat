import { UserModel } from '@/db/models/user.model';
import { InferInsertModel } from 'drizzle-orm';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core';

export interface CreateUserDto extends InferInsertModel<typeof UserModel> {}
export interface EditUserDto extends PgUpdateSetSource<typeof UserModel> {}
