import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.schema';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>, // პოსტის მოდელის ინექცია
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // პოსტის შექმნა — ამოწმებს არსებობს თუ არა user
  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.userModel.findById(userId); // ვპოულობთ იუზერს ID-ით
    if (!findUser) {
      throw new NotFoundException('User not found'); 
    }

    const newPost = new this.postModel({ ...createPostDto, user: userId });  // ვქმნით პოსტს და ვუთითებთ იუზერს როგორც ავტორს
    const savedPost = await newPost.save(); // ბაზაში შენახვა

    await findUser.updateOne({
      $push: { posts: savedPost._id },
    });

    return savedPost;
  }

  // პოსტის ძებნა აიდით
  async findPostById(id: string) {
    const post = await this.postModel.findById(id).populate('user');
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

}


