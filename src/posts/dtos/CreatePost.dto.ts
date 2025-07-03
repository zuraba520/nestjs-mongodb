import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  contents: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}


// მაგალთი  პოსტით

// {
//     "title": "My First Post",
//     "contents": "This is a post created with NestJS.",
//     "userId": "6650b5a87b6a8a1234567890"
//   }
  