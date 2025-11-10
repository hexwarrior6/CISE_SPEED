// pages/admin/users.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types/user.types';
import { addAuthHeader } from '../../utils/auth.utils';

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
        alert('User role updated successfully');
      } else {
        const data = await response.json();
        alert(`Failed to update role: ${data.error || 'Unknown error'}`);
      }
    } catch {
        alert('Network error. Please try again.');
      }
  };

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (!currentUser || currentUser.role !== 'Administrator') {
    return <div className="container">Unauthorized: Administrator access required</div>;
  }

  return (
    <div className="container">
      <h1>Admin User Management</h1>
      <p>Manage user roles and permissions</p>
      
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
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
                    onClick={() => updateUserRole(user.id, user.role)}
                    className="btn btn-primary"
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;