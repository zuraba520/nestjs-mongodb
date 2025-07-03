// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Post, PostSchema } from 'src/schemas/Post.schema';
// import { PostsController } from './posts.controller';
// import { PostsService } from './posts.service';
// import { User, UserSchema} from 'src/schemas/User.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: Post.name,
//         schema: PostSchema,
//       },
//       {
//         name: User.name,
//         schema: UserSchema,
//       },
//     ]),
//   ],
//   controllers: [PostsController],
//   providers: [PostsService],
// })
// export class PostsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schemas/Post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User, UserSchema } from '../schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
