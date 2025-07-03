
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

  // ქმნის ახალ კურსს
  createCourse(createCourseDto: CreateCourseDto) {
    const course = new this.courseModel(createCourseDto);
    return course.save();
  }

  // აბრუნებს ყველა კურსს სტატუსის მიხედვით (active ან deleted)
  getAllCourses(status: 'active' | 'deleted' = 'active') {
    if (status === 'deleted') {
      // მხოლოდ წაშლილი კურსები
      return this.courseModel.find({ status: 'deleted' }).sort({ createdAt: -1 });
    }

    // active + ძველი კურსები (status ველის გარეშე)
    return this.courseModel.find({
      $or: [
        { status: 'active' },
        { status: { $exists: false } }, // fallback ძველი დოკუმენტებისთვის
      ]
    }).sort({ createdAt: -1 });
  }

  // კურსის წამოღება ID-ის მიხედვით, სტუდენტების დატვირთვით (populate)
  async getCourseById(id: string) {
    const course = await this.courseModel.findById(id).populate('students');
    if (!course) {
      throw new NotFoundException('Course not found'); // 404
    }
    return course;
  }

  // კურსის განახლება
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const updated = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true, // განახლებული დოკუმენტის დაბრუნება
    });
    if (!updated) {
      throw new NotFoundException('Course not found');
    }
    return updated;
  }

  // კურსის "წაშლა" — მხოლოდ სტატუსის ცვლილება deleted-ზე
  async deleteCourse(id: string) {
    const deleted = await this.courseModel.findByIdAndUpdate(
      id,
      { status: 'deleted' },
      { new: true }
    );
    if (!deleted) {
      throw new NotFoundException('Course not found');
    }
    return { message: 'Course marked as deleted' };
  }

  // ტექსტური ძებნა — title და description ველებზე
  async searchCourses(query: string, status: 'active' | 'deleted' = 'active') {
    const filter: any = {
      $text: { $search: query },
    };

    if (status === 'deleted') {
      filter.status = 'deleted';
    } else {
      filter.$or = [
        { status: 'active' },
        { status: { $exists: false } }, // fallback ძველი კურსებისთვის
      ];
    }

    return this.courseModel.find(filter).sort({ createdAt: -1 });
  }
}
