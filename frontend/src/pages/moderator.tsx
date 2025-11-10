import React from 'react';
import Head from 'next/head';
import ModeratorQueue from '../components/ModeratorQueue';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const ModeratorPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push('/login');
    }
    // Check if user has moderator role
    // Note: This is a simple client-side check, real authorization should happen on the server
    if (!loading && user && user.role !== 'Moderator' && user.role !== 'Administrator') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Moderator Queue - CISE SPEED</title>
        <meta name="description" content="Review and moderate submitted SE Evidence articles" />
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ModeratorQueue />
        </div>
      </main>
    </>
  );
};

export default ModeratorPage;