import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repo';
import { User } from './schema/user.schema';
import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
