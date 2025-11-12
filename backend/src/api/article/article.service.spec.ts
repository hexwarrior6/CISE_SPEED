import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { Article, ArticleStatus, EvidenceType } from './article.schema';
import { Model } from 'mongoose';

// Mock Article model
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

describe('ArticleService', () => {
  let service: ArticleService;
  let model: Model<Article>;

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchArticles', () => {
    it('should return articles with keyword search', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles('test keyword');

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          $or: expect.arrayContaining([
            expect.objectContaining({ title: expect.any(RegExp) }),
            expect.objectContaining({ authors: expect.any(RegExp) }),
          ]),
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with evidence type filter', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles(
        '',
        EvidenceType.WEAK_AGAINST
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          evidence: EvidenceType.WEAK_AGAINST,
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with publication year range filter', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        '2019',
        '2021'
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          pubyear: expect.objectContaining({
            $gte: '2019',
            $lte: '2021',
          }),
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with author filter', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        'John Doe'
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          authors: expect.any(RegExp),
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with source filter', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        undefined,
        undefined,
        'Journal'
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          source: expect.any(RegExp),
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with multiple filters', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      // Mock the exec method to return the mock articles
      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.searchArticles(
        'test',
        EvidenceType.WEAK_AGAINST,
        'createdAt',
        'desc',
        '2019',
        '2021',
        'John',
        ArticleStatus.APPROVED,
        'Journal'
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          $or: expect.arrayContaining([
            expect.objectContaining({ title: expect.any(RegExp) }),
          ]),
          evidence: EvidenceType.WEAK_AGAINST,
          pubyear: expect.objectContaining({
            $gte: '2019',
            $lte: '2021',
          }),
          authors: expect.any(RegExp),
          source: expect.any(RegExp),
        })
      );
      expect(result).toEqual(mockArticles);
    });

    it('should sort articles by specified field', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      await service.searchArticles('', undefined, 'title', 'asc');

      expect(mockArticleModel.sort).toHaveBeenCalledWith({
        title: 'asc',
      });
    });

    it('should use default sorting if invalid sort field provided', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      await service.searchArticles('', undefined, 'invalidField', 'desc');

      expect(mockArticleModel.sort).toHaveBeenCalledWith({
        createdAt: 'desc',
      });
    });

    it('should handle invalid year values in publication year range', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      // Test with invalid year values that will result in NaN when parsed
      await service.searchArticles('', undefined, 'createdAt', 'desc', 'abc', 'def');

      // Should only add filters for valid years, so pubyear should be empty object
      expect(mockArticleModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ArticleStatus.APPROVED,
          pubyear: expect.any(Object),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should find an article by customId', async () => {
      const mockArticle = {
        customId: '1',
        title: 'Test Article',
        authors: 'John Doe',
        source: 'Journal of Testing',
        pubyear: '2020',
        doi: '10.1000/test1',
        claim: 'Test claim',
        evidence: EvidenceType.WEAK_AGAINST,
        status: ArticleStatus.APPROVED,
      };

      (mockArticleModel.findOne as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticle);

      const result = await service.findOne('1');

      expect(mockArticleModel.findOne).toHaveBeenCalledWith({ customId: '1' });
      expect(result).toEqual(mockArticle);
    });

    it('should throw error if article not found', async () => {
      (mockArticleModel.findOne as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('Article not found');
    });
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.APPROVED,
        },
      ];

      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(mockArticleModel.find).toHaveBeenCalledWith({});
      expect(mockArticleModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockArticles);
    });

    it('should return articles with status filter', async () => {
      const mockArticles = [
        {
          customId: '1',
          title: 'Test Article',
          authors: 'John Doe',
          source: 'Journal of Testing',
          pubyear: '2020',
          doi: '10.1000/test1',
          claim: 'Test claim',
          evidence: EvidenceType.WEAK_AGAINST,
          status: ArticleStatus.PENDING,
        },
      ];

      (mockArticleModel.find as jest.Mock).mockReturnThis();
      (mockArticleModel.sort as jest.Mock).mockReturnThis();
      (mockArticleModel.exec as jest.Mock).mockResolvedValue(mockArticles);

      const result = await service.findAll(ArticleStatus.PENDING);

      expect(mockArticleModel.find).toHaveBeenCalledWith({ status: ArticleStatus.PENDING });
      expect(mockArticleModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockArticles);
    });
  });
});