import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  SUBMITTER = 'Submitter',
  MODERATOR = 'Moderator',
  ANALYST = 'Analyst',
  SEARCHER = 'Searcher',
  ADMINISTRATOR = 'Administrator',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.SUBMITTER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  // 添加评分记录字段
  @Prop({
    type: [
      {
        articleId: String,
        rating: Number,
        ratedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  ratings: Array<{ articleId: string; rating: number; ratedAt?: Date }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
