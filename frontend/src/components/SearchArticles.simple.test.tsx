import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchArticles from './SearchArticles';
import { Article, EvidenceType, ArticleStatus } from '../types/article';

// Mock the fetch API
global.fetch = jest.fn();

// Simplified test to verify basic rendering
describe('SearchArticles Component', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  test('renders search form correctly', () => {
    render(<SearchArticles />);
    
    expect(screen.getByText('Search SE Evidence Articles')).toBeInTheDocument();
    expect(screen.getByLabelText('Keywords (Title, Authors, Claim)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});