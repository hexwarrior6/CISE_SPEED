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
  Query,
  Request
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

  // Get all articles with optional status filter
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

  // Get single article by ID
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

  // Submit new article (Submitter feature)
  @Post('/submit')
  async submitArticle(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    try {
      // Add submitter information from authenticated user
      if (req.user) {
        createArticleDto.submitterId = req.user._id;
        createArticleDto.submitterEmail = req.user.email;
      }
      
      const article = await this.articleService.submitArticle(createArticleDto);
      
      return {
        message: 'Article submitted successfully',
        article,
        notification: 'Email notification will be sent when review is complete'
      };
    } catch (error) {
      // Handle specific error types and pass appropriate messages to frontend
      if (error instanceof HttpException) {
        // Re-throw the HttpException as is to preserve status code and message
        throw error;
      }
      
      // For other errors, wrap in HttpException with proper details
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

  // Update article
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

  // Review article (Moderator feature)
  @Post('/:id/review')
  async reviewArticle(
    @Param('id') id: string, 
    @Body() reviewData: ReviewArticleDto, 
    @Request() req
  ) {
    try {
      // Get reviewer ID from authenticated user
      const reviewerId = req.user?._id || 'system';
      
      const updatedArticle = await this.articleService.reviewArticle(
        id, 
        reviewData, 
        reviewerId
      );
      
      return {
        message: 'Article reviewed successfully',
        article: updatedArticle
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

  // Search articles (Searcher feature)
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
    @Query('source') source?: string
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
        source
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

  // Get pending articles (for Moderator queue)
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

  // Check for duplicates by DOI (for Moderator feature)
  @Post('/check-duplicate')
  async checkDuplicates(@Body('doi') doi: string) {
    try {
      // Find similar articles by DOI
      const similarArticles = await this.articleService.findArticlesBySimilarDOI(doi);
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

  // Delete article
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
