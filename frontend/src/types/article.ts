// Enum for article status
export enum ArticleStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

// Enum for evidence types
export enum EvidenceType {
  EMPIRICAL_STUDY = 'Empirical Study',
  CASE_STUDY = 'Case Study',
  EXPERIMENTAL = 'Experimental',
  SYSTEMATIC_LITERATURE_REVIEW = 'Systematic Literature Review',
  META_ANALYSIS = 'Meta Analysis',
  SURVEY = 'Survey',
  THEORETICAL = 'Theoretical',
  TOOL_EVALUATION = 'Tool Evaluation',
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