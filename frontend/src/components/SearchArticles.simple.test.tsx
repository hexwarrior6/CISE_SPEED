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

    // Check for the main search input with the placeholder text
    expect(screen.getByPlaceholderText('Enter keywords to search across titles, authors, and claims...')).toBeInTheDocument();

    // Check for the search button
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();

    // Check for the Advanced Filters header
    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
  });
});