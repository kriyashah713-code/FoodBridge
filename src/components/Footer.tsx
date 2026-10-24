import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Leaf, Shield, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: About FoodBridge */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
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
                <HeartHandshake size={18} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>FoodBridge</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#A9C9B7', marginBottom: 16 }}>
              Food Waste Reduction & Donation System — bridging surplus edible food from banquets, restaurants, and individuals with certified NGOs, community kitchens, and shelters.
            </p>
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--color-mint)' }}>
              <Leaf size={14} />
              <span>Aligned with UN SDG 2 (Zero Hunger) & SDG 12 (Responsible Consumption)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/available-food">Available Food</Link></li>
              <li><Link to="/donate-food">Donate Food</Link></li>
              <li><Link to="/donation-history">Donation History</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Role Dashboards */}
          <div>
            <h4 className="footer-title">Portals</h4>
            <ul className="footer-links">
              <li><Link to="/donor-dashboard">Donor Dashboard</Link></li>
              <li><Link to="/ngo-dashboard">NGO Dashboard</Link></li>
              <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/signup">Register as Partner</Link></li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 className="footer-title">Academic Capstone</h4>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#A9C9B7' }}>
              <p style={{ marginBottom: 8 }}>
                <strong>B.Tech Computer Engineering</strong><br />
                Third-Year Web Engineering Project
              </p>
              <div className="flex items-center gap-1" style={{ color: 'var(--color-peach)', fontSize: 12 }}>
                <Award size={14} />
                <span>React + Vite + TypeScript + Supabase</span>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: '#8CA899' }}>
                Built strictly to university technical standards with PostgreSQL RLS security.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodBridge System. Developed for Computer Engineering Academic Demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" style={{ fontSize: 12 }}>
              <Shield size={13} color="var(--color-mint)" /> Safe Food Handling Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
