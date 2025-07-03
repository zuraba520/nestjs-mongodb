import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { Course } from 'src/schemas/course.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name) private userSettingsModel: Model<UserSettings>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  // 🔹 ახალი იუზერის შექმნა
  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    const existing = await this.userModel.findOne({ username: createUserDto.username });
    if (existing) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    if (settings) {
      const newSettings = new this.userSettingsModel(settings);
      const savedSettings = await newSettings.save();

      const newUser = new this.userModel({
        ...createUserDto,
        settings: savedSettings._id,
      });
      return newUser.save();
    }

    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // 🔹 ყველა იუზერის წამოღება
  getsUsers() {
    return this.userModel.find().populate(['settings', 'posts', 'enrolledCourses']);
  }

  // 🔹 კონკრეტული იუზერი ID-ით
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).populate(['settings', 'posts', 'enrolledCourses']);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // 🔹 იუზერის განახლება
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  // 🔹 იუზერის წაშლა
  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }

  // 🔹 Enrollment — კურსზე იუზერის დამატება
  async enrollCourse(userId: string, courseId: string) {
    const course = await this.courseModel.findById(courseId).populate('students');
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const alreadyEnrolled = course.students.some((s: any) => s._id.equals(userId));
    if (alreadyEnrolled) {
      throw new HttpException('User already enrolled', HttpStatus.CONFLICT);
    }

    if (course.students.length >= course.maxStudents) {
      throw new HttpException('Course is full', HttpStatus.CONFLICT);
    }

    await this.courseModel.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    ).populate(['enrolledCourses', 'settings']);
  }

  // 🔹 Unenrollment — იუზერის ამოღება კურსიდან
  async unenrollCourse(userId: string, courseId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isEnrolled = course.students.some((s: any) => s.toString() === userId);
    if (!isEnrolled) {
      throw new HttpException('User is not enrolled in this course', HttpStatus.BAD_REQUEST);
    }

    await this.courseModel.findByIdAndUpdate(courseId, {
      $pull: { students: userId },
    });

    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { enrolledCourses: courseId } },
      { new: true }
    ).populate(['enrolledCourses', 'settings']);
  }
}
