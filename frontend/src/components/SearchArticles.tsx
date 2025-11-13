import React, { useState, useEffect } from "react";
import { Article, EvidenceType, ArticleStatus } from "../types/article";
import styles from "../styles/SearchPage.module.scss";

// Enhanced search functionality with real-time suggestions

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

  return (
    <>
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
              className={styles.mainSearchInput}
              placeholder="Enter keywords to search across titles, authors, and claims..."
              aria-label="Search keywords"
            />
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

      {/* Results */}
      {error && (
        <div className={`${styles.message} ${styles.error}`}>{error}</div>
      )}

      {searchPerformed && !loading && !error && results.length === 0 && (
        <div className={styles.noResults}>
          <p>No results found matching your search criteria.</p>
          <p className={styles.textMuted}>
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {searchPerformed && results.length > 0 && (
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
      )}
    </>
  );
};

export default SearchArticles;
