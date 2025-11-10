// create-article.dto.ts
import { EvidenceType } from './article.schema';

export class CreateArticleDto {
  customId: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: EvidenceType;
  submitterId?: string;
  submitterEmail?: string;
}

// Review article DTO for moderator actions
export class ReviewArticleDto {
  status: 'Approved' | 'Rejected';
  reviewComment?: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
}
