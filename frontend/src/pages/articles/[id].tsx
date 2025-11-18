// frontend/src/pages/articles/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArticleRating from "../../components/ArticleRating";
import styles from "../../styles/ArticlesPage.module.scss";
import { useAuth } from "../../contexts/AuthContext";

interface Article {
  customId: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  averageRating?: number;
  userRating?: number;
}

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch article");

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 已认证的 Searcher 和 Analyst 用户都能评分
  const canRate =
    isAuthenticated && (user?.role === "Searcher" || user?.role === "Analyst");

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Article Details</h1>
        <p className={styles.pageSubtitle}>
          Detailed information about the article
        </p>
      </div>

      {/* 文章详情内容 */}
      <div className={styles.mainContent}>
        <div className={styles.articleDetailContainer}>
          {/* 文章标题和评分区域 */}
          <div className={styles.articleHeader}>
            <h2 className={styles.articleTitle}>{article.title}</h2>
            <div className={styles.articleRating}>
              <ArticleRating
                customId={article.customId}
                averageRating={article.averageRating}
                userRating={article.userRating}
                readonly={!canRate}
              />
            </div>
          </div>

          {/* 文章信息卡片 */}
          <div className={styles.articleInfoCard}>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Authors:</span>
                <span className={styles.infoValue}>
                  {article.authors || "N/A"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Source:</span>
                <span className={styles.infoValue}>
                  {article.source || "N/A"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Publication Year:</span>
                <span className={styles.infoValue}>
                  {article.pubyear || "N/A"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>DOI:</span>
                <span className={styles.infoValue}>
                  {article.doi ? (
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.doiLink}
                    >
                      {article.doi}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Claim:</span>
                <span className={styles.infoValue}>
                  {article.claim || "N/A"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Evidence:</span>
                <span className={styles.infoValue}>
                  {article.evidence || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className={styles.actionButtons}>
            <button
              className={styles.backButton}
              onClick={() => router.push("/articles")}
            >
              ← Back to Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
