import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send,
  Clock,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  Building,
  ArrowLeft
} from 'lucide-react';
import { FoodDonation } from '../types';
import { getDonationById, createPickupRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PickupRequestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<FoodDonation | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const defaultPickupTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours() + 1)}:00`;

  const [quantityRequested, setQuantityRequested] = useState<number>(0);
  const [estimatedPickupTime, setEstimatedPickupTime] = useState(defaultPickupTime);
  const [message, setMessage] = useState('');
  const [contactPerson, setContactPerson] = useState(user?.full_name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const item = await getDonationById(id);
        setDonation(item);
        if (item) {
          setQuantityRequested(item.quantity); // Default to full quantity
        }
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container section-spacer" style={{ textAlign: 'center' }}>
        <p>Loading donation details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="container section-spacer" style={{ textAlign: 'center' }}>
        <h2>Donation listing not found</h2>
        <Link to="/available-food" className="btn btn-primary" style={{ marginTop: 16 }}>
          Browse Available Food
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(donation.safe_pickup_deadline);
  const isExpired = donation.status === 'expired' || new Date() > deadlineDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isExpired) {
      setError('This donation has expired and cannot receive pickup requests.');
      return;
    }

    if (donation.status === 'claimed' || donation.status === 'completed') {
      setError('This donation has already been claimed or fulfilled.');
      return;
    }

    if (quantityRequested <= 0) {
      setError('Quantity requested must be greater than 0.');
      return;
    }

    if (quantityRequested > donation.quantity) {
      setError(`Cannot request more than the available quantity (${donation.quantity} ${donation.unit}).`);
      return;
    }

    const pickupTime = new Date(estimatedPickupTime);
    if (pickupTime > deadlineDate) {
      setError('Estimated pickup time cannot be after the safe pickup deadline.');
      return;
    }

    setSubmitting(true);

    try {
      await createPickupRequest({
        donation_id: donation.id,
        ngo_id: user?.id || 'demo-ngo',
        donor_id: donation.donor_id,
        quantity_requested: Number(quantityRequested),
        estimated_pickup_time: pickupTime.toISOString(),
        message,
        contact_person: contactPerson,
        contact_phone: contactPhone
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/ngo-dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit pickup request.');
      setSubmitting(false);
    }
  };

  return (
    <div className="section-spacer">
      <div className="container container-narrow">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} />
          <span>Back to Listing</span>
        </button>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-peach-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-peach-dark)'
                }}
              >
                <Send size={18} />
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700 }}>Submit NGO Pickup Request</h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Request food collection directly from the donor.
                </p>
              </div>
            </div>
            <span className="badge badge-peach">Logistics Form</span>
          </div>

          <div className="card-body">
            {/* Donation Summary Card */}
            <div style={{
              backgroundColor: 'var(--color-mint-light)',
              border: '1px solid var(--color-mint)',
              borderRadius: 'var(--radius-sm)',
              padding: 16,
              marginBottom: 24
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <span className="badge badge-mint">{donation.category}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  Available: {donation.quantity} {donation.unit}
                </span>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 8, color: 'var(--color-dark-green)' }}>
                {donation.food_name}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <div className="flex items-center gap-2">
                  <Clock size={15} color="var(--color-dark-green)" />
                  <span>Deadline: {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({deadlineDate.toLocaleDateString()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} color="var(--color-dark-green)" />
                  <span>{donation.location}, {donation.city}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>Pickup request sent to donor! Redirecting to NGO Dashboard...</span>
              </div>
            )}

            {isExpired ? (
              <div className="alert alert-danger">
                <AlertTriangle size={18} />
                <span>This donation is expired. Requests cannot be submitted.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
                  {/* Quantity Needed */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="qtyNeeded">
                      Quantity Needed ({donation.unit}) *
                    </label>
                    <input
                      id="qtyNeeded"
                      type="number"
                      min="1"
                      max={donation.quantity}
                      className="form-input"
                      value={quantityRequested}
                      onChange={(e) => setQuantityRequested(Number(e.target.value))}
                      required
                    />
                    <span className="form-hint">Max available: {donation.quantity} {donation.unit}</span>
                  </div>

                  {/* Estimated Pickup Time */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="pickupTime">
                      Estimated Pickup Time *
                    </label>
                    <input
                      id="pickupTime"
                      type="datetime-local"
                      className="form-input"
                      value={estimatedPickupTime}
                      onChange={(e) => setEstimatedPickupTime(e.target.value)}
                      required
                    />
                    <span className="form-hint">Must be before safe deadline</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Contact Person */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactName">
                      Contact Person / Driver Name *
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sunil Deshmukh"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactPhone">
                      Contact Phone *
                    </label>
                    <input
                      id="contactPhone"
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label" htmlFor="notes">
                    Logistics & Distribution Note
                  </label>
                  <textarea
                    id="notes"
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide details about your vehicle, thermal bags, or intended beneficiaries (e.g. elderly care shelter, night shelter community)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="card-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Request...' : 'Send Pickup Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
