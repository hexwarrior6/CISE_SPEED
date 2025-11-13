import { NextPage } from "next";
import { useEffect, useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import { Article } from "../../types/article.types";
import styles from '../../styles/ArticlesPage.module.scss';

const Articles: NextPage<{ initialArticles?: Article[] }> = ({ initialArticles }) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [loading, setLoading] = useState(!initialArticles);

  // 只在组件首次挂载且无初始数据时获取
  useEffect(() => {
    if (!initialArticles) {
      const fetchArticles = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`);
          if (!res.ok) throw new Error('Failed to fetch articles');
          const data = await res.json();

          // 映射后端数据到前端 Article 类型
          const mappedArticles = data.map((item: Article) => ({
            id: item.customId,
            title: item.title,
            authors: item.authors,
            source: item.source,
            pubyear: item.pubyear,
            doi: item.doi,
            claim: item.claim,
            evidence: item.evidence,
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
  const uniqueAuthors = Array.from(new Set(articles.flatMap(article => article.authors || []))).length;
  const uniqueSources = Array.from(new Set(articles.map(article => article.source))).length;
  const years = articles
    .map(article => article.pubyear)
    .filter(year => year) // Filter out null/undefined/empty years
    .map(year => parseInt(year)) // Convert to number
    .filter(year => !isNaN(year)); // Filter out NaN values
  const minYear = years.length > 0 ? Math.min(...years) : 0;
  const maxYear = years.length > 0 ? Math.max(...years) : 0;

  const headers: { key: string; label: string }[] = [
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

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Articles Index</h1>
        <p className={styles.pageSubtitle}>Page containing a table of all articles in the database</p>
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
          <div className={styles.statValue}>{minYear && maxYear ? `${minYear}-${maxYear}` : 'N/A'}</div>
          <div className={styles.statLabel}>Year Range</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.tableContainer}>
          {articles.length > 0 ? (
            <SortableTable
              headers={headers}
              data={articles}
              tableClassName={styles.table}
              headerClassName={styles.tableTh}
              cellClassName={styles.tableTd}
              customCellClasses={{
                tableHeader: styles.tableHeader,
                titleCell: styles.titleCell,
                authorCell: styles.authorCell,
                sourceCell: styles.sourceCell,
                yearCell: styles.yearCell,
                claimCell: styles.claimCell,
                evidenceCell: styles.evidenceCell
              }}
            />
          ) : (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3>No articles found</h3>
              <p>There are currently no articles in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;