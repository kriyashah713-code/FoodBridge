import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Utensils,
  Croissant,
  ShoppingBag,
  Apple,
  Milk,
  Coffee,
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  Users,
  Award,
  PlusCircle,
  Search
} from 'lucide-react';
import { FoodDonation } from '../types';
import { getDonations } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const [recentDonations, setRecentDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDonations();
        // Show available ones first
        const available = data.filter((d) => d.status === 'available').slice(0, 3);
        setRecentDonations(available.length > 0 ? available : data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Cooked Meals', icon: Utensils, count: 'Hot & Ready', bg: 'var(--color-mint-light)', color: 'var(--color-dark-green)' },
    { name: 'Bakery & Bread', icon: Croissant, count: 'Breads & Loaves', bg: 'var(--color-peach-light)', color: 'var(--color-peach-dark)' },
    { name: 'Fruits & Vegetables', icon: Apple, count: 'Farm Fresh', bg: 'var(--color-mint-light)', color: 'var(--color-dark-green)' },
    { name: 'Raw Ingredients / Groceries', icon: ShoppingBag, count: 'Pantry Staples', bg: 'var(--color-lavender-light)', color: 'var(--color-lavender-dark)' },
    { name: 'Dairy Products', icon: Milk, count: 'Milk & Paneer', bg: 'var(--color-peach-light)', color: 'var(--color-peach-dark)' },
    { name: 'Beverages', icon: Coffee, count: 'Juices & Water', bg: 'var(--color-mint-light)', color: 'var(--color-dark-green)' }
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/available-food?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        padding: '64px 0 72px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 48,
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'var(--color-mint-light)',
                border: '1px solid var(--color-mint)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-dark-green)',
                marginBottom: 20
              }}>
                <HeartHandshake size={16} />
                <span>Zero Hunger • Zero Food Waste • Local Communities</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 4.5vw, 48px)',
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: '-1px',
                marginBottom: 20,
                color: 'var(--color-text-main)'
              }}>
                Bridge the Gap Between <span style={{ color: 'var(--color-dark-green)' }}>Surplus Food</span> and Empty Plates.
              </h1>

              <p style={{
                fontSize: 17,
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: '560px'
              }}>
                FoodBridge empowers restaurants, wedding caterers, supermarkets, and individuals to safely channel high-quality surplus meals directly to verified NGOs and local community shelters.
              </p>

              <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                <Link to="/donate-food" className="btn btn-primary btn-lg">
                  <PlusCircle size={18} />
                  <span>Donate Food</span>
                </Link>

                <Link to="/available-food" className="btn btn-secondary btn-lg">
                  <Search size={18} />
                  <span>Browse Available Food</span>
                </Link>

                {role === 'donor' && (
                  <Link to="/donor-dashboard" className="btn btn-mint btn-lg">
                    <span>Donor Portal</span>
                  </Link>
                )}

                {role === 'ngo' && (
                  <Link to="/ngo-dashboard" className="btn btn-mint btn-lg">
                    <span>NGO Portal</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6" style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--color-border-subtle)' }}>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <ShieldCheck size={18} color="var(--color-dark-green)" />
                  <span>FSSAI Hygiene Standards</span>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <Clock size={18} color="var(--color-dark-green)" />
                  <span>Real-Time Expiry Windows</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div>
              <div style={{
                backgroundColor: 'var(--color-mint-light)',
                border: '2px solid var(--color-mint)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: 18,
                  height: 260
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80"
                    alt="Volunteers sharing nutritious meals with community"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-dark-green)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    🥗 100% Edible Surplus Rescued
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 16,
                  border: '1px solid var(--color-border)'
                }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Quick Verification Checklist</span>
                    <span className="badge badge-mint">Active Verified</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} color="var(--color-dark-green)" />
                      <span>Donor logs preparation timestamp & safety window</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} color="var(--color-dark-green)" />
                      <span>Certified NGO submits pickup logistics request</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} color="var(--color-dark-green)" />
                      <span>Instant acceptance & safe handover verification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="section-spacer-sm" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-icon stat-icon-mint">
                <Utensils size={24} />
              </div>
              <div>
                <div className="stat-value">12,450+</div>
                <div className="stat-label">Meals Rescued</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-peach">
                <HeartHandshake size={24} />
              </div>
              <div>
                <div className="stat-value">185+</div>
                <div className="stat-label">Active Donors</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-lavender">
                <Users size={24} />
              </div>
              <div>
                <div className="stat-value">92+</div>
                <div className="stat-label">Partner NGOs</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                <Award size={24} />
              </div>
              <div>
                <div className="stat-value">18.6 Tons</div>
                <div className="stat-label">CO₂ Emissions Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Category Cards Section */}
      <section className="section-spacer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
            <div>
              <h2 className="section-title">Explore Food by Category</h2>
              <p className="section-subtitle">Click any category card to filter active surplus listings immediately</p>
            </div>
            <Link to="/available-food" className="btn btn-outline btn-sm">
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  title={`Filter food by ${cat.name}`}
                >
                  <div className="category-icon-wrapper">
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className="category-card-title">{cat.name}</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{cat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fresh Available Food Listings Preview */}
      <section className="section-spacer">
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-mint">Real-time Feed</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Fresh Surplus Ready for Pickup</h2>
              </div>
              <p className="section-subtitle" style={{ marginTop: 4 }}>
                Inspected items from local caterers, bakeries, and stores. Safe pickup windows active.
              </p>
            </div>
            <Link to="/available-food" className="btn btn-primary">
              <span>Explore All Available Food</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <p>Loading available donations...</p>
          ) : (
            <div className="grid grid-3">
              {recentDonations.map((item) => (
                <FoodCard key={item.id} donation={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-spacer" style={{ backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
            <span className="badge badge-lavender" style={{ marginBottom: 12 }}>Transparent Protocol</span>
            <h2 className="section-title">How FoodBridge Works</h2>
            <p className="section-subtitle">
              Designed as a streamlined, accountable bridge between donors and verified food rescue teams.
            </p>
          </div>

          <div className="grid grid-3">
            {/* Step 1 */}
            <div className="card" style={{ borderTop: '4px solid var(--color-mint-dark)' }}>
              <div className="card-body">
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-mint)',
                  color: 'var(--color-dark-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 16
                }}>
                  01
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>Donor Lists Surplus</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  A restaurant or event donor submits the food name, quantity, preparation timestamp, location, and the strict safe pickup deadline.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ borderTop: '4px solid var(--color-peach-dark)' }}>
              <div className="card-body">
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-peach)',
                  color: 'var(--color-peach-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 16
                }}>
                  02
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>NGO Requests Pickup</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Registered NGOs search available items by distance and category, selecting the required portion and estimated arrival window.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ borderTop: '4px solid var(--color-lavender-dark)' }}>
              <div className="card-body">
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-lavender)',
                  color: 'var(--color-lavender-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 16
                }}>
                  03
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>Acceptance & Delivery</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  The donor reviews and accepts the pickup. Direct contact information is unlocked for safe collection, distribution, and receipt logging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: 'var(--color-mint-light)',
        borderTop: '1px solid var(--color-mint)',
        padding: '56px 0'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 650 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: 12 }}>
            Ready to Prevent Food Waste in Your City?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 28 }}>
            Whether you manage a food business with daily excess or an NGO seeking nutritious meals for shelter residents, FoodBridge welcomes you.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Join as Donor or NGO
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Read Capstone Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
