import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Building,
  Phone,
  ArrowLeft,
  Share2,
  Trash2,
  ShieldCheck,
  Send
} from 'lucide-react';
import { FoodDonation } from '../types';
import { getDonationById, deleteDonation, updateDonation } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<FoodDonation | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const item = await getDonationById(id);
        setDonation(item);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container section-spacer" style={{ textAlign: 'center' }}>
        <p>Loading food donation details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="container section-spacer text-center" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Donation Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
          The requested donation listing does not exist or may have been removed.
        </p>
        <Link to="/available-food" className="btn btn-primary">
          Back to Available Food
        </Link>
      </div>
    );
  }

  const prepDate = new Date(donation.preparation_time);
  const deadlineDate = new Date(donation.safe_pickup_deadline);
  const now = new Date();
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600);
  const isExpired = donation.status === 'expired' || diffHours <= 0;
  const isExpiringSoon = diffHours > 0 && diffHours <= 3;

  const isOwner = user?.id === donation.donor_id || role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this food listing?')) return;
    setDeleting(true);
    await deleteDonation(donation.id);
    navigate(role === 'donor' ? '/donor-dashboard' : '/available-food');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fallbackImages: Record<string, string> = {
    'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
    'Raw Ingredients / Groceries': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=80',
    'Packaged Foods': 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=900&auto=format&fit=crop&q=80',
    'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=80',
    'Dairy Products': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=900&auto=format&fit=crop&q=80',
    'Beverages': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&auto=format&fit=crop&q=80',
    'Other': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&auto=format&fit=crop&q=80'
  };

  const imageSrc = donation.image_url || fallbackImages[donation.category] || fallbackImages['Other'];

  return (
    <div className="section-spacer">
      <div className="container" style={{ maxWidth: 960 }}>
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="btn btn-secondary btn-sm">
              <Share2 size={14} />
              <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
            </button>

            {isOwner && (
              <button onClick={handleDelete} className="btn btn-danger-outline btn-sm" disabled={deleting}>
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Expiry Warning Alert if applicable */}
        {isExpired && (
          <div className="alert alert-danger">
            <AlertTriangle size={20} />
            <div>
              <strong>Listing Safe Pickup Window Closed</strong>
              <p style={{ fontSize: 13, marginTop: 2 }}>
                This food donation has passed its safe consumption deadline. According to food safety protocol, it cannot receive new pickup requests.
              </p>
            </div>
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="alert alert-warning">
            <Clock size={20} />
            <div>
              <strong>Expiring Soon (Under 3 Hours Remaining)</strong>
              <p style={{ fontSize: 13, marginTop: 2 }}>
                Urgent collection required! NGOs with nearby vehicles are advised to request pickup immediately.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>
          {/* Left Column: Image & Details */}
          <div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
              <img
                src={imageSrc}
                alt={donation.food_name}
                style={{ width: '100%', height: 320, objectFit: 'cover' }}
              />
              <div className="card-body">
                <div className="flex items-center gap-2" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-lavender">{donation.category}</span>
                  <span className="badge badge-mint">{donation.dietary_type}</span>
                  <span className={`badge ${isExpired ? 'badge-expired' : donation.status === 'claimed' ? 'badge-claimed' : 'badge-available'}`}>
                    {isExpired ? 'Expired' : donation.status}
                  </span>
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                  {donation.food_name}
                </h1>

                {donation.description ? (
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                    {donation.description}
                  </p>
                ) : (
                  <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', marginBottom: 20 }}>
                    No additional description provided.
                  </p>
                )}

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Storage & Handling Instructions</h4>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {donation.storage_instructions || 'Standard room temperature storage in hygienic container.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Logistics & Action Card */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <span style={{ fontWeight: 700, fontSize: 16 }}>Donation Logistics</span>
                <span className="badge badge-mint">{donation.quantity} {donation.unit}</span>
              </div>

              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Preparation Time */}
                  <div className="flex items-center gap-3">
                    <Calendar size={18} color="var(--color-dark-green)" />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Prepared / Packed At</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {prepDate.toLocaleDateString()} at {prepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Safe Pickup Deadline */}
                  <div className="flex items-center gap-3">
                    <Clock size={18} color={isExpiringSoon ? 'var(--color-peach-dark)' : 'var(--color-dark-green)'} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Safe Pickup Deadline</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isExpiringSoon ? 'var(--color-peach-dark)' : 'var(--color-text-main)' }}>
                        {deadlineDate.toLocaleDateString()} at {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin size={18} color="var(--color-dark-green)" />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Pickup Address</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{donation.location}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{donation.city}</div>
                    </div>
                  </div>

                  {/* Donor Info */}
                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 16 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                      <Building size={16} color="var(--color-dark-green)" />
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Donor Profile:</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{donation.donor_name}</div>
                    {donation.donor_phone && (
                      <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                        <Phone size={13} />
                        <span>{donation.donor_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div style={{ marginTop: 24 }}>
                  {isExpired ? (
                    <button className="btn btn-secondary btn-block" disabled>
                      Safe Window Closed (Expired)
                    </button>
                  ) : donation.status === 'claimed' ? (
                    <div className="alert alert-info" style={{ marginBottom: 0, textAlign: 'center' }}>
                      <CheckCircle size={18} />
                      <span>This listing has been claimed by a partner NGO.</span>
                    </div>
                  ) : (
                    <Link to={`/pickup-request/${donation.id}`} className="btn btn-primary btn-block btn-lg">
                      <Send size={16} />
                      <span>Submit Pickup Request</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Quality Standard Card */}
            <div className="card" style={{ backgroundColor: 'var(--color-mint-light)', border: '1px solid var(--color-mint)' }}>
              <div className="card-body" style={{ padding: 18 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: 6 }}>
                  <ShieldCheck size={18} />
                  <span>Food Safety Pledge</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  All donations are logged under FoodBridge safety protocols. The NGO agrees to transport items in clean, thermal-safe containers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
