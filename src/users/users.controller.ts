import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  Patch,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import mongoose from 'mongoose';

// ID-ის ვალიდაციის ფუნქცია
function validateObjectId(id: string, name: string = 'ID') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(`${name} is invalid`, 400);
  }
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //  იუზერის შექმნა
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // ყველა იუზერის წამოღება
  @Get()
  getUsers() {
    return this.usersService.getsUsers();
  }

  //  კონკრეტული იუზერის წამოღება
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    validateObjectId(id, 'User ID');
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  //  იუზერის განახლება
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    validateObjectId(id, 'User ID');
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new HttpException('User not found', 404);
    }
    return updatedUser;
  }

  //  იუზერის წაშლა
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    validateObjectId(id, 'User ID');
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) {
      throw new HttpException('User not found', 404);
    }
    return { message: 'User deleted successfully' };
  }

  //  იუზერის enrollment კურსზე
  @Patch(':userId/enroll/:courseId')
  async enrollCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    validateObjectId(userId, 'User ID');
    validateObjectId(courseId, 'Course ID');

    return this.usersService.enrollCourse(userId, courseId);
  }

  //  იუზერის unenrollment კურსიდან
  @Patch(':userId/unenroll/:courseId')
  async unenrollCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    validateObjectId(userId, 'User ID');
    validateObjectId(courseId, 'Course ID');

    return this.usersService.unenrollCourse(userId, courseId);
  }
}

