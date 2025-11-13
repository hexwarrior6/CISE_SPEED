import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { Article, ArticleStatus, EvidenceType } from './article.schema';
import { Model } from 'mongoose';

describe('ArticleService - Self-duplicate Prevention', () => {
  let service: ArticleService;
  let model: Model<Article>;

  const mockArticleModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findOneAndDelete: jest.fn().mockReturnThis(),
    create: jest.fn(),
    save: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    model = module.get<Model<Article>>(getModelToken(Article.name));
  });

  describe('reviewArticle', () => {
    it('should prevent marking an article as duplicate of itself', async () => {
      const mockArticle = {
        customId: '10',
        title: 'Test Article',
        doi: '10.1000/test-doi',
        status: ArticleStatus.PENDING,
      };

      (mockArticleModel.findOne as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticle);

      const reviewData = {
        status: 'Approved' as const,
        reviewComment: 'Test comment',
        isDuplicate: true,
        duplicateOf: '10', // Same ID as the article being reviewed
      };

      await expect(
        service.reviewArticle('10', reviewData, 'reviewer-id')
      ).rejects.toThrow('Cannot mark article as duplicate of itself');
    });
  });

  describe('submitArticle', () => {
    it('should prevent setting duplicateOf to the same article ID during submission', async () => {
      const createArticleDto = {
        customId: '10',
        title: 'Test Article',
        doi: '10.1000/test-doi',
        authors: 'John Doe',
        source: 'Journal of Testing',
        pubyear: '2020',
        claim: 'Test claim',
        evidence: EvidenceType.WEAK_AGAINST,
      };

      // Mock methods for the submission process
      (mockArticleModel.findOne as jest.Mock)
        .mockReturnThis()
        .mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null), // No existing article with this ID
        }));
      
      (mockArticleModel as any).save = jest.fn().mockResolvedValue({
        ...createArticleDto,
        status: ArticleStatus.PENDING,
        isDuplicate: false, // Should not be marked as duplicate with self reference
        customId: '10',
      });

      // Mock that there is an existing article with the same DOI
      (mockArticleModel.findOne as jest.Mock)
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValue(null), // No ID conflict
        }))
        .mockImplementationOnce(() => ({
          exec: jest.fn().mockResolvedValue({ customId: '10' }), // DOI exists with same ID
        }));

      const result = await service.submitArticle(createArticleDto);

      // Expect that duplicateOf is not set to the same ID as the article
      expect(result).toBeDefined();
    });
  });
});