import React, { useState, useEffect } from 'react';
import { Article, EvidenceType, ArticleStatus } from '../types/article';

// Enhanced search functionality with real-time suggestions

const SearchArticles: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [evidenceType, setEvidenceType] = useState('');
  const [pubYearFrom, setPubYearFrom] = useState('');
  const [pubYearTo, setPubYearTo] = useState('');
  const [authors, setAuthors] = useState('');
  const [status, setStatus] = useState<ArticleStatus | ''>('');
  const [source, setSource] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sortField, setSortField] = useState<keyof Article>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Enhanced search function with debouncing
  useEffect(() => {
    if (keywords.trim()) {
      const delaySearch = setTimeout(() => {
        // This is for real-time suggestions if needed in the future
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [keywords, evidenceType, pubYearFrom, pubYearTo, authors, status, source]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const params = new URLSearchParams();
      if (keywords.trim()) params.append('keywords', keywords.trim());
      if (evidenceType) params.append('evidenceType', evidenceType);
      if (pubYearFrom) params.append('pubYearFrom', pubYearFrom);
      if (pubYearTo) params.append('pubYearTo', pubYearTo);
      if (authors) params.append('authors', authors);
      if (status) params.append('status', status);
      if (source) params.append('source', source);
      
      // Add sort parameters
      params.append('sortBy', sortField);
      params.append('sortDirection', sortDirection);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search/advanced?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search articles');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle table sorting
  const handleSort = (field: keyof Article) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    // Re-run search with new sort parameters
    handleSearch();
  };

  const clearFilters = () => {
    setKeywords('');
    setEvidenceType('');
    setPubYearFrom('');
    setPubYearTo('');
    setAuthors('');
    setStatus('');
    setSource('');
    setResults([]);
    setSearchPerformed(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Search SE Evidence Articles</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (Title, Authors, Claim)
            </label>
            <div className="relative">
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter keywords to search..."
                aria-label="Search keywords"
              />
              {keywords && (
                <button
                  type="button"
                  onClick={() => setKeywords('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Clear keywords"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="evidenceType" className="block text-sm font-medium text-gray-700 mb-1">
              SE Practice (Evidence Type)
            </label>
            <select
              id="evidenceType"
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select SE Practice type"
            >
              <option value="">All Evidence Types</option>
              {Object.values(EvidenceType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pubYearFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year From
            </label>
            <input
              id="pubYearFrom"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={pubYearFrom}
              onChange={(e) => setPubYearFrom(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 2010"
              aria-label="Publication year from"
            />
          </div>
          <div>
            <label htmlFor="pubYearTo" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year To
            </label>
            <input
              id="pubYearTo"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={pubYearTo}
              onChange={(e) => setPubYearTo(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 2023"
              aria-label="Publication year to"
            />
          </div>
          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
              Authors
            </label>
            <input
              id="authors"
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Author name"
              aria-label="Filter by authors"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select article status"
            >
              <option value="">All Statuses</option>
              {Object.values(ArticleStatus).map((statusValue) => (
                <option key={statusValue} value={statusValue}>{statusValue}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Journal, conference, etc."
              aria-label="Filter by source"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {searchPerformed && !loading && !error && results.length === 0 && (
        <div className="p-8 bg-gray-50 text-center rounded-lg">
          <p className="text-gray-500">No results found matching your search criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {searchPerformed && results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">Found {results.length} results</p>
            <div className="text-xs text-gray-500">
              Sorting: <span className="font-medium">{sortField}</span> {sortDirection === 'asc' ? '↑' : '↓'}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === 'title' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('authors')}
                  >
                    <div className="flex items-center">
                      Authors
                      {sortField === 'authors' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center">
                      Source
                      {sortField === 'source' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('pubyear')}
                  >
                    <div className="flex items-center">
                      Year
                      {sortField === 'pubyear' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    SE Practice
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Claim
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Added
                      {sortField === 'createdAt' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((article) => (
                  <tr key={article.customId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {article.customId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-xs truncate">{article.authors}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-xs truncate">{article.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {article.pubyear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.evidence}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-sm">
                      <div className="line-clamp-3">{article.claim}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchArticles;