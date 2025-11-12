// article.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';
import { CreateArticleDto, ReviewArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // Get all articles (with optional filtering)
  async findAll(status?: ArticleStatus): Promise<Article[]> {
    const query = status ? { status } : {};
    return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  // Get article by customId
  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findOne({ customId: id }).exec();
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  // Check for duplicate by DOI
  async checkDuplicateByDOI(doi: string): Promise<boolean> {
    const existingArticle = await this.articleModel.findOne({ doi }).exec();
    return !!existingArticle;
  }

  // Get duplicate article by DOI
  async getDuplicateByDOI(doi: string): Promise<Article | null> {
    return this.articleModel.findOne({ doi }).exec();
  }

  // Find articles with similar DOIs (for duplicate checking)
  async findArticlesBySimilarDOI(doi: string): Promise<Article[]> {
    // Basic approach: find articles with exact DOI match or similar DOI
    // In a real system, you might want to implement more sophisticated similarity checks
    const exactMatch = await this.articleModel.findOne({ doi }).exec();
    
    if (exactMatch) {
      return [exactMatch];
    }
    
    // Try finding similar DOIs by matching parts of the DOI
    // For example, match the publisher prefix or first part of the DOI
    const doiParts = doi.split('/');
    if (doiParts.length >= 2) {
      const publisherPrefix = doiParts[0];
      const similarArticles = await this.articleModel.find({
        doi: { $regex: publisherPrefix, $options: 'i' },
      }).limit(5).exec();
      
      return similarArticles;
    }
    
    return [];
  }

  // Submit new article with duplicate checking
  async submitArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    let customId = createArticleDto.customId?.trim();
    
    // If customId is not provided, generate an auto-incrementing ID
    if (!customId) {
      // Get the highest existing ID number
      const lastArticle = await this.articleModel.findOne({})
        .sort({ customId: -1 })
        .exec();
      
      let nextId = 1;
      if (lastArticle && lastArticle.customId) {
        // Extract number from the last ID
        const lastIdNum = parseInt(lastArticle.customId, 10);
        if (!isNaN(lastIdNum)) {
          nextId = lastIdNum + 1;
        }
      }
      
      customId = nextId.toString();
    }

    // Check for duplicate by customId
    const existingById = await this.articleModel.findOne({ customId }).exec();
    if (existingById) {
      throw new HttpException(
        `Article with ID '${customId}' already exists`,
        HttpStatus.CONFLICT
      );
    }
    
    // Update createArticleDto with the determined customId
    createArticleDto.customId = customId;

    // Check for duplicate by DOI
    const isDuplicate = await this.checkDuplicateByDOI(createArticleDto.doi);
    
    // Create article data with common fields
    const articleData: any = {
      ...createArticleDto,
      status: ArticleStatus.PENDING,
      isDuplicate: isDuplicate,
    };
    
    // If duplicate, add reference to original article
    if (isDuplicate) {
      const duplicateArticle = await this.getDuplicateByDOI(createArticleDto.doi);
      articleData.duplicateOf = duplicateArticle?.customId;
    }

    // Create and save the new article
    const newArticle = new this.articleModel(articleData);
    return newArticle.save();
  }

  // Update article
  async update(id: string, createArticleDto: CreateArticleDto) {
    return this.articleModel
      .findOneAndUpdate({ customId: id }, createArticleDto, { new: true })
      .exec();
  }

  // Review article (for moderators)
  async reviewArticle(
    id: string, 
    reviewData: ReviewArticleDto, 
    reviewerId: string
  ): Promise<Article> {
    const article = await this.articleModel.findOne({ customId: id }).exec();
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    const updateData = {
      status: reviewData.status,
      reviewerId,
      reviewComment: reviewData.reviewComment,
    };

    // If marked as duplicate, add duplicate information
    if (reviewData.isDuplicate) {
      updateData['isDuplicate'] = true;
      updateData['duplicateOf'] = reviewData.duplicateOf;
    }

    const updatedArticle = await this.articleModel
      .findOneAndUpdate({ customId: id }, updateData, { new: true })
      .exec();
      
    if (!updatedArticle) {
      throw new HttpException('Failed to update article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    return updatedArticle;
  }

  // Search articles by keywords and filters with sorting
  async searchArticles(
    keywords: string, 
    evidenceType?: string,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    pubYearFrom?: string,
    pubYearTo?: string,
    authors?: string,
    status?: ArticleStatus,
    source?: string
  ): Promise<Article[]> {
    const query: any = {
      status: ArticleStatus.APPROVED, // Only search approved articles
    };

    // Add keyword search across multiple fields
    if (keywords) {
      const keywordRegex = new RegExp(keywords, 'i');
      query.$or = [
        { title: keywordRegex },
        { authors: keywordRegex },
        { claim: keywordRegex },
        { source: keywordRegex },
        { doi: keywordRegex },
      ];
    }

    // Add evidence type filter
    if (evidenceType) {
      query.evidence = evidenceType;
    }
    // Add publication year range filter
    if (pubYearFrom || pubYearTo) {
      query.pubyear = {};
      if (pubYearFrom) {
        const fromYear = parseInt(pubYearFrom, 10);
        if (!isNaN(fromYear)) {
          query.pubyear.$gte = pubYearFrom;
        }
      }
      if (pubYearTo) {
        const toYear = parseInt(pubYearTo, 10);
        if (!isNaN(toYear)) {
          query.pubyear.$lte = pubYearTo;
        }
      }
    }

    // Add authors filter
    if (authors) {
      query.authors = new RegExp(authors, 'i');
    }

    // Add status filter (if user has permission to see other statuses)
    if (status) {
      query.status = status;
    }

    // Add source filter
    if (source) {
      query.source = new RegExp(source, 'i');
    }
    // Create sort object
    const sortObject: any = {};
    // Validate sort field to prevent injection
    const allowedSortFields = ['createdAt', 'title', 'pubyear', 'authors', 'source'];
    if (allowedSortFields.includes(sortBy)) {
      sortObject[sortBy] = sortDirection;
    } else {
      sortObject['createdAt'] = 'desc'; // Default sort
    }

    return this.articleModel.find(query).sort(sortObject).exec();
  }

  // Delete article
  async delete(id: string) {
    return this.articleModel.findOneAndDelete({ customId: id }).exec();
  }
}
