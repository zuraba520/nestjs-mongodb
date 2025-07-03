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
  UsePipes,
  ValidationPipe,
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

  //  ყველა კურსის წამოღება სტატუსით active/deleted
  @Get()
  getAllCourses(@Query('status') status: 'active' | 'deleted' = 'active') {
    return this.coursesService.getAllCourses(status);
  }

  //  კონკრეტული კურსის წამოღება ID_ით
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

  //  კურსის წაშლა (სტატუსის შეცვლით)
  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Course ID', 400);
    }
    return this.coursesService.deleteCourse(id);
  }

  // ტექსტური ძებნა სტატუსით
  @Get('search/text')
  searchCourses(
    @Query('query') query: string,
    @Query('status') status: 'active' | 'deleted' = 'active',
  ) {
    return this.coursesService.searchCourses(query, status);
  }
}
