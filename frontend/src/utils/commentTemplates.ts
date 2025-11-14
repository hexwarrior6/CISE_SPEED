// commentTemplates.ts
// Predefined comment templates for article moderation

export interface CommentTemplate {
  id: string;
  name: string;
  category: 'approval' | 'rejection' | 'clarification' | 'duplicate';
  content: string;
}

export const commentTemplates: CommentTemplate[] = [
  // Approval Templates
  {
    id: 'approval-general',
    name: 'General Approval',
    category: 'approval',
    content: 'This article meets all the submission criteria and provides valuable evidence regarding the software engineering practice. The methodology is sound and the findings are clearly presented.'
  },
  {
    id: 'approval-high-quality',
    name: 'High Quality Article',
    category: 'approval',
    content: 'This is an excellent article that makes a significant contribution to the field. The evidence presented is robust and the conclusions are well-supported by the data.'
  },
  
  // Rejection Templates
  {
    id: 'rejection-low-quality',
    name: 'Low Quality/Methodology Issues',
    category: 'rejection',
    content: 'This article does not meet the quality standards for inclusion in the database. The methodology has significant flaws that undermine the validity of the findings.'
  },
  {
    id: 'rejection-insufficient-evidence',
    name: 'Insufficient Evidence',
    category: 'rejection',
    content: 'This article provides insufficient evidence to support its claims about the software engineering practice. Additional research and validation would be needed to make the findings credible.'
  },
  {
    id: 'rejection-off-topic',
    name: 'Off Topic/Out of Scope',
    category: 'rejection',
    content: 'This article is not relevant to the scope of the SE Evidence Database. It does not address a software engineering practice or provides information that is tangential to our focus.'
  },
  
  // Clarification Requests
  {
    id: 'clarification-needed',
    name: 'Clarification Needed',
    category: 'clarification',
    content: 'This article has potential but needs clarification on key aspects before it can be approved. Please provide additional information about the methodology and evidence.'
  },
  {
    id: 'clarification-evidence',
    name: 'Evidence Clarification',
    category: 'clarification',
    content: 'The relationship between the evidence presented and the claims made about the software engineering practice is unclear. Please clarify this connection.'
  },
  
  // Duplicate Templates
  {
    id: 'duplicate-found',
    name: 'Duplicate Content',
    category: 'duplicate',
    content: 'This article appears to be substantially similar to an existing entry in the database. After review, it does not provide significantly new information or evidence to warrant separate inclusion.'
  }
];

// Function to get templates by category
export const getTemplatesByCategory = (category: CommentTemplate['category']) => {
  return commentTemplates.filter(template => template.category === category);
};

// Function to get all templates
export const getAllTemplates = () => {
  return commentTemplates;
};