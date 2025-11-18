// frontend/src/pages/user/ratings.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/ArticlesPage.module.scss";
import { useAuth } from "../contexts/AuthContext";
import ArticleRating from "../components/ArticleRating";

interface RatedArticle {
  customId: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  userRating: number;
  averageRating?: number;
}

const UserRatingsPage = () => {
  const [ratedArticles, setRatedArticles] = useState<RatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已认证
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchRatedArticles = async () => {
      try {
        // 获取用户评分历史的API端点（需要后端实现）
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}/ratings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch ratings");

        const data = await response.json();
        setRatedArticles(data);
      } catch (err) {
        console.error("Error fetching rated articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatedArticles();
  }, [isAuthenticated, router, user?.id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Ratings</h1>
        <p className={styles.pageSubtitle}>Articles you have rated</p>
      </div>

      <div className={styles.mainContent}>
        {ratedArticles.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableTh}>Title</th>
                  <th className={styles.tableTh}>Authors</th>
                  <th className={styles.tableTh}>Source</th>
                  <th className={styles.tableTh}>Year</th>
                  <th className={styles.tableTh}>Your Rating</th>
                  <th className={styles.tableTh}>Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {ratedArticles.map((article) => (
                  <tr key={article.customId}>
                    <td className={styles.tableTd}>
                      <a href={`/articles/${article.customId}`}>
                        {article.title}
                      </a>
                    </td>
                    <td className={styles.tableTd}>
                      {article.authors?.join(", ") || "N/A"}
                    </td>
                    <td className={styles.tableTd}>
                      {article.source || "N/A"}
                    </td>
                    <td className={styles.tableTd}>
                      {article.pubyear || "N/A"}
                    </td>
                    <td className={styles.tableTd}>
                      <ArticleRating
                        customId={article.customId}
                        userRating={article.userRating}
                        readonly={true}
                      />
                    </td>
                    <td className={styles.tableTd}>
                      <ArticleRating
                        customId={article.customId}
                        averageRating={article.averageRating}
                        readonly={true}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven&apos;t rated any articles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRatingsPage;
