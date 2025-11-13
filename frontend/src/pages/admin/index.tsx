// pages/admin/index.tsx
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types/user.types';
import Link from 'next/link';
import styles from '../../styles/AdminDashboard.module.scss';

const AdminDashboard = () => {
  const { user } = useAuth();

  // These would typically come from API calls
  const totalUsers = 24;
  const pendingArticles = 5;
  const totalArticles = 128;
  const activeUsers = 18;

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Administrator Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome, {user?.username}. You have administrative privileges.</p>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalUsers}</div>
            <div className={styles.statLabel}>Total Users</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{pendingArticles}</div>
            <div className={styles.statLabel}>Pending Articles</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalArticles}</div>
            <div className={styles.statLabel}>Total Articles</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{activeUsers}</div>
            <div className={styles.statLabel}>Active Users (7d)</div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>System Overview</h2>
          <p>Monitor and manage system performance and administrative tasks.</p>
        </div>

        {/* Admin Options Grid */}
        <div className={styles.dashboardGrid}>
          {/* User Management Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>User Management</h3>
            </div>
            <div className={styles.cardBody}>
              <p>Manage user accounts, roles, and permissions.</p>
              <Link href="/admin/users" className={`${styles.btn} ${styles.btnPrimary}`}>
                Manage Users
              </Link>
            </div>
          </div>

          {/* Article Moderation Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Article Moderation</h3>
            </div>
            <div className={styles.cardBody}>
              <p>Review pending articles and manage content approval process.</p>
              <Link href="/moderator" className={`${styles.btn} ${styles.btnPrimary}`}>
                Moderate Articles
              </Link>
            </div>
          </div>

          {/* System Settings Card */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>System Settings</h3>
            </div>
            <div className={styles.cardBody}>
              <p>Configure system-wide settings and manage application configuration.</p>
              <Link href="#" className={`${styles.btn} ${styles.btnPrimary}`} onClick={(e) => { e.preventDefault(); alert('Feature coming soon!'); }}>
                System Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className={styles.mainContent}>
          <h2 className={styles.sectionTitle}>Quick Links</h2>
          <div className={styles.adminOptions}>
            <ul className={styles.optionList}>
              <li className={styles.optionItem}>
                <Link href="/admin/users" className={styles.optionLink}>
                  <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Manage Users
                </Link>
              </li>
              <li className={styles.optionItem}>
                <Link href="/moderator" className={styles.optionLink}>
                  <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A1.5 1.5 0 003.5 16h9a1.5 1.5 0 001.5-1.5V4.804A7.968 7.968 0 009 4.804z" />
                    <path d="M5 6.5A1.5 1.5 0 016.5 5h3A1.5 1.5 0 0111 6.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 015 9.5v-3z" />
                  </svg>
                  Moderate Articles
                </Link>
              </li>
              <li className={styles.optionItem}>
                <Link href="#" className={styles.optionLink} onClick={(e) => { e.preventDefault(); alert('Feature coming soon!'); }}>
                  <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  System Analytics
                </Link>
              </li>
              <li className={styles.optionItem}>
                <Link href="#" className={styles.optionLink} onClick={(e) => { e.preventDefault(); alert('Feature coming soon!'); }}>
                  <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Security Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;