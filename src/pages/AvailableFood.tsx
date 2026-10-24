import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  RotateCcw,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { FoodCategory, FoodDonation } from '../types';
import { getDonations } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { useAuth } from '../context/AuthContext';

export const AvailableFood: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuth();

  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state from query parameters or defaults
  const initialCategory = searchParams.get('category') || 'all';
  const [category, setCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryType, setDietaryType] = useState<string>('all');
  const [city, setCity] = useState<string>('');
  const [urgency, setUrgency] = useState<'all' | 'urgent' | 'today'>('all');
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'deadline_desc' | 'newest' | 'quantity_desc'>('deadline_asc');

  // Update category when URL query changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getDonations({
        search: searchQuery,
        category: category,
        dietaryType: dietaryType,
        city: city,
        urgency: urgency,
        status: 'available', // available food only by default
        sortBy: sortBy
      });
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, searchQuery, dietaryType, city, urgency, sortBy]);

  const resetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setDietaryType('all');
    setCity('');
    setUrgency('all');
    setSortBy('deadline_asc');
    setSearchParams({});
  };

  const categories: (FoodCategory | 'all')[] = [
    'all',
    'Cooked Meals',
    'Raw Ingredients / Groceries',
    'Packaged Foods',
    'Bakery & Bread',
    'Fruits & Vegetables',
    'Dairy Products',
    'Beverages',
    'Other'
  ];

  return (
    <div className="section-spacer">
      <div className="container">
        {/* Page Title & Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Available Surplus Food</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
              Browse real-time listings of edible surplus ready for pickup by verified community organizations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/donate-food" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Donate Food</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: 32 }}>
          <div className="card-body" style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
              {/* Keyword Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search food, location, donor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
                <Search size={16} color="var(--color-text-light)" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>

              {/* Category Dropdown */}
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSearchParams(e.target.value === 'all' ? {} : { category: e.target.value });
                }}
              >
                <option value="all">All Categories</option>
                {categories.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Dietary Dropdown */}
              <select
                className="form-select"
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value)}
              >
                <option value="all">All Diets (Veg / Non-Veg)</option>
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain Compliant</option>
              </select>

              {/* Urgency / Deadline Filter */}
              <select
                className="form-select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
              >
                <option value="all">All Time Windows</option>
                <option value="urgent">Expiring Soon (Under 3 hrs)</option>
                <option value="today">Expiring Today (24 hrs)</option>
              </select>

              {/* Reset button */}
              <button
                className="btn btn-secondary"
                onClick={resetFilters}
                title="Reset all filters"
                style={{ padding: '10px 14px' }}
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border-subtle)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Quick Filters:</span>
              <button
                className={`btn btn-sm ${category === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setCategory('all'); setSearchParams({}); }}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${category === 'Cooked Meals' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setCategory('Cooked Meals'); setSearchParams({ category: 'Cooked Meals' }); }}
              >
                Cooked Meals
              </button>
              <button
                className={`btn btn-sm ${category === 'Bakery & Bread' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setCategory('Bakery & Bread'); setSearchParams({ category: 'Bakery & Bread' }); }}
              >
                Bakery
              </button>
              <button
                className={`btn btn-sm ${category === 'Fruits & Vegetables' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setCategory('Fruits & Vegetables'); setSearchParams({ category: 'Fruits & Vegetables' }); }}
              >
                Fruits & Veg
              </button>
              <button
                className={`btn btn-sm ${urgency === 'urgent' ? 'btn-peach' : 'btn-secondary'}`}
                onClick={() => setUrgency(urgency === 'urgent' ? 'all' : 'urgent')}
              >
                🚨 Expiring Soon
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Sort */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Showing <strong>{donations.length}</strong> active food donation listings
          </span>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sort by:</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
            >
              <option value="deadline_asc">Safe Deadline (Soonest first)</option>
              <option value="deadline_desc">Safe Deadline (Latest first)</option>
              <option value="newest">Recently Listed</option>
              <option value="quantity_desc">Highest Quantity</option>
            </select>
          </div>
        </div>

        {/* Grid or Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p>Loading available donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'var(--color-mint-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                color: 'var(--color-dark-green)'
              }}
            >
              <AlertCircle size={28} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No Matching Food Listings Found</h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 450, margin: '0 auto 24px' }}>
              We couldn't find any donations matching your current filters. Try resetting the filters or check back shortly.
            </p>
            <div className="flex justify-center gap-3">
              <button className="btn btn-secondary" onClick={resetFilters}>
                Reset Filters
              </button>
              <Link to="/donate-food" className="btn btn-primary">
                Donate Food Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-3">
            {donations.map((item) => (
              <FoodCard key={item.id} donation={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
