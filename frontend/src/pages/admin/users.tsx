// pages/admin/users.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types/user.types';
import { addAuthHeader } from '../../utils/auth.utils';
import styles from '../../styles/AdminUsers.module.scss';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Administrator') {
      // Redirect to login or show unauthorized message
      window.location.href = '/login';
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
          method: 'GET',
          headers: addAuthHeader(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: (Partial<User> & { _id?: string })[] = await response.json();
        // Ensure each user has an id field based on _id if it doesn't exist
        const usersWithId = data.map((user) => ({
          ...user,
          id: user._id || user.id || '', // Use _id if id doesn't exist
        }));
        setUsers(usersWithId as User[]);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: addAuthHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Update the local state to reflect the change
        setUsers(users.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        ));
      } else {
        const data = await response.json();
        setError(`Failed to update role: ${data.error || 'Unknown error'}`);
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'Administrator') {
    return (
      <div className={styles.container}>
        <div className={styles.alertError}>
          <svg
            className={styles.alertIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          Unauthorized: Administrator access required
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Error Message */}
      {error && (
        <div className={styles.alertError}>
          <svg
            className={styles.alertIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Admin User Management</h1>
        <p className={styles.pageSubtitle}>Manage user roles and permissions</p>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.length}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.filter(u => u.role === 'Moderator').length}</div>
          <div className={styles.statLabel}>Moderators</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.filter(u => u.role === 'Administrator').length}</div>
          <div className={styles.statLabel}>Administrators</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.filter(u => u.role === 'Submitter').length}</div>
          <div className={styles.statLabel}>Submitters</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <h3>No users found</h3>
                      <p>There are currently no users in the system.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className={styles.selectInput}
                      >
                        <option value={UserRole.SUBMITTER}>Submitter</option>
                        <option value={UserRole.MODERATOR}>Moderator</option>
                        <option value={UserRole.ANALYST}>Analyst</option>
                        <option value={UserRole.SEARCHER}>Searcher</option>
                        <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                      </select>
                    </td>
                    <td>
                      {user.id !== currentUser.id && ( // Don't allow changing own role
                        <button
                          onClick={() => updateUserRole(user.id, user.role as UserRole)}
                          className={`${styles.btn} ${styles.btnSuccess}`}
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;