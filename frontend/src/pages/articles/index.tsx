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
      <div className={styles.articlesPage}>
        <div className={styles.articlesContainerMain}>
          <div className={styles.header}>
            <h1 className={styles.title}>Articles Index</h1>
            <p className={styles.description}>Page containing a table of all articles in the database</p>
          </div>
          <div className={styles.content}>
            <div className={styles.loading}>Loading articles...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.articlesPage}>
      <div className={styles.articlesContainerMain}>
        <div className={styles.header}>
          <h1 className={styles.title}>Articles Index</h1>
          <p className={styles.description}>Page containing a table of all articles in the database</p>
        </div>
        <div className={styles.content}>
          {articles.length > 0 ? (
            <div className={styles.tableContainer}>
              <SortableTable 
                headers={headers} 
                data={articles} 
                tableClassName={styles.articlesTable}
                headerClassName={styles.articlesTableTh}
                cellClassName={styles.articlesTableTd}
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
            </div>
          ) : (
            <div className={styles.noResults}>No articles found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;