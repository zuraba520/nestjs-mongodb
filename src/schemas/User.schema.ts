import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSettings } from './UserSettings.schema';
import { Post } from './Post.schema';
import { Course } from './course.schema';

@Schema() // მონგო სქემის აღნიშვნა
export class User {
  @Prop({ unique: true, required: true }) //ბაზაში რო შეინახოს
  username: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings', required: false })
  settings?: UserSettings;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], required: false })
  posts?: Post[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], required: false })
  enrolledCourses?: Course[]; // ✅ ჩაწერილი კურსები
}

export const UserSchema = SchemaFactory.createForClass(User);


// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { UserSettings } from './UserSettings.schema';
// import { Post } from './Post.schema';

// @Schema()
// export class User {
//   @Prop({ unique: true, required: true })
//   username: string;

//   @Prop({ required: false })
//   displayName?: string;

//   @Prop({ required: false })
//   avatarUrl?: string;

//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings', required: false })
//   settings?: UserSettings;

//   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], required: false })
//   posts?: Post[];
// }

// export const UserSchema = SchemaFactory.createForClass(User);

