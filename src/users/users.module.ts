import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/schemas/User.schema';
import { UserSettings, UserSettingsSchema } from 'src/schemas/UserSettings.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSettings.name, schema: UserSettingsSchema },
      { name: Course.name, schema: CourseSchema }, //enrollment-ისთვის
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
