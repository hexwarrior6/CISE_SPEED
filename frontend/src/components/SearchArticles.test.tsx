import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchArticles from './SearchArticles';
import { Article, EvidenceType, ArticleStatus } from '../types/article';

// Mock the fetch API
global.fetch = jest.fn();

const mockArticles: Article[] = [
  {
    customId: '1',
    title: 'Test Article 1',
    authors: 'John Doe',
    source: 'Journal of Testing',
    pubyear: '2020',
    doi: '10.1000/test1',
    claim: 'Test claim 1',
    evidence: EvidenceType.WEAK_AGAINST,
    status: ArticleStatus.APPROVED,
    isDuplicate: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    customId: '2',
    title: 'Test Article 2',
    authors: 'Jane Smith',
    source: 'Testing Today',
    pubyear: '2021',
    doi: '10.1000/test2',
    claim: 'Test claim 2',
    evidence: EvidenceType.MODERATELY_SUPPORTS,
    status: ArticleStatus.APPROVED,
    isDuplicate: false,
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
];

describe('SearchArticles Component', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  test('renders search form correctly', () => {
    render(<SearchArticles />);
    
    expect(screen.getByText('Search SE Evidence Articles')).toBeInTheDocument();
    expect(screen.getByLabelText('Keywords (Title, Authors, Claim)')).toBeInTheDocument();
    expect(screen.getByLabelText('SE Practice (Evidence Type)')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication Year From')).toBeInTheDocument();
    expect(screen.getByLabelText('Publication Year To')).toBeInTheDocument();
    expect(screen.getByLabelText('Authors')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('handles keyword search', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    render(<SearchArticles />);
    
    const keywordInput = screen.getByLabelText('Keywords (Title, Authors, Claim)');
    fireEvent.change(keywordInput, { target: { value: 'test keyword' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search/advanced?keywords=test+keyword&sortBy=createdAt&sortDirection=desc`
      );
    });
  });

  test('handles evidence type filter', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    render(<SearchArticles />);
    
    const evidenceTypeSelect = screen.getByLabelText('SE Practice (Evidence Type)');
    fireEvent.change(evidenceTypeSelect, { target: { value: EvidenceType.MODERATELY_SUPPORTS } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search/advanced?evidenceType=Moderately+Supports&sortBy=createdAt&sortDirection=desc`
      );
    });
  });

  test('handles publication year range filter', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    render(<SearchArticles />);
    
    const yearFromInput = screen.getByLabelText('Publication Year From');
    fireEvent.change(yearFromInput, { target: { value: '2020' } });
    
    const yearToInput = screen.getByLabelText('Publication Year To');
    fireEvent.change(yearToInput, { target: { value: '2022' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search/advanced?pubYearFrom=2020&pubYearTo=2022&sortBy=createdAt&sortDirection=desc`
      );
    });
  });

  test('handles multiple filters', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    render(<SearchArticles />);
    
    // Apply multiple filters
    const keywordInput = screen.getByLabelText('Keywords (Title, Authors, Claim)');
    fireEvent.change(keywordInput, { target: { value: 'test' } });
    
    const evidenceTypeSelect = screen.getByLabelText('SE Practice (Evidence Type)');
    fireEvent.change(evidenceTypeSelect, { target: { value: EvidenceType.WEAK_AGAINST } });
    
    const authorsInput = screen.getByLabelText('Authors');
    fireEvent.change(authorsInput, { target: { value: 'Doe' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      const fetchCallUrl = (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls[0][0];
      expect(fetchCallUrl).toContain('keywords=test');
      expect(fetchCallUrl).toContain('evidenceType=Weak+Against');
      expect(fetchCallUrl).toContain('authors=Doe');
      expect(fetchCallUrl).toContain('sortBy=createdAt');
      expect(fetchCallUrl).toContain('sortDirection=desc');
    });
  });

  test('displays search results', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    render(<SearchArticles />);
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Found 2 results')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Journal of Testing')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  test('handles search error', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

    render(<SearchArticles />);
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('clears all filters', async () => {
    render(<SearchArticles />);
    
    // Apply some filters
    const keywordInput = screen.getByLabelText('Keywords (Title, Authors, Claim)');
    fireEvent.change(keywordInput, { target: { value: 'test' } });
    
    const evidenceTypeSelect = screen.getByLabelText('SE Practice (Evidence Type)');
    fireEvent.change(evidenceTypeSelect, { target: { value: EvidenceType.WEAK_AGAINST } });
    
    // Verify filters are applied
    expect(keywordInput).toHaveValue('test');
    expect(evidenceTypeSelect).toHaveValue(EvidenceType.WEAK_AGAINST);
    
    // Click clear filters
    const clearButton = screen.getByRole('button', { name: 'Clear Filters' });
    fireEvent.click(clearButton);
    
    // Verify filters are cleared
    expect(keywordInput).toHaveValue('');
    expect(evidenceTypeSelect).toHaveValue('');
  });
});