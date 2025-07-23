import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './User.schema';

@Schema({ timestamps: true }) 
export class Course extends Document {
  @Prop({ required: true }) // კურსის სათაური აუცილებელია
  title: string;

  @Prop() // აღწერა არაა სავალდებულო
  description?: string;

  @Prop({ required: true }) // მაქს სტუდ რაო აუც
  maxStudents: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  students: User[]; //  დარეგისტრირებული იუზერები user ID ები

  @Prop({
    enum: ['active', 'deleted'],
    default: 'active',
  })
  status: 'active' | 'deleted'; // კურსის სტატუსი soft delete ისთვის
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Full text index ძიებისთვის title და description ველებზე
CourseSchema.index({ title: 'text', description: 'text' });
