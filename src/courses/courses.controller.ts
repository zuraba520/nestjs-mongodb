import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import mongoose from 'mongoose';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  //  კურსის შექმნა
  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  // ერთიანი ძებნა + სტატუსით ფილტრაცია + pagination
  @Get('search')
  searchCourses(
    @Query('query') query: string = '',
    @Query('status') status: 'active' | 'deleted' = 'active',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.coursesService.searchCourses(
      query,
      status,
      parseInt(page),
      parseInt(limit),
    );
  }

  //  კონკრეტული კურსის წამოღება ID ით
  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  //  კურსის განახლება
  @Patch(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  //  კურსის წაშლა სტატუსის შეცვლით
  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Course ID', 400);
    }
    return this.coursesService.deleteCourse(id);
  }

  //  წაშლილი კურსის აღდგენა სტატუსის დაბრუნება active ზე
  @Patch(':id/restore')
  restoreCourse(@Param('id') id: string) {
    return this.coursesService.restoreCourse(id);
  }
}
