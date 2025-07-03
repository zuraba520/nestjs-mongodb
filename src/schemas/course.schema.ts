import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  maxStudents: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  students: User[];

  //  ახალი ველი კურსის სტატუსისთვის სტატუსით
  @Prop({ enum: ['active', 'deleted'], default: 'active' })
  status: 'active' | 'deleted';
}

export const CourseSchema = SchemaFactory.createForClass(Course);

//  Full-text index title და description ველებზე
CourseSchema.index({ title: 'text', description: 'text' });
