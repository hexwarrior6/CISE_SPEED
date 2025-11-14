/**
 * Utility function to export article data as CSV
 */
import { Article } from '../types/article';

export const exportToCSV = (articles: Article[], filename: string = 'search-results.csv'): void => {
  if (!articles || articles.length === 0) {
    console.warn('No articles to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Title',
    'Authors',
    'Source',
    'Year',
    'DOI',
    'Claim',
    'Evidence Type',
    'Status',
    'Submitter ID',
    'Submitter Email',
    'Reviewer ID',
    'Review Comment',
    'Created At',
    'Updated At',
    'Is Duplicate',
    'Duplicate Of'
  ];

  // Prepare CSV content
  const csvContent = [
    headers.join(','),
    ...articles.map(article => {
      return [
        `"${escapeCsvField(article.customId)}"`,
        `"${escapeCsvField(article.title)}"`,
        `"${escapeCsvField(article.authors)}"`,
        `"${escapeCsvField(article.source)}"`,
        `"${escapeCsvField(article.pubyear)}"`,
        `"${escapeCsvField(article.doi)}"`,
        `"${escapeCsvField(article.claim)}"`,
        `"${escapeCsvField(article.evidence)}"`,
        `"${escapeCsvField(article.status)}"`,
        `"${escapeCsvField(article.submitterId || '')}"`,
        `"${escapeCsvField(article.submitterEmail || '')}"`,
        `"${escapeCsvField(article.reviewerId || '')}"`,
        `"${escapeCsvField(article.reviewComment || '')}"`,
        `"${escapeCsvField(article.createdAt || '')}"`,
        `"${escapeCsvField(article.updatedAt || '')}"`,
        `"${escapeCsvField(article.isDuplicate ? 'Yes' : 'No')}"`,
        `"${escapeCsvField(article.duplicateOf || '')}"`
      ].join(',');
    })
  ].join('\n');

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('CSV download is not supported in this browser');
  }
};

// Helper function to escape CSV fields that might contain commas, quotes, or newlines
const escapeCsvField = (field: string | number | boolean | undefined | null): string => {
  if (field === null || field === undefined) {
    return '';
  }

  const str = String(field);

  // If the string contains commas, double quotes, or newlines, wrap it in double quotes
  // Also escape any double quotes by replacing them with two double quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
};