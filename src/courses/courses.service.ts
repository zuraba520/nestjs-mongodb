import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  //  ახალი კურსის შექმნა
  createCourse(createCourseDto: CreateCourseDto) {
    const course = new this.courseModel({
      ...createCourseDto,
      status: 'active', // fallback ის გარეშე 
    });
    return course.save(); // ბაზი შენ
  }

  //  ძებნა სტატუსის ფილტრი + pagination
  async searchCourses(
    query: string = '',
    status: 'active' | 'deleted' = 'active',
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    //   სტატუსზე დაფუძნებულ საძიებო ფილტრი
    const baseStatusFilter =
      status === 'deleted'
        ? { status: 'deleted' }
        : { status: 'active' }; // fallbac

    // თუ ძიება ცარიელია → ვეყრდნობით მარტო სტატუსს, თუ არა → ვეძებთ ტექსტურადაც
    const finalFilter =
      query.trim() === ''
        ? baseStatusFilter
        : {
            ...baseStatusFilter,
            $text: { $search: query }, 
          };

    const [data, total] = await Promise.all([
      this.courseModel
        .find(finalFilter)
        .sort({ createdAt: -1 }) // უახლესი პირველი
        .skip(skip)
        .limit(limit),
      this.courseModel.countDocuments(finalFilter),
    ]);

    return {
      data, 
      total, 
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  //  კონკრეტული კურსის წამოღება ID ით
  async getCourseById(id: string) {
    const course = await this.courseModel.findById(id).populate('students');
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  //  კურსის განახლება
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const updated = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true, // დააბრუნე განახლებული
    });
    if (!updated) {
      throw new NotFoundException('Course not found');
    }
    return updated;
  }

  //  კურსის წაშლა status  deleted
  async deleteCourse(id: string) {
    const deleted = await this.courseModel.findByIdAndUpdate(
      id,
      { status: 'deleted' }, // მხოლოდ სტატუსის განახლება
      { new: true },
    );
    if (!deleted) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Course marked as deleted' };
  }

  // წაშლილი კურსის აღდგენა
  async restoreCourse(id: string) {
    const restored = await this.courseModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true },
    );
    if (!restored) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'კურსი წარმატებით აღდგა' };
  }
}
