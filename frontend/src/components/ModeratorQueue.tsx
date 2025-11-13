import React, { useState, useEffect } from 'react';
import { Article, ReviewData } from '../types/article';
import styles from '../styles/ModeratorQueue.module.scss';

const ModeratorQueue: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    status: 'Approved',
    reviewComment: '',
    isDuplicate: false,
    duplicateOf: '',
  });
  const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);
  const [duplicateCheckResults, setDuplicateCheckResults] = useState<Article[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Fetch pending articles
  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/moderator/pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending articles');
      }

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const checkForDuplicates = async (doi: string) => {
    if (!doi) return;

    setDuplicateCheckLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/check-duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ doi }),
      });

      if (!response.ok) {
        throw new Error('Failed to check for duplicates');
      }

      const data = await response.json();
      setDuplicateCheckResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check duplicates');
    } finally {
      setDuplicateCheckLoading(false);
    }
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setReviewData({
      status: 'Approved',
      reviewComment: '',
      isDuplicate: article.isDuplicate || false,
      duplicateOf: article.duplicateOf || '',
    });
    setReviewSuccess(null);
    setDuplicateCheckResults([]);

    // Automatically check for duplicates when an article is selected
    checkForDuplicates(article.doi);
  };

  const handleReviewSubmit = async () => {
    if (!selectedArticle) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${selectedArticle.customId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setReviewSuccess('Article reviewed successfully');
      setSelectedArticle(null);
      // Refresh the list
      fetchPendingArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className={styles.emptyState}>Loading pending articles...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.message} ${styles.error}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Moderator Queue</h1>
      </div>

      {reviewSuccess && (
        <div className={`${styles.message} ${styles.success}`}>
          {reviewSuccess}
        </div>
      )}

      <div className={styles.queueContainer}>
        {/* Queue List */}
        <div className={styles.queueSection}>
          <div className={styles.queueHeader}>
            <h2>Pending Articles ({articles.length})</h2>
          </div>

          <div className={styles.queueList}>
            {articles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending articles</p>
            ) : (
              <div className="space-y-2">
                {articles.map((article) => (
                  <div
                    key={article.customId}
                    className={`${styles.queueItem} ${selectedArticle?.customId === article.customId ? styles.selected : ''}`}
                    onClick={() => handleArticleSelect(article)}
                  >
                    <div className={styles.title}>{article.title}</div>
                    <div className={styles.authors}>{article.authors}</div>
                    <div className={styles.date}>
                      Submitted: {new Date(article.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    {article.isDuplicate && (
                      <div className={styles.duplicateWarning}>Potential duplicate</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Details and Review Form */}
        <div className={styles.articleDetails}>
          {selectedArticle ? (
            <>
              <div className={styles.articleHeader}>
                <h2>Article Details</h2>
              </div>

              <div className={styles.articleContent}>
                <div className={styles.articleInfoGrid}>
                  <div className={styles.infoGroup}>
                    <div className={styles.label}>ID</div>
                    <div className={styles.value}>{selectedArticle.customId}</div>
                  </div>
                  <div className={styles.infoGroup}>
                    <div className={styles.label}>DOI</div>
                    <div className={styles.value}>{selectedArticle.doi}</div>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}>Title</div>
                  <div className={styles.value}>{selectedArticle.title}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}>Authors</div>
                  <div className={styles.value}>{selectedArticle.authors}</div>
                </div>

                <div className={styles.articleInfoGrid}>
                  <div className={styles.infoGroup}>
                    <div className={styles.label}>Source</div>
                    <div className={styles.value}>{selectedArticle.source}</div>
                  </div>
                  <div className={styles.infoGroup}>
                    <div className={styles.label}>Publication Year</div>
                    <div className={styles.value}>{selectedArticle.pubyear}</div>
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}>Evidence Type</div>
                  <div className={styles.value}>{selectedArticle.evidence}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}>Claim</div>
                  <div className={styles.value}>{selectedArticle.claim}</div>
                </div>

                {selectedArticle.isDuplicate && selectedArticle.duplicateOf && (
                  <div className={styles.duplicateWarningBox}>
                    <div className={styles.warningTitle}>Potential Duplicate</div>
                    <div className={styles.warningText}>Duplicate of article ID: {selectedArticle.duplicateOf}</div>
                  </div>
                )}

                <div className={styles.reviewSection}>
                  <h2 className={styles.reviewHeader}>Review Article</h2>

                  <div className={styles.reviewForm}>
                    <div>
                      <label className={styles.label}>Review Action</label>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioOption}>
                          <input
                            type="radio"
                            name="status"
                            value="Approved"
                            checked={reviewData.status === 'Approved'}
                            onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'Approved' | 'Rejected' })}
                          />
                          <span>Approve</span>
                        </label>
                        <label className={styles.radioOption}>
                          <input
                            type="radio"
                            name="status"
                            value="Rejected"
                            checked={reviewData.status === 'Rejected'}
                            onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'Approved' | 'Rejected' })}
                          />
                          <span>Reject</span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={reviewData.isDuplicate}
                          onChange={(e) => setReviewData({ ...reviewData, isDuplicate: e.target.checked })}
                        />
                        Mark as Duplicate
                      </label>
                      <button
                        type="button"
                        onClick={() => selectedArticle && checkForDuplicates(selectedArticle.doi)}
                        disabled={duplicateCheckLoading}
                        className={styles.checkButton}
                      >
                        {duplicateCheckLoading ? 'Checking...' : 'Check DOI for Duplicates'}
                      </button>
                    </div>

                    {duplicateCheckResults.length > 0 && (
                      <div className={styles.duplicateResults}>
                        <h4 className={styles.resultsHeader}>Potential Duplicates Found:</h4>
                        <ul className={styles.duplicateList}>
                          {duplicateCheckResults.map(duplicate => (
                            <li key={duplicate.customId} className={styles.duplicateItem}>
                              <input
                                type="radio"
                                name="duplicateChoice"
                                value={duplicate.customId}
                                onChange={() => setReviewData({
                                  ...reviewData,
                                  isDuplicate: true,
                                  duplicateOf: duplicate.customId
                                })}
                              />
                              <span className={styles.duplicateTitle}>{duplicate.title}</span>
                              <span className={styles.duplicateId}>({duplicate.customId})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reviewData.isDuplicate && !duplicateCheckResults.length && (
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Duplicate of Article ID
                        </label>
                        <input
                          type="text"
                          value={reviewData.duplicateOf}
                          onChange={(e) => setReviewData({ ...reviewData, duplicateOf: e.target.value })}
                          className={styles.input}
                          placeholder="Enter article ID"
                        />
                      </div>
                    )}

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Review Comments</label>
                      <textarea
                        value={reviewData.reviewComment}
                        onChange={(e) => setReviewData({ ...reviewData, reviewComment: e.target.value })}
                        rows={4}
                        className={styles.textarea}
                        placeholder="Add your review comments here"
                      />
                    </div>

                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className={`${styles.button} ${styles.cancelButton}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReviewSubmit}
                        disabled={submittingReview}
                        className={`${styles.button} ${styles.submitButton}`}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select an article from the queue to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorQueue;