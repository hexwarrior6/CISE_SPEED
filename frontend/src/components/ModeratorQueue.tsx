import React, { useState, useEffect } from "react";
import { Article, ReviewData } from "../types/article";
import styles from "../styles/ModeratorQueue.module.scss";

const ModeratorQueue: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    status: "Approved",
    reviewComment: "",
    isDuplicate: false,
    duplicateOf: "",
  });
  const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);
  const [duplicateCheckResults, setDuplicateCheckResults] = useState<Article[]>(
    []
  );
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "duplicate" | "normal"
  >("all");

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/moderator/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending articles");
      }

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const checkForDuplicates = async (doi: string, currentId?: string) => {
    if (!doi) return;

    setDuplicateCheckLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/check-duplicate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            doi,
            ...(currentId && { excludeId: currentId }) // Only include excludeId if currentId is provided
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check for duplicates");
      }

      const data = await response.json();
      setDuplicateCheckResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to check duplicates"
      );
    } finally {
      setDuplicateCheckLoading(false);
    }
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setReviewData({
      status: "Approved",
      reviewComment: "",
      isDuplicate: article.isDuplicate || false,
      duplicateOf: article.duplicateOf || "",
    });
    setReviewSuccess(null);
    setDuplicateCheckResults([]);
    checkForDuplicates(article.doi, article.customId);
  };

  const handleReviewSubmit = async () => {
    if (!selectedArticle) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${selectedArticle.customId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setReviewSuccess("Article reviewed successfully");
      setSelectedArticle(null);
      fetchPendingArticles();

      setTimeout(() => setReviewSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filterStatus === "duplicate") return article.isDuplicate;
    if (filterStatus === "normal") return !article.isDuplicate;
    return true;
  });

  const duplicateCount = articles.filter((a) => a.isDuplicate).length;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading pending articles...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Success/Error Messages */}
      {reviewSuccess && (
        <div className={styles.alertSuccess}>
          <svg
            className={styles.alertIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {reviewSuccess}
        </div>
      )}

      {error && (
        <div className={styles.alertError}>
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

      <div className={styles.mainContent}>
        {/* Sidebar with Queue and Stats */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Moderator Queue</h2>
            <p className={styles.pageSubtitle}>
              Review and approve pending articles
            </p>
          </div>

          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{articles.length}</div>
              <div className={styles.statLabel}>Total Pending</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>1</div>
              <div className={styles.statLabel}>Potential Duplicates</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{duplicateCount}</div>
              <div className={styles.statLabel}>New Articles</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{articles.length - duplicateCount}</div>
              <div className={styles.statLabel}>Remaining Articles</div>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Filters</h3>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === "all" ? styles.active : ""
                }`}
                onClick={() => setFilterStatus("all")}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === "normal" ? styles.active : ""
                }`}
                onClick={() => setFilterStatus("normal")}
              >
                New
              </button>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === "duplicate" ? styles.active : ""
                }`}
                onClick={() => setFilterStatus("duplicate")}
              >
                Duplicates
              </button>
            </div>
          </div>

          <div className={styles.articleList}>
            {filteredArticles.length === 0 ? (
              <div className={styles.emptyQueue}>
                <svg
                  className={styles.emptyIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No articles to review</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.customId}
                  className={`${styles.articleCard} ${
                    selectedArticle?.customId === article.customId
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleArticleSelect(article)}
                >
                  {article.isDuplicate && (
                    <div className={styles.duplicateBadge}>
                      <svg
                        className={styles.badgeIcon}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Duplicate
                    </div>
                  )}
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardAuthors}>{article.authors}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <svg
                        className={styles.metaIcon}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {new Date(
                        article.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                    <span className={styles.metaItem}>
                      <svg
                        className={styles.metaIcon}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {article.customId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Review Panel */}
        <div className={styles.reviewPanel}>
          {selectedArticle ? (
            <>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Article Review</h2>
                  <p className={styles.panelSubtitle}>
                    ID: {selectedArticle.customId}
                  </p>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={() => setSelectedArticle(null)}
                  title="Close"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.panelContent}>
                {/* Article Information */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Article Information</h3>
                  <table className={styles.infoTable}>
                    <tbody>
                      <tr>
                        <td>Title</td>
                        <td>{selectedArticle.title}</td>
                      </tr>
                      <tr>
                        <td>Authors</td>
                        <td>{selectedArticle.authors}</td>
                      </tr>
                      <tr>
                        <td>DOI</td>
                        <td className={styles.doi}>{selectedArticle.doi}</td>
                      </tr>
                      <tr>
                        <td>Source</td>
                        <td>{selectedArticle.source}</td>
                      </tr>
                      <tr>
                        <td>Year</td>
                        <td>{selectedArticle.pubyear}</td>
                      </tr>
                      <tr>
                        <td>Evidence Type</td>
                        <td>{selectedArticle.evidence}</td>
                      </tr>
                      <tr>
                        <td>Claim</td>
                        <td>{selectedArticle.claim}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Duplicate Check Section */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Duplicate Check</h3>
                    <button
                      onClick={() => checkForDuplicates(selectedArticle.doi, selectedArticle.customId)}
                      disabled={duplicateCheckLoading}
                      className={styles.checkBtn}
                    >
                      {duplicateCheckLoading ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Checking...
                        </>
                      ) : (
                        <>
                          <svg
                            className={styles.btnIcon}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Check for Duplicates
                        </>
                      )}
                    </button>
                  </div>

                  {selectedArticle.isDuplicate &&
                    selectedArticle.duplicateOf && (
                      <div className={styles.warningBox}>
                        <svg
                          className={styles.warningIcon}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <strong>Potential Duplicate Detected</strong>
                          <p>
                            This article may be a duplicate of:{" "}
                            {selectedArticle.duplicateOf}
                          </p>
                        </div>
                      </div>
                    )}

                  {duplicateCheckResults.length > 0 && (
                    <div className={styles.duplicatesFound}>
                      <p className={styles.duplicatesTitle}>
                        <svg
                          className={styles.infoIcon}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Found {duplicateCheckResults.length} potential
                        duplicate(s)
                      </p>
                      <div className={styles.duplicatesList}>
                        {duplicateCheckResults.map((duplicate) => (
                          <label
                            key={duplicate.customId}
                            className={styles.duplicateOption}
                          >
                            <input
                              type="radio"
                              name="duplicateChoice"
                              value={duplicate.customId}
                              checked={
                                reviewData.duplicateOf === duplicate.customId
                              }
                              onChange={() =>
                                setReviewData({
                                  ...reviewData,
                                  isDuplicate: true,
                                  duplicateOf: duplicate.customId,
                                })
                              }
                            />
                            <div className={styles.duplicateInfo}>
                              <span className={styles.duplicateTitle}>
                                {duplicate.title}
                              </span>
                              <span className={styles.duplicateId}>
                                ID: {duplicate.customId}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {duplicateCheckResults.length === 0 && !duplicateCheckLoading && selectedArticle && (
                    <div className={styles.noDuplicatesFound}>
                      <svg
                        className={styles.successIcon}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong>No Duplicates Found</strong>
                        <p>
                          This article appears to be original and not a duplicate of any existing articles.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Review Decision */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Review Decision</h3>

                  <div className={styles.reviewActions}>
                    <label
                      className={`${styles.actionCard} ${
                        reviewData.status === "Approved"
                          ? styles.actionSelected
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="Approved"
                        checked={reviewData.status === "Approved"}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            status: e.target.value as "Approved" | "Rejected",
                          })
                        }
                      />
                      <div className={styles.actionContent}>
                        <svg
                          className={styles.actionIcon}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <strong>Approve</strong>
                          <p>Accept and publish this article</p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`${styles.actionCard} ${
                        reviewData.status === "Rejected"
                          ? styles.actionSelected
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="Rejected"
                        checked={reviewData.status === "Rejected"}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            status: e.target.value as "Approved" | "Rejected",
                          })
                        }
                      />
                      <div className={styles.actionContent}>
                        <svg
                          className={styles.actionIcon}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <strong>Reject</strong>
                          <p>Decline this submission</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={reviewData.isDuplicate}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          isDuplicate: e.target.checked,
                        })
                      }
                    />
                    <span>Mark this article as a duplicate</span>
                  </label>

                  {reviewData.isDuplicate && !duplicateCheckResults.length && (
                    <div className={styles.inputGroup}>
                      <label>Duplicate of Article ID</label>
                      <input
                        type="text"
                        value={reviewData.duplicateOf}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            duplicateOf: e.target.value,
                          })
                        }
                        placeholder="Enter article ID"
                        className={styles.textInput}
                      />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label>Review Comments</label>
                    <textarea
                      value={reviewData.reviewComment}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          reviewComment: e.target.value,
                        })
                      }
                      rows={4}
                      className={styles.textarea}
                      placeholder="Add your review comments here (optional)"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className={styles.submitSection}>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={submittingReview}
                    className={styles.submitBtn}
                  >
                    {submittingReview ? (
                      <>
                        <div className={styles.buttonSpinner}></div>
                        Submitting Review...
                      </>
                    ) : (
                      <>
                        <svg
                          className={styles.btnIcon}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyReview}>
              <svg
                className={styles.emptyReviewIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3>No Article Selected</h3>
              <p>Select an article from the queue to begin reviewing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorQueue;
