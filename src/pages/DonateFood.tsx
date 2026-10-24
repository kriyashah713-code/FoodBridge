import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, AlertTriangle, CheckCircle, Package, MapPin, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DietaryType, FoodCategory, FoodUnit } from '../types';
import { createDonation } from '../services/api';

export const DonateFood: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Helper date defaults
  const now = new Date();
  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const prepDefault = formatDateTimeLocal(now);
  const deadlineDefault = formatDateTimeLocal(new Date(now.getTime() + 4 * 3600 * 1000)); // +4 hours

  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState<number>(25);
  const [unit, setUnit] = useState<FoodUnit>('servings');
  const [dietaryType, setDietaryType] = useState<DietaryType>('Vegetarian');
  const [location, setLocation] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [preparationTime, setPreparationTime] = useState(prepDefault);
  const [safePickupDeadline, setSafePickupDeadline] = useState(deadlineDefault);
  const [storageInstructions, setStorageInstructions] = useState('Kept hot in food-grade insulated containers.');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sampleImages = [
    { label: 'Cooked Meals', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Biryani / Rice', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Bakery Loaves', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fresh Vegetables', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dry Groceries', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const prepDate = new Date(preparationTime);
    const deadlineDate = new Date(safePickupDeadline);

    if (deadlineDate <= prepDate) {
      setError('Safe Pickup Deadline must be strictly AFTER the preparation timestamp.');
      return;
    }

    if (quantity <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    setSubmitting(true);

    try {
      await createDonation({
        donor_id: user?.id || 'demo-donor',
        donor_name: user?.organization_name
          ? `${user.full_name} (${user.organization_name})`
          : (user?.full_name || 'Community Donor'),
        donor_phone: user?.phone || '+91 98765 00000',
        food_name: foodName,
        category,
        quantity: Number(quantity),
        unit,
        dietary_type: dietaryType,
        location,
        city,
        preparation_time: prepDate.toISOString(),
        safe_pickup_deadline: deadlineDate.toISOString(),
        storage_instructions: storageInstructions,
        description,
        image_url: imageUrl || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/donor-dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to list food donation.');
      setSubmitting(false);
    }
  };

  return (
    <div className="section-spacer">
      <div className="container container-narrow">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-dark-green)'
                }}
              >
                <PlusCircle size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>Donate Surplus Food</h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Log surplus edible food to connect with nearby verified NGOs immediately.
                </p>
              </div>
            </div>
            <span className="badge badge-mint">Donor Form</span>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>Donation listing published successfully! Redirecting to dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Food Name & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="foodName">
                    Food Name / Title *
                  </label>
                  <input
                    id="foodName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Vegetable Pulao & Paneer Curry"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category *
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    required
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Raw Ingredients / Groceries">Raw Ingredients / Groceries</option>
                    <option value="Packaged Foods">Packaged Foods</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Unit, Dietary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="qty">
                    Quantity *
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min="1"
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="unit">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    className="form-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as FoodUnit)}
                    required
                  >
                    <option value="servings">servings (meals)</option>
                    <option value="kg">kg (kilograms)</option>
                    <option value="boxes">boxes / containers</option>
                    <option value="packets">packets / ration kits</option>
                    <option value="liters">liters</option>
                    <option value="trays">catering trays</option>
                    <option value="items">pieces / items</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dietary">
                    Dietary Type *
                  </label>
                  <select
                    id="dietary"
                    className="form-select"
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                    required
                  >
                    <option value="Vegetarian">Vegetarian (Pure Veg)</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan (Plant-based)</option>
                    <option value="Jain">Jain (No Root Veg)</option>
                    <option value="All / Mixed">All / Mixed</option>
                  </select>
                </div>
              </div>

              {/* Timing Requirements */}
              <div style={{
                backgroundColor: 'var(--color-peach-light)',
                border: '1px solid var(--color-peach)',
                borderRadius: 'var(--radius-sm)',
                padding: 16,
                marginBottom: 20
              }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, color: 'var(--color-peach-dark)', marginBottom: 12 }}>
                  <Clock size={16} />
                  <span>Strict Safety & Expiry Deadlines</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="form-label" htmlFor="prepTime" style={{ color: 'var(--color-peach-dark)' }}>
                      Preparation Timestamp *
                    </label>
                    <input
                      id="prepTime"
                      type="datetime-local"
                      className="form-input"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(e.target.value)}
                      required
                    />
                    <span className="form-hint">When the food was cooked or packed.</span>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="deadline" style={{ color: 'var(--color-peach-dark)' }}>
                      Safe Pickup Deadline *
                    </label>
                    <input
                      id="deadline"
                      type="datetime-local"
                      className="form-input"
                      value={safePickupDeadline}
                      onChange={(e) => setSafePickupDeadline(e.target.value)}
                      required
                    />
                    <span className="form-hint">Time after which item cannot be safely consumed.</span>
                  </div>
                </div>
              </div>

              {/* Location & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="loc">
                    Pickup Location / Address *
                  </label>
                  <input
                    id="loc"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Banquet Hall Gate 2, Link Road"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Storage Instructions & Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="storage">
                  Storage & Handling Instructions
                </label>
                <input
                  id="storage"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kept chilled at 4°C, requires thermal transport bags"
                  value={storageInstructions}
                  onChange={(e) => setStorageInstructions(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="desc">
                  Detailed Description & Packaging Notes
                </label>
                <textarea
                  id="desc"
                  className="form-textarea"
                  rows={3}
                  placeholder="Provide any details about packaging, allergen notices, or specific loading instructions for the NGO vehicle..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Optional Photo selection */}
              <div className="form-group">
                <label className="form-label">
                  Food Photo (Optional Image URL or Pick a Preset):
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setImageUrl(s.url)}
                      style={{ fontSize: 11 }}
                    >
                      Use {s.label} Photo
                    </button>
                  ))}
                </div>
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
                  {submitting ? 'Publishing Listing...' : 'Publish Food Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
