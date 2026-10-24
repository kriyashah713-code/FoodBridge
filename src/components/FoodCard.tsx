import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Package, Heart, AlertTriangle, ArrowRight } from 'lucide-react';
import { FoodDonation } from '../types';

interface Props {
  donation: FoodDonation;
}

export const FoodCard: React.FC<Props> = ({ donation }) => {
  const deadlineDate = new Date(donation.safe_pickup_deadline);
  const now = new Date();
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600);
  const isExpiringSoon = diffHours > 0 && diffHours <= 3;
  const isExpired = donation.status === 'expired' || diffHours <= 0;

  // Format time remaining
  const getTimeRemainingText = () => {
    if (isExpired) return 'Safe Pickup Window Closed';
    if (diffHours < 1) {
      const minutes = Math.max(1, Math.round(diffHours * 60));
      return `${minutes} min left to pickup`;
    }
    if (diffHours < 24) {
      return `${Math.round(diffHours)} hours left`;
    }
    const days = Math.round(diffHours / 24);
    return `${days} day${days > 1 ? 's' : ''} left`;
  };

  const getDietaryBadgeClass = () => {
    switch (donation.dietary_type) {
      case 'Vegetarian':
        return 'badge-mint';
      case 'Vegan':
        return 'badge-mint';
      case 'Non-Vegetarian':
        return 'badge-peach';
      default:
        return 'badge-lavender';
    }
  };

  const fallbackImages: Record<string, string> = {
    'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    'Raw Ingredients / Groceries': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    'Packaged Foods': 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600&auto=format&fit=crop&q=80',
    'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    'Dairy Products': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80',
    'Beverages': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    'Other': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80'
  };

  const imageSrc = donation.image_url || fallbackImages[donation.category] || fallbackImages['Other'];

  return (
    <div className="card card-hover food-card">
      {/* Image container */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={donation.food_name}
          className="food-card-image"
          loading="lazy"
        />

        {/* Status / Category Overlay badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`badge ${donation.status === 'available' && !isExpired ? 'badge-available' : donation.status === 'claimed' ? 'badge-claimed' : donation.status === 'requested' ? 'badge-requested' : 'badge-expired'}`}>
            {isExpired ? 'Expired' : donation.status}
          </span>
          <span className={`badge ${getDietaryBadgeClass()}`}>
            {donation.dietary_type}
          </span>
        </div>

        {isExpiringSoon && !isExpired && donation.status === 'available' && (
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <span className="badge badge-peach" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={12} /> Expiring Soon
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="food-card-body">
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <span className="badge badge-lavender" style={{ fontSize: 11 }}>
            {donation.category}
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
            {donation.city}
          </span>
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
          <Link to={`/food/${donation.id}`} style={{ color: 'var(--color-text-main)' }}>
            {donation.food_name}
          </Link>
        </h3>

        {donation.description && (
          <p style={{
            fontSize: 13,
            color: 'var(--color-text-muted)',
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {donation.description}
          </p>
        )}

        <div className="food-card-meta">
          <div className="food-card-meta-item">
            <Package size={15} color="var(--color-dark-green)" />
            <span><strong>{donation.quantity}</strong> {donation.unit} available</span>
          </div>

          <div className="food-card-meta-item">
            <Clock size={15} color={isExpiringSoon ? 'var(--color-peach-dark)' : 'var(--color-text-light)'} />
            <span style={{ color: isExpiringSoon ? 'var(--color-peach-dark)' : 'inherit', fontWeight: isExpiringSoon ? 600 : 400 }}>
              {getTimeRemainingText()}
            </span>
          </div>

          <div className="food-card-meta-item">
            <MapPin size={15} color="var(--color-text-light)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {donation.location}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)', fontSize: 12, color: 'var(--color-text-muted)' }}>
          Donated by: <strong>{donation.donor_name}</strong>
        </div>
      </div>

      {/* Footer */}
      <div className="food-card-footer">
        <Link to={`/food/${donation.id}`} className="btn btn-secondary btn-sm">
          Details
        </Link>

        {isExpired ? (
          <button className="btn btn-secondary btn-sm" disabled>
            Expired
          </button>
        ) : donation.status === 'claimed' ? (
          <button className="btn btn-secondary btn-sm" disabled>
            Claimed
          </button>
        ) : (
          <Link to={`/pickup-request/${donation.id}`} className="btn btn-primary btn-sm">
            <span>Request</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
};
