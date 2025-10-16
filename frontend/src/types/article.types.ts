// types/article.types.ts

// 用于前端显示和表单提交的 Article 接口
export interface Article {
  customId: string; // 前端统一使用 id
  title: string;
  authors: string; // 注意：根据你的后端，authors 是字符串，不是数组
  source: string;
  pubyear: string; // 或者可以定义为 number，根据后端
  doi: string;
  claim: string;
  evidence: string;
}

// 用于创建新文章的 DTO（与后端 CreateArticleDto 对应）
export interface CreateArticleDto {
  customId: string; // 对应后端的 customId
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
}