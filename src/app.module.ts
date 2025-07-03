// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersModule } from './users/users.module';
// import { PostsModule } from './posts/posts.module';

// @Module({
//     imports: [
//       MongooseModule.forRoot('mongodb://127.0.0.1/nestjs_tutorial'),
//       UsersModule,
//       PostsModule,
//     ],
//   })
//   export class AppModule {}
  


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CoursesModule } from './courses/courses.module'; 

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/nestjs_tutorial'),
    UsersModule,
    PostsModule,
    CoursesModule, 
  ],
})
export class AppModule {}
