import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect ke login, simpan halaman asal untuk redirect kembali setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
