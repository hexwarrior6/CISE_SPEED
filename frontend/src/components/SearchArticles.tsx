import React, { useState, useEffect, useRef } from "react";
import { Article, EvidenceType, ArticleStatus } from "../types/article";
import styles from "../styles/SearchPage.module.scss";

// Enhanced search functionality with real-time suggestions and search history

const SearchArticles: React.FC = () => {
  const [keywords, setKeywords] = useState("");
  const [evidenceType, setEvidenceType] = useState("");
  const [pubYearFrom, setPubYearFrom] = useState("");
  const [pubYearTo, setPubYearTo] = useState("");
  const [authors, setAuthors] = useState("");
  const [status, setStatus] = useState<ArticleStatus | "">("");
  const [source, setSource] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sortField, setSortField] = useState<keyof Article>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        if (Array.isArray(history)) {
          setSearchHistory(history);
        }
      } catch (e) {
        console.error('Error parsing search history from localStorage:', e);
      }
    }
  }, []);

  // Save search history to localStorage whenever searchHistory changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Update dropdown position when it's shown or when the window is resized
  useEffect(() => {
    const updatePosition = () => {
      if (showHistoryDropdown && searchInputRef.current) {
        const inputRect = searchInputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: inputRect.bottom + window.scrollY,
          left: inputRect.left + window.scrollX,
          width: inputRect.width,
        });
      }
    };

    // Only update position when dropdown is shown
    if (showHistoryDropdown) {
      // Use setTimeout to ensure element is rendered before calculating position
      setTimeout(updatePosition, 0);
    }

    // Add event listeners for scroll and resize to update position
    const handleScrollAndResize = () => {
      if (showHistoryDropdown) {
        updatePosition();
      }
    };

    window.addEventListener('scroll', handleScrollAndResize);
    window.addEventListener('resize', handleScrollAndResize);

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, [showHistoryDropdown]);

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

    // Add to search history if the search term is not already in the history
    if (keywords.trim()) {
      setSearchHistory(prev => {
        const newHistory = prev.filter(item => item.toLowerCase() !== keywords.trim().toLowerCase());
        // Limit history to 10 items
        return [keywords.trim(), ...newHistory].slice(0, 10);
      });
    }

    try {
      const params = new URLSearchParams();
      if (keywords.trim()) params.append("keywords", keywords.trim());
      if (evidenceType) params.append("evidenceType", evidenceType);
      if (pubYearFrom) params.append("pubYearFrom", pubYearFrom);
      if (pubYearTo) params.append("pubYearTo", pubYearTo);
      if (authors) params.append("authors", authors);
      if (status) params.append("status", status);
      if (source) params.append("source", source);

      // Add sort parameters
      params.append("sortBy", sortField);
      params.append("sortDirection", sortDirection);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/articles/search/advanced?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to search articles");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during search"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHistoryItemClick = (searchTerm: string) => {
    setKeywords(searchTerm);
    setShowHistoryDropdown(false);
    // Focus the search input after setting the value
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Handle table sorting
  const handleSort = (field: keyof Article) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    // Re-run search with new sort parameters
    handleSearch();
  };

  const clearFilters = () => {
    setKeywords("");
    setEvidenceType("");
    setPubYearFrom("");
    setPubYearTo("");
    setAuthors("");
    setStatus("");
    setSource("");
    setResults([]);
    setSearchPerformed(false);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchInputRef.current && !searchInputRef.current.contains(target) &&
          dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowHistoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Search Form Container */}
      <div className={`${styles.mainContent} ${styles.searchFormContainer}`}>
        {/* Search Form */}
        <div className={styles.searchContainer}>
          {/* Main Search Bar */}
          <div className={styles.mainSearchSection}>
            <div className={styles.searchBarContainer}>
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowHistoryDropdown(true)}
                  onClick={() => setShowHistoryDropdown(true)}
                  className={styles.mainSearchInput}
                  placeholder="Enter keywords to search across titles, authors, and claims..."
                  aria-label="Search keywords"
                  autoComplete="off"
                  ref={searchInputRef}
                />
                {showHistoryDropdown && (
                  <div
                    className={styles.searchHistoryDropdown}
                    ref={dropdownRef}
                    style={{
                      top: `${dropdownPosition.top + 4}px`,  // Add 4px gap
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                    }}
                  >
                    {searchHistory.length > 0 ? (
                      <>
                        <div className={styles.historyHeader}>
                          <span>Recent Searches</span>
                          <button
                            className={styles.clearHistoryButton}
                            onClick={handleClearHistory}
                            aria-label="Clear search history"
                          >
                            Clear
                          </button>
                        </div>
                        <ul className={styles.historyList}>
                          {searchHistory.map((item, index) => (
                            <li
                              key={index}
                              className={styles.historyItem}
                              onClick={() => handleHistoryItemClick(item)}
                            >
                              <span className={styles.historyIcon}>🕒</span>
                              <span className={styles.historyText}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <div className={styles.noHistoryMessage}>
                        <p>No recent searches</p>
                      </div>
                    )}
                  </div>
                )}
              <button
                onClick={handleSearch}
                disabled={loading}
                className={styles.mainSearchButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters Section */}
          <div className={styles.advancedFiltersSection}>
            <div
              className={styles.advancedFiltersHeader}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <h3>Advanced Filters</h3>
              <span
                className={`${styles.toggleIcon} ${
                  showAdvancedFilters ? styles.rotated : ""
                }`}
              >
                ▼
              </span>
            </div>

            {showAdvancedFilters && (
              <div className={styles.advancedFiltersContent}>
                <div className={styles.filtersRow}>
                  <div className={styles.filterGroup}>
                    <label htmlFor="evidenceType" className={styles.filterLabel}>
                      SE Practice
                    </label>
                    <select
                      id="evidenceType"
                      value={evidenceType}
                      onChange={(e) => setEvidenceType(e.target.value)}
                      className={styles.formSelect}
                      aria-label="Select SE Practice type"
                    >
                      <option value="">All Practices</option>
                      {Object.values(EvidenceType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label htmlFor="status" className={styles.filterLabel}>
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                      className={styles.formSelect}
                      aria-label="Select article status"
                    >
                      <option value="">All Statuses</option>
                      {Object.values(ArticleStatus).map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                          {statusValue}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label htmlFor="pubYearFrom" className={styles.filterLabel}>
                      Year From
                    </label>
                    <input
                      id="pubYearFrom"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={pubYearFrom}
                      onChange={(e) => setPubYearFrom(e.target.value)}
                      className={styles.formInput}
                      placeholder="e.g. 2010"
                      aria-label="Publication year from"
                    />
                  </div>
                </div>

                <div className={styles.filtersRow}>
                  <div className={styles.filterGroup}>
                    <label htmlFor="pubYearTo" className={styles.filterLabel}>
                      Year To
                    </label>
                    <input
                      id="pubYearTo"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={pubYearTo}
                      onChange={(e) => setPubYearTo(e.target.value)}
                      className={styles.formInput}
                      placeholder="e.g. 2023"
                      aria-label="Publication year to"
                    />
                  </div>

                  <div className={styles.filterGroup}>
                    <label htmlFor="authors" className={styles.filterLabel}>
                      Authors
                    </label>
                    <input
                      id="authors"
                      type="text"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      className={styles.formInput}
                      placeholder="Author names"
                      aria-label="Filter by authors"
                    />
                  </div>

                  <div className={styles.filterGroup}>
                    <label htmlFor="source" className={styles.filterLabel}>
                      Source
                    </label>
                    <input
                      id="source"
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className={styles.formInput}
                      placeholder="Journal, conference, etc."
                      aria-label="Filter by source"
                    />
                  </div>
                </div>

                <div className={styles.filterActions}>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={styles.searchButton}
                  >
                    Apply Filters
                  </button>
                  <button onClick={clearFilters} className={styles.clearButton}>
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className={`${styles.alertError}`}>
          <svg
            className={styles.alertIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {searchPerformed && !loading && !error && results.length === 0 && (
        <div className={styles.mainContent}>
          <div className={styles.noResults}>
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyStateIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3>No results found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          </div>
        </div>
      )}

      {searchPerformed && results.length > 0 && (
        <div className={styles.mainContent}>
          <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
              <p className={styles.resultsCount}>
                Found {results.length} results
              </p>
              <div className={styles.sortInfo}>
                Sorting: <span className={styles.sortField}>{sortField}</span>{" "}
                {sortDirection === "asc" ? "↑" : "↓"}
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    <th scope="col" onClick={() => handleSort("title")}>
                      <div className={styles.tableHeader}>
                        Title
                        {sortField === "title" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" onClick={() => handleSort("authors")}>
                      <div className={styles.tableHeader}>
                        Authors
                        {sortField === "authors" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" onClick={() => handleSort("source")}>
                      <div className={styles.tableHeader}>
                        Source
                        {sortField === "source" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" onClick={() => handleSort("pubyear")}>
                      <div className={styles.tableHeader}>
                        Year
                        {sortField === "pubyear" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col">
                      <div className={styles.tableHeader}>SE Practice</div>
                    </th>
                    <th scope="col">
                      <div className={styles.tableHeader}>Claim</div>
                    </th>
                    <th scope="col" onClick={() => handleSort("createdAt")}>
                      <div className={styles.tableHeader}>
                        Added
                        {sortField === "createdAt" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((article) => (
                    <tr key={article.customId} className={styles.tableRow}>
                      <td className={styles.titleCell}>
                        <div className={styles.titleText}>{article.title}</div>
                        <div className={styles.idText}>
                          ID: {article.customId}
                        </div>
                      </td>
                      <td className={styles.authorCell}>{article.authors}</td>
                      <td className={styles.sourceCell}>{article.source}</td>
                      <td className={styles.yearCell}>{article.pubyear}</td>
                      <td className={styles.practiceCell}>
                        <span className={styles.chip}>{article.evidence}</span>
                      </td>
                      <td className={styles.claimCell}>{article.claim}</td>
                      <td className={styles.dateCell}>
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchArticles;
