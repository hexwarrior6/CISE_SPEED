import React, { useState, useEffect } from 'react';
import { Article, ReviewData } from '../types/article';

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
    return <div className="text-center p-8">Loading pending articles...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Moderator Queue</h1>

      {reviewSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {reviewSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Pending Articles ({articles.length})</h2>
            
            {articles.length === 0 ? (
              <p className="text-gray-500">No pending articles</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {articles.map((article) => (
                  <div
                    key={article.customId}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${selectedArticle?.customId === article.customId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                    onClick={() => handleArticleSelect(article)}
                  >
                    <div className="font-medium text-gray-900 truncate">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.authors}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(article.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    {article.isDuplicate && (
                      <div className="text-xs text-amber-600 mt-1">Potential duplicate</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Details and Review Form */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Article Details</h2>
              
              <div className="mb-6 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ID</h3>
                    <p>{selectedArticle.customId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">DOI</h3>
                    <p>{selectedArticle.doi}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <h3 className="text-lg font-medium">{selectedArticle.title}</h3>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Authors</h3>
                  <p>{selectedArticle.authors}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Source</h3>
                    <p>{selectedArticle.source}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Publication Year</h3>
                    <p>{selectedArticle.pubyear}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Evidence Type</h3>
                  <p>{selectedArticle.evidence}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Claim</h3>
                  <p className="whitespace-pre-line">{selectedArticle.claim}</p>
                </div>
                
                {selectedArticle.isDuplicate && selectedArticle.duplicateOf && (
                  <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                    <h3 className="text-sm font-medium text-amber-800">Potential Duplicate</h3>
                    <p className="text-sm text-amber-700">Duplicate of article ID: {selectedArticle.duplicateOf}</p>
                  </div>
                )}
              </div>

              <hr className="my-6" />

              <h2 className="text-xl font-semibold mb-4">Review Article</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Action</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Approved"
                        checked={reviewData.status === 'Approved'}
                        onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'Approved' | 'Rejected' })}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Approve</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Rejected"
                        checked={reviewData.status === 'Rejected'}
                        onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'Approved' | 'Rejected' })}
                        className="h-4 w-4 text-red-600"
                      />
                      <span className="ml-2 text-gray-700">Reject</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Mark as Duplicate
                    </label>
                    <button
                      type="button"
                      onClick={() => selectedArticle && checkForDuplicates(selectedArticle.doi)}
                      disabled={duplicateCheckLoading}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {duplicateCheckLoading ? 'Checking...' : 'Check DOI for Duplicates'}
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={reviewData.isDuplicate}
                    onChange={(e) => setReviewData({ ...reviewData, isDuplicate: e.target.checked })}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>

                {duplicateCheckResults.length > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">Potential Duplicates Found:</h4>
                    <ul className="space-y-2">
                      {duplicateCheckResults.map(duplicate => (
                        <li key={duplicate.customId} className="text-sm">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="duplicateChoice"
                              value={duplicate.customId}
                              onChange={() => setReviewData({ 
                                ...reviewData, 
                                isDuplicate: true, 
                                duplicateOf: duplicate.customId 
                              })}
                              className="h-4 w-4 text-blue-600 mr-2"
                            />
                            <div>
                              <span className="font-medium">{duplicate.title}</span>
                              <span className="text-gray-500 ml-2">({duplicate.customId})</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reviewData.isDuplicate && !duplicateCheckResults.length && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duplicate of Article ID
                    </label>
                    <input
                      type="text"
                      value={reviewData.duplicateOf}
                      onChange={(e) => setReviewData({ ...reviewData, duplicateOf: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Enter article ID"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Comments</label>
                  <textarea
                    value={reviewData.reviewComment}
                    onChange={(e) => setReviewData({ ...reviewData, reviewComment: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Add your review comments here"
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={submittingReview}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Select an article from the queue to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorQueue;