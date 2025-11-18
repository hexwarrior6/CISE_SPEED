export interface Rating {
  id?: number;
  userId: number;
  articleId: number;
  score: number; // 0.5-5, 步长0.5
  createdAt?: Date;
}

export interface ArticleRatingSummary {
  articleId: number;
  averageScore: number;
  totalRatings: number;
}
