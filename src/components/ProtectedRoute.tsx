import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container section-spacer text-center" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Loading authenticated session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="container section-spacer" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--color-peach-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <ShieldAlert size={32} color="var(--color-peach-dark)" />
            </div>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>Access Restricted</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
              This portal requires <strong>{allowedRoles.join(' or ')}</strong> role permissions. Your current role is <strong>{role}</strong>.
            </p>
            <div className="flex justify-center gap-3">
              <a href="/" className="btn btn-secondary">
                Return Home
              </a>
              {role === 'donor' && (
                <a href="/donor-dashboard" className="btn btn-primary">
                  Go to Donor Dashboard
                </a>
              )}
              {role === 'ngo' && (
                <a href="/ngo-dashboard" className="btn btn-primary">
                  Go to NGO Dashboard
                </a>
              )}
              {role === 'admin' && (
                <a href="/admin-dashboard" className="btn btn-primary">
                  Go to Admin Dashboard
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
