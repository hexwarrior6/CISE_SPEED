import React from 'react';
import Head from 'next/head';
import SubmitterForm from '../components/SubmitterForm';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '../styles/SubmitPage.module.scss';

const SubmitPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push('/login');
    }
    // Check if user has submitter role
    // Note: This is a simple client-side check, real authorization should happen on the server
    if (!loading && user && user.role !== 'Submitter' && user.role !== 'Administrator') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Submit SE Evidence Article - CISE SPEED</title>
        <meta name="description" content="Submit a new SE Evidence article for review" />
      </Head>
      
      <main className={styles.submitPage}>
        <div className={styles.submitContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Submit SE Evidence Article</h1>
          </div>
          <div className={styles.formContainer}>
            <SubmitterForm />
          </div>
          <div className={styles.footer}>
            <p>Please fill in all required fields marked with an asterisk (*)</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SubmitPage;