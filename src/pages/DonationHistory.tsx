import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  Calendar,
  Package,
  Printer,
  Search,
  Filter,
  Award,
  Leaf
} from 'lucide-react';
import { FoodDonation } from '../types';
import { getDonations } from '../services/api';

export const DonationHistory: React.FC = () => {
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getDonations();
        setDonations(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = donations.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.food_name.toLowerCase().includes(q) ||
        d.donor_name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPortionsRescued = donations
    .filter((d) => d.status === 'completed' || d.status === 'claimed')
    .reduce((acc, curr) => acc + (curr.unit === 'servings' ? curr.quantity : curr.quantity * 2), 0);

  const estimatedCO2 = (totalPortionsRescued * 1.5).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-mint">Impact Archive</span>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Donation History & Ledger</h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginTop: 4 }}>
              Comprehensive immutable record of all surplus meals logged, requested, and distributed.
            </p>
          </div>

          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print Audit Ledger</span>
          </button>
        </div>

        {/* Environmental Impact Banner */}
        <div style={{
          backgroundColor: 'var(--color-mint-light)',
          border: '1px solid var(--color-mint)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          alignItems: 'center'
        }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark-green)' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-dark-green)' }}>{totalPortionsRescued}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Estimated Meals Saved</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-peach)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-peach-dark)' }}>
              <Leaf size={24} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-peach-dark)' }}>{estimatedCO2} kg</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Greenhouse Gases Prevented</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-lavender-dark)' }}>
              <History size={24} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-lavender-dark)' }}>{donations.length}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total Recorded Transactions</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body" style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter by food item, donor or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
                <Search size={16} color="var(--color-text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed / Distributed</option>
                <option value="claimed">Claimed by NGO</option>
                <option value="available">Active / Available</option>
                <option value="expired">Expired</option>
              </select>

              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Raw Ingredients / Groceries">Raw Ingredients / Groceries</option>
                <option value="Dairy Products">Dairy Products</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        {loading ? (
          <p>Loading history records...</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Logged Date</th>
                  <th>Food Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Donor Organization</th>
                  <th>Location</th>
                  <th>Final Status</th>
                  <th>Record Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const created = new Date(item.created_at);
                  return (
                    <tr key={item.id}>
                      <td style={{ fontSize: 13 }}>
                        {created.toLocaleDateString()}<br />
                        <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>
                          {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-text-main)' }}>{item.food_name}</strong>
                        <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>{item.dietary_type}</div>
                      </td>
                      <td><span className="badge badge-lavender">{item.category}</span></td>
                      <td><strong>{item.quantity}</strong> {item.unit}</td>
                      <td>{item.donor_name}</td>
                      <td>{item.city}</td>
                      <td>
                        <span className={`badge ${
                          item.status === 'completed'
                            ? 'badge-completed'
                            : item.status === 'claimed'
                            ? 'badge-claimed'
                            : item.status === 'available'
                            ? 'badge-available'
                            : 'badge-expired'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/food/${item.id}`} className="btn btn-secondary btn-sm">
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
