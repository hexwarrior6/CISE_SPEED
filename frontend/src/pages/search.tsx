import React from 'react';
import Head from 'next/head';
import SearchArticles from '../components/SearchArticles';
import styles from '../styles/SearchPage.module.scss';

const SearchPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Search SE Evidence Articles - CISE SPEED</title>
        <meta name="description" content="Search through approved SE Evidence articles" />
      </Head>
      <main className={styles.searchPage}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Search SE Evidence Articles</h1>
          <p className={styles.pageSubtitle}>Find research articles related to software engineering practices</p>
        </div>

        <div className={styles.searchFormContainer}>
          <SearchArticles />
        </div>
      </main>
    </>
  );
};

export default SearchPage;