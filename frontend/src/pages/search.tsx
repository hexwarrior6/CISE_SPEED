import React from 'react';
import Head from 'next/head';
import SearchArticles from '../components/SearchArticles';

const SearchPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Search SE Evidence Articles - CISE SPEED</title>
        <meta name="description" content="Search through approved SE Evidence articles" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <SearchArticles />
        </div>
      </main>
    </>
  );
};

export default SearchPage;