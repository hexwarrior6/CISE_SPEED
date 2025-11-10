// pages/admin/index.tsx
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { UserRole } from '../../types/user.types';
import Link from 'next/link';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMINISTRATOR]}>
      <div className="container">
        <h1>Administrator Dashboard</h1>
        <p>Welcome, {user?.username}. You have administrative privileges.</p>
        
        <div className="admin-options">
          <h2>Admin Options</h2>
          <ul>
            <li><Link href="/admin/users">Manage Users</Link></li>
            {/* Additional admin features can be added here */}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;