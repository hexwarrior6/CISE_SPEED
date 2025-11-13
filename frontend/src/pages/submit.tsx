import React from 'react';
import Head from 'next/head';
import SubmitterForm from '../components/SubmitterForm';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

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

      <main style={{ maxWidth: '750px', margin: '0 auto', padding: '0.5rem', background: '#f9fafb', minHeight: 'auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden' }}>
          {/* Page Header */}
          <div style={{ margin: 0, padding: '1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
              Submit SE Evidence Article
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              Fill in the details for your SE Evidence article submission
            </p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <SubmitterForm />

            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
              <p>Please fill in all required fields marked with an asterisk (*)</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SubmitPage;