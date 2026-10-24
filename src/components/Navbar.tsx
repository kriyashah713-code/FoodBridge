import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  HeartHandshake,
  PlusCircle,
  Database,
  LogOut,
  User,
  ShieldCheck,
  Building,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupabaseNoticeModal } from './SupabaseNoticeModal';

export const Navbar: React.FC = () => {
  const { user, role, signOut, switchDemoRole, isSupabaseActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: 'var(--color-mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-dark-green)'
            }}>
              <HeartHandshake size={22} />
            </div>
            <div>
              <span className="navbar-brand-text">FoodBridge</span>
              <span className="navbar-brand-tagline">Waste Reduction & Donation</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/available-food" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Available Food
            </NavLink>

            <NavLink to="/donate-food" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              <span className="flex items-center gap-1">
                <PlusCircle size={15} />
                Donate Food
              </span>
            </NavLink>

            {/* Role specific dashboard links */}
            {role === 'donor' && (
              <NavLink to="/donor-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Donor Dashboard
              </NavLink>
            )}

            {role === 'ngo' && (
              <NavLink to="/ngo-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                NGO Dashboard
              </NavLink>
            )}

            {role === 'admin' && (
              <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                Admin Dashboard
              </NavLink>
            )}

            <NavLink to="/donation-history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Donation History
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              About Us
            </NavLink>

            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Contact Us
            </NavLink>
          </nav>

          {/* User & Actions */}
          <div className="navbar-actions">
            {/* Supabase status badge */}
            <button
              onClick={() => setModalOpen(true)}
              title="Click to view Database Connection instructions"
              className="badge"
              style={{
                backgroundColor: isSupabaseActive ? 'var(--color-success-light)' : 'var(--color-lavender)',
                color: isSupabaseActive ? 'var(--color-success)' : 'var(--color-lavender-dark)',
                cursor: 'pointer',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Database size={13} />
              <span style={{ fontSize: 11 }}>{isSupabaseActive ? 'Supabase Live' : 'Supabase Setup'}</span>
            </button>

            {/* Role Quick Switcher */}
            <div className="role-switcher" title="Quickly switch roles for academic grading & evaluation">
              <span style={{ fontSize: 11, color: 'var(--color-text-light)', marginLeft: 4 }}>Role:</span>
              <button
                className={`role-switcher-btn ${role === 'donor' ? 'active' : ''}`}
                onClick={() => switchDemoRole('donor')}
                title="Switch to Donor role"
              >
                Donor
              </button>
              <button
                className={`role-switcher-btn ${role === 'ngo' ? 'active' : ''}`}
                onClick={() => switchDemoRole('ngo')}
                title="Switch to NGO role"
              >
                NGO
              </button>
              <button
                className={`role-switcher-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => switchDemoRole('admin')}
                title="Switch to Admin role"
              >
                Admin
              </button>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <span
                  className="badge badge-mint"
                  style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                  title={user.email}
                >
                  {role === 'admin' ? <ShieldCheck size={13} /> : role === 'ngo' ? <Building size={13} /> : <Heart size={13} />}
                  {user.full_name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Log out"
                  style={{ padding: '6px 10px' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Supabase Notice Modal */}
      <SupabaseNoticeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
