import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Heart, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await signUp({
        email,
        password,
        full_name: fullName,
        role,
        phone,
        organization_name: organizationName,
        address,
        city
      });

      if (res.success) {
        if (role === 'ngo') {
          navigate('/ngo-dashboard');
        } else {
          navigate('/donor-dashboard');
        }
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-spacer">
      <div className="container container-narrow">
        <div className="card" style={{ maxWidth: '580px', margin: '0 auto' }}>
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
                <UserPlus size={16} />
              </div>
              <h2 style={{ fontSize: 20 }}>Join the FoodBridge Network</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Register as a Food Donor or Certified NGO to begin rescuing meals.
            </p>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection Tabs */}
              <div className="form-group">
                <label className="form-label">I want to register as:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div
                    onClick={() => setRole('donor')}
                    style={{
                      border: `2px solid ${role === 'donor' ? 'var(--color-dark-green)' : 'var(--color-border)'}`,
                      backgroundColor: role === 'donor' ? 'var(--color-mint-light)' : 'var(--color-white)',
                      padding: 14,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ fontWeight: 700, color: 'var(--color-dark-green)' }}>
                      <Heart size={16} />
                      <span>Food Donor</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      Restaurant, Caterer, Supermarket, Individual
                    </span>
                  </div>

                  <div
                    onClick={() => setRole('ngo')}
                    style={{
                      border: `2px solid ${role === 'ngo' ? 'var(--color-dark-green)' : 'var(--color-border)'}`,
                      backgroundColor: role === 'ngo' ? 'var(--color-mint-light)' : 'var(--color-white)',
                      padding: 14,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ fontWeight: 700, color: 'var(--color-dark-green)' }}>
                      <Building size={16} />
                      <span>NGO / Charity</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      Shelter, Soup Kitchen, Relief Foundation
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Patel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone / Mobile *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="org">
                    {role === 'ngo' ? 'NGO / Organization Name *' : 'Business / Organization (Optional)'}
                  </label>
                  <input
                    id="org"
                    type="text"
                    className="form-input"
                    placeholder={role === 'ngo' ? 'e.g. Annapurna Trust' : 'e.g. City Banquet Hall'}
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required={role === 'ngo'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">
                    Physical Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="form-input"
                    placeholder="Street, locality, area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="pass">
                    Password *
                  </label>
                  <input
                    id="pass"
                    type="password"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cpass">
                    Confirm Password *
                  </label>
                  <input
                    id="cpass"
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
                style={{ marginTop: 12 }}
              >
                {submitting ? 'Registering Account...' : `Register as ${role === 'donor' ? 'Food Donor' : 'Partner NGO'}`}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
