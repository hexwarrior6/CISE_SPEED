// Enum for article status
export enum ArticleStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

// Enum for evidence types
export enum EvidenceType {
  WEAK_AGAINST = 'Weak Against',
  MODERATELY_AGAINST = 'Moderately Against',
  NEUTRAL = 'Neutral',
  MODERATELY_SUPPORTS = 'Moderately Supports',
  STRONGLY_SUPPORTS = 'Strongly Supports',
}

// Article interface
export interface Article {
  customId: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: EvidenceType;
  status: ArticleStatus;
  isDuplicate: boolean;
  duplicateOf?: string;
  submitterId?: string;
  submitterEmail?: string;
  reviewerId?: string;
  reviewComment?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Review data interface
export interface ReviewData {
  status: 'Approved' | 'Rejected';
  reviewComment?: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
}