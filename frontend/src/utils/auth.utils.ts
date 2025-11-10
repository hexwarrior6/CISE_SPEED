// utils/auth.utils.ts

// Utility function to get the authentication token from localStorage
export const getAuthToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
};

// Utility function to get the current user from localStorage
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Utility function to add auth headers to fetch requests
export const addAuthHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getAuthToken();
  return {
    ...headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};