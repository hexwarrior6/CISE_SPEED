// article.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './create-article.dto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 测试路由
  @Get('/test')
  test() {
    return 'Article route is working!';
  }

  // 获取所有文章
  @Get('/')
  async findAll() {
    try {
      return await this.articleService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // 根据 customId 获取单篇文章
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      const article = await this.articleService.findOne(id);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Article found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // 创建新文章
  @Post('/')
  async addArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articleService.create(createArticleDto);
      return { message: 'Article added successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // 更新文章
  @Put('/:id')
  async updateArticle(
    @Param('id') id: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      await this.articleService.update(id, createArticleDto);
      return { message: 'Article updated successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to update this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // 删除文章
  @Delete('/:id')
  async deleteArticle(@Param('id') id: string) {
    try {
      const deletedArticle = await this.articleService.delete(id);
      if (!deletedArticle) {
        throw new Error('Article not found for deletion');
      }
      return deletedArticle;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such article',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
