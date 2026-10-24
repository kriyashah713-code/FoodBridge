import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Calendar,
  AlertCircle,
  Users,
  Award,
  Filter
} from 'lucide-react';
import { FoodDonation, PickupRequest } from '../types';
import { getDonations, getPickupRequests, updatePickupRequestStatus, updateDonation } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'donations'>('requests');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Accept modal state
  const [modalRequest, setModalRequest] = useState<PickupRequest | null>(null);
  const [donorNote, setDonorNote] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const allDonations = await getDonations();
      // Filter by donor_id or demo donor
      const donorItems = allDonations.filter(
        (d) => d.donor_id === user?.id || d.donor_id === 'donor-1' || d.donor_id === 'demo-donor'
      );
      setDonations(donorItems);

      const allReqs = await getPickupRequests({
        donor_id: user?.id || 'donor-1'
      });
      setRequests(allReqs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleAccept = async (req: PickupRequest) => {
    setProcessingId(req.id);
    try {
      await updatePickupRequestStatus(req.id, 'accepted', donorNote || 'Approved! Safe pickup confirmed.');
      setModalRequest(null);
      setDonorNote('');
      await loadDashboardData();
    } catch (err) {
      alert('Failed to accept request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reqId: string) => {
    const reason = window.prompt('Optional rejection reason for NGO:', 'Quantity no longer available');
    if (reason === null) return;
    setProcessingId(reqId);
    try {
      await updatePickupRequestStatus(reqId, 'rejected', reason);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkCompleted = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      await updatePickupRequestStatus(reqId, 'completed', 'Food collected successfully');
      await loadDashboardData();
    } catch (err) {
      alert('Failed to mark completed');
    } finally {
      setProcessingId(null);
    }
  };

  // Stats calculation
  const totalListed = donations.length;
  const activeCount = donations.filter((d) => d.status === 'available').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;
  const completedCount = donations.filter((d) => d.status === 'completed' || d.status === 'claimed').length;

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Top Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-mint">Donor Operations</span>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Donor Dashboard</h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginTop: 4 }}>
              Logged in as: <strong>{user?.full_name}</strong> {user?.organization_name && `(${user.organization_name})`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/donate-food" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Donate More Surplus</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-icon stat-icon-mint">
              <Package size={22} />
            </div>
            <div>
              <div className="stat-value">{totalListed}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-peach">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Active Surplus</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-lavender">
              <Users size={22} />
            </div>
            <div>
              <div className="stat-value">{pendingRequestsCount}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <Award size={22} />
            </div>
            <div>
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Claimed / Rescued</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <Clock size={16} />
            <span>Incoming Pickup Requests ({requests.length})</span>
            {pendingRequestsCount > 0 && (
              <span className="badge badge-peach" style={{ marginLeft: 6, fontSize: 11 }}>
                {pendingRequestsCount} Pending
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <Package size={16} />
            <span>My Food Listings ({donations.length})</span>
          </button>
        </div>

        {/* TAB 1: Incoming Pickup Requests */}
        {activeTab === 'requests' && (
          <div>
            {requests.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
                <Clock size={32} color="var(--color-text-light)" style={{ margin: '0 auto 12px' }} />
                <h3>No Pickup Requests Yet</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
                  When partner NGOs request collection of your surplus food, they will appear here for review.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {requests.map((req) => {
                  const pickupTime = new Date(req.estimated_pickup_time);
                  return (
                    <div key={req.id} className="card">
                      <div className="card-body">
                        <div className="flex items-center justify-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${
                              req.status === 'pending'
                                ? 'badge-requested'
                                : req.status === 'accepted'
                                ? 'badge-available'
                                : req.status === 'completed'
                                ? 'badge-completed'
                                : 'badge-expired'
                            }`}>
                              Request {req.status.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 13, color: 'var(--color-text-light)' }}>
                              Requested on {new Date(req.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-dark-green)' }}>
                            {req.quantity_requested} {req.donation?.unit || 'units'} requested
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                          <div>
                            <h3 style={{ fontSize: 17, marginBottom: 6 }}>
                              Food Item: <strong>{req.donation?.food_name || 'Surplus Meal Listing'}</strong>
                            </h3>
                            {req.message && (
                              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 10, background: '#F8FAFC', padding: 10, borderRadius: 6 }}>
                                <strong>NGO Message:</strong> "{req.message}"
                              </p>
                            )}

                            {req.donor_note && (
                              <p style={{ fontSize: 13, color: 'var(--color-dark-green)', background: 'var(--color-mint-light)', padding: 10, borderRadius: 6 }}>
                                <strong>Your Note to NGO:</strong> {req.donor_note}
                              </p>
                            )}
                          </div>

                          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', paddingLeft: 16 }}>
                            <div style={{ marginBottom: 6 }}>
                              <strong>Pickup Volunteer / Driver:</strong> {req.contact_person}
                            </div>
                            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                              <Phone size={14} color="var(--color-dark-green)" />
                              <span>{req.contact_phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} color="var(--color-dark-green)" />
                              <span>Est. Pickup: {pickupTime.toLocaleDateString()} at {pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Request Action Buttons */}
                        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                          {req.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-danger-outline btn-sm"
                                onClick={() => handleReject(req.id)}
                                disabled={processingId === req.id}
                              >
                                <XCircle size={14} />
                                <span>Reject Request</span>
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setModalRequest(req);
                                  setDonorNote('Approved! Food packaged and ready for collection.');
                                }}
                                disabled={processingId === req.id}
                              >
                                <CheckCircle size={14} />
                                <span>Accept & Confirm Pickup</span>
                              </button>
                            </>
                          )}

                          {req.status === 'accepted' && (
                            <button
                              className="btn btn-mint btn-sm"
                              onClick={() => handleMarkCompleted(req.id)}
                              disabled={processingId === req.id}
                            >
                              <CheckCircle size={14} />
                              <span>Mark Handover Completed</span>
                            </button>
                          )}

                          {req.status === 'completed' && (
                            <span className="badge badge-mint" style={{ padding: '6px 12px' }}>
                              ✓ Handover Successfully Completed
                            </span>
                          )}

                          {req.status === 'rejected' && (
                            <span className="badge badge-expired" style={{ padding: '6px 12px' }}>
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: My Food Listings */}
        {activeTab === 'donations' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Safe Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => {
                  const deadline = new Date(d.safe_pickup_deadline);
                  const isExpired = d.status === 'expired' || new Date() > deadline;
                  return (
                    <tr key={d.id}>
                      <td>
                        <Link to={`/food/${d.id}`} style={{ fontWeight: 700, color: 'var(--color-dark-green)' }}>
                          {d.food_name}
                        </Link>
                        <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
                          {d.location}, {d.city}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-lavender">{d.category}</span>
                      </td>
                      <td>
                        <strong>{d.quantity}</strong> {d.unit}
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: isExpired ? 'var(--color-danger)' : 'inherit' }}>
                          {deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          isExpired
                            ? 'badge-expired'
                            : d.status === 'available'
                            ? 'badge-available'
                            : d.status === 'claimed'
                            ? 'badge-claimed'
                            : 'badge-requested'
                        }`}>
                          {isExpired ? 'Expired' : d.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link to={`/food/${d.id}`} className="btn btn-secondary btn-sm">
                            View
                          </Link>
                          {d.status === 'claimed' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={async () => {
                                await updateDonation(d.id, { status: 'completed' });
                                await loadDashboardData();
                              }}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Accept Pickup Modal */}
      {modalRequest && (
        <div className="modal-overlay" onClick={() => setModalRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm & Accept Pickup Request</h3>
              <button className="modal-close" onClick={() => setModalRequest(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, marginBottom: 16 }}>
                You are approving pickup of <strong>{modalRequest.quantity_requested} {modalRequest.donation?.unit}</strong> for <strong>{modalRequest.contact_person}</strong>.
              </p>
              <div className="form-group">
                <label className="form-label">Note / Gate Instructions for Driver:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={donorNote}
                  onChange={(e) => setDonorNote(e.target.value)}
                  placeholder="e.g. Please enter via Gate 2. Inform security you are from FoodBridge."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalRequest(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAccept(modalRequest)}
                disabled={processingId === modalRequest.id}
              >
                {processingId === modalRequest.id ? 'Confirming...' : 'Confirm Acceptance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
