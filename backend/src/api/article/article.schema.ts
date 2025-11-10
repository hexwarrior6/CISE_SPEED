// article.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

export enum ArticleStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum EvidenceType {
  WEAK_AGAINST = 'Weak Against',
  MODERATELY_AGAINST = 'Moderately Against',
  NEUTRAL = 'Neutral',
  MODERATELY_SUPPORTS = 'Moderately Supports',
  STRONGLY_SUPPORTS = 'Strongly Supports',
}

@Schema({ timestamps: true }) // 自动添加 createdAt 和 updatedAt 字段
export class Article {
  @Prop({ required: true, unique: true })
  customId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  pubyear: string;

  @Prop({ required: true, unique: true, index: true })
  doi: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true, enum: EvidenceType })
  evidence: EvidenceType;

  @Prop({ required: true, enum: ArticleStatus, default: ArticleStatus.PENDING })
  status: ArticleStatus;

  @Prop()
  submitterId: string;

  @Prop()
  submitterEmail: string;

  @Prop()
  reviewerId?: string;

  @Prop()
  reviewComment?: string;

  @Prop()
  isDuplicate?: boolean;

  @Prop()
  duplicateOf?: string; // Reference to the original article's customId
}

export const ArticleSchema = SchemaFactory.createForClass(Article);