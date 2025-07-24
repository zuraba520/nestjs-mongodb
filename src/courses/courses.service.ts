import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  // ახალი კურსის შექმნა
  createCourse(createCourseDto: CreateCourseDto) {
    const course = new this.courseModel({
      ...createCourseDto,
      status: 'active',
    });
    return course.save();
  }

  // ძებნა სტატუსის ფილტრი + pagination
  async searchCourses(
    query: string = '',
    status: 'active' | 'deleted' = 'active',
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const baseStatusFilter =
      status === 'deleted'
        ? { status: 'deleted' }
        : { status: 'active' };

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
        .sort({ createdAt: -1 })
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



  async searchUnrCourses(
    query: string = '',
    status: 'active' | 'deleted' = 'active',
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const baseStatusFilter =
      status === 'deleted'
        ? { status: 'deleted' }
        : { status: 'active' };

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
        .sort({ createdAt: -1 })
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

  // კონკრეტული კურსის წამოღება ID ით
  async getCourseById(id: string) {
    const course = await this.courseModel.findById(id).populate('students');
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  // კურსის განახლება
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // აკრძალვა თუ უკვე enrolled სტუდენტებზე ნაკლებ მაქს სტუდენტს ვირჩევ ვანაცვლებ
    if (
      updateCourseDto.maxStudents !== undefined &&
      course.students.length > updateCourseDto.maxStudents
    ) {
      throw new BadRequestException(
        `Cannot set maxStudents to ${updateCourseDto.maxStudents} - already ${course.students.length} students are enrolled.`,
      );
    }

    const updated = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true,
    });

    return updated;
  }

  // კურსის წაშლა  სტატუსის ცვლილება
  async deleteCourse(id: string) {
    const deleted = await this.courseModel.findByIdAndUpdate(
      id,
      { status: 'deleted' },
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
