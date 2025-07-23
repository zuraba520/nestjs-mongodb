import { IsNotEmpty, IsString, MaxLength, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty() // ცარიელი არ უნდა იყოს
  @IsString()
  @MaxLength(100) // მაქსიმუმ 100 სიმბოლო
  title: string; // კურსის სათაური

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string; // კურსის აღწერა

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxStudents: number; // სტუდენტების მაქს რაოდენობა

  
}
