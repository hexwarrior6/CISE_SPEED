// article.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true }) // 自动添加 createdAt 和 updatedAt 字段
export class Article {
  @Prop({ required: true, unique: true }) // _id 通常是 MongoDB 自动生成的，但如果你需要自定义ID，可以这样定义
  customId: string; // 对应数据中的 "_id: '5'"

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  pubyear: string; // 也可以定义为 Number，取决于你的数据格式

  @Prop({ required: true })
  doi: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true })
  evidence: string; // 例如: "weak against", "strongly supports"
}

export const ArticleSchema = SchemaFactory.createForClass(Article);