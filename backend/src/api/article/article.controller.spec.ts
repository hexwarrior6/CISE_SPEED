import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article, ArticleStatus, EvidenceType } from './article.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock ArticleService
const mockArticleService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  submitArticle: jest.fn(),
  update: jest.fn(),
  reviewArticle: jest.fn(),
  searchArticles: jest.fn(),
  delete: jest.fn(),
  findArticlesBySimilarDOI: jest.fn(),
};

describe('ArticleController', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchArticles', () => {
    it('should call articleService.searchArticles with correct parameters', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles(
        'test keyword',
        EvidenceType.WEAK_AGAINST,
        'title',
        'asc',
        '2019',
        '2021',
        'John',
        ArticleStatus.APPROVED,
        'Journal',
      );

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        'test keyword',
        EvidenceType.WEAK_AGAINST,
        'title',
        'asc',
        '2019',
        '2021',
        'John',
        ArticleStatus.APPROVED,
        'Journal',
      );
      expect(result).toEqual(mockArticles);
    });

    // it('should handle searchArticles error', async () => {
    //   const error = new Error('Search error');
    //   (mockArticleService.searchArticles as jest.Mock).mockRejectedValue(error);

    //   await expect(controller.searchArticles('keyword')).rejects.toThrow();
    // });

    it('should handle keyword-only search', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles('test keyword');

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        'test keyword',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockArticles);
    });

    it('should handle evidence type filter', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles(
        '',
        EvidenceType.WEAK_AGAINST,
      );

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        '',
        EvidenceType.WEAK_AGAINST,
        'createdAt',
        'desc',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockArticles);
    });

    it('should handle publication year range filter', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        '2019',
        '2021',
      );

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        '',
        undefined,
        'createdAt',
        'desc',
        '2019',
        '2021',
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockArticles);
    });

    it('should handle author filter', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        'John',
      );

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        'John',
        undefined,
        undefined,
      );
      expect(result).toEqual(mockArticles);
    });

    it('should handle source filter', async () => {
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

      (mockArticleService.searchArticles as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      const result = await controller.searchArticles(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        undefined,
        undefined,
        'Journal',
      );

      expect(mockArticleService.searchArticles).toHaveBeenCalledWith(
        '',
        undefined,
        'createdAt',
        'desc',
        undefined,
        undefined,
        undefined,
        undefined,
        'Journal',
      );
      expect(result).toEqual(mockArticles);
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

      (mockArticleService.findAll as jest.Mock).mockResolvedValue(mockArticles);

      const result = await controller.findAll();

      expect(mockArticleService.findAll).toHaveBeenCalledWith(undefined);
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

      (mockArticleService.findAll as jest.Mock).mockResolvedValue(mockArticles);

      const result = await controller.findAll(ArticleStatus.PENDING);

      expect(mockArticleService.findAll).toHaveBeenCalledWith(
        ArticleStatus.PENDING,
      );
      expect(result).toEqual(mockArticles);
    });

    // it('should handle findAll error', async () => {
    //   (mockArticleService.findAll as jest.Mock).mockRejectedValue(
    //     new Error('Find error')
    //   );

    //   await expect(
    //     controller.findAll()
    //   ).rejects.toThrowError();
    // });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
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

      (mockArticleService.findOne as jest.Mock).mockResolvedValue(mockArticle);

      const result = await controller.findOne('1');

      expect(mockArticleService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockArticle);
    });

    // it('should handle findOne error', async () => {
    //   (mockArticleService.findOne as jest.Mock).mockRejectedValue(
    //     new Error('Find one error')
    //   );

    //   await expect(
    //     controller.findOne('1')
    //   ).rejects.toThrowError();
    // });
  });

  describe('getPendingArticles', () => {
    it('should return pending articles', async () => {
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

      (mockArticleService.findAll as jest.Mock).mockResolvedValue(mockArticles);

      const result = await controller.getPendingArticles();

      expect(mockArticleService.findAll).toHaveBeenCalledWith(
        ArticleStatus.PENDING,
      );
      expect(result).toEqual(mockArticles);
    });

    // it('should handle getPendingArticles error', async () => {
    //   (mockArticleService.findAll as jest.Mock).mockRejectedValue(
    //     new Error('Get pending articles error')
    //   );

    //   await expect(
    //     controller.getPendingArticles()
    //   ).rejects.toThrowError();
    // });
  });
});
