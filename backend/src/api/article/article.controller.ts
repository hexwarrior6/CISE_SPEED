// article.controller.ts
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, ReviewArticleDto } from './create-article.dto';
import { ArticleStatus } from './article.schema';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/test')
  async test() {
    return 'Article API is working';
  }

  @Get('/')
  async findAll(@Query('status') status?: ArticleStatus) {
    try {
      return await this.articleService.findAll(status);
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

  @Post('/submit')
  async submitArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ) {
    try {
      if (req.user) {
        createArticleDto.submitterId = req.user._id;
        createArticleDto.submitterEmail = req.user.email;
      }

      const article = await this.articleService.submitArticle(createArticleDto);

      return {
        message: 'Article submitted successfully',
        article,
        notification: 'Email notification will be sent when review is complete',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Unable to submit this article',
          message: error.message || 'Unable to submit this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Post(':id/rating')
  async addRating(
    @Param('id') id: string,
    @Body() body: { userId: string; score: number }, // 修改参数结构
    @Request() req,
  ) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // 使用userId和score进行评分
    return this.articleService.addRating(id, body.userId, body.score);
  }

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

  @Post('/:id/review')
  async reviewArticle(
    @Param('id') id: string,
    @Body() reviewData: ReviewArticleDto,
    @Request() req,
  ) {
    try {
      const reviewerId = req.user?._id || 'system';

      const updatedArticle = await this.articleService.reviewArticle(
        id,
        reviewData,
        reviewerId,
      );

      return {
        message: 'Article reviewed successfully',
        article: updatedArticle,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to review this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('/search/advanced')
  async searchArticles(
    @Query('keywords') keywords: string,
    @Query('evidenceType') evidenceType?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
    @Query('pubYearFrom') pubYearFrom?: string,
    @Query('pubYearTo') pubYearTo?: string,
    @Query('authors') authors?: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
  ) {
    try {
      return await this.articleService.searchArticles(
        keywords,
        evidenceType,
        sortBy,
        sortDirection,
        pubYearFrom,
        pubYearTo,
        authors,
        status as ArticleStatus,
        source,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to search articles',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('/moderator/pending')
  async getPendingArticles() {
    try {
      return await this.articleService.findAll(ArticleStatus.PENDING);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No pending articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Post('/check-duplicate')
  async checkDuplicates(
    @Body('doi') doi: string,
    @Body('excludeId') excludeId?: string,
  ) {
    try {
      const similarArticles =
        await this.articleService.findArticlesBySimilarDOI(doi, excludeId);
      return similarArticles;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to check for duplicates',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

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
