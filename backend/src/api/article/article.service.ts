// article.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';
import { CreateArticleDto, ReviewArticleDto } from './create-article.dto';
import { EmailService } from '../../services/email.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private emailService: EmailService,
  ) {}

  async findAll(status?: ArticleStatus): Promise<Article[]> {
    const query = status ? { status } : { status: ArticleStatus.APPROVED };
    return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findOne({ customId: id }).exec();
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  async addRating(articleId: string, userId: string, rating: number) {
    // 验证评分值
    if (rating < 0.5 || rating > 5 || (rating * 2) % 1 !== 0) {
      throw new BadRequestException(
        'Rating must be between 0.5 and 5 with 0.5 step',
      );
    }

    const article = await this.articleModel.findOne({ customId: articleId });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // 查找用户是否已评分
    const existingRatingIndex = article.ratings.findIndex(
      (r) => r.userId === userId,
    );
    if (existingRatingIndex >= 0) {
      // 更新现有评分
      article.ratings[existingRatingIndex].rating = rating;
    } else {
      // 添加新评分
      article.ratings.push({
        userId,
        rating,
      });
    }

    // 计算新的平均评分
    const totalRating = article.ratings.reduce((sum, r) => sum + r.rating, 0);
    article.averageRating =
      Math.round((totalRating / article.ratings.length) * 10) / 10; // 保留一位小数

    return article.save();
  }

  async checkDuplicateByDOI(doi: string): Promise<boolean> {
    const existingArticle = await this.articleModel.findOne({ doi }).exec();
    return !!existingArticle;
  }

  async getDuplicateByDOI(doi: string): Promise<Article | null> {
    return this.articleModel.findOne({ doi }).exec();
  }

  async findArticlesBySimilarDOI(
    doi: string,
    excludeId?: string,
  ): Promise<Article[]> {
    const query: any = { doi };

    if (excludeId) {
      query.customId = { $ne: excludeId };
    }

    const exactMatches = await this.articleModel.find(query).exec();

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    const doiParts = doi.split('/');
    if (doiParts.length >= 2) {
      const publisherPrefix = doiParts[0];
      const query: any = {
        doi: { $regex: publisherPrefix, $options: 'i' },
      };

      if (excludeId) {
        query.customId = { $ne: excludeId };
      }

      const similarArticles = await this.articleModel
        .find(query)
        .limit(5)
        .exec();

      return similarArticles;
    }

    return [];
  }

  async submitArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    let customId = createArticleDto.customId?.trim();

    if (!customId) {
      const allArticles = await this.articleModel
        .find({
          customId: { $ne: '' },
        })
        .exec();

      let maxId = 0;
      for (const article of allArticles) {
        if (article.customId) {
          const idNum = parseInt(article.customId, 10);
          if (!isNaN(idNum) && idNum > maxId) {
            maxId = idNum;
          }
        }
      }

      customId = (maxId + 1).toString();
    }

    const existingById = await this.articleModel.findOne({ customId }).exec();
    if (existingById) {
      throw new HttpException(
        `Article with ID '${customId}' already exists`,
        HttpStatus.CONFLICT,
      );
    }

    createArticleDto.customId = customId;

    const isDuplicate = await this.checkDuplicateByDOI(createArticleDto.doi);

    const articleData: any = {
      ...createArticleDto,
      status: ArticleStatus.PENDING,
      isDuplicate: isDuplicate,
    };

    if (isDuplicate) {
      const duplicateArticle = await this.getDuplicateByDOI(
        createArticleDto.doi,
      );
      if (duplicateArticle && duplicateArticle.customId !== customId) {
        articleData.duplicateOf = duplicateArticle.customId;
      }
    }

    const newArticle = new this.articleModel(articleData);
    return newArticle.save();
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return this.articleModel
      .findOneAndUpdate({ customId: id }, createArticleDto, { new: true })
      .exec();
  }

  async reviewArticle(
    id: string,
    reviewData: ReviewArticleDto,
    reviewerId: string,
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

    if (reviewData.isDuplicate) {
      updateData['isDuplicate'] = true;
      if (reviewData.duplicateOf === id) {
        throw new HttpException(
          'Cannot mark article as duplicate of itself',
          HttpStatus.BAD_REQUEST,
        );
      }
      updateData['duplicateOf'] = reviewData.duplicateOf;
    } else {
      updateData['isDuplicate'] = false;
      updateData['duplicateOf'] = undefined;
    }

    const updatedArticle = await this.articleModel
      .findOneAndUpdate({ customId: id }, updateData, { new: true })
      .exec();

    if (!updatedArticle) {
      throw new HttpException(
        'Failed to update article',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    console.log(
      `Attempting to send notification email for article ${updatedArticle.customId} with status ${updatedArticle.status}`,
    );
    await this.sendReviewNotificationEmail(updatedArticle);

    return updatedArticle;
  }

  private async sendReviewNotificationEmail(article: Article) {
    console.log(
      `Processing notification for article ${article.customId} with status ${article.status} and submitter email ${article.submitterEmail}`,
    );

    if (!article.submitterEmail) {
      console.warn(
        `No submitter email found for article ${article.customId} - article.service.ts:228`,
      );
      return;
    }

    let subject = '';
    let htmlContent = '';

    if (article.status === ArticleStatus.APPROVED) {
      subject = 'Your Article Has Been Approved - CISE_SPEED';
      htmlContent = `
        <h2>Article Review Result Notification</h2>
        <p>Hello,</p>
        <p>Your article <strong>"${article.title}"</strong> has been approved and added to the database.</p>
        <p><strong>Article Details:</strong></p>
        <ul>
          <li>Title: ${article.title}</li>
          <li>ID: ${article.customId}</li>
          <li>Authors: ${article.authors}</li>
          <li>Publication Year: ${article.pubyear}</li>
          <li>Evidence Type: ${article.evidence}</li>
        </ul>
        <p>Thank you for contributing to the CISE_SPEED database!</p>
        <p>If you have any questions, please feel free to contact us.</p>
      `;
    } else if (article.status === ArticleStatus.REJECTED) {
      subject = 'Article Review Result - CISE_SPEED';
      htmlContent = `
        <h2>Article Review Result Notification</h2>
        <p>Hello,</p>
        <p>Unfortunately, your article <strong>"${article.title}"</strong> did not pass the review.</p>

        ${article.reviewComment ? `<p><strong>Review Comment:</strong> ${article.reviewComment}</p>` : ''}

        <p><strong>Article Details:</strong></p>
        <ul>
          <li>Title: ${article.title}</li>
          <li>ID: ${article.customId}</li>
          <li>Authors: ${article.authors}</li>
          <li>Publication Year: ${article.pubyear}</li>
        </ul>
        <p>Thank you for your interest and contribution to the CISE_SPEED database!</p>
        <p>If you have any questions, please feel free to contact us.</p>
      `;
    } else {
      console.log(
        `Article ${article.customId} status changed to ${article.status}, no email notification required.`,
      );
      return;
    }

    console.log(
      `Attempting to send email to ${article.submitterEmail} with subject: ${subject}`,
    );

    try {
      const result = await this.emailService.sendMail(
        article.submitterEmail,
        subject,
        htmlContent,
        `CISE_SPEED: Your article "${article.title}" has been reviewed`,
        'CISE_SPEED System',
      );

      if (result) {
        console.log(
          `Notification email sent successfully to ${article.submitterEmail} for article ${article.customId}`,
        );
      } else {
        console.error(
          `Failed to send notification email to ${article.submitterEmail} for article ${article.customId}`,
        );
      }
    } catch (error) {
      console.error(
        `Error sending notification email to ${article.submitterEmail} for article ${article.customId}:`,
        error,
      );
    }
  }

  async searchArticles(
    keywords: string,
    evidenceType?: string,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    pubYearFrom?: string,
    pubYearTo?: string,
    authors?: string,
    status?: ArticleStatus,
    source?: string,
  ): Promise<Article[]> {
    const query: any = {
      status: ArticleStatus.APPROVED,
    };

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

    if (evidenceType) {
      query.evidence = evidenceType;
    }

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

    if (authors) {
      query.authors = new RegExp(authors, 'i');
    }

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = new RegExp(source, 'i');
    }

    const sortObject: any = {};
    const allowedSortFields = [
      'createdAt',
      'title',
      'pubyear',
      'authors',
      'source',
    ];
    if (allowedSortFields.includes(sortBy)) {
      sortObject[sortBy] = sortDirection;
    } else {
      sortObject['createdAt'] = 'desc';
    }

    return this.articleModel.find(query).sort(sortObject).exec();
  }

  async delete(id: string) {
    return this.articleModel.findOneAndDelete({ customId: id }).exec();
  }
}
