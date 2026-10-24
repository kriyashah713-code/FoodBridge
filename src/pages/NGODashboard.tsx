import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Package,
  Award,
  ArrowRight
} from 'lucide-react';
import { FoodDonation, PickupRequest } from '../types';
import { getDonations, getPickupRequests, updatePickupRequestStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FoodCard } from '../components/FoodCard';

export const NGODashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [nearbySurplus, setNearbySurplus] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'explore'>('requests');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const myReqs = await getPickupRequests({
        ngo_id: user?.id || 'ngo-1'
      });
      setRequests(myReqs);

      const allDonations = await getDonations();
      // Show available ones
      const available = allDonations.filter((d) => d.status === 'available');
      setNearbySurplus(available.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancelRequest = async (reqId: string) => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
    setProcessingId(reqId);
    try {
      await updatePickupRequestStatus(reqId, 'cancelled');
      await loadData();
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkReceived = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      await updatePickupRequestStatus(reqId, 'completed', 'Food picked up and safely distributed by NGO');
      await loadData();
    } finally {
      setProcessingId(null);
    }
  };

  const activeCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const totalPortions = requests
    .filter((r) => r.status === 'accepted' || r.status === 'completed')
    .reduce((sum, r) => sum + r.quantity_requested, 0);

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Top Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-lavender">NGO Portal</span>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>NGO Food Rescue Dashboard</h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginTop: 4 }}>
              Logged in organization: <strong>{user?.organization_name || user?.full_name}</strong> ({user?.city || 'Local Chapter'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/available-food" className="btn btn-primary">
              <Search size={16} />
              <span>Browse All Available Food</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-icon stat-icon-peach">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-mint">
              <CheckCircle size={22} />
            </div>
            <div>
              <div className="stat-value">{acceptedCount}</div>
              <div className="stat-label">Pickups Confirmed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-lavender">
              <Package size={22} />
            </div>
            <div>
              <div className="stat-value">{totalPortions}</div>
              <div className="stat-label">Portions Rescued</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <Award size={22} />
            </div>
            <div>
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Completed Pickups</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <Clock size={16} />
            <span>My Pickup Requests ({requests.length})</span>
            {acceptedCount > 0 && (
              <span className="badge badge-available" style={{ marginLeft: 6, fontSize: 11 }}>
                {acceptedCount} Ready for Pickup!
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Building size={16} />
            <span>Urgent Nearby Surplus ({nearbySurplus.length})</span>
          </button>
        </div>

        {/* TAB 1: My Pickup Requests */}
        {activeTab === 'requests' && (
          <div>
            {requests.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
                <Clock size={32} color="var(--color-text-light)" style={{ margin: '0 auto 12px' }} />
                <h3>No Pickup Requests Submitted Yet</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 20 }}>
                  Browse our live feed of fresh surplus food and submit collection requests.
                </p>
                <Link to="/available-food" className="btn btn-primary">
                  Browse Available Food
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {requests.map((req) => {
                  const pickupTime = new Date(req.estimated_pickup_time);
                  const isAccepted = req.status === 'accepted';
                  return (
                    <div
                      key={req.id}
                      className="card"
                      style={{ borderLeft: isAccepted ? '5px solid var(--color-success)' : undefined }}
                    >
                      <div className="card-body">
                        <div className="flex items-center justify-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${
                              req.status === 'accepted'
                                ? 'badge-available'
                                : req.status === 'pending'
                                ? 'badge-requested'
                                : req.status === 'completed'
                                ? 'badge-completed'
                                : 'badge-expired'
                            }`}>
                              Status: {req.status.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--color-text-light)' }}>
                              Submitted {new Date(req.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dark-green)' }}>
                            Requested: {req.quantity_requested} {req.donation?.unit || 'units'}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                          <div>
                            <h3 style={{ fontSize: 18, marginBottom: 6 }}>
                              <Link to={`/food/${req.donation_id}`} style={{ color: 'var(--color-text-main)' }}>
                                {req.donation?.food_name || 'Food Donation Listing'}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                              <MapPin size={14} color="var(--color-dark-green)" />
                              <span>{req.donation?.location}, {req.donation?.city}</span>
                            </div>

                            {/* Donor Note / Acceptance Confirmation */}
                            {req.donor_note && (
                              <div style={{
                                backgroundColor: isAccepted ? 'var(--color-mint-light)' : '#F8FAFC',
                                border: `1px solid ${isAccepted ? 'var(--color-mint)' : '#E2E8F0'}`,
                                padding: 12,
                                borderRadius: 6,
                                marginTop: 10
                              }}>
                                <strong style={{ fontSize: 12, color: 'var(--color-dark-green)' }}>
                                  Message from Donor:
                                </strong>
                                <p style={{ fontSize: 13, marginTop: 4 }}>{req.donor_note}</p>
                              </div>
                            )}
                          </div>

                          {/* Pickup Timing & Logistics */}
                          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', paddingLeft: 16 }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                              <Calendar size={14} color="var(--color-dark-green)" />
                              <span><strong>Scheduled Time:</strong> {pickupTime.toLocaleDateString()} at {pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div style={{ marginBottom: 6 }}>
                              <strong>Designated Driver:</strong> {req.contact_person} ({req.contact_phone})
                            </div>

                            {/* Unlocked Donor Contact when accepted */}
                            {isAccepted && req.donation?.donor_phone && (
                              <div style={{
                                marginTop: 8,
                                padding: 8,
                                background: '#F0FDF4',
                                borderRadius: 6,
                                border: '1px solid #BBF7D0',
                                color: '#166534'
                              }}>
                                <strong>Direct Donor Phone:</strong> {req.donation.donor_phone}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                          {req.status === 'pending' && (
                            <button
                              className="btn btn-danger-outline btn-sm"
                              onClick={() => handleCancelRequest(req.id)}
                              disabled={processingId === req.id}
                            >
                              <XCircle size={14} />
                              <span>Cancel Request</span>
                            </button>
                          )}

                          {req.status === 'accepted' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleMarkReceived(req.id)}
                              disabled={processingId === req.id}
                            >
                              <CheckCircle size={14} />
                              <span>Confirm Food Picked Up</span>
                            </button>
                          )}

                          <Link to={`/food/${req.donation_id}`} className="btn btn-secondary btn-sm">
                            View Listing
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Nearby Surplus Explorer */}
        {activeTab === 'explore' && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Active donations currently ready for collection:
              </p>
              <Link to="/available-food" className="btn btn-outline btn-sm">
                <span>View All Listings</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-3">
              {nearbySurplus.map((item) => (
                <FoodCard key={item.id} donation={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
