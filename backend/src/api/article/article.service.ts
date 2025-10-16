// article.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findOne({ customId: id }).exec(); // 根据 customId 查找
    if (!article) {
      throw new Error('Article not found'); // 如果找不到文章则抛出错误
    }
    return article;
  }

  async create(createArticleDto: CreateArticleDto) {
    const newArticle = new this.articleModel(createArticleDto);
    return newArticle.save();
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return this.articleModel
      .findOneAndUpdate({ customId: id }, createArticleDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.articleModel.findOneAndDelete({ customId: id }).exec();
  }
}
