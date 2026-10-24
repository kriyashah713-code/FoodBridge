import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, Shield, AlertCircle, HeartHandshake, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { signIn, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await signIn(email, password);
      if (res.success) {
        if (from !== '/') {
          navigate(from);
        } else if (email.includes('ngo')) {
          navigate('/ngo-dashboard');
        } else if (email.includes('admin')) {
          navigate('/admin-dashboard');
        } else {
          navigate('/donor-dashboard');
        }
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'donor') {
      setEmail('donor@foodbridge.org');
      setPassword('password123');
      navigate('/donor-dashboard');
    } else if (role === 'ngo') {
      setEmail('ngo@foodbridge.org');
      setPassword('password123');
      navigate('/ngo-dashboard');
    } else if (role === 'admin') {
      setEmail('admin@foodbridge.org');
      setPassword('password123');
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="section-spacer">
      <div className="container container-narrow">
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-dark-green)'
                }}
              >
                <LogIn size={16} />
              </div>
              <h2 style={{ fontSize: 20 }}>Welcome Back to FoodBridge</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Log in to manage your food donations or submit pickup requests.
            </p>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Switcher for Evaluation */}
            <div style={{
              backgroundColor: 'var(--color-mint-light)',
              border: '1px solid var(--color-mint)',
              borderRadius: 'var(--radius-sm)',
              padding: 12,
              marginBottom: 20
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-dark-green)', display: 'block', marginBottom: 8 }}>
                ⚡ One-Click Academic Demo Login:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => handleQuickDemo('donor')}
                >
                  Donor Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => handleQuickDemo('ngo')}
                >
                  NGO Demo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => handleQuickDemo('admin')}
                >
                  Admin Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="e.g. donor@foodbridge.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
                style={{ marginTop: 8 }}
              >
                {submitting ? 'Authenticating...' : 'Log In'}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>
              Don't have an account yet?{' '}
              <Link to="/signup" style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
