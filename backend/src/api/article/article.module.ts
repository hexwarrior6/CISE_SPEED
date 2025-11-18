// article.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article, ArticleSchema } from './article.schema';
import { EmailService } from '../../services/email.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ConfigModule,
    UserModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, EmailService],
})
export class ArticleModule {}
