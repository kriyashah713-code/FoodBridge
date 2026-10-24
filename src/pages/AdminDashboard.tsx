import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Package,
  Inbox,
  Clock,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Mail,
  Building,
  Check
} from 'lucide-react';
import { ContactMessage, FoodDonation, PickupRequest, UserProfile } from '../types';
import {
  getAllProfiles,
  getDonations,
  getPickupRequests,
  getContactMessages,
  deleteDonation,
  updateContactMessageStatus,
  updateUserProfile
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'users' | 'donations' | 'requests' | 'inquiries'>('users');
  const [filterQuery, setFilterQuery] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [uList, dList, rList, mList] = await Promise.all([
        getAllProfiles(),
        getDonations(),
        getPickupRequests(),
        getContactMessages()
      ]);
      setProfiles(uList);
      setDonations(dList);
      setRequests(rList);
      setMessages(mList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm('Admin confirmation: permanently remove this donation listing from the database?')) return;
    await deleteDonation(id);
    await loadAllData();
  };

  const handleToggleResolveMessage = async (msgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'resolved' ? 'read' : 'resolved';
    await updateContactMessageStatus(msgId, nextStatus);
    await loadAllData();
  };

  // Stats
  const totalUsers = profiles.length;
  const totalDonations = donations.length;
  const totalRequests = requests.length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-peach" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} /> Master Administrator
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Platform Administration</h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginTop: 4 }}>
              System audit, user directory, food safety compliance, and moderation control panel.
            </p>
          </div>

          <div style={{ padding: '8px 16px', background: 'var(--color-mint-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-mint)', fontSize: 13, color: 'var(--color-dark-green)', fontWeight: 600 }}>
            PostgreSQL RLS Protected
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-icon stat-icon-mint">
              <Users size={22} />
            </div>
            <div>
              <div className="stat-value">{totalUsers}</div>
              <div className="stat-label">Registered Accounts</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-peach">
              <Package size={22} />
            </div>
            <div>
              <div className="stat-value">{totalDonations}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-lavender">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value">{totalRequests}</div>
              <div className="stat-label">Pickup Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <Inbox size={22} />
            </div>
            <div>
              <div className="stat-value">{unreadMessagesCount}</div>
              <div className="stat-label">Inquiries Pending</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>Users Directory ({profiles.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <Package size={16} />
            <span>All Donations ({donations.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <Clock size={16} />
            <span>Pickup Audit Trail ({requests.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <Mail size={16} />
            <span>Contact Inquiries ({messages.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="badge badge-peach" style={{ marginLeft: 6, fontSize: 11 }}>
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User / Entity</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{p.full_name}</div>
                      {p.organization_name && (
                        <div style={{ fontSize: 12, color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building size={12} />
                          <span>{p.organization_name}</span>
                        </div>
                      )}
                    </td>
                    <td>{p.email}</td>
                    <td>
                      <span className={`badge ${
                        p.role === 'admin'
                          ? 'badge-peach'
                          : p.role === 'ngo'
                          ? 'badge-lavender'
                          : 'badge-mint'
                      }`}>
                        {p.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{p.phone || '—'}</td>
                    <td>{p.city || '—'}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ALL DONATIONS MODERATION */}
        {activeTab === 'donations' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Food Title</th>
                  <th>Donor</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{d.food_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>{d.location}, {d.city}</div>
                    </td>
                    <td>{d.donor_name}</td>
                    <td><span className="badge badge-lavender">{d.category}</span></td>
                    <td>{d.quantity} {d.unit}</td>
                    <td>{new Date(d.safe_pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(d.safe_pickup_deadline).toLocaleDateString()})</td>
                    <td>
                      <span className={`badge ${
                        d.status === 'available'
                          ? 'badge-available'
                          : d.status === 'claimed'
                          ? 'badge-claimed'
                          : d.status === 'expired'
                          ? 'badge-expired'
                          : 'badge-completed'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => handleDeleteDonation(d.id)}
                        title="Remove listing from system"
                      >
                        <Trash2 size={13} />
                        <span>Purge</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PICKUP REQUESTS AUDIT */}
        {activeTab === 'requests' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Food Listing</th>
                  <th>NGO / Contact</th>
                  <th>Quantity</th>
                  <th>Scheduled Pickup</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.id.substring(0, 10)}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.donation?.food_name || 'Listing #' + r.donation_id.substring(0, 6)}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Donor ID: {r.donor_id.substring(0, 8)}</div>
                    </td>
                    <td>
                      <div>{r.contact_person}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.contact_phone}</div>
                    </td>
                    <td><strong>{r.quantity_requested}</strong> {r.donation?.unit || 'units'}</td>
                    <td>{new Date(r.estimated_pickup_time).toLocaleDateString()} at {new Date(r.estimated_pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span className={`badge ${
                        r.status === 'accepted'
                          ? 'badge-available'
                          : r.status === 'pending'
                          ? 'badge-requested'
                          : r.status === 'completed'
                          ? 'badge-completed'
                          : 'badge-expired'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: CONTACT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m) => (
              <div key={m.id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${m.status === 'resolved' ? 'badge-completed' : m.status === 'read' ? 'badge-lavender' : 'badge-peach'}`}>
                        {m.status.toUpperCase()}
                      </span>
                      <strong style={{ fontSize: 15 }}>{m.subject}</strong>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12, background: '#F8FAFC', padding: 12, borderRadius: 6 }}>
                    {m.message}
                  </p>

                  <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 10, fontSize: 13 }}>
                    <div>
                      From: <strong>{m.name}</strong> (<a href={`mailto:${m.email}`}>{m.email}</a>)
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleResolveMessage(m.id, m.status)}
                    >
                      <Check size={14} />
                      <span>{m.status === 'resolved' ? 'Mark as Unresolved' : 'Mark as Resolved'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
