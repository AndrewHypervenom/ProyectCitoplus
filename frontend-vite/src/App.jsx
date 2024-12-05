import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserManagement from './components/UserManagement';
import VisitorList from './components/VisitorList';
import { AuthContext } from './context/AuthContext';
import ComingSoon from './pages/ComingSoon';

// Patron de diseño para rutas protegidas (HOC)
// Verifica auth y roles
function PrivateRoute({ children, requiredRole }) {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Redirección según rol
  if (requiredRole && user?.rol !== requiredRole) {
    return user?.rol === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />;
  }

  return children;
}

// Router principal
export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas para Admin */}
      <Route path="/admin" element={
        <PrivateRoute requiredRole="admin">
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/users" element={
        <PrivateRoute requiredRole="admin">
          <UserManagement />
        </PrivateRoute>
      } />
      <Route path="/admin/visitors" element={
        <PrivateRoute requiredRole="admin">
          <VisitorList />
        </PrivateRoute>
      } />
      
      {/* Rutas para Usuario Normal */}
      <Route path="/user" element={
        <PrivateRoute requiredRole="usuario">
          <UserDashboard />
        </PrivateRoute>
      } />
      <Route path="/user/visitors" element={
        <PrivateRoute requiredRole="usuario">
          <VisitorList />
        </PrivateRoute>
      } />

      <Route path="/user/profile" element={
        <PrivateRoute requiredRole="usuario">
          <ComingSoon />
        </PrivateRoute>
      } />
      <Route path="/user/calendar" element={
        <PrivateRoute requiredRole="usuario">
          <ComingSoon />
        </PrivateRoute>
      } />

      {/* Ruta por defecto o fallback*/}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}