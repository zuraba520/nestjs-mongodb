import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { CreatePostDto } from './dtos/CreatePost.dto';
  import { PostsService } from './posts.service';
  
  @Controller('posts') // ყველა როუტი იწყება posts ით
  export class PostsController {
    constructor(private postsService: PostsService) {}
  
    @Post()
    // @UsePipes(new ValidationPipe())
    createPost(@Body() createPostDto: CreatePostDto) { // Body დან ვიღებთ post ის მონაცემებს
      return this.postsService.createPost(createPostDto);
    }
  }