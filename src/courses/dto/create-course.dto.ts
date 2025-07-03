
import { IsNotEmpty, IsString, MaxLength, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty() // ცარიელი არუნდა იყოს 
  @IsString() 
  @MaxLength(100) //მაქს 100 სიმბოლო
  title: string;   // სათაურისათვის

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;  // კურსის აღწერისათვის

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxStudents: number; //მაქს რამდენი სტუდენტი ჩაეწერება
}
