// frontend/src/pages/articles/index.tsx
// frontend/src/pages/articles/index.tsx
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import { Article } from "../../types/article.types";
import styles from "../../styles/ArticlesPage.module.scss";
import ArticleRating from "../../components/ArticleRating";
import { useAuth } from "../../contexts/AuthContext";

const Articles: NextPage<{ initialArticles?: Article[] }> = ({
  initialArticles,
}) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [loading, setLoading] = useState(!initialArticles);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!initialArticles) {
      const fetchArticles = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`,
          );
          if (!res.ok) throw new Error("Failed to fetch articles");
          const data = await res.json();

          // 映射后端数据到前端 Article 类型
          const mappedArticles = data.map((item: Article) => ({
            customId: item.customId,
            title: item.title,
            authors: item.authors,
            source: item.source,
            pubyear: item.pubyear,
            doi: item.doi,
            claim: item.claim,
            evidence: item.evidence,
            averageRating: item.averageRating,
          }));

          setArticles(mappedArticles);
        } catch (error) {
          console.error("Error fetching articles:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchArticles();
    }
  }, [initialArticles]);

  // Calculate stats for the stats bar
  const totalArticles = articles.length;
  const uniqueAuthors = Array.from(
    new Set(articles.flatMap((article) => article.authors || [])),
  ).length;
  const uniqueSources = Array.from(
    new Set(articles.map((article) => article.source)),
  ).length;
  const years = articles
    .map((article) => article.pubyear)
    .filter((year) => year) // Filter out null/undefined/empty years
    .map((year) => parseInt(year)) // Convert to number
    .filter((year) => !isNaN(year)); // Filter out NaN values
  const minYear = years.length > 0 ? Math.min(...years) : 0;
  const maxYear = years.length > 0 ? Math.max(...years) : 0;

  // 根据用户角色决定是否显示评分列
  const showRatingColumn =
    isAuthenticated && (user?.role === "Searcher" || user?.role === "Analyst");

  const headers: { key: string; label: string }[] = [
    // 只有Searcher和Analyst用户才显示评分列
    ...(showRatingColumn
      ? [{ key: "rating", label: "Rating(click to rate)" }]
      : []),

    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  // 修改表格数据显示，有条件地添加评分组件
  const articlesWithRatings = articles.map((article) => ({
    ...article,
    // 只有Searcher用户才添加评分组件
    ...(showRatingColumn && {
      rating: (
        <ArticleRating
          customId={article.customId}
          averageRating={article.averageRating}
          readonly={true}
        />
      ),
    }),
  }));

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Articles Index</h1>
        <p className={styles.pageSubtitle}>
          Page containing a table of all articles in the database
        </p>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalArticles}</div>
          <div className={styles.statLabel}>Total Articles</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{uniqueAuthors}</div>
          <div className={styles.statLabel}>Unique Authors</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{uniqueSources}</div>
          <div className={styles.statLabel}>Unique Sources</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {minYear && maxYear ? `${minYear}-${maxYear}` : "N/A"}
          </div>
          <div className={styles.statLabel}>Year Range</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.tableContainer}>
          {articles.length > 0 ? (
            <SortableTable
              headers={headers}
              data={showRatingColumn ? articlesWithRatings : articles}
              tableClassName={styles.table}
              headerClassName={styles.tableTh}
              cellClassName={styles.tableTd}
              customCellClasses={{
                tableHeader: styles.tableHeader,
                titleCell: styles.titleCell,
                authorCell: styles.authorCell,
                sourceCell: styles.sourceCell,
              }}
            />
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
