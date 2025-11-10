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
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <SubmitterForm />
        </div>
      </main>
    </>
  );
};

export default SubmitPage;